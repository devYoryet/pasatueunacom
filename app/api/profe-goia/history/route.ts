import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data, error } = await supabase
      .from('profe_goia_sessions')
      .select('id, context_type, context_ref, context_id, question, response, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    // Daily usage count
    const today = new Date().toISOString().split('T')[0]
    const { count } = await supabase
      .from('profe_goia_sessions')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('session_date', today)

    return NextResponse.json({ sessions: data ?? [], usedToday: count ?? 0, limit: 5 })
  } catch (err) {
    console.error('[profe-goia/history]', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
