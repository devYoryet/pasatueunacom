'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowRight, TrendingUp, BookOpen, CheckCircle, Clock, AlertTriangle,
  CalendarDays, Flame, Target, Trophy, ChevronRight, Zap,
  Play, Star, Lightbulb, GraduationCap,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDateTime, formatTime, getScoreColor, truncate, getGreeting } from '@/lib/utils'
import {
  COURSE_CALENDAR,
  getCurrentCourseWeek,
  getDaysUntilNextTest,
  getDaysUntilCourseEnd,
  CHAPTER_COLORS,
  type TestDate,
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
  courseProgress: { done: number; total: number; pct: number }
}

// ─── Clinical tips that rotate by day ────────────────────────────────────────

const EUNACOM_TIPS = [
  { icon: '🫀', topic: 'Cardiología', tip: 'FA + inestabilidad hemodinámica → cardioversión eléctrica inmediata. No esperar antiarrítmicos.' },
  { icon: '💉', topic: 'Diabetes', tip: 'Metformina: primera línea en DM2. Contraindicada con TFG < 30 mL/min/1.73m².' },
  { icon: '🫁', topic: 'Respiratorio', tip: 'EPOC: FEV1/FVC < 0.70 post broncodilatador confirma obstrucción. No reversible como el asma.' },
  { icon: '🧠', topic: 'Neurología', tip: 'ACV isquémico: ventana de tPA son 4.5 h desde inicio de síntomas. Contraindicado en hemorrágico.' },
  { icon: '🩺', topic: 'Sepsis', tip: 'Sepsis = SOFA ≥ 2 + foco infeccioso. Bundle 1h: hemocultivos → antibióticos → fluidos.' },
  { icon: '🦠', topic: 'Infectología', tip: 'VIH: iniciar TARV en todos los pacientes, independiente del CD4. Meta: carga viral indetectable.' },
  { icon: '🔬', topic: 'Hematología', tip: 'Anemia ferropénica: ferritina baja + TIBC alto + VCM bajo. Primera causa de anemia en el mundo.' },
  { icon: '🩻', topic: 'Nefrología', tip: 'IRA prerrenal: FEUNa < 1%, cilindros hialinos. Renal intrínseca: FEUNa > 2%, cilindros granulares.' },
  { icon: '🌡️', topic: 'Reumatología', tip: 'AR: anti-CCP es el más específico. FR puede ser positivo en otras enfermedades.' },
  { icon: '🫁', topic: 'Asma', tip: 'Crisis asmática grave: SaO₂ < 92%, pCO₂ normal o alto (agotamiento), ingresar a UCI.' },
  { icon: '💊', topic: 'Farmacología', tip: 'AINES + anticoagulantes = riesgo de sangrado GI. Siempre preguntar por automedicación.' },
  { icon: '🧬', topic: 'Gastro', tip: 'H. pylori: triple terapia clásica (IBP + claritromicina + amoxicilina) por 14 días.' },
]

function getTodayTip() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  return EUNACOM_TIPS[dayOfYear % EUNACOM_TIPS.length]
}

// ─── Streak calculator ────────────────────────────────────────────────────────

