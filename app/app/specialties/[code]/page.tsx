'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Clock, Play, Video, Brain,
} from 'lucide-react'
import { COURSE_CALENDAR, CHAPTER_COLORS } from '@/lib/course-calendar'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonWithProgress extends Lesson {
  isWatched: boolean
}

interface SpecialtyData extends Specialty {
  eunacom_areas: { name: string } | null
  exams: (Exam & { completedCount: number })[]
  lessons: LessonWithProgress[]
  chapterNumber: number | null
  chapterTitle: string | null
  chapterColor: keyof typeof CHAPTER_COLORS | null
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
    <div
      className={`rounded-xl border transition-all duration-200 ${
        lesson.isWatched
          ? 'border-green-200 bg-green-50/40'
          : 'border-slate-200 bg-white hover:border-slate-300'
      }`}
    >
      {/* Lesson Header */}
      <div className="flex items-center gap-3 p-4">
        {/* Watch status icon */}
        <button
          onClick={() => onToggleWatched(lesson.id, !lesson.isWatched)}
          className="flex-shrink-0 transition-transform hover:scale-110"
          title={lesson.isWatched ? 'Marcar como no visto' : 'Marcar como visto'}
        >
          {lesson.isWatched
            ? <CheckCircle2 className="w-5 h-5 text-green-500" />
            : <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />}
        </button>

