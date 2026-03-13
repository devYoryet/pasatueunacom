import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

// One-time endpoint to set video_url for lessons that have generated audio files.
// POST /api/admin/update-lesson-audio
export async function POST() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'No autenticado' }, { status: 401 })

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (!profile || profile.role !== 'admin') {
    return NextResponse.json({ error: 'Acceso denegado' }, { status: 403 })
  }

  // Get the diabetes specialty id
  const { data: specialty } = await supabase
    .from('specialties')
    .select('id')
    .eq('code', 'diabetes')
    .single()

  if (!specialty) {
    return NextResponse.json({ error: 'Specialty "diabetes" not found' }, { status: 404 })
  }

  // Update lesson 1 (Clasificación y Diferenciación de los Tipos de Diabetes Mellitus)
  const { data, error } = await supabase
    .from('lessons')
    .update({ video_url: '/audio/diabetes-clasificacion.mp3' })
    .eq('specialty_id', specialty.id)
    .eq('order_index', 1)
    .select('id, title, video_url')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ updated: data })
}
