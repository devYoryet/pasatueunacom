'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowRight, TrendingUp, BookOpen, CheckCircle, Clock, AlertTriangle,
  CalendarDays, Flame, Target, Trophy, ChevronRight, Zap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime, formatTime, getScoreColor, truncate, getGreeting } from '@/lib/utils'
import {
  COURSE_CALENDAR,
  getCurrentCourseWeek,
  getDaysUntilNextTest,
  CHAPTER_COLORS,
} from '@/lib/course-calendar'
import type { Attempt, Specialty } from '@/lib/supabase/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardData {
  profile: { full_name: string }
  todayCount: number
  avgScore: number
  streak: number
  totalAttempts: number
  recentAttempts: (Attempt & { exams: { title: string; specialties: Specialty | null } | null })[]
  weakSpecialties: { name: string; score: number; code: string }[]
  lastIncomplete: (Attempt & { exams: { title: string; id: number } | null }) | null
  // course progress
  courseProgress: {
    done: number
    total: number
    pct: number
  }
}

// ─── Streak calculator ────────────────────────────────────────────────────────

function calculateStreak(finishedDates: string[]): number {
  if (finishedDates.length === 0) return 0
  const days = new Set(
    finishedDates.map((d) => new Date(d).toLocaleDateString('es-CL'))
  )
  const today = new Date()
  let streak = 0
  let checkDate = new Date(today)

  while (true) {
    const key = checkDate.toLocaleDateString('es-CL')
    if (days.has(key)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      // If we haven't found anything today, check yesterday before breaking
      if (streak === 0) {
        checkDate.setDate(checkDate.getDate() - 1)
        const prevKey = checkDate.toLocaleDateString('es-CL')
        if (days.has(prevKey)) {
          streak++
          checkDate.setDate(checkDate.getDate() - 1)
          continue
        }
      }
      break
    }
  }
  return streak
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatsCard({
  title,
  value,
  icon: Icon,
  subtitle,
  color = 'text-blue-600',
  bgColor = 'bg-slate-50',
}: {
  title: string
  value: string | number
  icon: React.ElementType
  subtitle?: string
  color?: string
  bgColor?: string
}) {
  return (
    <div className="stats-card">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${bgColor}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
      <div className="text-2xl font-heading font-bold text-slate-900 mb-1">{value}</div>
      <div className="text-sm font-medium text-slate-700">{title}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>}
    </div>
  )
}

// ─── Course progress mini card ────────────────────────────────────────────────

