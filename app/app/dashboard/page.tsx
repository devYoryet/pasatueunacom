'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  TrendingUp, BookOpen, CheckCircle, Circle, Clock, Flame, Target,
  Trophy, ChevronRight, ChevronDown, ChevronUp, Play,
  CalendarDays, Stethoscope, AlertTriangle, ArrowRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { getScoreColor, getGreeting, formatTime, truncate } from '@/lib/utils'
import {
  COURSE_CALENDAR, getCurrentCourseWeek, getDaysUntilNextTest,
  getDaysUntilCourseEnd, CHAPTER_COLORS, formatWeekRange,
  type CourseWeek, type TestDate,
} from '@/lib/course-calendar'
import type { Attempt } from '@/lib/supabase/types'

// ─── Types ────────────────────────────────────────────────────────────────────

type WeekStatus = 'completo' | 'en_curso' | 'atrasado' | 'incompleto' | 'proximo' | 'repaso'

interface ExamItem {
  id: number
  title: string
  completed: boolean
  bestScore: number | null
  attemptCount: number
}

interface SpecItem {
  id: number
  code: string
  name: string
  icon: string | null
  exams: ExamItem[]
}

interface WeekRow {
  week: CourseWeek
  totalExams: number
  completedExams: number
  status: WeekStatus
  specs: SpecItem[]
}

