import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { parseQuestionsFromText, parseQuestionsFromImages } from '@/lib/ai/parseQuestions'
import type { ParsedQuestion } from '@/lib/supabase/types'

// POST — Parse questions from text or images
export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  // Check admin role
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  const body = await req.json()
  const { rawText, images, specialtyId } = body

  if (!rawText && (!images || images.length === 0)) {
    return NextResponse.json({ error: 'Debes proporcionar texto o imágenes' }, { status: 400 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'API key de OpenAI no configurada' }, { status: 500 })
  }

  try {
    let questions: ParsedQuestion[]

    if (rawText) {
      questions = await parseQuestionsFromText(rawText, specialtyId)
    } else {
      questions = await parseQuestionsFromImages(images)
    }

    // Generate SQL preview
    const sql = questions.map((q) => `
INSERT INTO questions (specialty_id, stem, option_a, option_b, option_c, option_d, option_e, correct_option, explanation, difficulty, has_table, ai_generated)
VALUES (${specialtyId ?? 'NULL'}, '${q.stem.replace(/'/g, "''")}', '${q.option_a.replace(/'/g, "''")}', '${q.option_b.replace(/'/g, "''")}', '${q.option_c.replace(/'/g, "''")}', '${q.option_d.replace(/'/g, "''")}', ${q.option_e ? `'${q.option_e.replace(/'/g, "''")}'` : 'NULL'}, '${q.correct_option}', '${q.explanation.replace(/'/g, "''")}', '${q.difficulty}', ${q.has_table}, TRUE);`
    ).join('\n')

    // Log import
    await supabase.from('import_logs').insert([{
      admin_id: user.id,
      source_type: rawText ? 'text' : 'image',
      questions_extracted: questions.length,
      questions_imported: 0,
      specialty_id: specialtyId ? parseInt(specialtyId) : null,
    }])

    return NextResponse.json({
      questions,
      count: questions.length,
      sql,
    })
  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json(
      { error: 'Error al procesar las preguntas. Verifica el API key de OpenAI.' },
      { status: 500 }
    )
  }
}

// PUT — Save parsed questions to database
export async function PUT(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  const body = await req.json()
  const { questions, specialtyId, examId, isAiGenerated = false } = body

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    return NextResponse.json({ error: 'No hay preguntas para importar' }, { status: 400 })
  }

  const questionsToInsert = questions.map((q: ParsedQuestion) => ({
    specialty_id: specialtyId ? parseInt(String(specialtyId)) : null,
    stem: q.stem,
    option_a: q.option_a,
    option_b: q.option_b,
    option_c: q.option_c,
    option_d: q.option_d,
    option_e: q.option_e || null,
    correct_option: q.correct_option,
    explanation: q.explanation,
    difficulty: q.difficulty,
    has_table: q.has_table,
    is_active: true,
    ai_generated: isAiGenerated,
    created_by: user.id,
  }))

  const { data: insertedQuestions, error } = await supabase
    .from('questions')
    .insert(questionsToInsert)
    .select('id')

  if (error) {
    console.error('Insert error:', error)
    return NextResponse.json({ error: 'Error al guardar preguntas' }, { status: 500 })
  }

  // If examId specified, add to exam
  if (examId && insertedQuestions) {
    const { data: existingEq } = await supabase
      .from('exam_questions')
      .select('order_index')
      .eq('exam_id', parseInt(examId))
      .order('order_index', { ascending: false })
      .limit(1)

    const startIndex = (existingEq?.[0]?.order_index ?? 0) + 1

    const examQuestions = insertedQuestions.map((q: any, i: number) => ({
      exam_id: parseInt(examId),
      question_id: q.id,
      order_index: startIndex + i,
    }))

    await supabase.from('exam_questions').insert(examQuestions)
  }

  // Update import log
  await supabase
    .from('import_logs')
    .update({ questions_imported: insertedQuestions?.length ?? 0 })
    .eq('admin_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)

  return NextResponse.json({ imported: insertedQuestions?.length ?? 0 })
}
