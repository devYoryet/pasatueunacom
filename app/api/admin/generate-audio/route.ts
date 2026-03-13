import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 120 // 2 min para audio largo

/**
 * POST /api/admin/generate-audio
 * Body: { lesson_id: number }
 *
 * Flujo:
 * 1. Obtiene el txt_content de la lección desde Supabase
 * 2. Llama a OpenAI TTS (tts-1-hd, voice: nova) — servidor Vercel no tiene proxy
 * 3. Sube el MP3 a Supabase Storage bucket "audio"
 * 4. Actualiza lessons.video_url con la URL pública
 */
export async function POST(req: NextRequest) {
  // Auth: solo admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  // OpenAI key
  const openaiKey = process.env.OPENAI_API_KEY
  if (!openaiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY no configurado en variables de entorno' }, { status: 500 })
  }

  const { lesson_id, voice = 'nova', speed = 0.95 } = await req.json()
  if (!lesson_id) return NextResponse.json({ error: 'lesson_id requerido' }, { status: 400 })

  // Obtener la lección
  const { data: lesson, error: lessonErr } = await supabase
    .from('lessons')
    .select('id, title, order_index, txt_content, specialty_id')
    .eq('id', lesson_id)
    .single()

  if (lessonErr || !lesson) {
    return NextResponse.json({ error: 'Lección no encontrada' }, { status: 404 })
  }

  const script = lesson.txt_content?.trim()
  if (!script) {
    return NextResponse.json({ error: 'La lección no tiene txt_content (guion de audio)' }, { status: 400 })
  }

  // Llamar a OpenAI TTS
  let audioBuffer: ArrayBuffer
  try {
    const ttsRes = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'tts-1-hd',
        voice,           // nova es la más natural en español latinoamericano
        input: script,
        speed,
        response_format: 'mp3',
      }),
    })

    if (!ttsRes.ok) {
      const err = await ttsRes.text()
      return NextResponse.json({ error: `OpenAI TTS error: ${err}` }, { status: 502 })
    }

    audioBuffer = await ttsRes.arrayBuffer()
  } catch (e: any) {
    return NextResponse.json({ error: `Error llamando OpenAI: ${e.message}` }, { status: 502 })
  }

  // Subir a Supabase Storage
  const filename = `capsula_${String(lesson.order_index).padStart(2, '0')}_${lesson_id}.mp3`
  const storagePath = `diabetes/${filename}`

  // Usar service role key para bypass RLS en storage
  const { createClient: createAdmin } = await import('@supabase/supabase-js')
  const adminClient = createAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error: uploadErr } = await adminClient.storage
    .from('audio')
    .upload(storagePath, audioBuffer, {
      contentType: 'audio/mpeg',
      upsert: true,
    })

  if (uploadErr) {
    return NextResponse.json({ error: `Error subiendo audio: ${uploadErr.message}` }, { status: 500 })
  }

  // Obtener URL pública
  const { data: { publicUrl } } = adminClient.storage.from('audio').getPublicUrl(storagePath)

  // Actualizar video_url en la lección
  const { error: updateErr } = await supabase
    .from('lessons')
    .update({ video_url: publicUrl })
    .eq('id', lesson_id)

  if (updateErr) {
    return NextResponse.json({ error: `Audio subido pero no se pudo actualizar la lección: ${updateErr.message}`, publicUrl }, { status: 500 })
  }

  return NextResponse.json({
    success: true,
    lesson_id,
    title: lesson.title,
    publicUrl,
    size_kb: Math.round(audioBuffer.byteLength / 1024),
  })
}
