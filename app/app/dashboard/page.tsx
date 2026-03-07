'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, TrendingUp, BookOpen, CheckCircle, Clock, AlertTriangle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime, formatTime, getScoreColor, truncate } from '@/lib/utils'
import type { Attempt, Specialty } from '@/lib/supabase/types'

interface DashboardData {
  todayCount: number
  avgScore: number
  streak: number
  totalAttempts: number
  recentAttempts: (Attempt & { exams: { title: string; specialties: Specialty | null } | null })[]
  weakSpecialties: { name: string; score: number; code: string }[]
  lastIncomplete: (Attempt & { exams: { title: string; id: number } | null }) | null
}

function StatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  color = 'text-blue-600',
}: {
  title: string
  value: string | number
  icon: React.ElementType
  subtitle?: string
  color?: string
}) {
  return (
    <div className="stats-card">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-slate-50`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div className="text-2xl font-heading font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-700">{title}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
    </div>
  )
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const [attemptsRes, todayRes] = await Promise.all([
        supabase
          .from('attempts')
          .select('*, exams(title, id, specialties(name, code, icon))')
          .eq('user_id', user.id)
          .eq('is_completed', true)
          .order('finished_at', { ascending: false })
          .limit(20),
        supabase
          .from('attempts')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_completed', true)
          .gte('finished_at', today.toISOString()),
      ])

      const attempts = (attemptsRes.data ?? []) as any[]
      const recentAttempts = attempts.slice(0, 5)

      const avgScore =
        attempts.length > 0
          ? Math.round(attempts.reduce((sum, a) => sum + (a.score_percent ?? 0), 0) / attempts.length)
          : 0

      // Find weak specialties
      const specialtyScores: Record<string, { total: number; count: number; name: string }> = {}
      attempts.forEach((a) => {
        if (a.exams?.specialties) {
          const code = a.exams.specialties.code
          const name = a.exams.specialties.name
          if (!specialtyScores[code]) specialtyScores[code] = { total: 0, count: 0, name }
          specialtyScores[code].total += a.score_percent ?? 0
          specialtyScores[code].count++
        }
      })

      const weakSpecialties = Object.entries(specialtyScores)
        .map(([code, data]) => ({
          code,
          name: data.name,
          score: Math.round(data.total / data.count),
        }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 3)

      // Find last incomplete
      const { data: incompleteData } = await supabase
        .from('attempts')
        .select('*, exams(title, id)')
        .eq('user_id', user.id)
        .eq('is_completed', false)
        .order('started_at', { ascending: false })
        .limit(1)
        .single()

      setData({
        todayCount: todayRes.data?.length ?? 0,
        avgScore,
        streak: 0, // TODO: calculate streak
        totalAttempts: attempts.length,
        recentAttempts,
        weakSpecialties,
        lastIncomplete: incompleteData as any,
      })
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="section-title">Panel de inicio</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen de tu actividad y progreso</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Respondidas hoy"
          value={data?.todayCount ?? 0}
          icon={CheckCircle}
          color="text-green-600"
          subtitle="Preguntas"
        />
        <StatsCard
          title="Promedio histórico"
          value={`${data?.avgScore ?? 0}%`}
          icon={TrendingUp}
          color="text-blue-600"
          subtitle="Puntaje general"
        />
        <StatsCard
          title="Racha actual"
          value={data?.streak ?? 0}
          icon={Clock}
          color="text-orange-500"
          subtitle="Días consecutivos"
        />
        <StatsCard
          title="Total intentos"
          value={data?.totalAttempts ?? 0}
          icon={BookOpen}
          color="text-purple-600"
          subtitle="Completados"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* CONTINUE */}
        {data?.lastIncomplete ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Continúa donde lo dejaste</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-slate-800">
                    {data.lastIncomplete.exams?.title}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {formatDateTime(data.lastIncomplete.started_at)}
                  </div>
                </div>
                <Link href={`/app/exam/${data.lastIncomplete.exam_id}`}>
                  <Button size="sm" className="gap-2">
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center text-slate-400">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay intentos incompletos.</p>
              <Link href="/app/specialties">
                <Button variant="ghost" size="sm" className="mt-2">Comenzar práctica →</Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* WEAK SPECIALTIES */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Tus áreas más débiles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.weakSpecialties && data.weakSpecialties.length > 0 ? (
              data.weakSpecialties.map((spec) => (
                <div key={spec.code}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{spec.name}</span>
                    <span className={`text-sm font-bold ${getScoreColor(spec.score)}`}>
                      {spec.score}%
                    </span>
                  </div>
                  <Progress value={spec.score} className="h-1.5" />
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-4">
                Completa algunos intentos para ver tus áreas débiles.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* RECENT ACTIVITY */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Actividad reciente</CardTitle>
            <Link href="/app/history">
              <Button variant="ghost" size="sm">Ver todo →</Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {data?.recentAttempts && data.recentAttempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="text-left pb-3 font-medium">Examen</th>
                    <th className="text-left pb-3 font-medium hidden sm:table-cell">Especialidad</th>
                    <th className="text-center pb-3 font-medium">Puntaje</th>
                    <th className="text-right pb-3 font-medium hidden md:table-cell">Tiempo</th>
                    <th className="text-right pb-3 font-medium">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {data.recentAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4">
                        <span className="font-medium text-slate-800">
                          {truncate(attempt.exams?.title ?? 'Examen', 35)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <span className="text-slate-500">
                          {(attempt.exams as any)?.specialties?.name ?? '—'}
                        </span>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`font-bold ${getScoreColor(attempt.score_percent ?? 0)}`}>
                          {Math.round(attempt.score_percent ?? 0)}%
                        </span>
                      </td>
                      <td className="py-3 text-right text-slate-400 hidden md:table-cell">
                        {attempt.time_used_seconds ? formatTime(attempt.time_used_seconds) : '—'}
                      </td>
                      <td className="py-3 text-right text-slate-400">
                        {attempt.finished_at
                          ? new Date(attempt.finished_at).toLocaleDateString('es-CL')
                          : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400">
              <p className="text-sm">Aún no has completado ningún intento.</p>
              <Link href="/app/specialties">
                <Button variant="ghost" size="sm" className="mt-2">
                  Empezar ahora →
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
