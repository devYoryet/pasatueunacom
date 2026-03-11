'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import ConfigModal from '@/components/quiz/ConfigModal'
import type { Specialty } from '@/lib/supabase/types'
import {
  BookOpen, Play, CheckCircle2, Clock3, Circle,
  ChevronDown, ChevronUp, ExternalLink, MoreHorizontal,
  CalendarDays, Flame, Trophy,
} from 'lucide-react'
import {
  COURSE_CALENDAR, CHAPTER_COLORS, formatWeekRange, getCurrentCourseWeek,
  type CourseWeek,
} from '@/lib/course-calendar'
import { getScoreColor } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ExamStatus {
  id: number
  title: string
  question_count: number
  order_index: number
  exam_type: string
  specialty_id: number | null
  isCompleted: boolean
  avgScore: number | null
}

interface SpecialtyData extends Specialty {
  exams: ExamStatus[]
  rawExams: any[] // full Exam objects for ConfigModal
  totalExams: number
  completedExams: number
  avgScore: number
}

// ─── Exam Item ────────────────────────────────────────────────────────────────

function ExamItem({ exam }: { exam: ExamStatus }) {
  return (
    <div className={`flex items-center gap-3 pl-10 pr-4 py-2.5 border-b border-slate-50 last:border-0 transition-colors group ${
      exam.isCompleted ? 'bg-green-50/30' : 'hover:bg-slate-50/60'
    }`}>
      {exam.isCompleted
        ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
        : <Circle className="w-4 h-4 text-slate-200 flex-shrink-0 group-hover:text-slate-300" />
      }

      <div className="flex-1 min-w-0">
        <p className={`text-sm leading-tight ${exam.isCompleted ? 'text-slate-500' : 'text-slate-700'}`}>
          {exam.title}
        </p>
        <p className="text-xs text-slate-400 mt-0.5">{exam.question_count || 15} preguntas</p>
      </div>

      {exam.avgScore !== null && (
        <span className={`text-xs font-bold tabular-nums w-8 text-right ${getScoreColor(exam.avgScore)}`}>
          {exam.avgScore}%
        </span>
      )}

      <Link href={`/app/exam/${exam.id}`}>
        <Button
          size="sm"
          variant={exam.isCompleted ? 'outline' : 'default'}
          className="h-7 text-xs gap-1 flex-shrink-0"
        >
          <Play className="w-3 h-3" />
          {exam.isCompleted ? 'Repetir' : 'Iniciar'}
        </Button>
      </Link>
    </div>
  )
}

// ─── Specialty / Week Row ─────────────────────────────────────────────────────

