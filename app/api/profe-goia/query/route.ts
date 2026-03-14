import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const DAILY_LIMIT = 5

const SYSTEM_PROMPT = `Eres Profe GoIA, el tutor de inteligencia artificial de PasaTuEunacom.
Tu misión es ayudar a médicos chilenos a prepararse para el EUNACOM de forma eficiente, empática y directa.

IDENTIDAD:
- Nombre: Profe GoIA
- Tono: cercano, motivador, preciso. Como un médico amigo que ya pasó el EUNACOM y quiere ayudarte.
- Idioma: español chileno médico (sin chilenismos excesivos, pero natural)

BASE DE CONOCIMIENTO PRIORITARIA:
1. Guías clínicas MINSAL Chile vigentes (GES, AUGE, protocolos)
2. Temario oficial EUNACOM (ASOFAMECH): Medicina Interna, Cirugía, Pediatría, Ginecología/Obstetricia, Psiquiatría, Medicina Preventiva/Salud Pública
3. Pautas EUNACOM de años anteriores y preguntas frecuentes
4. Transcripciones y material del curso (contexto adicional si se provee)

REGLAS DE RESPUESTA:
- Estructura: breve intro → desarrollo con **negritas** para lo clave → resumen/perla EUNACOM
- Máximo 350 palabras (sé denso y útil, no verboso)
- Si hay una mnemotecnia o truco, inclúyelo
- Si hay una guía MINSAL específica, menciónala (ej: "Guía GES Diabetes 2023")
- Si la pregunta tiene trampa frecuente en EUNACOM, adviértelo con ⚠️
- Cierra con una frase motivadora breve (1 línea)
- Si el contexto de transcripciones/material de clase se provee, úsalo como fuente primaria`

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Daily limit check
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('profe_goia_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('session_date', today)

    const usedToday = count ?? 0
    if (usedToday >= DAILY_LIMIT) {
      return NextResponse.json(
        { error: 'daily_limit', usedToday, limit: DAILY_LIMIT },
        { status: 429 }
      )
    }

    const body = await req.json()
    const {
      question,
      specialtyCode,
      lessonId,
      contextRef,
    }: {
      question: string
      specialtyCode?: string
      lessonId?: number
      contextRef?: string
    } = body

    if (!question?.trim()) {
      return NextResponse.json({ error: 'No question provided' }, { status: 400 })
    }

    // Load lesson context for RAG
    let context = ''
    if (lessonId) {
      const { data: lesson } = await supabase
        .from('lessons')
        .select('title, txt_content, ai_summary, ai_key_concepts, ai_high_yield')
        .eq('id', lessonId)
        .single()
      if (lesson) {
        const parts: string[] = []
        if (lesson.title) parts.push(`# ${lesson.title}`)
        if (lesson.ai_summary) parts.push(`**Resumen:** ${lesson.ai_summary}`)
        if (lesson.ai_key_concepts) {
          const kc = lesson.ai_key_concepts as string[]
          parts.push(`**Conceptos clave:** ${kc.join(', ')}`)
        }
        if (lesson.ai_high_yield) {
          const hy = lesson.ai_high_yield as string[]
          parts.push(`**Alto rendimiento:** ${hy.join(' | ')}`)
        }
        if (lesson.txt_content) parts.push(lesson.txt_content.slice(0, 3000))
        context = parts.join('\n\n')
      }
    } else if (specialtyCode) {
      // Load top lessons for the specialty
      const { data: specialty } = await supabase
        .from('specialties')
        .select('id')
        .eq('code', specialtyCode)
        .single()
      if (specialty) {
        const { data: lessons } = await supabase
          .from('lessons')
          .select('title, txt_content, ai_summary')
          .eq('specialty_id', specialty.id)
          .eq('is_available', true)
          .order('order_index')
          .limit(12)
        if (lessons && lessons.length > 0) {
          context = lessons.map((l) => {
            const parts: string[] = []
            if (l.title) parts.push(`### ${l.title}`)
            if (l.ai_summary) parts.push(l.ai_summary)
            if (l.txt_content) parts.push(l.txt_content.slice(0, 1500))
            return parts.join('\n')
          }).join('\n\n---\n\n')
        }
      }
    }

    const userMessage = context
      ? `MATERIAL DE CLASE (úsalo como fuente primaria):\n\n${context}\n\n---\n\nPREGUNTA DEL ESTUDIANTE:\n${question}`
      : question

    // Stream response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      max_tokens: 600,
      temperature: 0.5,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
    })

    let fullResponse = ''

    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content ?? ''
          if (delta) {
            fullResponse += delta
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ delta })}\n\n`))
          }
        }

        // Save session to DB
        await supabase.from('profe_goia_sessions').insert({
          user_id: user.id,
          session_date: today,
          context_type: lessonId ? 'lesson' : specialtyCode ? 'specialty' : 'general',
          context_ref: contextRef ?? null,
          context_id: lessonId ? String(lessonId) : null,
          question,
          response: fullResponse,
        })

        controller.enqueue(
          new TextEncoder().encode(
            `data: ${JSON.stringify({ done: true, usedToday: usedToday + 1, limit: DAILY_LIMIT })}\n\n`
          )
        )
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    })
  } catch (err) {
    console.error('[profe-goia/query]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