interface ChapterProgress {
  number: number
  title: string
  color: 'blue' | 'purple' | 'green' | 'orange'
  weeks: WeekRow[]
  totalExams: number
  completedExams: number
  pct: number
}

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS: Record<WeekStatus, { label: string; badge: string; dot: string }> = {
  completo:   { label: 'Completo',   badge: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  en_curso:   { label: 'En curso',   badge: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
  atrasado:   { label: 'Atrasado',   badge: 'bg-red-100 text-red-700',      dot: 'bg-red-500' },
  incompleto: { label: 'Incompleto', badge: 'bg-amber-100 text-amber-700',  dot: 'bg-amber-400' },
  proximo:    { label: 'Próximo',    badge: 'bg-slate-100 text-slate-400',  dot: 'bg-slate-300' },
  repaso:     { label: 'Repaso',     badge: 'bg-purple-100 text-purple-600',dot: 'bg-purple-400' },
}

function getWeekStatus(week: CourseWeek, completed: number, total: number): WeekStatus {
  if (week.isRepaso) return 'repaso'
  const today = new Date(); today.setHours(0, 0, 0, 0)
  const start = new Date(week.start)
  const end = new Date(week.end)
  if (completed >= total && total > 0) return 'completo'
  if (today >= start && today <= end) return 'en_curso'
  if (today > end) return completed === 0 ? 'atrasado' : 'incompleto'
  return 'proximo'
}

// ─── Rotating clinical tips ───────────────────────────────────────────────────

const TIPS = [
  { area: 'Cardiología',       tip: 'FA + inestabilidad hemodinámica: cardioversión eléctrica inmediata. No esperes antiarrítmicos.' },
  { area: 'Diabetes',          tip: 'Metformina primera línea en DM2. Suspender si TFG < 30 mL/min o contraste yodado.' },
  { area: 'Neumología',        tip: 'EPOC: FEV1/FVC < 0.70 post broncodilatador. Exacerbación grave: PaCO₂ elevado = agotamiento.' },
  { area: 'Neurología',        tip: 'ACV isquémico: tPA hasta 4.5h del inicio. Contraindicado en hemorrágico o INR > 1.7.' },
  { area: 'Infectología',      tip: 'Sepsis = SOFA ≥ 2. Bundle 1h: hemocultivos, antibióticos y fluidos 30 mL/kg.' },
  { area: 'Hematología',       tip: 'Anemia ferropénica: ferritina baja + TIBC alto. Primera causa mundial de anemia.' },
  { area: 'Nefrología',        tip: 'IRA prerrenal: FENa < 1%, densidad > 1020. Renal: FENa > 2%, cilindros granulosos.' },
  { area: 'Reumatología',      tip: 'Anti-CCP: más específico para AR. FR positivo también en infecciones y sarcoidosis.' },
  { area: 'Gastroenterología', tip: 'H. pylori: triple terapia 14 días. Verificar erradicación con UBT o Ag en deposiciones.' },
  { area: 'Asma',              tip: 'Crisis grave: SpO₂ < 92%, pCO₂ normal o elevado (fatiga). UCI. No usar sedantes.' },
  { area: 'Endocrinología',    tip: 'Hipotiroidismo: TSH alto + T4L bajo. Hashimoto = anti-TPO positivo. Tratamiento: levotiroxina.' },
  { area: 'Insuf. cardíaca',   tip: 'IC con FEyVI reducida: IECA + betabloqueador + espironolactona reducen mortalidad.' },
]

function getTodayTip() {
  const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return TIPS[doy % TIPS.length]
}

// ─── Mini calendar ────────────────────────────────────────────────────────────

function MiniCalendar({ testDates }: { testDates: TestDate[] }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const todayD = today.getDate()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7
  const testDaySet = new Set(
    testDates.filter((t) => { const d = new Date(t.date); return d.getFullYear() === year && d.getMonth() === month }).map((t) => new Date(t.date).getDate())
  )
  const getTitle = (day: number) => testDates.find((t) => { const d = new Date(t.date); return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day })?.title
  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)
  const monthName = today.toLocaleString('es-CL', { month: 'long', year: 'numeric' })

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700 mb-3 capitalize">{monthName}</p>
      <div className="grid grid-cols-7 mb-1">
        {['L','M','M','J','V','S','D'].map((d, i) => <div key={i} className="text-center text-[10px] font-medium text-slate-400">{d}</div>)}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />
          const isToday = day === todayD
          const isExam = testDaySet.has(day)
          const isPast = day < todayD
          return (
            <div key={i} title={isExam ? getTitle(day) : undefined}
              className={`flex items-center justify-center text-xs rounded-full mx-auto my-0.5 w-7 h-7 ${
                isToday ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-200' :
                isExam  ? 'bg-amber-400 text-white font-bold cursor-help' :
                isPast  ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >{day}</div>
          )
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Prueba</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />Hoy</span>
      </div>
    </div>
  )
}

// ─── Week progress row (expandable table row) ────────────────────────────────

function WeekProgressRow({ row, color }: { row: WeekRow; color: typeof CHAPTER_COLORS[keyof typeof CHAPTER_COLORS] }) {
  const [expanded, setExpanded] = useState(false)
  const router = useRouter()
  const s = STATUS[row.status]
  const pct = row.totalExams > 0 ? Math.round((row.completedExams / row.totalExams) * 100) : 0
  const isCurrent = row.status === 'en_curso'
  const isOverdue = row.status === 'atrasado' || row.status === 'incompleto'
  const hasContent = row.totalExams > 0 && row.specs.length > 0

  return (
    <>
      <tr
        className={`border-b border-slate-200 last:border-0 transition-colors ${
          isCurrent ? 'bg-blue-50 border-l-2 border-l-blue-600' : expanded ? 'bg-slate-50' : 'hover:bg-slate-50'
        } ${hasContent ? 'cursor-pointer select-none' : ''}`}
        onClick={() => hasContent && setExpanded(!expanded)}
      >
        {/* Week # */}
        <td className="py-3 pl-4 pr-2 text-xs font-mono text-slate-500 w-8 font-semibold">{row.week.week}</td>

        {/* Topic */}
        <td className="py-3 pr-3">
          <div className={`text-sm font-semibold ${isCurrent ? 'text-blue-700' : 'text-slate-900'}`}>
            {row.week.topic}
          </div>
          <div className="text-xs text-slate-500 mt-0.5 hidden sm:block">{formatWeekRange(row.week.start, row.week.end)}</div>
        </td>

        {/* Objetivo */}
        <td className="py-3 pr-3 hidden md:table-cell">
          <span className="text-xs text-slate-600">{row.totalExams > 0 ? `${row.totalExams}` : '—'}</span>
        </td>

        {/* Completado */}
        <td className="py-3 pr-3">
          {row.totalExams > 0 ? (
            <div className="flex items-center gap-2">
              <span className={`text-xs font-semibold tabular-nums ${
                row.completedExams >= row.totalExams ? 'text-green-700' :
                isOverdue ? 'text-red-600' : 'text-slate-700'
              }`}>
                {row.completedExams}/{row.totalExams}
              </span>
              <div className="w-12 hidden sm:block">
                <Progress value={pct} className={`h-1 ${
                  row.completedExams >= row.totalExams ? '[&>div]:bg-green-500' :
                  isOverdue ? '[&>div]:bg-red-400' : '[&>div]:bg-blue-600'
                }`} />
              </div>
            </div>
          ) : (
            <span className="text-xs text-slate-400">—</span>
          )}
        </td>

        {/* Status */}
        <td className="py-3 pr-3">
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
            <span className="text-xs text-slate-600 font-medium">{s.label}</span>
          </div>
        </td>

        {/* Chevron */}
        <td className="py-3 pr-4 text-right">
          {hasContent && (
            expanded
              ? <ChevronUp className="w-3.5 h-3.5 text-slate-500 inline" />
              : <ChevronDown className="w-3.5 h-3.5 text-slate-500 inline" />
          )}
        </td>
      </tr>

      {/* ── Expanded quiz panel ─────────────────────────── */}
      {expanded && hasContent && (
        <tr>
          <td colSpan={6} className="px-4 pb-3 pt-1 bg-white">
            <div className="space-y-2">
              {row.specs.map((spec) => (
                <div key={spec.id} className="bg-white rounded border border-slate-300 overflow-hidden">

                  {/* Spec header */}
                  <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-200 bg-slate-200">
                    <span className="text-xs font-semibold text-slate-800">{spec.name}</span>
                    <span className="text-xs text-slate-600 ml-0.5">
                      {spec.exams.filter(e => e.completed).length}/{spec.exams.length} cuestionarios
                    </span>
                    <div className="ml-auto flex items-center gap-3">
                      <button
                        className="text-xs text-blue-700 hover:text-blue-900 font-semibold transition-colors"
                        onClick={(e) => { e.stopPropagation(); router.push(`/app/specialties/${spec.code}?tab=lessons`) }}
                      >
                        Cápsulas →
                      </button>
                      <button
                        className="text-xs text-slate-600 hover:text-slate-900 font-medium transition-colors"
                        onClick={(e) => { e.stopPropagation(); router.push(`/app/specialties/${spec.code}`) }}
                      >
                        Ver todo →
                      </button>
                    </div>
                  </div>

                  {/* Quiz rows */}
                  <div className="divide-y divide-slate-100">
                    {spec.exams.length === 0 ? (
                      <p className="px-4 py-3 text-xs text-slate-500">Sin cuestionarios disponibles aún</p>
                    ) : spec.exams.map((exam) => (
                      <div key={exam.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50 transition-colors">
                        {exam.completed
                          ? <CheckCircle className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                          : <Circle className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />}

                        <span className="text-xs text-slate-800 flex-1 min-w-0 truncate">{exam.title}</span>

                        {exam.bestScore !== null && (
                          <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${
                            exam.bestScore >= 70 ? 'text-green-700' :
                            exam.bestScore >= 50 ? 'text-amber-700' : 'text-red-500'
                          }`}>{exam.bestScore}%</span>
                        )}

                        <button
                          className={`text-xs flex-shrink-0 px-2.5 py-1 rounded border transition-colors font-medium ${
                            exam.completed
                              ? 'border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-700'
                              : 'border-blue-700 bg-blue-700 text-white hover:bg-blue-800'
                          }`}
                          onClick={(e) => { e.stopPropagation(); router.push(`/app/exam/${exam.id}`) }}
                        >
                          {exam.completed ? 'Repasar' : 'Iniciar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </td>
        </tr>
      )}
    </>
  )
}

