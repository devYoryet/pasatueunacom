import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'
export const maxDuration = 90

const DAILY_LIMIT = 5

const QUIZ_REVIEW_SYSTEM_PROMPT = `Eres Profe GoIA, el tutor IA de PasaTuEunacom.
El estudiante acaba de terminar un cuestionario EUNACOM y tú debes analizar sus errores y entregarle retroalimentación estructurada.

INSTRUCCIONES:
1. Analiza las preguntas incorrectas una por una
2. Identifica los PATRONES de error (ej: confunde DM1 con DM2, no conoce criterios diagnósticos, etc.)
3. Entrega una respuesta con esta ESTRUCTURA FIJA:

---
## 📊 Análisis de tu desempeño

**[Puntuación]:** [X]% — [breve comentario motivador según el puntaje]

## ❌ Conceptos que debes reforzar

[Lista los 3-5 conceptos principales donde fallaste, con una explicación breve de qué debes recordar]

## 🧠 Perlas para no olvidar

[2-3 mnemotecnias o trucos EUNACOM para los errores más frecuentes del cuestionario]

## ⚠️ Trampas frecuentes en el EUNACOM

[1-2 distractores o errores conceptuales clásicos que aparecieron en este cuestionario]

## 📚 Qué estudiar ahora

[Recomienda qué releer o repasar, mencionando las clases/temas específicos del cuestionario]

---
*¡Tú puedes! Cada error es un concepto que ya no olvidarás.* 💪
---

TONO: directo, empático, motivador. Como un colega médico que ya pasó el EUNACOM.
LONGITUD: máxima 500 palabras. Sé denso y útil.`

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
      attemptId,
      examTitle,
      score,
      incorrectItems,
    }: {
      attemptId: string
      examTitle: string
      score: number
      incorrectItems: Array<{
        stem: string
        correct_option: string
        user_answer: string
        option_a: string | null
        option_b: string | null
        option_c: string | null
        option_d: string | null
        option_e: string | null
        explanation: string | null
      }>
    } = body

    if (!attemptId || !incorrectItems?.length) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Build the analysis prompt
    const incorrectSummary = incorrectItems.map((item, i) => {
      const opts: Record<string, string | null> = {
        a: item.option_a, b: item.option_b, c: item.option_c,
        d: item.option_d, e: item.option_e,
      }
      const correctText = opts[item.correct_option] ?? item.correct_option
      const userText = item.user_answer ? (opts[item.user_answer] ?? item.user_answer) : '(sin responder)'
      return `
**Error ${i + 1}:**
Pregunta: ${item.stem.slice(0, 200)}
Respuesta correcta: ${item.correct_option.toUpperCase()}) ${correctText}
Tu respuesta: ${item.user_answer?.toUpperCase() ?? '—'}) ${userText}
Explicación: ${item.explanation?.slice(0, 300) ?? 'No disponible'}`
    }).join('\n')

    const userMessage = `CUESTIONARIO: "${examTitle}"
PUNTAJE OBTENIDO: ${score}%
PREGUNTAS INCORRECTAS (${incorrectItems.length}):

${incorrectSummary}

Por favor analiza mis errores y dame retroalimentación estructurada según tu formato.`

    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      stream: true,
      max_tokens: 800,
      temperature: 0.4,
      messages: [
        { role: 'system', content: QUIZ_REVIEW_SYSTEM_PROMPT },
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
          context_type: 'quiz_review',
          context_ref: examTitle,
          context_id: attemptId,
          question: `Revisión de ${incorrectItems.length} errores en "${examTitle}" (${score}%)`,
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
    console.error('[profe-goia/quiz-review]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
