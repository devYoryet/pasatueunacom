import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'
import { generateQuestionsPrompt } from '@/lib/ai/generateVariants'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'API key de OpenAI no configurada' }, { status: 500 })
  }

  const body = await req.json()
  const { specialtyId, count = 10, focusFailed, increaseDifficulty, includeTabular } = body

  // Get example questions for this specialty
  let questionsQuery = supabase
    .from('questions')
    .select('*')
    .eq('specialty_id', specialtyId)
    .eq('is_active', true)

  if (focusFailed) {
    // Get questions with high failure rate
    const { data: failedStats } = await supabase
      .from('question_stats')
      .select('question_id, difficulty_score')
      .order('difficulty_score', { ascending: false })
      .limit(20)

    if (failedStats && failedStats.length > 0) {
      const failedIds = failedStats.map((s: any) => s.question_id)
      questionsQuery = questionsQuery.in('id', failedIds)
    }
  }

  const { data: exampleQuestions } = await questionsQuery.limit(10)

  if (!exampleQuestions || exampleQuestions.length === 0) {
    return NextResponse.json(
      { error: 'No hay preguntas de ejemplo para esta especialidad' },
      { status: 404 }
    )
  }

  const prompt = await generateQuestionsPrompt(count, exampleQuestions as any, {
    focusOnFailed: focusFailed,
    increaseDifficulty,
    includeTabular,
  })

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  // Create a streaming response
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const completion = await client.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
          max_tokens: 12000,
        })

        const content = completion.choices[0]?.message?.content
        if (!content) {
          controller.close()
          return
        }

        // Parse JSON array
        const jsonMatch = content.match(/\[[\s\S]*\]/)
        if (!jsonMatch) {
          controller.close()
          return
        }

        const questions = JSON.parse(jsonMatch[0])

        // Stream each question individually
        for (const question of questions) {
          const data = `data: ${JSON.stringify({ question })}\n\n`
          controller.enqueue(encoder.encode(data))
          // Small delay for streaming effect
          await new Promise((resolve) => setTimeout(resolve, 100))
        }

        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      } catch (error) {
        console.error('Generate error:', error)
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: 'Error generando preguntas' })}\n\n`)
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
