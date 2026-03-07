'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AdminStatsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()

      const [attemptsRes, usersRes, questionsRes] = await Promise.all([
        supabase
          .from('attempts')
          .select('score_percent, started_at, exams(specialties(name))')
          .eq('is_completed', true)
          .order('started_at', { ascending: false })
          .limit(500),
        supabase.from('profiles').select('created_at, subscription_status').eq('role', 'student'),
        supabase.from('question_stats').select('*').order('times_shown', { ascending: false }).limit(20),
      ])

      const attempts = attemptsRes.data ?? []
      const users = usersRes.data ?? []

      // Score distribution
      const scoreRanges = [
        { range: '0-40%', count: 0 },
        { range: '41-60%', count: 0 },
        { range: '61-80%', count: 0 },
        { range: '81-100%', count: 0 },
      ]
      attempts.forEach((a: any) => {
        const s = a.score_percent ?? 0
        if (s <= 40) scoreRanges[0].count++
        else if (s <= 60) scoreRanges[1].count++
        else if (s <= 80) scoreRanges[2].count++
        else scoreRanges[3].count++
      })

      setStats({
        totalAttempts: attempts.length,
        avgScore: attempts.length > 0
          ? Math.round(attempts.reduce((sum: number, a: any) => sum + (a.score_percent ?? 0), 0) / attempts.length)
          : 0,
        totalUsers: users.length,
        activeUsers: users.filter((u: any) => u.subscription_status === 'active').length,
        scoreDistribution: scoreRanges,
        failedQuestions: questionsRes.data ?? [],
      })
      setLoading(false)
    }

    load()
  }, [])

  if (loading) return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
      </div>
      <Skeleton className="h-64" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="section-title">Estadísticas globales</h1>
        <p className="text-slate-500 text-sm mt-1">Métricas de uso de la plataforma</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Intentos totales', value: stats?.totalAttempts ?? 0 },
          { label: 'Puntaje promedio', value: `${stats?.avgScore ?? 0}%` },
          { label: 'Usuarios totales', value: stats?.totalUsers ?? 0 },
          { label: 'Suscriptores activos', value: stats?.activeUsers ?? 0 },
        ].map((s) => (
          <div key={s.label} className="stats-card">
            <div className="text-2xl font-heading font-bold text-slate-900">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribución de puntajes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.scoreDistribution ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" radius={[6, 6, 0, 0]} name="Intentos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