        {/* Order number */}
        <span className="text-xs font-mono text-slate-400 w-6 flex-shrink-0">
          {lesson.order_index}
        </span>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium leading-tight ${lesson.isWatched ? 'text-slate-500' : 'text-slate-800'}`}>
            {lesson.title}
          </p>
          {durationStr && (
            <div className="flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-xs text-slate-400">{durationStr}</span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Video button */}
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

          {/* Expand AI content */}
          {hasAiContent && (
            <button
              onClick={() => setOpen(!open)}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
              title="Ver material de estudio"
            >
              {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* AI Study Material */}
      {open && hasAiContent && (
        <div className="border-t border-slate-100 p-4 space-y-4 bg-white rounded-b-xl">

          {/* Summary */}
          {lesson.ai_summary && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Resumen</span>
              </div>
              <p className="text-sm text-slate-700 leading-relaxed">{lesson.ai_summary}</p>
            </div>
          )}

          {/* Key concepts */}
          {lesson.ai_key_concepts?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-semibold text-purple-700 uppercase tracking-wide">Conceptos clave</span>
              </div>
              <ul className="space-y-1">
                {lesson.ai_key_concepts.map((c, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-purple-400 flex-shrink-0 mt-0.5">•</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Mnemonics */}
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

          {/* High-yield EUNACOM */}
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

          {/* Algorithms */}
          {lesson.ai_algorithms?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Cpu className="w-4 h-4 text-green-500" />
                <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Algoritmos clínicos</span>
              </div>
              <div className="space-y-1">
                {lesson.ai_algorithms.map((a, i) => (
                  <div key={i} className="font-mono text-xs bg-green-50 text-green-800 px-3 py-1.5 rounded-lg border border-green-100">
                    {a}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Review Questions */}
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
        supabase
          .from('specialties')
          .select('*, eunacom_areas(name)')
          .eq('code', code)
          .single(),
        supabase
          .from('exams')
          .select('*')
          .eq('is_active', true)
          .order('order_index'),
        // Lessons from DB (may be empty until migration is run)
        supabase
          .from('lessons')
          .select('*')
          .eq('is_available', true)
          .order('order_index'),
      ])

      const spec = specRes.data
      if (!spec) { setLoading(false); return }

      const specExams = (examsRes.data ?? []).filter((e: any) => e.specialty_id === spec.id)
      const specLessons = (lessonsRes.data ?? []).filter((l: any) => l.specialty_id === spec.id)

      // User attempts for score/completion data
      let completedExamIds = new Set<number>()
      let watchedLessonIds = new Set<number>()

      if (user) {
        const [attRes, watchRes] = await Promise.all([
          supabase
            .from('attempts')
            .select('exam_id')
            .eq('user_id', user.id)
            .eq('is_completed', true),
          // lesson_progress may not exist yet if migration not run
          supabase
            .from('lesson_progress')
            .select('lesson_id')
            .eq('user_id', user.id)
            .eq('completed', true)
            .then((r: unknown) => r as { data: { lesson_id: number }[] | null }) // no throw on missing table
        ])
        attRes.data?.forEach((a: any) => completedExamIds.add(a.exam_id))
        watchRes.data?.forEach((w: any) => watchedLessonIds.add(w.lesson_id))
      }

      // Find chapter info
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
        exams: specExams.map((e: any) => ({
          ...e,
          completedCount: completedExamIds.has(e.id) ? 1 : 0,
        })),
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
      await supabase.from('lesson_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
    }

    // Optimistic update
    setData((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        lessons: prev.lessons.map((l) =>
          l.id === lessonId ? { ...l, isWatched: watched } : l
        ),
      }
    })
  }

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
      <Link href="/app/specialties" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Volver a Especialidades
      </Link>

      {/* Header Card */}
      <div className={`rounded-2xl border-2 ${color.border} ${color.bg} p-6`}>
        <div className="flex items-start gap-4">
          <div className="text-4xl">{data.icon}</div>
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
          </div>
        </div>

        {/* Progress summary */}
        <div className="mt-5 grid sm:grid-cols-2 gap-4">
          {/* Lessons progress */}
          <div className={`bg-white/70 rounded-xl p-4 border ${color.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <Video className={`w-4 h-4 ${color.text}`} />
              <span className="text-sm font-semibold text-slate-700">Clases</span>
            </div>
            {data.lessons.length > 0 ? (
              <>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>{watchedCount}/{data.lessons.length} vistas</span>
                  <span className={`font-bold ${color.text}`}>{lessonPct}%</span>
                </div>
                <Progress value={lessonPct} className={`h-2 ${color.progress}`} />
              </>
            ) : (
              <p className="text-xs text-slate-400">Clases próximamente</p>
            )}
          </div>

          {/* Exams progress */}
          <div className={`bg-white/70 rounded-xl p-4 border ${color.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className={`w-4 h-4 ${color.text}`} />
              <span className="text-sm font-semibold text-slate-700">Cuestionarios</span>
            </div>
            {data.exams.length > 0 ? (
              <>
                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                  <span>{completedExams}/{data.exams.length} completados</span>
                  <span className={`font-bold ${color.text}`}>{examPct}%</span>
                </div>
                <Progress value={examPct} className={`h-2 ${color.progress}`} />
              </>
            ) : (
              <p className="text-xs text-slate-400">Sin cuestionarios aún</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue={data.lessons.length > 0 ? 'lessons' : 'quizzes'}>
        <TabsList className="bg-slate-100">
          <TabsTrigger value="lessons" className="gap-2">
            <Video className="w-4 h-4" />
            Clases
            {data.lessons.length > 0 && (
              <span className="text-xs bg-white rounded-full px-1.5 py-0.5 font-semibold text-slate-600">
                {data.lessons.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="quizzes" className="gap-2">
            <BookOpen className="w-4 h-4" />
            Cuestionarios
            {data.exams.length > 0 && (
              <span className="text-xs bg-white rounded-full px-1.5 py-0.5 font-semibold text-slate-600">
                {data.exams.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

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
              {/* Quick actions */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-slate-500">
                  {watchedCount === data.lessons.length
                    ? '¡Todas las clases vistas! 🎉'
                    : `${data.lessons.length - watchedCount} clases pendientes`}
                </p>
                {watchedCount < data.lessons.length && (
                  <button
                    onClick={() => {
                      // Find first unwatched
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
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  onToggleWatched={toggleWatched}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Quizzes Tab ──────────────────────────────────── */}
        <TabsContent value="quizzes" className="mt-4">
          {data.exams.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border-2 border-dashed border-slate-200">
              <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-semibold text-slate-600">Sin cuestionarios aún</h3>
              <p className="text-sm text-slate-400">Los cuestionarios se habilitarán próximamente.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-500">
                  {data.exams.length} cuestionarios · ~{data.exams.length * 15} preguntas total
                </p>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={() => setConfigOpen(true)}
                >
                  <Play className="w-3.5 h-3.5" />
                  Practicar todo
                </Button>
              </div>

              {data.exams.map((exam) => (
                <div
                  key={exam.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                    exam.completedCount > 0
                      ? 'border-green-200 bg-green-50/40'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {exam.completedCount > 0
                    ? <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    : <Circle className="w-5 h-5 text-slate-300 flex-shrink-0" />}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{exam.title}</p>
                    <p className="text-xs text-slate-400">{exam.question_count} preguntas</p>
                  </div>

                  <Link href={`/app/exam/${exam.id}`}>
                    <Button size="sm" variant={exam.completedCount > 0 ? 'outline' : 'default'} className="gap-2">
                      <Play className="w-3.5 h-3.5" />
                      {exam.completedCount > 0 ? 'Repetir' : 'Iniciar'}
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Config modal for "Practicar todo" */}
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
