'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  COURSE_CALENDAR,
  CHAPTER_COLORS,
  getCurrentCourseWeek,
  getDaysUntilNextTest,
  getDaysUntilCourseEnd,
  formatWeekRange,
  type CourseWeek,
  type CourseChapter,
} from '@/lib/course-calendar'
import {
  CheckCircle2,
  Circle,
  Clock3,
  CalendarDays,
  Trophy,
  Flame,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  BookOpen,
  Target,
  Zap,
  Info,
} from 'lucide-react'
import type { TestDate } from '@/lib/course-calendar'

// ─── Monthly Calendar Grid ─────────────────────────────────────────────────────

function MonthGrid({ year, month, testDates }: { year: number; month: number; testDates: TestDate[] }) {
  const today = new Date()
  const todayY = today.getFullYear()
  const todayM = today.getMonth()
  const todayD = today.getDate()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Monday-first offset: Mon=0 … Sun=6
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7

  const testDaySet = new Set(
    testDates
      .filter((t) => {
        const d = new Date(t.date)
        return d.getFullYear() === year && d.getMonth() === month
      })
      .map((t) => new Date(t.date).getDate())
  )

  const getTestTitle = (day: number) =>
    testDates.find((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })?.title

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const monthName = new Date(year, month).toLocaleString('es-CL', { month: 'long' })

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3 capitalize">
        {monthName} {year}
      </h3>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-slate-400 py-0.5">
            {d}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />

          const isToday = year === todayY && month === todayM && day === todayD
          const isExam = testDaySet.has(day)
          const isPast = new Date(year, month, day) < new Date(todayY, todayM, todayD)
          const title = isExam ? getTestTitle(day) : undefined

          return (
            <div
              key={i}
              title={title}
              className={`flex items-center justify-center text-xs rounded-full mx-auto my-0.5 w-7 h-7 transition-colors ${
                isToday
                  ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-200'
                  : isExam
                  ? 'bg-amber-400 text-white font-bold cursor-help hover:bg-amber-500'
                  : isPast
                  ? 'text-slate-300'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Types ────────────────────────────────────────────────────────────────────

interface SpecialtyStats {
  specialty_id: number
  code: string
  name: string
  totalExams: number
  completedExams: number
  avgScore: number
}

type WeekStatus = 'completed' | 'current' | 'pending'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getWeekStatus(week: CourseWeek, currentWeek: CourseWeek | null): WeekStatus {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  const weekEnd = new Date(week.end)
  weekEnd.setHours(23, 59, 59, 999)
  const weekStart = new Date(week.start)

  if (today > weekEnd) return 'completed'
  if (currentWeek && week.week === currentWeek.week) return 'current'
  if (today < weekStart) return 'pending'
  return 'current'
}

function getSpecialtyProgress(week: CourseWeek, stats: Record<string, SpecialtyStats>) {
  if (week.specialtyCodes.length === 0) return null
  const relevant = week.specialtyCodes.map((c) => stats[c]).filter(Boolean)
  if (relevant.length === 0) return null

  const totalExams = relevant.reduce((s, x) => s + x.totalExams, 0)
  const completedExams = relevant.reduce((s, x) => s + x.completedExams, 0)
  const avgScores = relevant.filter((x) => x.avgScore > 0).map((x) => x.avgScore)
  const avgScore = avgScores.length > 0 ? Math.round(avgScores.reduce((a, b) => a + b, 0) / avgScores.length) : 0

  return { totalExams, completedExams, avgScore, pct: totalExams > 0 ? Math.round((completedExams / totalExams) * 100) : 0 }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusIcon({ status, isRepaso }: { status: WeekStatus; isRepaso?: boolean }) {
  if (isRepaso) return <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center"><span className="text-xs">📋</span></div>
  if (status === 'completed') return <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
  if (status === 'current') return <Clock3 className="w-5 h-5 text-blue-500 flex-shrink-0 animate-pulse" />
  return <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />
}

function ScoreBadge({ score }: { score: number }) {
  const cls = score >= 80 ? 'bg-green-100 text-green-700' : score >= 60 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${cls}`}>{score}%</span>
}

function WeekRow({
  week,
  status,
  progress,
  color,
  isCurrent,
}: {
  week: CourseWeek
  status: WeekStatus
  progress: ReturnType<typeof getSpecialtyProgress>
  color: typeof CHAPTER_COLORS[keyof typeof CHAPTER_COLORS]
  isCurrent: boolean
}) {
  const dateRange = formatWeekRange(week.start, week.end)

  return (
    <div
      className={`flex items-start gap-3 p-3 rounded-xl transition-all ${
        isCurrent
          ? `${color.bg} ${color.border} border-2 shadow-sm`
          : 'hover:bg-slate-50'
      }`}
    >
      {/* Status icon */}
      <div className="mt-0.5">
        <StatusIcon status={status} isRepaso={week.isRepaso} />
      </div>

      {/* Week number */}
      <div className="w-7 flex-shrink-0 text-xs font-mono text-slate-400 mt-0.5">
        S{week.week}
      </div>

      {/* Dates */}
      <div className="w-20 flex-shrink-0 text-xs text-slate-500 mt-0.5">{dateRange}</div>

      {/* Topic */}
      <div className="flex-1 min-w-0">
        <div className={`text-sm font-medium ${isCurrent ? color.text : 'text-slate-700'} leading-tight`}>
          {week.topic}
          {isCurrent && (
            <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${color.badge} font-semibold`}>
              Esta semana
            </span>
          )}
        </div>

        {/* Progress bar for specialty weeks */}
        {progress && progress.totalExams > 0 && (
          <div className="mt-1.5 flex items-center gap-2">
            <div className="flex-1 max-w-[120px]">
              <Progress value={progress.pct} className={`h-1.5 ${color.progress}`} />
            </div>
            <span className="text-xs text-slate-400">
              {progress.completedExams}/{progress.totalExams} cuest.
            </span>
          </div>
        )}
      </div>

      {/* Score */}
      <div className="flex-shrink-0">
        {progress && progress.avgScore > 0 ? (
          <ScoreBadge score={progress.avgScore} />
        ) : status === 'completed' && !week.isRepaso ? (
          <span className="text-xs text-slate-300">Sin datos</span>
        ) : null}
      </div>
    </div>
  )
}

function ChapterCard({
  chapter,
  stats,
  currentWeek,
  defaultOpen,
}: {
  chapter: CourseChapter
  stats: Record<string, SpecialtyStats>
  currentWeek: CourseWeek | null
  defaultOpen: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const color = CHAPTER_COLORS[chapter.color]

  // Chapter progress: % of content weeks with any completed exam
  const contentWeeks = chapter.weeks.filter((w) => !w.isRepaso && w.specialtyCodes.length > 0)
  const weeksDone = contentWeeks.filter((w) => {
    const prog = getSpecialtyProgress(w, stats)
    return prog && prog.completedExams > 0
  }).length
  const chapterPct = contentWeeks.length > 0 ? Math.round((weeksDone / contentWeeks.length) * 100) : 0

  const hasCurrentWeek = chapter.weeks.some((w) => currentWeek && w.week === currentWeek.week)

  return (
    <div className={`rounded-2xl border-2 ${hasCurrentWeek ? color.border : 'border-slate-200'} overflow-hidden`}>
      {/* Chapter header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-4 p-5 text-left ${hasCurrentWeek ? color.bg : 'bg-white'} hover:bg-slate-50 transition-colors`}
      >
        {/* Chapter number */}
        <div className={`w-10 h-10 rounded-xl ${color.badge} flex items-center justify-center flex-shrink-0 font-bold text-sm`}>
          {chapter.number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading font-semibold text-slate-900 text-base">
              Capítulo {chapter.number}
            </span>
            {hasCurrentWeek && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${color.badge}`}>
                En curso
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-0.5 truncate">{chapter.title}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="text-right hidden sm:block">
            <div className={`text-lg font-bold ${color.text}`}>{chapterPct}%</div>
            <div className="text-xs text-slate-400">{weeksDone}/{contentWeeks.length} temas</div>
          </div>
          <div className="w-20 hidden sm:block">
            <Progress value={chapterPct} className={`h-2 ${color.progress}`} />
          </div>
          <div>
            {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
          </div>
        </div>
      </button>

      {/* Mobile progress */}
      <div className={`flex items-center gap-2 px-5 pb-3 ${hasCurrentWeek ? color.bg : 'bg-white'} sm:hidden`}>
        <Progress value={chapterPct} className={`flex-1 h-2 ${color.progress}`} />
        <span className={`text-sm font-bold ${color.text}`}>{chapterPct}%</span>
      </div>

      {/* Weeks list */}
      {open && (
        <div className="border-t border-slate-100 bg-white p-4 space-y-1">
          {chapter.weeks.map((week) => {
            const status = getWeekStatus(week, currentWeek)
            const progress = getSpecialtyProgress(week, stats)
            const isCurrent = !!(currentWeek && week.week === currentWeek.week)

            return (
              <WeekRow
                key={week.week}
                week={week}
                status={status}
                progress={progress}
                color={color}
                isCurrent={isCurrent}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const [stats, setStats] = useState<Record<string, SpecialtyStats>>({})
  const [loading, setLoading] = useState(true)
  const [calendarsOpen, setCalendarsOpen] = useState(true)

  const currentWeek = useMemo(() => getCurrentCourseWeek(), [])
  const nextTest = useMemo(() => getDaysUntilNextTest(), [])
  const daysLeft = useMemo(() => getDaysUntilCourseEnd(), [])

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      // Fetch specialties + exams + user attempts in parallel
      const [specsRes, examsRes, attemptsRes] = await Promise.all([
        supabase.from('specialties').select('id, code, name').order('order_index'),
        supabase.from('exams').select('id, specialty_id, question_count').eq('is_active', true).eq('exam_type', 'topic'),
        supabase.from('attempts').select('exam_id, score_percent').eq('user_id', user.id).eq('is_completed', true),
      ])

      const specs = specsRes.data ?? []
      const exams = examsRes.data ?? []
      const attempts = attemptsRes.data ?? []

      // Distinct completed exam_ids per specialty
      const completedBySpec: Record<number, Set<number>> = {}
      const scoresBySpec: Record<number, number[]> = {}
      for (const a of attempts) {
        const exam = exams.find((e: { id: number; specialty_id: number; question_count: number }) => e.id === a.exam_id)
        if (!exam?.specialty_id) continue
        const sid = exam.specialty_id
        if (!completedBySpec[sid]) completedBySpec[sid] = new Set()
        completedBySpec[sid].add(a.exam_id)
        if (!scoresBySpec[sid]) scoresBySpec[sid] = []
        if (a.score_percent != null) scoresBySpec[sid].push(a.score_percent)
      }

      const result: Record<string, SpecialtyStats> = {}
      for (const spec of specs) {
        const specExams = exams.filter((e: { id: number; specialty_id: number; question_count: number }) => e.specialty_id === spec.id)
        const completed = completedBySpec[spec.id]?.size ?? 0
        const scores = scoresBySpec[spec.id] ?? []
        result[spec.code] = {
          specialty_id: spec.id,
          code: spec.code,
          name: spec.name,
          totalExams: specExams.length,
          completedExams: completed,
          avgScore: scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
        }
      }

      setStats(result)
      setLoading(false)
    }
    load()
  }, [])

  // Overall course progress
  const overallProgress = useMemo(() => {
    const allContentWeeks = COURSE_CALENDAR.chapters.flatMap((c) =>
      c.weeks.filter((w) => !w.isRepaso && w.specialtyCodes.length > 0)
    )
    const done = allContentWeeks.filter((w) => {
      const prog = getSpecialtyProgress(w, stats)
      return prog && prog.completedExams > 0
    }).length
    return { done, total: allContentWeeks.length, pct: allContentWeeks.length > 0 ? Math.round((done / allContentWeeks.length) * 100) : 0 }
  }, [stats])

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-10 w-64" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Course Hero Card ─────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white p-6 shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white" />
          <div className="absolute -bottom-16 -left-16 w-80 h-80 rounded-full bg-white" />
        </div>

        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <CalendarDays className="w-5 h-5 text-blue-200" />
                <span className="text-blue-200 text-sm font-medium">Curso Regular</span>
              </div>
              <h1 className="text-2xl font-heading font-bold">{COURSE_CALENDAR.courseName}</h1>
              <p className="text-blue-200 text-sm mt-1">5 enero — 10 julio 2026 · 26 semanas</p>
            </div>

            <div className="flex gap-3 flex-wrap">
              {daysLeft > 0 && (
                <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <div className="text-2xl font-bold">{daysLeft}</div>
                  <div className="text-xs text-blue-200">días restantes</div>
                </div>
              )}
              {nextTest && (
                <div className="bg-amber-400/20 border border-amber-300/30 backdrop-blur rounded-xl px-4 py-3 text-center">
                  <div className="text-2xl font-bold text-amber-200">{nextTest.days}</div>
                  <div className="text-xs text-amber-200/80">días hasta prueba</div>
                </div>
              )}
            </div>
          </div>

          {/* Overall progress */}
          <div className="mt-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-100 font-medium">Progreso general del curso</span>
              <span className="text-sm font-bold text-white">{overallProgress.pct}% · {overallProgress.done}/{overallProgress.total} temas iniciados</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-700"
                style={{ width: `${overallProgress.pct}%` }}
              />
            </div>
          </div>

          {/* Current week pill */}
          {currentWeek && (
            <div className="mt-4 inline-flex items-center gap-2 bg-white/15 border border-white/20 rounded-full px-4 py-1.5">
              <Flame className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-medium">
                Semana {currentWeek.week}: <strong>{currentWeek.topic}</strong>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Next Test Countdown ───────────────────────────── */}
      {nextTest && (
        <div className={`flex items-center gap-4 p-4 rounded-xl border-2 ${
          nextTest.days <= 7
            ? 'bg-red-50 border-red-200'
            : nextTest.days <= 14
            ? 'bg-amber-50 border-amber-200'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className={`p-2 rounded-xl ${
            nextTest.days <= 7 ? 'bg-red-100' : nextTest.days <= 14 ? 'bg-amber-100' : 'bg-slate-100'
          }`}>
            <AlertCircle className={`w-5 h-5 ${
              nextTest.days <= 7 ? 'text-red-600' : nextTest.days <= 14 ? 'text-amber-600' : 'text-slate-600'
            }`} />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-900">{nextTest.test.title}</div>
            <div className="text-sm text-slate-500">{nextTest.test.description}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-xl font-bold ${
              nextTest.days <= 7 ? 'text-red-600' : nextTest.days <= 14 ? 'text-amber-600' : 'text-slate-700'
            }`}>
              {nextTest.days === 0 ? '¡Hoy!' : `${nextTest.days}d`}
            </div>
            <div className="text-xs text-slate-400">
              {new Date(nextTest.test.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>
      )}

      {/* ── Monthly Calendars ─────────────────────────────── */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
        <button
          onClick={() => setCalendarsOpen(!calendarsOpen)}
          className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
        >
          <CalendarDays className="w-5 h-5 text-slate-500 flex-shrink-0" />
          <h2 className="text-base font-heading font-semibold text-slate-800 flex-1">
            Calendario Mensual
          </h2>
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-slate-400 mr-3">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              Prueba
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
              Hoy
            </span>
          </div>
          {calendarsOpen
            ? <ChevronUp className="w-5 h-5 text-slate-400 flex-shrink-0" />
            : <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
          }
        </button>
        {calendarsOpen && (
          <div className="border-t border-slate-100 p-5">
            <p className="text-xs text-slate-400 mb-4 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              Hover sobre las fechas amarillas para ver el nombre de la prueba
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5, 6].map((m) => (
                <MonthGrid key={m} year={2026} month={m} testDates={COURSE_CALENDAR.testDates} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Chapter Cards ─────────────────────────────────── */}
      <div>
        <h2 className="text-lg font-heading font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-slate-500" />
          Contenido del Curso
        </h2>

        <div className="space-y-4">
          {COURSE_CALENDAR.chapters.map((chapter) => {
            const hasCurrentWeek = chapter.weeks.some((w) => currentWeek && w.week === currentWeek.week)
            return (
              <ChapterCard
                key={chapter.number}
                chapter={chapter}
                stats={stats}
                currentWeek={currentWeek}
                defaultOpen={hasCurrentWeek || chapter.number === 1}
              />
            )
          })}
        </div>
      </div>

      {/* ── Test Dates Timeline ───────────────────────────── */}
      <div>
        <h2 className="text-lg font-heading font-semibold text-slate-800 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-slate-500" />
          Guía de Fechas — Pruebas y Ensayos
        </h2>

        <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          {COURSE_CALENDAR.testDates.map((test, i) => {
            const today = new Date()
            today.setHours(0, 0, 0, 0)
            const testDay = new Date(test.date)
            testDay.setHours(0, 0, 0, 0)
            const isPast = testDay < today
            const isToday = testDay.getTime() === today.getTime()
            const daysAway = Math.ceil((testDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            const typeStyles: Record<string, string> = {
              diagnostic:  'bg-slate-100 text-slate-700',
              chapter:     'bg-blue-100 text-blue-700',
              simulation:  'bg-amber-100 text-amber-700',
              final:       'bg-red-100 text-red-700',
            }

            const typeLabels: Record<string, string> = {
              diagnostic:  'Diagnóstica',
              chapter:     'Capítulo',
              simulation:  'Simulacro',
              final:       'Final',
            }

            return (
              <div
                key={test.date}
                className={`flex items-center gap-4 px-5 py-4 ${
                  i < COURSE_CALENDAR.testDates.length - 1 ? 'border-b border-slate-100' : ''
                } ${isPast ? 'opacity-50' : ''} ${isToday ? 'bg-amber-50' : ''}`}
              >
                {/* Status dot */}
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                  isPast ? 'bg-slate-300' : isToday ? 'bg-amber-400 animate-pulse' : 'bg-amber-400'
                }`} />

                {/* Date */}
                <div className="w-20 flex-shrink-0 text-sm font-mono text-slate-500">
                  {testDay.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit' })}
                </div>

                {/* Title + description */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-slate-800 text-sm">{test.title}</div>
                  <div className="text-xs text-slate-400 truncate">{test.description}</div>
                </div>

                {/* Type badge */}
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium hidden sm:inline-flex ${typeStyles[test.type] ?? 'bg-slate-100 text-slate-600'}`}>
                  {typeLabels[test.type] ?? test.type}
                </span>

                {/* Days away */}
                <div className="flex-shrink-0 text-right w-16">
                  {isPast ? (
                    <span className="text-xs text-slate-400">Pasada</span>
                  ) : isToday ? (
                    <span className="text-xs font-bold text-amber-600">¡Hoy!</span>
                  ) : (
                    <span className={`text-sm font-bold ${daysAway <= 7 ? 'text-red-600' : daysAway <= 14 ? 'text-amber-600' : 'text-slate-600'}`}>
                      {daysAway}d
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Quick Actions ─────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Link href="/app/specialties" className="group flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-blue-300 hover:shadow-md transition-all">
          <div className="p-3 rounded-xl bg-blue-50 group-hover:bg-blue-100 transition-colors">
            <BookOpen className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">Practicar ahora</div>
            <div className="text-sm text-slate-500">Continúa con las especialidades</div>
          </div>
        </Link>
        <Link href="/app/stats" className="group flex items-center gap-4 p-5 rounded-2xl border-2 border-slate-200 bg-white hover:border-purple-300 hover:shadow-md transition-all">
          <div className="p-3 rounded-xl bg-purple-50 group-hover:bg-purple-100 transition-colors">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <div className="font-semibold text-slate-800">Ver mi progreso</div>
            <div className="text-sm text-slate-500">Estadísticas detalladas</div>
          </div>
        </Link>
      </div>
    </div>
  )
}
