import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
  }

  const body = await req.json()
  const { mode, specialtyId, examId, questionCount, timerEnabled, timerSeconds } = body

  let targetExamId = examId

  if (mode === 'simulation') {
    // Use the simulation exam
    const { data: simExam } = await supabase
      .from('exams')
      .select('id')
      .eq('exam_type', 'simulation')
      .eq('is_active', true)
      .limit(1)
      .single()

    if (simExam) {
      targetExamId = simExam.id
    } else {
      return NextResponse.json({ error: 'No hay examen simulacro disponible' }, { status: 404 })
    }
  } else if (!targetExamId && specialtyId) {
    // Get first available exam for this specialty
    const { data: firstExam } = await supabase
      .from('exams')
      .select('id')
      .eq('specialty_id', specialtyId)
      .eq('is_active', true)
      .order('order_index')
      .limit(1)
      .single()

    if (firstExam) {
      targetExamId = firstExam.id
    } else {
      return NextResponse.json({ error: 'No hay exámenes disponibles para esta especialidad' }, { status: 404 })
    }
  }

  if (!targetExamId) {
    return NextResponse.json({ error: 'Examen no especificado' }, { status: 400 })
  }

  // Check if exam has questions
  const { data: examQuestions, count } = await supabase
    .from('exam_questions')
    .select('question_id', { count: 'exact' })
    .eq('exam_id', targetExamId)

  if (!examQuestions || examQuestions.length === 0) {
    return NextResponse.json(
      { error: 'Este examen no tiene preguntas asignadas aún' },
      { status: 404 }
    )
  }

  // Get exam info
  const { data: exam } = await supabase
    .from('exams')
    .select('*')
    .eq('id', targetExamId)
    .single()

  if (!exam) {
    return NextResponse.json({ error: 'Examen no encontrado' }, { status: 404 })
  }

  // Create attempt
  const timeLimitSeconds =
    mode === 'simulation'
      ? 4 * 60 * 60
      : timerEnabled
        ? timerSeconds * (questionCount || exam.question_count)
        : null

  const { data: attempt, error: attemptError } = await supabase
    .from('attempts')
    .insert([{
      user_id: user.id,
      exam_id: targetExamId,
      mode,
      total_questions: Math.min(questionCount || exam.question_count, examQuestions.length),
      answers: {},
      is_completed: false,
    }])
    .select()
    .single()

  if (attemptError || !attempt) {
    return NextResponse.json({ error: 'Error al crear intento' }, { status: 500 })
  }

  return NextResponse.json({
    examId: targetExamId,
    attemptId: attempt.id,
    timeLimitSeconds,
    questionCount: Math.min(questionCount || exam.question_count, examQuestions.length),
  })
}
