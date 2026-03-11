import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await req.json()
  const {
    examId,
    answers,
    correctCount,
    totalQuestions,
    scorePercent,
    timeUsedSeconds,
    mode,
    attemptId,
  } = body

  let attempt

  if (attemptId) {
    // Update existing attempt
    const { data, error } = await supabase
      .from('attempts')
      .update({
        answers,
        correct_count: correctCount,
        total_questions: totalQuestions,
        score_percent: scorePercent,
        time_used_seconds: timeUsedSeconds,
        finished_at: new Date().toISOString(),
        is_completed: true,
      })
      .eq('id', attemptId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Intento no encontrado' }, { status: 404 })
    }
    attempt = data
  } else {
    // Create new attempt
    const { data, error } = await supabase
      .from('attempts')
      .insert([{
        user_id: user.id,
        exam_id: examId,
        mode: mode ?? 'practice',
        answers,
        correct_count: correctCount,
        total_questions: totalQuestions,
        score_percent: scorePercent,
        time_used_seconds: timeUsedSeconds,
        finished_at: new Date().toISOString(),
        is_completed: true,
      }])
      .select()
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Error al guardar intento' }, { status: 500 })
    }
    attempt = data
  }

  // Update question stats in parallel (fire-and-forget, non-blocking)
  const answerEntries = Object.entries(answers) as [string, string][]
  const questionIds = answerEntries.map(([id]) => parseInt(id))

  if (questionIds.length > 0) {
    // Fetch correct answers for all questions in one query
    supabase
      .from('questions')
      .select('id, correct_option')
      .in('id', questionIds)
      .then(({ data: questions }) => {
        if (!questions) return
        // Fire all RPC calls in parallel instead of sequentially
        Promise.all(
          questions.map((q) =>
            supabase.rpc('update_question_stats', {
              p_question_id: q.id,
              p_is_correct: answers[String(q.id)] === q.correct_option,
            })
          )
        )
      })
  }

  return NextResponse.json({ attemptId: attempt.id })
}
