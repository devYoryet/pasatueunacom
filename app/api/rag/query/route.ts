import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SYSTEM_PROMPT = `Eres un tutor médico experto en preparación EUNACOM para Chile.
Tu rol es responder preguntas clínicas basándote EXCLUSIVAMENTE en las transcripciones de clase proporcionadas.

INSTRUCCIONES:
1. Responde de forma clara, didáctica y en español chileno médico
2. Usa la información de las transcripciones como fuente principal
3. Estructura tu respuesta con párrafos cortos y claros
4. Si la pregunta tiene relación clínica directa con EUNACOM, menciona qué es lo más evaluado
5. Humaniza la respuesta: como si fuera un médico experto explicándole a un colega que estudia
6. Si hay un concepto clave o mnemotecnia relevante, inclúyela
7. Si la información no está en las transcripciones, indícalo honestamente
8. Usa negritas (**texto**) para los conceptos más importantes
9. Sé conciso pero completo — máximo 300 palabras`

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'No autenticado' }), { status: 401 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: 'API key de OpenAI no configurada' }), { status: 500 })
  }

  const body = await req.json()
  const { question, specialtyCode = 'diabetes' } = body as { question: string; specialtyCode?: string }

  if (!question?.trim()) {
    return new Response(JSON.stringify({ error: 'Pregunta requerida' }), { status: 400 })
  }

  // Load lesson transcriptions for the specialty
  const { data: specialty } = await supabase
    .from('specialties')
    .select('id, name')
    .eq('code', specialtyCode)
    .single()

  if (!specialty) {
    return new Response(JSON.stringify({ error: 'Especialidad no encontrada' }), { status: 404 })
  }

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, order_index, txt_content, ai_summary, ai_key_concepts')
    .eq('specialty_id', specialty.id)
    .eq('is_available', true)
    .order('order_index')
    .limit(24)

  if (!lessons || lessons.length === 0) {
    return new Response(JSON.stringify({ error: 'No hay transcripciones disponibles para esta especialidad' }), { status: 404 })
  }

  // Build context from transcriptions (truncated to fit context window)
  const MAX_CHARS_PER_LESSON = 2000
  const context = lessons
    .map((lesson: any) => {
      const parts: string[] = [`--- CÁPSULA ${lesson.order_index}: ${lesson.title} ---`]
      if (lesson.ai_summary) parts.push(`RESUMEN: ${lesson.ai_summary}`)
      if (lesson.txt_content) {
        const truncated = lesson.txt_content.slice(0, MAX_CHARS_PER_LESSON)
        parts.push(`TRANSCRIPCIÓN: ${truncated}${lesson.txt_content.length > MAX_CHARS_PER_LESSON ? '...' : ''}`)
      }
      return parts.join('\n')
    })
    .join('\n\n')

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  // Stream the response
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await client.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT,
            },
            {
              role: 'user',
              content: `ESPECIALIDAD: ${specialty.name}\n\nCONTENIDO DE LAS CLASES:\n${context}\n\n---\n\nPREGUNTA DEL ESTUDIANTE: ${question}`,
            },
          ],
          temperature: 0.6,
          max_tokens: 600,
          stream: true,
        })

        for await (const chunk of completion) {
          const text = chunk.choices[0]?.delta?.content ?? ''
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`))
          }
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error: any) {
        console.error('RAG query error:', error)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'Error al procesar la consulta' })}\n\n`)
        )
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
