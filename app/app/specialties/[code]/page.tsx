'use client'

import { useEffect, useState, use, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import ConfigModal from '@/components/quiz/ConfigModal'
import type { Specialty, Exam, Lesson } from '@/lib/supabase/types'
import {
  CheckCircle2, Circle, PlayCircle, ChevronDown, ChevronUp,
  ArrowLeft, BookOpen, FileText, Lightbulb, Target, Cpu, MessageSquare,
  Clock, Play, Video, Brain, TrendingUp, TrendingDown, Minus,
  AlertTriangle, BarChart2, Zap, Award, Star,
} from 'lucide-react'
import { COURSE_CALENDAR, CHAPTER_COLORS } from '@/lib/course-calendar'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonWithProgress extends Lesson {
  isWatched: boolean
}

interface ExamWithAttempts extends Exam {
  completedCount: number
  bestScore: number | null
  lastScore: number | null
  scoreHistory: number[]
  attemptCount: number
}

interface SpecialtyData extends Specialty {
  eunacom_areas: { name: string } | null
  exams: ExamWithAttempts[]
  lessons: LessonWithProgress[]
  chapterNumber: number | null
  chapterTitle: string | null
  chapterColor: keyof typeof CHAPTER_COLORS | null
}

// ─── Score color helper ───────────────────────────────────────────────────────

function scoreCx(score: number | null, variant: 'text' | 'badge' = 'text') {
  if (score === null) return variant === 'badge' ? 'bg-slate-100 text-slate-500' : 'text-slate-400'
  if (score >= 70) return variant === 'badge' ? 'bg-green-100 text-green-700' : 'text-green-600'
  if (score >= 50) return variant === 'badge' ? 'bg-amber-100 text-amber-700' : 'text-amber-600'
  return variant === 'badge' ? 'bg-red-100 text-red-600' : 'text-red-500'
}

// ─── Lesson Card ──────────────────────────────────────────────────────────────

function LessonCard({
  lesson,
  onToggleWatched,
}: {
  lesson: LessonWithProgress
  onToggleWatched: (id: number, watched: boolean) => void
}) {
  const [open, setOpen] = useState(false)

  const hasAiContent =
    lesson.ai_summary ||
    lesson.ai_key_concepts?.length > 0 ||
    lesson.ai_mnemonics?.length > 0 ||
    lesson.ai_high_yield?.length > 0

  const durationStr = lesson.duration_seconds
    ? `${Math.floor(lesson.duration_seconds / 60)} min`
    : null

  return (
    <div className={`rounded-xl border transition-all duration-200 ${
      lesson.isWatched
        ? 'border-green-200 bg-green-50/40'
        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
    }`}>
      <div className="flex items-center gap-3 p-4">
        {/* Watch toggle */}
        <button
          onClick={() => onToggleWatched(lesson.id, !lesson.isWatched)}
          className="flex-shrink-0 transition-transform hover:scale-110"
          title={lesson.isWatched ? 'Marcar como no visto' : 'Marcar como visto'}
        >
          {lesson.isWatched
            ? <CheckCircle2 className="w-5 h-5 text-green-500" />
            : <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />}
        </button>

        <span className="text-xs font-mono text-slate-400 w-6 flex-shrink-0">{lesson.order_index}</span>

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-tight ${lesson.isWatched ? 'text-slate-500 line-through decoration-slate-300' : 'text-slate-800'}`}>
            {lesson.title}
          </p>
          {durationStr && (
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">{durationStr}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {lesson.video_url && (
            <a
              href={lesson.video_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => !lesson.isWatched && onToggleWatched(lesson.id, true)}
            >
              <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs">
                <PlayCircle className="w-3.5 h-3.5" />
                Ver
              </Button>
            </a>
          )}
          {hasAiContent && (
            <button
              onClick={() => setOpen(!open)}
              className="p-1 text-blue-400 hover:text-blue-600 transition-colors"
              title="Ver material IA"
            >
              {open ? <ChevronUp className="w-4 h-4" /> : <Lightbulb className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* AI Study Material */}
      {open && hasAiContent && (
        <div className="border-t border-slate-100 p-4 space-y-4 bg-gradient-to-br from-blue-50/40 to-indigo-50/40 rounded-b-xl">
          {lesson.ai_summary && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Resumen</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{lesson.ai_summary}</p>
            </div>
          )}
          {lesson.ai_key_concepts?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Conceptos clave</span>
              </div>
              <ul className="space-y-1">
                {lesson.ai_key_concepts.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-purple-400 flex-shrink-0 mt-0.5">•</span>{c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {lesson.ai_mnemonics?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Brain className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Nemotecnias</span>
              </div>
              <div className="space-y-2">
                {lesson.ai_mnemonics.map((m, i) => (
                  <div key={i} className="bg-amber-50 border border-amber-100 rounded-lg p-3">
                    <div className="text-xs text-amber-600 mb-1">{m.para}</div>
                    <div className="font-bold text-amber-800 text-sm">{m.nemotecnia}</div>
                    <div className="text-xs text-amber-700 mt-1">{m.explicacion}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {lesson.ai_high_yield?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-red-500" />
                <span className="text-xs font-semibold text-red-700 uppercase tracking-wide">Puntos clave EUNACOM</span>
              </div>
              <ul className="space-y-1">
                {lesson.ai_high_yield.map((p, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-red-400 flex-shrink-0 mt-0.5">★</span>
                    <span className="text-slate-700">{p}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {lesson.ai_algorithms?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Algoritmos clínicos</span>
              </div>
              <div className="space-y-1">
                {lesson.ai_algorithms.map((a, i) => (
                  <div key={i} className="font-mono text-xs bg-green-50 text-green-800 px-3 py-1.5 rounded-lg border border-green-100">{a}</div>
                ))}
              </div>
            </div>
          )}
          {lesson.ai_review_qs?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Preguntas de repaso</span>
              </div>
              <div className="space-y-2">
                {lesson.ai_review_qs.map((q, i) => (
                  <ReviewQuestion key={i} question={q} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function ReviewQuestion({ question }: { question: { pregunta: string; respuesta: string } }) {
  const [show, setShow] = useState(false)
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="p-3 bg-slate-50">
        <p className="text-sm text-slate-800 font-medium">{question.pregunta}</p>
      </div>
      <div className="px-3 pb-3 pt-1">
        <button
          onClick={() => setShow(!show)}
          className="text-xs text-blue-600 hover:text-blue-800 font-medium"
        >
          {show ? 'Ocultar respuesta' : 'Ver respuesta'}
        </button>
        {show && (
          <div className="mt-2 text-sm text-slate-700 bg-blue-50 rounded-lg p-3 border border-blue-100">
            {question.respuesta}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SpecialtyDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [data, setData] = useState<SpecialtyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [configOpen, setConfigOpen] = useState(false)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const [specRes, examsRes, lessonsRes] = await Promise.all([
        supabase.from('specialties').select('*, eunacom_areas(name)').eq('code', code).single(),
        supabase.from('exams').select('*').eq('is_active', true).order('order_index'),
        supabase.from('lessons').select('*').eq('is_available', true).order('order_index'),
      ])

      const spec = specRes.data
      if (!spec) { setLoading(false); return }

      const specExams = (examsRes.data ?? []).filter((e: any) => e.specialty_id === spec.id)
      const specLessons = (lessonsRes.data ?? []).filter((l: any) => l.specialty_id === spec.id)

      let watchedLessonIds = new Set<number>()
      // attemptsByExam: exam_id → scores ordered oldest→newest
      const attemptsByExam: Record<number, number[]> = {}

      if (user) {
        const [attRes, watchRes] = await Promise.all([
          supabase
            .from('attempts')
            .select('exam_id, score_percent, finished_at')
            .eq('user_id', user.id)
            .eq('is_completed', true)
            .order('finished_at', { ascending: true }),
          supabase
            .from('lesson_progress')
            .select('lesson_id')
            .eq('user_id', user.id)
            .eq('completed', true)
            .then((r: unknown) => r as { data: { lesson_id: number }[] | null }),
        ])

        attRes.data?.forEach((a: any) => {
          if (!attemptsByExam[a.exam_id]) attemptsByExam[a.exam_id] = []
          attemptsByExam[a.exam_id].push(a.score_percent ?? 0)
        })
        watchRes.data?.forEach((w: any) => watchedLessonIds.add(w.lesson_id))
      }

      // Chapter info
      let chapterNumber: number | null = null
      let chapterTitle: string | null = null
      let chapterColor: keyof typeof CHAPTER_COLORS | null = null
      for (const chapter of COURSE_CALENDAR.chapters) {
        if (chapter.weeks.some((w) => w.specialtyCodes.includes(spec.code))) {
          chapterNumber = chapter.number
          chapterTitle = chapter.title
          chapterColor = chapter.color
          break
        }
      }

      setData({
        ...spec,
        exams: specExams.map((e: any) => {
          const history = attemptsByExam[e.id] ?? []
          return {
            ...e,
            completedCount: history.length,
            bestScore: history.length > 0 ? Math.max(...history) : null,
            lastScore: history.length > 0 ? history[history.length - 1] : null,
            scoreHistory: history,
            attemptCount: history.length,
          }
        }),
        lessons: specLessons.map((l: any) => ({
          ...l,
          isWatched: watchedLessonIds.has(l.id),
        })),
        chapterNumber,
        chapterTitle,
        chapterColor,
      })
      setLoading(false)
    }
    load()
  }, [code])

  const toggleWatched = async (lessonId: number, watched: boolean) => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    if (watched) {
      await supabase.from('lesson_progress').upsert({
        user_id: user.id,
        lesson_id: lessonId,
        completed: true,
        watched_at: new Date().toISOString(),
      }, { onConflict: 'user_id,lesson_id' })
    } else {
      await supabase.from('lesson_progress').delete().eq('user_id', user.id).eq('lesson_id', lessonId)
    }

    setData((prev) => prev ? {
      ...prev,
      lessons: prev.lessons.map((l) => l.id === lessonId ? { ...l, isWatched: watched } : l),
    } : prev)
  }

  // ── Analytics derived values ─────────────────────────────────────────────

  const analytics = useMemo(() => {
    if (!data || data.exams.length === 0) return null
    const attempted = data.exams.filter((e) => e.attemptCount > 0)
    if (attempted.length === 0) return null

    const totalAttempts = data.exams.reduce((s, e) => s + e.attemptCount, 0)
    const avgBest = Math.round(attempted.reduce((s, e) => s + (e.bestScore ?? 0), 0) / attempted.length)
    const worstExam = attempted.reduce((a, b) => (a.bestScore ?? 100) < (b.bestScore ?? 100) ? a : b)
    const bestExam = attempted.reduce((a, b) => (a.bestScore ?? 0) > (b.bestScore ?? 0) ? a : b)
    const totalImprovement = attempted
      .filter((e) => e.scoreHistory.length >= 2)
      .reduce((s, e) => s + (e.lastScore! - e.scoreHistory[0]), 0)

    return { totalAttempts, avgBest, worstExam, bestExam, totalImprovement, attempted }
  }, [data])

  // ────────────────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-40 rounded-2xl" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-16 rounded-xl" />)}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">Especialidad no encontrada.</p>
        <Link href="/app/specialties">
          <Button variant="ghost" className="mt-4">← Volver</Button>
        </Link>
      </div>
    )
  }

  const color = data.chapterColor ? CHAPTER_COLORS[data.chapterColor] : CHAPTER_COLORS.blue
  const watchedCount = data.lessons.filter((l) => l.isWatched).length
  const lessonPct = data.lessons.length > 0 ? Math.round((watchedCount / data.lessons.length) * 100) : 0
  const completedExams = data.exams.filter((e) => e.completedCount > 0).length
  const examPct = data.exams.length > 0 ? Math.round((completedExams / data.exams.length) * 100) : 0

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link href="/app/specialties" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Volver a Especialidades
      </Link>

      {/* ── Header Card ─────────────────────────────────── */}
      <div className={`rounded-2xl border-2 ${color.border} ${color.bg} p-6`}>
        <div className="flex items-start gap-4">
          <div className="text-4xl leading-none">{data.icon}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {data.chapterNumber && (
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${color.badge}`}>
                  Capítulo {data.chapterNumber}
                </span>
              )}
              {data.chapterTitle && (
                <span className="text-xs text-slate-500">{data.chapterTitle}</span>
              )}
            </div>
            <h1 className="text-2xl font-heading font-bold text-slate-900">{data.name}</h1>

            {/* Quick score pill if has attempts */}
            {analytics && (
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${scoreCx(analytics.avgBest, 'badge')}`}>
                  Promedio {analytics.avgBest}%
                </span>
                {analytics.totalImprovement > 0 && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{analytics.totalImprovement}% mejora acumulada
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress summary */}
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          <div className={`bg-white/70 rounded-xl p-4 border ${color.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <Video className={`w-4 h-4 ${color.text}`} />
              <span className="text-sm font-semibold text-slate-700">Clases</span>
              <span className="ml-auto text-xs text-slate-400">{watchedCount}/{data.lessons.length}</span>
            </div>
            {data.lessons.length > 0 ? (
              <Progress value={lessonPct} className={`h-2 ${color.progress}`} />
            ) : (
              <p className="text-xs text-slate-400">Clases próximamente</p>
            )}
          </div>
          <div className={`bg-white/70 rounded-xl p-4 border ${color.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className={`w-4 h-4 ${color.text}`} />
              <span className="text-sm font-semibold text-slate-700">Cuestionarios</span>
              <span className="ml-auto text-xs text-slate-400">{completedExams}/{data.exams.length}</span>
            </div>
            {data.exams.length > 0 ? (
              <Progress value={examPct} className={`h-2 ${examPct === 100 ? '[&>div]:bg-green-500' : color.progress}`} />
            ) : (
              <p className="text-xs text-slate-400">Sin cuestionarios aún</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Tabs ────────────────────────────────────────── */}
      <Tabs defaultValue={data.exams.length > 0 ? 'quizzes' : 'lessons'}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="quizzes" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Cuestionarios
            {data.exams.length > 0 && (
              <span className="text-xs bg-white rounded-full px-1.5 py-0.5 font-semibold text-slate-600">
                {data.exams.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="lessons" className="gap-2">
            <Video className="w-4 h-4" />
            Clases
            {data.lessons.length > 0 && (
              <span className="text-xs bg-white rounded-full px-1.5 py-0.5 font-semibold text-slate-600">
                {data.lessons.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart2 className="w-4 h-4" />
            Rendimiento
          </TabsTrigger>
        </TabsList>

        {/* ── Quizzes Tab ────────────────────────────────── */}
        <TabsContent value="quizzes" className="mt-4 space-y-3">
          {data.exams.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border-2 border-dashed border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-600">Sin cuestionarios aún</h3>
              <p className="text-sm text-slate-400">Los cuestionarios se habilitarán próximamente.</p>
            </div>
          ) : (
            <>
              {/* Analytics strip */}
              {analytics && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${scoreCx(analytics.avgBest)}`}>{analytics.avgBest}%</div>
                    <div className="text-[10px] text-slate-400">Promedio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-slate-800">{completedExams}/{data.exams.length}</div>
                    <div className="text-[10px] text-slate-400">Completados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{analytics.totalAttempts}</div>
                    <div className="text-[10px] text-slate-400">Intentos</div>
                  </div>
                </div>
              )}

              {/* Weak area callout */}
              {analytics && analytics.worstExam.bestScore !== null && analytics.worstExam.bestScore < 70 && (
                <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
                  <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-amber-800">Área de mejora detectada</p>
                    <p className="text-xs text-amber-700 truncate">{analytics.worstExam.title} — mejor puntaje: <strong>{analytics.worstExam.bestScore}%</strong></p>
                  </div>
                  <Button asChild size="sm" className="flex-shrink-0 h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white border-0">
                    <Link href={`/app/exam/${analytics.worstExam.id}`}>Repasar</Link>
                  </Button>
                </div>
              )}

              {/* Header actions */}
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  {data.exams.length} cuestionarios · ~{data.exams.length * 15} preguntas
                </p>
                <Button size="sm" className="gap-2" onClick={() => setConfigOpen(true)}>
                  <Play className="w-3.5 h-3.5" />
                  Practicar todo
                </Button>
              </div>

              {/* Quiz cards */}
              {data.exams.map((exam) => (
                <div
                  key={exam.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    exam.completedCount > 0
                      ? 'border-green-200 bg-green-50/30 hover:bg-green-50/60'
                      : 'border-slate-200 bg-white hover:border-amber-200 hover:bg-amber-50/20'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {exam.completedCount > 0
                      ? <CheckCircle2 className="w-5 h-5 text-green-500" />
                      : <Circle className="w-5 h-5 text-amber-300" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-slate-800">{exam.title}</p>
                      {exam.bestScore !== null && (
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${scoreCx(exam.bestScore, 'badge')}`}>
                          {exam.bestScore}%
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                      <span className="text-xs text-slate-400">{exam.question_count} preguntas</span>
                      {exam.attemptCount > 0 && (
                        <span className="text-xs text-slate-400">{exam.attemptCount} intento{exam.attemptCount > 1 ? 's' : ''}</span>
                      )}
                      {/* Score history trail */}
                      {exam.scoreHistory.length >= 2 && (
                        <div className="flex items-center gap-1 text-[10px]">
                          {exam.scoreHistory.slice(-4).map((s, i) => (
                            <span key={i} className="flex items-center gap-0.5">
                              {i > 0 && <span className="text-slate-300 mx-0.5">→</span>}
                              <span className={scoreCx(s)}>{s}%</span>
                            </span>
                          ))}
                          {exam.scoreHistory.length >= 2 && (() => {
                            const diff = exam.lastScore! - exam.scoreHistory[0]
                            if (diff > 3) return <TrendingUp className="w-3 h-3 text-green-500 ml-1" />
                            if (diff < -3) return <TrendingDown className="w-3 h-3 text-red-400 ml-1" />
                            return <Minus className="w-3 h-3 text-slate-300 ml-1" />
                          })()}
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    asChild
                    size="sm"
                    variant={exam.completedCount > 0 ? 'outline' : 'default'}
                    className={`gap-1.5 flex-shrink-0 ${
                      exam.completedCount === 0 ? 'bg-blue-600 hover:bg-blue-700' : ''
                    }`}
                  >
                    <Link href={`/app/exam/${exam.id}`}>
                      <Play className="w-3.5 h-3.5" />
                      {exam.completedCount > 0 ? 'Repetir' : 'Iniciar'}
                    </Link>
                  </Button>
                </div>
              ))}
            </>
          )}
        </TabsContent>

        {/* ── Lessons Tab ─────────────────────────────────── */}
        <TabsContent value="lessons" className="mt-4">
          {data.lessons.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border-2 border-dashed border-slate-200">
              <Video className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-600 mb-1">Clases próximamente</h3>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Las cápsulas de audio con material de estudio IA se habilitarán en las próximas semanas.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">
                  {watchedCount === data.lessons.length
                    ? '¡Todas las clases vistas! 🎉'
                    : `${data.lessons.length - watchedCount} clase${data.lessons.length - watchedCount > 1 ? 's' : ''} pendiente${data.lessons.length - watchedCount > 1 ? 's' : ''}`}
                </p>
                {watchedCount < data.lessons.length && (
                  <button
                    onClick={() => {
                      const first = data.lessons.find((l) => !l.isWatched && l.video_url)
                      if (first) window.open(first.video_url!, '_blank')
                    }}
                    className={`text-xs font-semibold ${color.text} hover:underline`}
                  >
                    Continuar donde lo dejé →
                  </button>
                )}
              </div>
              {data.lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} onToggleWatched={toggleWatched} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Analytics / Rendimiento Tab ──────────────────── */}
        <TabsContent value="analytics" className="mt-4 space-y-4">
          {!analytics ? (
            <div className="text-center py-16 rounded-2xl border-2 border-dashed border-slate-200">
              <BarChart2 className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-600">Sin datos de rendimiento aún</h3>
              <p className="text-sm text-slate-400 max-w-xs mx-auto mt-1">
                Completa al menos un cuestionario para ver tus estadísticas de rendimiento.
              </p>
              <Button size="sm" className="mt-4" onClick={() => setConfigOpen(true)}>
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Empezar ahora
              </Button>
            </div>
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: `${analytics.avgBest}%`, label: 'Promedio general', icon: BarChart2, cx: scoreCx(analytics.avgBest), bg: analytics.avgBest >= 70 ? 'bg-green-50' : analytics.avgBest >= 50 ? 'bg-amber-50' : 'bg-red-50' },
                  { value: `${completedExams}/${data.exams.length}`, label: 'Completados', icon: CheckCircle2, cx: 'text-blue-600', bg: 'bg-blue-50' },
                  { value: `${analytics.totalAttempts}`, label: 'Total intentos', icon: Zap, cx: 'text-purple-600', bg: 'bg-purple-50' },
                  { value: analytics.totalImprovement > 0 ? `+${analytics.totalImprovement}%` : '—', label: 'Mejora total', icon: TrendingUp, cx: analytics.totalImprovement > 0 ? 'text-green-600' : 'text-slate-400', bg: analytics.totalImprovement > 0 ? 'bg-green-50' : 'bg-slate-50' },
                ].map(({ value, label, icon: Icon, cx, bg }) => (
                  <div key={label} className={`${bg} rounded-xl p-3 text-center border border-white`}>
                    <Icon className={`w-4 h-4 mx-auto mb-1 ${cx}`} />
                    <div className={`text-xl font-heading font-bold ${cx}`}>{value}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              {/* Best vs worst */}
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-800 uppercase tracking-wide">Mejor resultado</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 truncate">{analytics.bestExam.title}</p>
                  <p className={`text-2xl font-heading font-bold mt-1 ${scoreCx(analytics.bestExam.bestScore)}`}>
                    {analytics.bestExam.bestScore}%
                  </p>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-semibold text-amber-800 uppercase tracking-wide">Área de mejora</span>
                  </div>
                  <p className="text-sm font-medium text-slate-800 truncate">{analytics.worstExam.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-2xl font-heading font-bold ${scoreCx(analytics.worstExam.bestScore)}`}>
                      {analytics.worstExam.bestScore}%
                    </p>
                    {analytics.worstExam.bestScore !== null && analytics.worstExam.bestScore < 70 && (
                      <Button asChild size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-white border-0">
                        <Link href={`/app/exam/${analytics.worstExam.id}`}>Repasar →</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Ranked list */}
              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Cuestionarios por rendimiento</h3>
                <div className="space-y-2">
                  {[...data.exams]
                    .sort((a, b) => {
                      if (a.bestScore === null && b.bestScore === null) return 0
                      if (a.bestScore === null) return 1
                      if (b.bestScore === null) return -1
                      return a.bestScore - b.bestScore
                    })
                    .map((exam) => {
                      const diff = exam.scoreHistory.length >= 2
                        ? exam.lastScore! - exam.scoreHistory[0]
                        : null

                      return (
                        <div key={exam.id} className="bg-white rounded-xl border border-slate-200 p-3 hover:border-slate-300 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="text-sm font-medium text-slate-800 truncate">{exam.title}</span>
                                {exam.attemptCount === 0 && (
                                  <Badge className="text-[10px] bg-slate-100 text-slate-500 border-0 py-0 flex-shrink-0">Pendiente</Badge>
                                )}
                              </div>
                              {exam.attemptCount > 0 && (
                                <>
                                  <div className="flex items-center gap-2">
                                    <Progress
                                      value={exam.bestScore ?? 0}
                                      className={`flex-1 h-2 ${
                                        (exam.bestScore ?? 0) >= 70 ? '[&>div]:bg-green-500' :
                                        (exam.bestScore ?? 0) >= 50 ? '[&>div]:bg-amber-400' :
                                        '[&>div]:bg-red-400'
                                      }`}
                                    />
                                    <span className={`text-xs font-bold w-9 text-right flex-shrink-0 ${scoreCx(exam.bestScore)}`}>
                                      {exam.bestScore}%
                                    </span>
                                  </div>
                                  {exam.scoreHistory.length >= 2 && (
                                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                                      <span>Historial:</span>
                                      {exam.scoreHistory.map((s, i) => (
                                        <span key={i} className="flex items-center gap-0.5">
                                          {i > 0 && <span className="text-slate-200">→</span>}
                                          <span className={scoreCx(s)}>{s}%</span>
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </>
                              )}
                            </div>

                            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                              {diff !== null && (
                                diff > 3
                                  ? <TrendingUp className="w-4 h-4 text-green-500" />
                                  : diff < -3
                                    ? <TrendingDown className="w-4 h-4 text-red-400" />
                                    : <Minus className="w-4 h-4 text-slate-300" />
                              )}
                              {exam.attemptCount > 0 && (
                                <span className="text-[10px] text-slate-400">{exam.attemptCount} int.</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Config modal */}
      {data && (
        <ConfigModal
          open={configOpen}
          onClose={() => setConfigOpen(false)}
          specialty={data}
          exams={data.exams}
        />
      )}
    </div>
  )
}