function SpecialtyWeekRow({
  week,
  specialties,
  isCurrent,
  color,
  onPracticeAll,
}: {
  week: CourseWeek
  specialties: SpecialtyData[]
  isCurrent: boolean
  color: typeof CHAPTER_COLORS[keyof typeof CHAPTER_COLORS]
  onPracticeAll: (spec: SpecialtyData) => void
}) {
  const [open, setOpen] = useState(isCurrent)
  const dateRange = formatWeekRange(week.start, week.end)

  // Repaso week — simple display
  if (week.isRepaso) {
    return (
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-0 ${
        isCurrent ? color.bg : ''
      }`}>
        <span className="text-base flex-shrink-0">📋</span>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium text-slate-600">{week.topic}</span>
          <span className="text-xs text-slate-400 ml-2">S{week.week} · {dateRange}</span>
        </div>
        {isCurrent && (
          <span className={`text-xs font-semibold ${color.text} flex-shrink-0`}>
            Esta semana
          </span>
        )}
      </div>
    )
  }

  // No specialties mapped yet
  if (specialties.length === 0) return null

  // Aggregate metrics
  const totalExams = specialties.reduce((s, sp) => s + sp.totalExams, 0)
  const completedExams = specialties.reduce((s, sp) => s + sp.completedExams, 0)
  const pct = totalExams > 0 ? Math.round((completedExams / totalExams) * 100) : 0
  const isDone = totalExams > 0 && completedExams >= totalExams
  const isStarted = completedExams > 0 && !isDone

  const topicExams = specialties.flatMap((sp) => sp.exams.filter((e) => e.exam_type === 'topic'))
  const hasExams = topicExams.length > 0

  return (
    <div className={`border-b border-slate-100 last:border-0 ${isCurrent ? color.bg : ''}`}>
      {/* Row header */}
      <div
        className={`flex items-center gap-3 px-4 py-3 transition-colors ${
          hasExams ? 'cursor-pointer hover:bg-black/[0.015]' : 'cursor-default'
        }`}
        onClick={() => hasExams && setOpen(!open)}
      >
        {/* Status icon */}
        <div className="flex-shrink-0">
          {isDone
            ? <CheckCircle2 className="w-5 h-5 text-green-500" />
            : isStarted
            ? <Clock3 className={`w-5 h-5 ${color.text}`} />
            : <Circle className="w-5 h-5 text-slate-200" />
          }
        </div>

        {/* Week number */}
        <span className="text-xs font-mono text-slate-400 w-6 flex-shrink-0">S{week.week}</span>

        {/* Date range (desktop) */}
        <span className="text-xs text-slate-400 w-18 flex-shrink-0 hidden sm:block">{dateRange}</span>

        {/* Topic name */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-medium ${isCurrent ? color.text : 'text-slate-800'}`}>
              {week.topic}
            </span>
            {isCurrent && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${color.badge} hidden sm:inline`}>
                Esta semana
              </span>
            )}
          </div>
          {/* Mobile date */}
          <span className="text-xs text-slate-400 sm:hidden">{dateRange}</span>
        </div>

        {/* Progress (desktop) */}
        {hasExams && (
          <div className="flex items-center gap-2 flex-shrink-0 hidden sm:flex">
            <span className="text-xs text-slate-400 tabular-nums">{completedExams}/{totalExams}</span>
            <div className="w-14">
              <Progress value={pct} className={`h-1.5 ${isDone ? '[&>div]:bg-green-500' : color.progress}`} />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {specialties.length === 1 && (
            <Link href={`/app/specialties/${specialties[0].code}`} onClick={(e) => e.stopPropagation()}>
              <button className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors rounded-lg hover:bg-white/80">
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </Link>
          )}
          {hasExams && specialties.length === 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); onPracticeAll(specialties[0]) }}
              className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors rounded-lg hover:bg-white/80"
              title="Practicar todo"
            >
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          )}
          {hasExams && (
            open
              ? <ChevronUp className="w-4 h-4 text-slate-300 ml-0.5" />
              : <ChevronDown className="w-4 h-4 text-slate-300 ml-0.5" />
          )}
        </div>
      </div>

      {/* Expanded quiz list */}
      {open && hasExams && (
        <div className="border-t border-slate-100 bg-white/70">
          {topicExams.map((exam) => (
            <ExamItem key={exam.id} exam={exam} />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Chapter Section ──────────────────────────────────────────────────────────

function ChapterSection({
  chapter,
  specialtyMap,
  currentWeekNum,
  defaultOpen,
  onPracticeAll,
}: {
  chapter: typeof COURSE_CALENDAR.chapters[0]
  specialtyMap: Record<string, SpecialtyData>
  currentWeekNum: number | null
  defaultOpen: boolean
  onPracticeAll: (spec: SpecialtyData) => void
}) {
  const [open, setOpen] = useState(defaultOpen)
  const color = CHAPTER_COLORS[chapter.color]

  const hasCurrentWeek = chapter.weeks.some((w) => w.week === currentWeekNum)

  // Chapter-level metrics
  const uniqueCodes = [...new Set(chapter.weeks.flatMap((w) => w.specialtyCodes))]
  const specs = uniqueCodes.map((c) => specialtyMap[c]).filter(Boolean)
  const totalExams = specs.reduce((s, sp) => s + sp.totalExams, 0)
  const completedExams = specs.reduce((s, sp) => s + sp.completedExams, 0)
  const chapterPct = totalExams > 0 ? Math.round((completedExams / totalExams) * 100) : 0

  return (
    <div className={`rounded-2xl border-2 overflow-hidden ${hasCurrentWeek ? color.border : 'border-slate-200'}`}>
      {/* Chapter header */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-4 p-5 text-left transition-colors ${
          hasCurrentWeek ? color.bg : 'bg-white'
        } hover:brightness-[0.97]`}
      >
        {/* Chapter number badge */}
        <div className={`w-10 h-10 rounded-xl ${color.badge} flex items-center justify-center flex-shrink-0 font-bold text-sm`}>
          {chapter.number}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-heading font-semibold text-slate-900">
              Capítulo {chapter.number}
            </span>
            {hasCurrentWeek && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${color.badge}`}>
                En curso
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 truncate mt-0.5">{chapter.title}</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {totalExams > 0 && (
            <div className="text-right hidden sm:block">
              <div className={`text-lg font-bold ${chapterPct === 100 ? 'text-green-600' : color.text}`}>{chapterPct}%</div>
              <div className="text-xs text-slate-400">{completedExams}/{totalExams} cuest.</div>
            </div>
          )}
          {totalExams > 0 && (
            <div className="w-16 hidden sm:block">
              <Progress value={chapterPct} className={`h-2 ${chapterPct === 100 ? '[&>div]:bg-green-500' : color.progress}`} />
            </div>
          )}
          {open ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
        </div>
      </button>

      {/* Mobile progress */}
      {totalExams > 0 && (
        <div className={`flex items-center gap-2 px-5 pb-3 ${hasCurrentWeek ? color.bg : 'bg-white'} sm:hidden`}>
          <Progress value={chapterPct} className={`flex-1 h-2 ${chapterPct === 100 ? '[&>div]:bg-green-500' : color.progress}`} />
          <span className={`text-sm font-bold ${chapterPct === 100 ? 'text-green-600' : color.text}`}>{chapterPct}%</span>
        </div>
      )}

      {/* Chapter weeks */}
      {open && (
        <div className="border-t border-slate-100 bg-white">
          {chapter.weeks.map((week) => {
            const weekSpecialties = week.specialtyCodes.map((c) => specialtyMap[c]).filter(Boolean)
            return (
              <SpecialtyWeekRow
                key={week.week}
                week={week}
                specialties={weekSpecialties}
                isCurrent={week.week === currentWeekNum}
                color={color}
                onPracticeAll={onPracticeAll}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SpecialtiesPage() {
  const [specialtyMap, setSpecialtyMap] = useState<Record<string, SpecialtyData>>({})
  const [loading, setLoading] = useState(true)
  const [configOpen, setConfigOpen] = useState(false)
  const [selectedSpec, setSelectedSpec] = useState<SpecialtyData | null>(null)

  const currentWeek = useMemo(() => getCurrentCourseWeek(), [])
  const currentWeekNum = currentWeek?.week ?? null

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      // Single batch: specs, exams, and (if logged in) attempts
      const [specsRes, examsRes, attRes] = await Promise.all([
        supabase.from('specialties').select('*, eunacom_areas(*)').order('order_index'),
        supabase.from('exams').select('id, title, specialty_id, exam_type, question_count, order_index, is_active').eq('is_active', true).order('order_index'),
        user
          ? supabase.from('attempts').select('exam_id, score_percent').eq('user_id', user.id).eq('is_completed', true)
          : Promise.resolve({ data: [] }),
      ])

      const specs = (specsRes.data ?? []) as any[]
      const exams = (examsRes.data ?? []) as any[]
      const attempts = (attRes.data ?? []) as { exam_id: number; score_percent: number | null }[]

      // Per-exam completion and score map
      const completedExamIds = new Set(attempts.map((a) => a.exam_id))
      const scoresByExam: Record<number, number[]> = {}
      for (const a of attempts) {
        if (a.score_percent != null) {
          if (!scoresByExam[a.exam_id]) scoresByExam[a.exam_id] = []
          scoresByExam[a.exam_id].push(a.score_percent)
        }
      }

      const map: Record<string, SpecialtyData> = {}

      for (const spec of specs) {
        const specExams = exams.filter((e: any) => e.specialty_id === spec.id)
        const topicExams = specExams.filter((e: any) => e.exam_type === 'topic')

        const examsWithStatus: ExamStatus[] = specExams.map((e: any) => {
          const scores = scoresByExam[e.id] ?? []
          return {
            id: e.id,
            title: e.title,
            question_count: e.question_count ?? 15,
            order_index: e.order_index ?? 0,
            exam_type: e.exam_type,
            specialty_id: e.specialty_id,
            isCompleted: completedExamIds.has(e.id),
            avgScore: scores.length > 0
              ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length)
              : null,
          }
        })

        const completedTopicCount = topicExams.filter((e: any) => completedExamIds.has(e.id)).length
        const allTopicScores = topicExams.flatMap((e: any) => scoresByExam[e.id] ?? [])
        const avgScore = allTopicScores.length > 0
          ? Math.round(allTopicScores.reduce((a: number, b: number) => a + b, 0) / allTopicScores.length)
          : 0

        map[spec.code] = {
          ...spec,
          exams: examsWithStatus,
          rawExams: specExams,
          totalExams: topicExams.length,
          completedExams: completedTopicCount,
          avgScore,
        }
      }

      setSpecialtyMap(map)
      setLoading(false)
    }

    load()
  }, [])

  // Overall course progress
  const overallProgress = useMemo(() => {
    const values = Object.values(specialtyMap)
    const total = values.reduce((s, sp) => s + sp.totalExams, 0)
    const done = values.reduce((s, sp) => s + sp.completedExams, 0)
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [specialtyMap])

  const handlePracticeAll = (spec: SpecialtyData) => {
    setSelectedSpec(spec)
    setConfigOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-5 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 rounded-2xl" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Page header */}
      <div>
        <h1 className="section-title">Contenido del Curso</h1>
        <p className="text-slate-500 text-sm mt-1">
          EUNACOM Julio 2026 — Organizado por semana del calendario
        </p>
      </div>

      {/* Overall progress */}
      {overallProgress.total > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-slate-700">Progreso general del curso</span>
            </div>
            <span className="text-sm font-bold text-blue-700">{overallProgress.pct}%</span>
          </div>
          <Progress value={overallProgress.pct} className="h-3 [&>div]:bg-blue-500" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-slate-400">
              {overallProgress.done}/{overallProgress.total} cuestionarios completados
            </span>
            {currentWeek && (
              <div className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs font-medium text-blue-600">
                  Semana {currentWeek.week}: {currentWeek.topic}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* General section */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-slate-500" />
          </div>
          <span className="font-semibold text-slate-800 text-sm">General</span>
        </div>
        <div>
          <Link
            href="/app/calendar"
            className="flex items-center gap-3 px-5 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors group"
          >
            <CalendarDays className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
            <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors">
              Calendario del Curso
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-300 ml-auto -rotate-90" />
          </Link>
          <div className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50 transition-colors">
            <span className="text-base flex-shrink-0">🎯</span>
            <div className="flex-1 min-w-0">
              <span className="text-sm text-slate-700">
                Prueba diagnóstica: Ensayo 180 preguntas tipo EUNACOM
              </span>
              <div className="text-xs text-slate-400 mt-0.5">09 ene 2026 · Disponible próximamente</div>
            </div>
          </div>
        </div>
      </div>

      {/* Chapter sections */}
      {COURSE_CALENDAR.chapters.map((chapter) => {
        const hasCurrentWeek = chapter.weeks.some((w) => w.week === currentWeekNum)
        return (
          <ChapterSection
            key={chapter.number}
            chapter={chapter}
            specialtyMap={specialtyMap}
            currentWeekNum={currentWeekNum}
            defaultOpen={hasCurrentWeek || chapter.number === 1}
            onPracticeAll={handlePracticeAll}
          />
        )
      })}

      {/* Config modal for "Practicar todo" */}
      {selectedSpec && (
        <ConfigModal
          open={configOpen}
          onClose={() => {
            setConfigOpen(false)
            setSelectedSpec(null)
          }}
          specialty={selectedSpec}
          exams={selectedSpec.rawExams}
        />
      )}
    </div>
  )
}