// ─── Chapter card ─────────────────────────────────────────────────────────────

function ChapterCard({ chapter, defaultOpen }: { chapter: ChapterProgress; defaultOpen: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  const color = CHAPTER_COLORS[chapter.color]
  const isCurrent = chapter.weeks.some((w) => w.status === 'en_curso')
  const atrasados = chapter.weeks.filter((w) => w.status === 'atrasado').length
  const incompletos = chapter.weeks.filter((w) => w.status === 'incompleto').length

  return (
    <div className="rounded-lg border border-slate-300 overflow-hidden shadow-sm">
      {/* Chapter header — Blackboard dark style */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left bg-[#1c2c3e] hover:bg-[#243547] transition-colors"
      >
        <div className="w-9 h-9 rounded bg-white/20 border border-white/30 flex items-center justify-center font-bold text-base text-white flex-shrink-0">
          {chapter.number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">Capítulo {chapter.number}</span>
            {isCurrent && <span className="text-xs px-2 py-0.5 rounded font-semibold bg-blue-600 text-white border border-blue-400">En curso</span>}
            {atrasados > 0 && (
              <span className="text-xs px-2 py-0.5 rounded font-semibold bg-red-600 text-white border border-red-400">
                {atrasados} atrasado{atrasados > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-white/60 mt-0.5 truncate">{chapter.title}</p>
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          {chapter.totalExams > 0 && (
            <div className="hidden sm:flex items-center gap-2">
              <div className="text-right">
                <div className={`text-sm font-bold tabular-nums ${chapter.pct === 100 ? 'text-green-400' : 'text-white'}`}>{chapter.pct}%</div>
                <div className="text-xs text-white/50 tabular-nums">{chapter.completedExams}/{chapter.totalExams}</div>
              </div>
              <div className="w-14">
                <Progress value={chapter.pct} className={`h-1.5 bg-white/20 ${chapter.pct === 100 ? '[&>div]:bg-green-400' : '[&>div]:bg-blue-400'}`} />
              </div>
            </div>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-white/70" /> : <ChevronDown className="w-4 h-4 text-white/70" />}
        </div>
      </button>

      {/* Mobile progress */}
      {chapter.totalExams > 0 && (
        <div className="flex items-center gap-2 px-5 py-2 bg-[#243547] sm:hidden border-t border-white/10">
          <Progress value={chapter.pct} className={`flex-1 h-1.5 bg-white/20 ${chapter.pct === 100 ? '[&>div]:bg-green-400' : '[&>div]:bg-blue-400'}`} />
          <span className={`text-sm font-bold ${chapter.pct === 100 ? 'text-green-400' : 'text-white'}`}>{chapter.pct}%</span>
        </div>
      )}

      {/* Week table */}
      {open && (
        <div className="border-t border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full bg-white min-w-[480px]">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-100 text-[11px] text-slate-600 uppercase tracking-wide font-semibold">
                  <th className="text-left font-medium py-2 pl-4 pr-2 w-8">S</th>
                  <th className="text-left font-medium py-2 pr-3">Tema</th>
                  <th className="text-left font-medium py-2 pr-3 hidden md:table-cell">Objetivo</th>
                  <th className="text-left font-medium py-2 pr-3">Completado</th>
                  <th className="text-left font-medium py-2 pr-3">Estado</th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody>
                {chapter.weeks.map((row) => (
                  <WeekProgressRow key={row.week.week} row={row} color={color} />
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-100 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap font-medium">
              <span>{chapter.completedExams}/{chapter.totalExams} cuestionarios</span>
              {atrasados > 0 && <span className="text-red-600">· {atrasados} atrasada{atrasados > 1 ? 's' : ''}</span>}
              {incompletos > 0 && <span className="text-amber-600">· {incompletos} incompleta{incompletos > 1 ? 's' : ''}</span>}
            </div>
            <Link href="/app/specialties">
              <Button size="sm" variant="ghost" className="text-xs h-7 gap-1.5 flex-shrink-0 text-slate-700 hover:text-blue-700 font-medium">
                <BookOpen className="w-3 h-3" />
                Ver especialidades
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [chapters, setChapters] = useState<ChapterProgress[]>([])
  const [profile, setProfile] = useState<{ full_name: string } | null>(null)
  const [stats, setStats] = useState({ todayCount: 0, avgScore: 0, streak: 0, totalAttempts: 0 })
  const [lastIncomplete, setLastIncomplete] = useState<{ exam_id: number; title: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const currentWeek = useMemo(() => getCurrentCourseWeek(), [])
  const nextTest = useMemo(() => getDaysUntilNextTest(), [])
  const daysLeft = useMemo(() => getDaysUntilCourseEnd(), [])
  const tip = useMemo(() => getTodayTip(), [])

  const courseProgress = useMemo(() => {
    const total = chapters.reduce((s, c) => s + c.totalExams, 0)
    const done = chapters.reduce((s, c) => s + c.completedExams, 0)
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [chapters])

  const currentChapter = chapters.find((c) => c.weeks.some((w) => w.status === 'en_curso'))

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const today = new Date(); today.setHours(0, 0, 0, 0)

      const [profileRes, specsRes, examsRes, attRes, todayRes, incompleteRes] = await Promise.all([
        supabase.from('profiles').select('full_name').eq('id', user.id).single(),
        supabase.from('specialties').select('id, code, name, icon').order('order_index'),
        supabase.from('exams').select('id, specialty_id, exam_type, title, order_index').eq('is_active', true).eq('exam_type', 'topic').order('order_index'),
        supabase.from('attempts').select('exam_id, score_percent, finished_at').eq('user_id', user.id).eq('is_completed', true).order('finished_at', { ascending: false }).limit(200),
        supabase.from('attempts').select('id').eq('user_id', user.id).eq('is_completed', true).gte('finished_at', today.toISOString()),
        supabase.from('attempts').select('exam_id, exams(title)').eq('user_id', user.id).eq('is_completed', false).order('started_at', { ascending: false }).limit(1).maybeSingle(),
      ])

      const specs = (specsRes.data ?? []) as { id: number; code: string; name: string; icon: string | null }[]
      const exams = (examsRes.data ?? []) as { id: number; specialty_id: number; exam_type: string; title: string; order_index: number | null }[]
      const attempts = (attRes.data ?? []) as { exam_id: number; score_percent: number | null; finished_at: string }[]

      // Per-specialty completed exam set
      const completedBySpec: Record<number, Set<number>> = {}
      for (const a of attempts) {
        const exam = exams.find((e) => e.id === a.exam_id)
        if (!exam?.specialty_id) continue
        if (!completedBySpec[exam.specialty_id]) completedBySpec[exam.specialty_id] = new Set()
        completedBySpec[exam.specialty_id].add(a.exam_id)
      }

      // Best score + attempt count per exam (attempts ordered DESC = first = most recent)
      const scoreByExam: Record<number, { best: number; count: number }> = {}
      for (const a of attempts) {
        if (a.score_percent === null) continue
        if (!scoreByExam[a.exam_id]) scoreByExam[a.exam_id] = { best: -1, count: 0 }
        scoreByExam[a.exam_id].count++
        scoreByExam[a.exam_id].best = Math.max(scoreByExam[a.exam_id].best, a.score_percent)
      }

      // Spec code → { id, name, icon }
      const specMap: Record<string, { id: number; name: string; icon: string | null }> = {}
      for (const s of specs) specMap[s.code] = { id: s.id, name: s.name, icon: s.icon }

      // Build chapter progress data
      const chapterData: ChapterProgress[] = COURSE_CALENDAR.chapters.map((ch) => {
        const weeks: WeekRow[] = ch.weeks.map((week) => {
          let totalExams = 0
          let completedExams = 0
          const weekSpecs: SpecItem[] = []

          for (const code of week.specialtyCodes) {
            const spec = specMap[code]
            if (!spec) continue
            const specExamsList = exams.filter((e) => e.specialty_id === spec.id)
            const completedSet = completedBySpec[spec.id]

            weekSpecs.push({
              id: spec.id,
              code,
              name: spec.name,
              icon: spec.icon,
              exams: specExamsList.map((e) => ({
                id: e.id,
                title: e.title,
                completed: completedSet?.has(e.id) ?? false,
                bestScore: scoreByExam[e.id]?.best !== undefined && scoreByExam[e.id].best >= 0
                  ? scoreByExam[e.id].best
                  : null,
                attemptCount: scoreByExam[e.id]?.count ?? 0,
              })),
            })

            totalExams += specExamsList.length
            completedExams += completedSet?.size ?? 0
          }

          return { week, totalExams, completedExams, status: getWeekStatus(week, completedExams, totalExams), specs: weekSpecs }
        })

        const total = weeks.reduce((s, w) => s + w.totalExams, 0)
        const done = weeks.reduce((s, w) => s + w.completedExams, 0)
        return {
          number: ch.number,
          title: ch.title,
          color: ch.color,
          weeks,
          totalExams: total,
          completedExams: done,
          pct: total > 0 ? Math.round((done / total) * 100) : 0,
        }
      })

      // Stats
      const avgScore = attempts.length > 0
        ? Math.round(attempts.reduce((s, a) => s + (a.score_percent ?? 0), 0) / attempts.length)
        : 0

      const days = new Set(attempts.map((a) => new Date(a.finished_at).toLocaleDateString('es-CL')))
      let streak = 0
      let check = new Date()
      while (true) {
        if (days.has(check.toLocaleDateString('es-CL'))) { streak++; check.setDate(check.getDate() - 1) }
        else {
          if (streak === 0) { check.setDate(check.getDate() - 1); if (days.has(check.toLocaleDateString('es-CL'))) { streak++; check.setDate(check.getDate() - 1); continue } }
          break
        }
      }

      const inc = incompleteRes.data as any
      setChapters(chapterData)
      setProfile(profileRes.data)
      setStats({ todayCount: todayRes.data?.length ?? 0, avgScore, streak, totalAttempts: attempts.length })
      setLastIncomplete(inc ? { exam_id: inc.exam_id, title: inc.exams?.title ?? 'Examen' } : null)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="grid lg:grid-cols-[1fr_280px] gap-6 max-w-7xl">
        <div className="space-y-5">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full rounded-full" />
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-16 rounded-2xl" />)}
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? ''

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-6 max-w-7xl items-start">

      {/* ── MAIN COLUMN ───────────────────────────────────── */}
      <div className="space-y-5 min-w-0">

        {/* Greeting + overall progress */}
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {getGreeting()}{firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            EUNACOM Julio 2026
            {daysLeft !== null && daysLeft > 0 && <span className="ml-1 text-slate-700 font-medium">· {daysLeft} días restantes</span>}
            {currentWeek && <span className="ml-1 text-slate-400">· Semana {currentWeek.week}: {currentWeek.topic}</span>}
          </p>
        </div>

        {/* Global progress bar — compact */}
        {courseProgress.total > 0 && (
          <div className="flex items-center gap-3">
            <Progress value={courseProgress.pct} className="flex-1 h-2.5 [&>div]:bg-blue-500" />
            <span className="text-sm font-bold text-blue-700 flex-shrink-0 w-10 text-right">{courseProgress.pct}%</span>
            <span className="text-xs text-slate-400 flex-shrink-0">{courseProgress.done}/{courseProgress.total} cuest.</span>
          </div>
        )}

        {/* Continue banner (if there's an incomplete exam) */}
        {lastIncomplete && (
          <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-slate-800 truncate">{lastIncomplete.title}</span>
              <span className="text-xs text-slate-400 ml-2">Sin terminar</span>
            </div>
            <Link href={`/app/exam/${lastIncomplete.exam_id}`}>
              <Button size="sm" className="gap-1.5 flex-shrink-0">Continuar <ArrowRight className="w-3.5 h-3.5" /></Button>
            </Link>
          </div>
        )}

        {/* ── Chapter cards (the main view) ─────────────── */}
        <div className="space-y-4">
          {chapters.map((chapter) => {
            const isCurrent = chapter.weeks.some((w) => w.status === 'en_curso')
            return (
              <ChapterCard
                key={chapter.number}
                chapter={chapter}
                defaultOpen={isCurrent || chapter.number === 1}
              />
            )
          })}
        </div>

        {/* ── Quick stat strip ─────────────────────────── */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { v: stats.todayCount,    l: 'Hoy',      icon: CheckCircle, cx: 'text-blue-700' },
            { v: `${stats.avgScore}%`,l: 'Promedio', icon: TrendingUp,  cx: 'text-green-700' },
            { v: stats.streak,        l: 'Racha',    icon: Flame,       cx: 'text-amber-700' },
            { v: stats.totalAttempts, l: 'Total',    icon: BookOpen,    cx: 'text-slate-700' },
          ].map(({ v, l, icon: Icon, cx }) => (
            <div key={l} className="bg-white rounded-lg border border-slate-300 p-3 text-center shadow-sm">
              <Icon className={`w-3.5 h-3.5 mx-auto mb-1.5 ${cx}`} size={14} />
              <div className={`text-base font-bold tabular-nums ${cx}`}>{v}</div>
              <div className="text-[11px] text-slate-500 font-medium">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT SIDEBAR ─────────────────────────────── */}
      <div className="space-y-4">

        {/* Mini calendar */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <MiniCalendar testDates={COURSE_CALENDAR.testDates} />
          <Link href="/app/calendar" className="block mt-4">
            <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
              <CalendarDays className="w-3.5 h-3.5" />
              Calendario completo
            </Button>
          </Link>
        </div>

        {/* Next exam countdown */}
        {nextTest && (
          <div className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Próxima prueba</span>
            </div>
            <div className={`text-3xl font-bold tabular-nums ${nextTest.days <= 7 ? 'text-red-600' : nextTest.days <= 14 ? 'text-amber-600' : 'text-slate-800'}`}>
              {nextTest.days === 0 ? '¡Hoy!' : `${nextTest.days}d`}
            </div>
            <div className="text-sm font-medium text-slate-700 mt-1">{nextTest.test.title}</div>
            <div className="text-xs text-slate-400 mt-0.5">{new Date(nextTest.test.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}</div>
          </div>
        )}

        {/* Clinical tip */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <div className="flex items-center gap-1.5 mb-3">
            <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Perla del día</span>
          </div>
          <div className="text-xs font-semibold text-blue-700 mb-1">{tip.area}</div>
          <p className="text-xs text-slate-600 leading-relaxed">{tip.tip}</p>
        </div>

        {/* Quick links */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          {[
            { href: '/app/specialties', icon: BookOpen,   label: 'Contenido', sub: 'Videos y cuestionarios' },
            { href: '/app/stats',       icon: TrendingUp, label: 'Estadísticas', sub: 'Análisis de rendimiento' },
            { href: '/app/history',     icon: Clock,      label: 'Historial',    sub: 'Todos los intentos' },
          ].map(({ href, icon: Icon, label, sub }) => (
            <Link key={href} href={href} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-700">{label}</div>
                <div className="text-xs text-slate-400">{sub}</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400" />
            </Link>
          ))}
        </div>

        {/* EUNACOM countdown */}
        {daysLeft !== null && daysLeft > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white p-4 text-center">
            <Trophy className="w-4 h-4 mx-auto mb-2 text-amber-500" />
            <div className="text-3xl font-bold text-slate-800 tabular-nums">{daysLeft}</div>
            <div className="text-slate-500 text-xs mt-1">días para el EUNACOM</div>
          </div>
        )}
      </div>
    </div>
  )
}