function CourseProgressCard({ courseProgress }: { courseProgress: DashboardData['courseProgress'] }) {
  const currentWeek = useMemo(() => getCurrentCourseWeek(), [])
  const nextTest = useMemo(() => getDaysUntilNextTest(), [])

  // Find current chapter
  const currentChapter = currentWeek
    ? COURSE_CALENDAR.chapters.find((c) => c.weeks.some((w) => w.week === currentWeek.week))
    : null
  const color = currentChapter ? CHAPTER_COLORS[currentChapter.color] : CHAPTER_COLORS.blue

  return (
    <Card className="border-2 border-blue-100 bg-gradient-to-br from-blue-50 to-white">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-blue-500" />
            Calendario del Curso
          </CardTitle>
          <Link href="/app/calendar">
            <Button variant="ghost" size="sm" className="text-xs text-blue-600 hover:text-blue-700 h-7">
              Ver completo <ChevronRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Progreso general EUNACOM 2026</span>
            <span className="text-sm font-bold text-blue-700">{courseProgress.pct}%</span>
          </div>
          <Progress value={courseProgress.pct} className="h-2.5 [&>div]:bg-blue-500" />
          <div className="text-xs text-slate-400 mt-1">{courseProgress.done} de {courseProgress.total} temas iniciados</div>
        </div>

        {/* Current week */}
        {currentWeek ? (
          <div className={`flex items-center gap-3 p-3 rounded-xl ${color.bg} border ${color.border}`}>
            <Flame className={`w-4 h-4 ${color.text} flex-shrink-0`} />
            <div className="flex-1 min-w-0">
              <div className={`text-xs font-semibold ${color.text}`}>Semana {currentWeek.week} — En curso</div>
              <div className="text-sm font-medium text-slate-800 truncate">{currentWeek.topic}</div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
            <CalendarDays className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-500">Fuera del periodo del curso</span>
          </div>
        )}

        {/* Next test countdown */}
        {nextTest && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-600">
              <Target className="w-4 h-4 text-amber-500" />
              <span>{nextTest.test.title}</span>
            </div>
            <span className={`font-bold ${nextTest.days <= 7 ? 'text-red-600' : nextTest.days <= 14 ? 'text-amber-600' : 'text-slate-700'}`}>
              {nextTest.days === 0 ? '¡Hoy!' : `${nextTest.days} días`}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

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

      // Single batched query: all completed attempts with exam+specialty join
      const [attemptsRes, todayRes, incompleteRes, profileRes, examsRes] = await Promise.all([
        supabase
          .from('attempts')
          .select('*, exams(title, id, specialty_id, specialties(name, code, icon))')
          .eq('user_id', user.id)
          .eq('is_completed', true)
          .order('finished_at', { ascending: false })
          .limit(100), // enough for stats, not entire history
        supabase
          .from('attempts')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_completed', true)
          .gte('finished_at', today.toISOString()),
        supabase
          .from('attempts')
          .select('*, exams(title, id)')
          .eq('user_id', user.id)
          .eq('is_completed', false)
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle(),
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('exams').select('id, specialty_id').eq('is_active', true).eq('exam_type', 'topic'),
      ])

      const attempts = (attemptsRes.data ?? []) as any[]
      const recentAttempts = attempts.slice(0, 5)

      // Avg score from all attempts
      const avgScore = attempts.length > 0
        ? Math.round(attempts.reduce((sum, a) => sum + (a.score_percent ?? 0), 0) / attempts.length)
        : 0

      // Streak calculation from finished_at dates
      const finishedDates = attempts
        .map((a) => a.finished_at)
        .filter(Boolean) as string[]
      const streak = calculateStreak(finishedDates)

      // Weak specialties (by avg score from attempts)
      const specialtyScores: Record<string, { total: number; count: number; name: string }> = {}
      for (const a of attempts) {
        if (a.exams?.specialties) {
          const code = a.exams.specialties.code
          const name = a.exams.specialties.name
          if (!specialtyScores[code]) specialtyScores[code] = { total: 0, count: 0, name }
          specialtyScores[code].total += a.score_percent ?? 0
          specialtyScores[code].count++
        }
      }
      const weakSpecialties = Object.entries(specialtyScores)
        .map(([code, d]) => ({ code, name: d.name, score: Math.round(d.total / d.count) }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 3)

      // Course progress: how many calendar weeks have at least 1 completed exam
      const exams = examsRes.data ?? []
      const completedExamIds = new Set(attempts.map((a) => a.exam_id))
      const completedSpecialtyCodes = new Set<string>()

      for (const exam of exams) {
        if (completedExamIds.has(exam.id) && exam.specialty_id) {
          // Find specialty code from attempts
          const att = attempts.find((a) => a.exam_id === exam.id && a.exams?.specialties)
          if (att?.exams?.specialties?.code) {
            completedSpecialtyCodes.add(att.exams.specialties.code)
          }
        }
      }

      // Count content weeks (non-repaso) that have any completed specialty
      const allContentWeeks = COURSE_CALENDAR.chapters.flatMap((c) =>
        c.weeks.filter((w) => !w.isRepaso && w.specialtyCodes.length > 0)
      )
      const doneWeeks = allContentWeeks.filter((w) =>
        w.specialtyCodes.some((code) => completedSpecialtyCodes.has(code))
      )

      setData({
        profile: profileRes.data ?? { full_name: '' },
        todayCount: todayRes.data?.length ?? 0,
        avgScore,
        streak,
        totalAttempts: attempts.length,
        recentAttempts,
        weakSpecialties,
        lastIncomplete: incompleteRes.data as any,
        courseProgress: {
          done: doneWeeks.length,
          total: allContentWeeks.length,
          pct: allContentWeeks.length > 0 ? Math.round((doneWeeks.length / allContentWeeks.length) * 100) : 0,
        },
      })
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
        <Skeleton className="h-48" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Greeting */}
      <div>
        <h1 className="section-title">
          {getGreeting()}{data?.profile?.full_name ? `, ${data.profile.full_name.split(' ')[0]}` : ''} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Resumen de tu actividad y progreso en el curso EUNACOM 2026</p>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Respondidas hoy"
          value={data?.todayCount ?? 0}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-50"
          subtitle="Cuestionarios"
        />
        <StatsCard
          title="Promedio histórico"
          value={`${data?.avgScore ?? 0}%`}
          icon={TrendingUp}
          color="text-blue-600"
          bgColor="bg-blue-50"
          subtitle="Puntaje general"
        />
        <StatsCard
          title="Racha actual"
          value={data?.streak ?? 0}
          icon={Flame}
          color="text-orange-500"
          bgColor="bg-orange-50"
          subtitle={data?.streak === 1 ? 'día consecutivo' : 'días consecutivos'}
        />
        <StatsCard
          title="Total completados"
          value={data?.totalAttempts ?? 0}
          icon={BookOpen}
          color="text-purple-600"
          bgColor="bg-purple-50"
          subtitle="Cuestionarios"
        />
      </div>

      {/* COURSE PROGRESS + CONTINUE */}
      <div className="grid lg:grid-cols-2 gap-6">
        <CourseProgressCard courseProgress={data?.courseProgress ?? { done: 0, total: 22, pct: 0 }} />

        {data?.lastIncomplete ? (
          <Card className="border-2 border-amber-100">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" />
                Continúa donde lo dejaste
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-slate-800 truncate">
                    {data.lastIncomplete.exams?.title}
                  </div>
                  <div className="text-sm text-slate-500 mt-1">
                    {formatDateTime(data.lastIncomplete.started_at)}
                  </div>
                </div>
                <Link href={`/app/exam/${data.lastIncomplete.exam_id}`}>
                  <Button size="sm" className="gap-2 flex-shrink-0">
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* WEAK SPECIALTIES when no incomplete */
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                Áreas a reforzar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data?.weakSpecialties && data.weakSpecialties.length > 0 ? (
                data.weakSpecialties.map((spec) => (
                  <div key={spec.code}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{spec.name}</span>
                      <span className={`text-sm font-bold ${getScoreColor(spec.score)}`}>{spec.score}%</span>
                    </div>
                    <Progress value={spec.score} className="h-1.5" />
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 text-center py-4">
                  Completa algunos cuestionarios para ver tus áreas débiles.
                </p>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* WEAK SPECIALTIES (when there IS an incomplete) */}
      {data?.lastIncomplete && data.weakSpecialties.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              Áreas a reforzar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              {data.weakSpecialties.map((spec) => (
                <div key={spec.code}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{spec.name}</span>
                    <span className={`text-sm font-bold ${getScoreColor(spec.score)}`}>{spec.score}%</span>
                  </div>
                  <Progress value={spec.score} className="h-1.5" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
              <p className="text-sm">Aún no has completado ningún cuestionario.</p>
              <Link href="/app/specialties">
                <Button variant="ghost" size="sm" className="mt-2">Empezar ahora →</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
