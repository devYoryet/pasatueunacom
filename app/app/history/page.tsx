'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime, formatTime, getScoreColor, getScoreBadgeColor, truncate } from '@/lib/utils'
import { BarChart3, Eye } from 'lucide-react'

interface AttemptRow {
  id: string
  exam_id: number
  score_percent: number | null
  correct_count: number
  total_questions: number
  time_used_seconds: number | null
  finished_at: string | null
  mode: string
  exams: {
    title: string
    specialties: { name: string; icon: string } | null
  } | null
}

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<AttemptRow[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const PAGE_SIZE = 20

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('attempts')
        .select('*, exams(title, specialties(name, icon))')
        .eq('user_id', user.id)
        .eq('is_completed', true)
        .order('finished_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)

      setAttempts((data as AttemptRow[]) ?? [])
      setLoading(false)
    }

    load()
  }, [page])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Historial de intentos</h1>
          <p className="text-slate-500 text-sm mt-1">Todos tus intentos completados</p>
        </div>
        <Link href="/app/stats">
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Estadísticas
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="pt-6">
          {attempts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="text-left pb-3 font-medium">Examen</th>
                    <th className="text-left pb-3 font-medium hidden sm:table-cell">Especialidad</th>
                    <th className="text-center pb-3 font-medium">Puntaje</th>
                    <th className="text-center pb-3 font-medium hidden md:table-cell">Correctas</th>
                    <th className="text-right pb-3 font-medium hidden md:table-cell">Tiempo</th>
                    <th className="text-right pb-3 font-medium">Fecha</th>
                    <th className="text-right pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {attempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 pr-4">
                        <div className="font-medium text-slate-800">
                          {truncate(attempt.exams?.title ?? 'Examen', 35)}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5 sm:hidden">
                          {attempt.exams?.specialties?.name}
                        </div>
                      </td>
                      <td className="py-3 pr-4 hidden sm:table-cell">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <span>{attempt.exams?.specialties?.icon}</span>
                          <span>{attempt.exams?.specialties?.name ?? '—'}</span>
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <Badge className={getScoreBadgeColor(attempt.score_percent ?? 0)}>
                          {Math.round(attempt.score_percent ?? 0)}%
                        </Badge>
                      </td>
                      <td className="py-3 text-center text-slate-500 hidden md:table-cell">
                        {attempt.correct_count}/{attempt.total_questions}
                      </td>
                      <td className="py-3 text-right text-slate-400 hidden md:table-cell">
                        {attempt.time_used_seconds ? formatTime(attempt.time_used_seconds) : '—'}
                      </td>
                      <td className="py-3 text-right text-slate-400 text-xs">
                        {attempt.finished_at
                          ? new Date(attempt.finished_at).toLocaleDateString('es-CL')
                          : '—'}
                      </td>
                      <td className="py-3 text-right pl-4">
                        <Link href={`/app/exam/${attempt.exam_id}/results?attemptId=${attempt.id}`}>
                          <Button variant="ghost" size="icon" className="h-7 w-7">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400">
              <p className="text-sm">No has completado ningún intento aún.</p>
              <Link href="/app/specialties">
                <Button variant="ghost" size="sm" className="mt-3">
                  Empezar a practicar →
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