function calculateStreak(finishedDates: string[]): number {
  if (finishedDates.length === 0) return 0
  const days = new Set(finishedDates.map((d) => new Date(d).toLocaleDateString('es-CL')))
  const today = new Date()
  let streak = 0
  let checkDate = new Date(today)
  while (true) {
    const key = checkDate.toLocaleDateString('es-CL')
    if (days.has(key)) {
      streak++
      checkDate.setDate(checkDate.getDate() - 1)
    } else {
      if (streak === 0) {
        checkDate.setDate(checkDate.getDate() - 1)
        if (days.has(checkDate.toLocaleDateString('es-CL'))) {
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

// ─── Mini Month Calendar ──────────────────────────────────────────────────────

function MiniCalendar({ testDates }: { testDates: TestDate[] }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayD = today.getDate()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7

  const testDaySet = new Set(
    testDates
      .filter((t) => {
        const d = new Date(t.date)
        return d.getFullYear() === year && d.getMonth() === month
      })
      .map((t) => new Date(t.date).getDate())
  )

  const getTitle = (day: number) =>
    testDates.find((t) => {
      const d = new Date(t.date)
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day
    })?.title

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const monthName = today.toLocaleString('es-CL', { month: 'long', year: 'numeric' })

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700 mb-3 capitalize">{monthName}</p>
      <div className="grid grid-cols-7 mb-1">
        {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-slate-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />
          const isToday = day === todayD
          const isExam = testDaySet.has(day)
          const isPast = day < todayD
          return (
            <div
              key={i}
              title={isExam ? getTitle(day) : undefined}
              className={`flex items-center justify-center text-xs rounded-full mx-auto my-0.5 w-7 h-7 ${
                isToday ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-200' :
                isExam ? 'bg-amber-400 text-white font-bold cursor-help' :
                isPast ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Prueba</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />Hoy</span>
      </div>
    </div>
  )
}

// ─── Chapter progress rows ────────────────────────────────────────────────────

function ChapterProgressRow({
  chapter,
  completedSpecCodes,
}: {
  chapter: typeof COURSE_CALENDAR.chapters[0]
  completedSpecCodes: Set<string>
}) {
  const color = CHAPTER_COLORS[chapter.color]
  const contentWeeks = chapter.weeks.filter((w) => !w.isRepaso && w.specialtyCodes.length > 0)
  const doneWeeks = contentWeeks.filter((w) =>
    w.specialtyCodes.some((c) => completedSpecCodes.has(c))
  )
  const pct = contentWeeks.length > 0 ? Math.round((doneWeeks.length / contentWeeks.length) * 100) : 0

  return (
    <div className="flex items-center gap-3">
      <div className={`w-6 h-6 rounded-lg ${color.badge} flex items-center justify-center text-xs font-bold flex-shrink-0`}>
        {chapter.number}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-slate-600 truncate">{chapter.title}</span>
          <span className={`text-xs font-bold ${color.text} ml-2 flex-shrink-0`}>{pct}%</span>
        </div>
        <Progress value={pct} className={`h-1.5 ${pct === 100 ? '[&>div]:bg-green-500' : color.progress}`} />
      </div>
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [completedSpecCodes, setCompletedSpecCodes] = useState<Set<string>>(new Set())

  const currentWeek = useMemo(() => getCurrentCourseWeek(), [])
  const nextTest = useMemo(() => getDaysUntilNextTest(), [])
  const daysLeft = useMemo(() => getDaysUntilCourseEnd(), [])
  const todayTip = useMemo(() => getTodayTip(), [])

  const currentChapter = currentWeek
    ? COURSE_CALENDAR.chapters.find((c) => c.weeks.some((w) => w.week === currentWeek.week))
    : null
  const color = currentChapter ? CHAPTER_COLORS[currentChapter.color] : CHAPTER_COLORS.blue

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const [attemptsRes, todayRes, incompleteRes, profileRes, examsRes] = await Promise.all([
        supabase
          .from('attempts')
          .select('*, exams(title, id, specialty_id, specialties(name, code, icon))')
          .eq('user_id', user.id)
          .eq('is_completed', true)
          .order('finished_at', { ascending: false })
          .limit(100),
        supabase.from('attempts').select('id').eq('user_id', user.id).eq('is_completed', true).gte('finished_at', today.toISOString()),
        supabase.from('attempts').select('*, exams(title, id)').eq('user_id', user.id).eq('is_completed', false).order('started_at', { ascending: false }).limit(1).maybeSingle(),
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('exams').select('id, specialty_id').eq('is_active', true).eq('exam_type', 'topic'),
      ])

      const attempts = (attemptsRes.data ?? []) as any[]
      const avgScore = attempts.length > 0
        ? Math.round(attempts.reduce((s, a) => s + (a.score_percent ?? 0), 0) / attempts.length)
        : 0
      const streak = calculateStreak(attempts.map((a) => a.finished_at).filter(Boolean) as string[])

      const specialtyScores: Record<string, { total: number; count: number; name: string }> = {}
      for (const a of attempts) {
        if (a.exams?.specialties) {
          const code = a.exams.specialties.code
          if (!specialtyScores[code]) specialtyScores[code] = { total: 0, count: 0, name: a.exams.specialties.name }
          specialtyScores[code].total += a.score_percent ?? 0
          specialtyScores[code].count++
        }
      }
      const weakSpecialties = Object.entries(specialtyScores)
        .map(([code, d]) => ({ code, name: d.name, score: Math.round(d.total / d.count) }))
        .sort((a, b) => a.score - b.score)
        .slice(0, 3)

      const exams = examsRes.data ?? []
      const completedExamIds = new Set(attempts.map((a: any) => a.exam_id))
      const specCodes = new Set<string>()
      for (const exam of exams as any[]) {
        if (completedExamIds.has(exam.id) && exam.specialty_id) {
          const att = attempts.find((a: any) => a.exam_id === exam.id && a.exams?.specialties)
          if (att?.exams?.specialties?.code) specCodes.add(att.exams.specialties.code)
        }
      }

      const allContentWeeks = COURSE_CALENDAR.chapters.flatMap((c) =>
        c.weeks.filter((w) => !w.isRepaso && w.specialtyCodes.length > 0)
      )
      const doneWeeks = allContentWeeks.filter((w) => w.specialtyCodes.some((c) => specCodes.has(c)))

      setCompletedSpecCodes(specCodes)
      setData({
        profile: profileRes.data ?? { full_name: '' },
        todayCount: todayRes.data?.length ?? 0,
        avgScore,
        streak,
        totalAttempts: attempts.length,
        recentAttempts: attempts.slice(0, 5),
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
      <div className="grid lg:grid-cols-[1fr_300px] gap-6 max-w-7xl">
        <div className="space-y-6">
          <Skeleton className="h-10 w-72" />
          <Skeleton className="h-40 rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-48" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    )
  }

  const firstName = data?.profile?.full_name?.split(' ')[0] ?? ''

  return (
    <div className="grid lg:grid-cols-[1fr_296px] gap-6 max-w-7xl items-start">

      {/* ── LEFT MAIN COLUMN ─────────────────────────────── */}
      <div className="space-y-5 min-w-0">

        {/* Greeting */}
        <div>
          <h1 className="section-title">
            {getGreeting()}{firstName ? `, ${firstName}` : ''} 👋
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Tu preparación EUNACOM Julio 2026 — {daysLeft !== null ? `${daysLeft} días restantes` : 'Fuera del periodo del curso'}
          </p>
        </div>

        {/* ── Course hero card ────────────────────────────── */}
        <div className={`rounded-2xl border-2 p-5 ${currentChapter ? color.border : 'border-slate-200'} bg-white`}>
          {/* Header row */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Progreso EUNACOM 2026</span>
              </div>
              <div className="text-2xl font-heading font-bold text-slate-900">{data?.courseProgress.pct ?? 0}%</div>
              <div className="text-xs text-slate-400 mt-0.5">
                {data?.courseProgress.done ?? 0} de {data?.courseProgress.total ?? 0} temas iniciados
              </div>
            </div>
            <Link href="/app/calendar">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <CalendarDays className="w-3.5 h-3.5" />
                Ver calendario
              </Button>
            </Link>
          </div>

          {/* Overall progress bar */}
          <Progress value={data?.courseProgress.pct ?? 0} className="h-3 [&>div]:bg-blue-500 mb-4" />

          {/* Chapter progress rows */}
          <div className="space-y-3">
            {COURSE_CALENDAR.chapters.map((chapter) => (
              <ChapterProgressRow
                key={chapter.number}
                chapter={chapter}
                completedSpecCodes={completedSpecCodes}
              />
            ))}
          </div>

          {/* Current week banner */}
          {currentWeek && (
            <div className={`mt-4 flex items-center gap-3 p-3 rounded-xl ${color.bg} border ${color.border}`}>
              <Flame className={`w-4 h-4 ${color.text} flex-shrink-0`} />
              <div className="flex-1 min-w-0">
                <div className={`text-xs font-semibold ${color.text}`}>Semana {currentWeek.week} — Esta semana</div>
                <div className="text-sm font-medium text-slate-800 truncate">{currentWeek.topic}</div>
              </div>
              <Link href="/app/specialties">
                <Button size="sm" variant="ghost" className={`text-xs ${color.text} gap-1 h-7`}>
                  <Play className="w-3 h-3" />
                  Estudiar
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* ── Stat cards 2×2 ──────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Respondidas hoy', value: data?.todayCount ?? 0, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', sub: 'cuestionarios' },
            { label: 'Promedio histórico', value: `${data?.avgScore ?? 0}%`, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50', sub: 'puntaje general' },
            { label: 'Racha actual', value: data?.streak ?? 0, icon: Flame, color: 'text-orange-500', bg: 'bg-orange-50', sub: `día${(data?.streak ?? 0) !== 1 ? 's' : ''} consecutivo${(data?.streak ?? 0) !== 1 ? 's' : ''}` },
            { label: 'Total completados', value: data?.totalAttempts ?? 0, icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', sub: 'cuestionarios' },
          ].map(({ label, value, icon: Icon, color: c, bg, sub }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon className={`w-4.5 h-4.5 ${c}`} size={18} />
              </div>
              <div className="text-xl font-heading font-bold text-slate-900">{value}</div>
              <div className="text-sm font-medium text-slate-700 mt-0.5">{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </div>
          ))}
        </div>

        {/* ── Continue or Weak areas ────────────────────────── */}
        {data?.lastIncomplete ? (
          <div className="bg-white rounded-2xl border-2 border-amber-100 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-semibold text-slate-800">Continúa donde lo dejaste</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 truncate">{data.lastIncomplete.exams?.title}</div>
                <div className="text-sm text-slate-500 mt-0.5">{formatDateTime(data.lastIncomplete.started_at)}</div>
              </div>
              <Link href={`/app/exam/${data.lastIncomplete.exam_id}`}>
                <Button size="sm" className="gap-2 flex-shrink-0">
                  Continuar <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        ) : data?.weakSpecialties && data.weakSpecialties.length > 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-4 h-4 text-orange-500" />
              <span className="text-sm font-semibold text-slate-800">Áreas a reforzar</span>
            </div>
            <div className="space-y-3">
              {data.weakSpecialties.map((spec) => (
                <div key={spec.code}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-slate-700">{spec.name}</span>
                    <span className={`text-sm font-bold ${getScoreColor(spec.score)}`}>{spec.score}%</span>
                  </div>
                  <Progress value={spec.score} className="h-1.5" />
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ── Recent activity ───────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <span className="text-sm font-semibold text-slate-800">Actividad reciente</span>
            <Link href="/app/history">
              <Button variant="ghost" size="sm" className="text-xs h-7">Ver todo <ChevronRight className="w-3.5 h-3.5 ml-1" /></Button>
            </Link>
          </div>
          {data?.recentAttempts && data.recentAttempts.length > 0 ? (
            <div className="divide-y divide-slate-50">
              {data.recentAttempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center gap-4 px-5 py-3 hover:bg-slate-50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-slate-800 truncate">
                      {truncate(attempt.exams?.title ?? 'Examen', 40)}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {(attempt.exams as any)?.specialties?.name ?? '—'}
                      {attempt.finished_at && ` · ${new Date(attempt.finished_at).toLocaleDateString('es-CL')}`}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    {attempt.time_used_seconds && (
                      <span className="text-xs text-slate-400 hidden md:block">{formatTime(attempt.time_used_seconds)}</span>
                    )}
                    <span className={`text-sm font-bold ${getScoreColor(attempt.score_percent ?? 0)}`}>
                      {Math.round(attempt.score_percent ?? 0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 gap-3 text-slate-400">
              <BookOpen className="w-8 h-8 opacity-40" />
              <p className="text-sm">Aún no has completado ningún cuestionario.</p>
              <Link href="/app/specialties">
                <Button variant="outline" size="sm">Empezar ahora →</Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT SIDEBAR ─────────────────────────────────── */}
      <div className="space-y-4">

        {/* Mini calendar */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <MiniCalendar testDates={COURSE_CALENDAR.testDates} />
          <Link href="/app/calendar" className="block mt-4">
            <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              Ver calendario completo
            </Button>
          </Link>
        </div>

        {/* Next exam countdown */}
        {nextTest && (
          <div className={`rounded-2xl border-2 p-4 ${
            nextTest.days <= 7 ? 'border-red-200 bg-red-50' :
            nextTest.days <= 14 ? 'border-amber-200 bg-amber-50' :
            'border-slate-200 bg-white'
          }`}>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Próxima prueba</span>
            </div>
            <div className={`text-3xl font-heading font-bold mb-1 ${
              nextTest.days <= 7 ? 'text-red-600' :
              nextTest.days <= 14 ? 'text-amber-600' :
              'text-slate-800'
            }`}>
              {nextTest.days === 0 ? '¡Hoy!' : `${nextTest.days} días`}
            </div>
            <div className="text-sm font-medium text-slate-700">{nextTest.test.title}</div>
            <div className="text-xs text-slate-400 mt-0.5">{nextTest.test.description}</div>
            <div className="text-xs text-slate-400 mt-1">
              {new Date(nextTest.test.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
            </div>
          </div>
        )}

        {/* Tip del día */}
        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl border border-blue-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Perla clínica del día</span>
          </div>
          <div className="flex items-start gap-2.5">
            <span className="text-xl flex-shrink-0">{todayTip.icon}</span>
            <div>
              <div className="text-xs font-semibold text-blue-800 mb-1">{todayTip.topic}</div>
              <p className="text-xs text-slate-700 leading-relaxed">{todayTip.tip}</p>
            </div>
          </div>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Acceso rápido</span>
          </div>
          {[
            { href: '/app/specialties', icon: BookOpen, label: 'Contenido del curso', sub: 'Videos, apuntes y cuestionarios' },
            { href: '/app/stats', icon: TrendingUp, label: 'Mi progreso', sub: 'Estadísticas detalladas' },
            { href: '/app/history', icon: Clock, label: 'Historial', sub: 'Todos tus intentos' },
          ].map(({ href, icon: Icon, label, sub }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <Icon className="w-4 h-4 text-slate-500 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-700 group-hover:text-blue-700 transition-colors">{label}</div>
                <div className="text-xs text-slate-400">{sub}</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400 transition-colors" />
            </Link>
          ))}
        </div>

        {/* Days to EUNACOM */}
        {daysLeft !== null && daysLeft > 0 && (
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-4 text-white text-center">
            <Trophy className="w-6 h-6 mx-auto mb-2 text-amber-300" />
            <div className="text-3xl font-heading font-bold">{daysLeft}</div>
            <div className="text-blue-200 text-xs mt-1">días para el EUNACOM</div>
            <div className="text-blue-300 text-[10px] mt-0.5">Julio 2026</div>
          </div>
        )}
      </div>
    </div>
  )
}
