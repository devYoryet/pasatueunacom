'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { getScoreColor } from '@/lib/utils'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

interface SpecialtyStats {
  name: string
  icon: string
  avgScore: number
  attempts: number
  code: string
}

export default function StatsPage() {
  const [specialtyStats, setSpecialtyStats] = useState<SpecialtyStats[]>([])
  const [loading, setLoading] = useState(true)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [overallAvg, setOverallAvg] = useState(0)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: attempts } = await supabase
        .from('attempts')
        .select('score_percent, exams(specialty_id, specialties(name, icon, code))')
        .eq('user_id', user.id)
        .eq('is_completed', true)

      if (!attempts) { setLoading(false); return }

      setTotalAttempts(attempts.length)

      const overall = attempts.reduce((sum, a) => sum + (a.score_percent ?? 0), 0)
      setOverallAvg(attempts.length > 0 ? Math.round(overall / attempts.length) : 0)

      const specMap: Record<string, { total: number; count: number; name: string; icon: string }> = {}

      attempts.forEach((a: any) => {
        const spec = a.exams?.specialties
        if (spec) {
          const code = spec.code
          if (!specMap[code]) specMap[code] = { total: 0, count: 0, name: spec.name, icon: spec.icon ?? '' }
          specMap[code].total += a.score_percent ?? 0
          specMap[code].count++
        }
      })

      const stats = Object.entries(specMap).map(([code, data]) => ({
        code,
        name: data.name,
        icon: data.icon,
        avgScore: Math.round(data.total / data.count),
        attempts: data.count,
      })).sort((a, b) => a.avgScore - b.avgScore)

      setSpecialtyStats(stats)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
      </div>
    )
  }

  const chartData = specialtyStats.map((s) => ({
    name: s.name.split(' ')[0],
    score: s.avgScore,
    fill: s.avgScore >= 80 ? '#10B981' : s.avgScore >= 60 ? '#F59E0B' : '#EF4444',
  }))

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="section-title">Mis estadísticas</h1>
        <p className="text-slate-500 text-sm mt-1">Análisis de tu rendimiento por especialidad</p>
      </div>

      {/* SUMMARY */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="stats-card text-center">
          <div className="text-3xl font-heading font-black text-blue-900">{totalAttempts}</div>
          <div className="text-sm text-slate-500 mt-1">Intentos completados</div>
        </div>
        <div className="stats-card text-center">
          <div className={`text-3xl font-heading font-black ${getScoreColor(overallAvg)}`}>
            {overallAvg}%
          </div>
          <div className="text-sm text-slate-500 mt-1">Promedio general</div>
        </div>
        <div className="stats-card text-center">
          <div className="text-3xl font-heading font-black text-purple-600">
            {specialtyStats.length}
          </div>
          <div className="text-sm text-slate-500 mt-1">Especialidades practicadas</div>
        </div>
      </div>

      {specialtyStats.length > 0 ? (
        <>
          {/* BAR CHART */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Rendimiento por especialidad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Promedio']} />
                    <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <rect key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* SPECIALTY BREAKDOWN */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Detalle por especialidad</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {specialtyStats.map((spec) => (
                <div key={spec.code}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span>{spec.icon}</span>
                      <span className="text-sm font-medium text-slate-700">{spec.name}</span>
                      <span className="text-xs text-slate-400">{spec.attempts} intentos</span>
                    </div>
                    <span className={`text-sm font-bold ${getScoreColor(spec.avgScore)}`}>
                      {spec.avgScore}%
                    </span>
                  </div>
                  <Progress value={spec.avgScore} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-16 pb-16 text-center text-slate-400">
            <p className="text-sm">Completa algunos intentos para ver tus estadísticas.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
