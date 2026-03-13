'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import ConfigModal from '@/components/quiz/ConfigModal'
import LessonSlidesModal from '@/components/lesson/LessonSlidesModal'
import type { Specialty, Exam, Lesson } from '@/lib/supabase/types'
import {
  CheckCircle2, Circle, ChevronDown, ChevronUp,
  ArrowLeft, BookOpen, FileText, Lightbulb, Target, Cpu, MessageSquare,
  Clock, Play, Video, Brain, TrendingUp, TrendingDown, Minus,
  AlertTriangle, BarChart2, Zap, Award, Layers,
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

// ─── Score color ──────────────────────────────────────────────────────────────

function scoreCx(score: number | null, variant: 'text' | 'badge' = 'text') {
  if (score === null) return variant === 'badge' ? 'bg-slate-100 text-slate-500' : 'text-slate-400'
  if (score >= 70) return variant === 'badge' ? 'bg-green-100 text-green-700 border border-green-200' : 'text-green-600'
  if (score >= 50) return variant === 'badge' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'text-amber-600'
  return variant === 'badge' ? 'bg-red-100 text-red-600 border border-red-200' : 'text-red-500'
}

// ─── Markdown prose helper ────────────────────────────────────────────────────

function Prose({ children, className = '' }: { children: string; className?: string }) {
  return (
    <div className={`prose prose-sm max-w-none text-justify leading-relaxed
      [&_strong]:font-semibold [&_strong]:text-slate-900
      [&_p]:mb-3 [&_p:last-child]:mb-0
      [&_ul]:mt-2 [&_ul]:space-y-1 [&_li]:leading-relaxed
      ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  )
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ icon: Icon, label, color }: { icon: any; label: string; color: string }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg mb-3 ${color}`}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" />
      <span className="text-xs font-bold uppercase tracking-wider">{label}</span>
    </div>
  )
}

// ─── Review Question ──────────────────────────────────────────────────────────

function ReviewQuestion({ question, index }: { question: { pregunta: string; respuesta: string }; index: number }) {
  const [show, setShow] = useState(false)

  // Parse embedded options (A) B) C) D) format)
  const lines = question.pregunta.split('\n')
  const questionLines: string[] = []
  const optionLines: string[] = []
  lines.forEach((line) => {
    if (/^[A-Da-d][).]\s/.test(line.trim())) optionLines.push(line.trim())
    else questionLines.push(line)
  })
  const questionText = questionLines.join('\n').trim()
  const hasOptions = optionLines.length >= 2

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {index}
          </span>
          <div className="flex-1 text-sm text-slate-800 text-justify leading-relaxed">
            <Prose>{questionText}</Prose>
          </div>
        </div>
      </div>

      {hasOptions && (
        <div className="px-4 py-2 grid gap-1.5">
          {optionLines.map((opt, i) => (
            <div key={i} className="text-sm text-slate-700 px-3 py-2 rounded-lg border border-slate-100 bg-slate-50/60">
              {opt}
            </div>
          ))}
        </div>
      )}

      <div className="px-4 py-2.5 flex items-center gap-3">
        <button
          onClick={() => setShow(!show)}
          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
            show
              ? 'border-green-300 bg-green-50 text-green-700'
              : 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100'
          }`}
        >
          {show ? '▲ Ocultar respuesta' : '▼ Ver respuesta'}
        </button>
      </div>

      {show && (
        <div className="px-4 pb-4">
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-4 h-4 rounded-full bg-green-200 flex items-center justify-center">
                <span className="text-green-700 text-[10px] font-bold">✓</span>
              </span>
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Respuesta</span>
            </div>
            <div className="text-sm text-slate-800 [&_strong]:font-semibold [&_strong]:text-green-900">
              <Prose className="text-slate-700">{question.respuesta}</Prose>
            </div>
          </div>
        </div>
      )}
    </div>
  )
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
  const [audioOpen, setAudioOpen] = useState(false)
  const [slidesOpen, setSlidesOpen] = useState(false)

  const isAudio = !!(lesson.video_url && /\.(mp3|m4a|ogg|wav|aac)(\?|$)/i.test(lesson.video_url))

  const hasAiContent = !!(
    lesson.ai_summary ||
    (lesson.ai_key_concepts && lesson.ai_key_concepts.length > 0) ||
    (lesson.ai_mnemonics && lesson.ai_mnemonics.length > 0) ||
    (lesson.ai_high_yield && lesson.ai_high_yield.length > 0)
  )

  const durationStr = lesson.duration_seconds
    ? `${Math.floor(lesson.duration_seconds / 60)} min`
    : null

  return (
    <>
      {slidesOpen && (
        <LessonSlidesModal lesson={lesson} onClose={() => setSlidesOpen(false)} />
      )}

      <div className={`rounded-xl border transition-colors ${
        lesson.isWatched ? 'border-green-200 bg-green-50/30' : 'border-slate-200 bg-white'
      }`}>
        {/* ── Row header ── */}
        <div className="flex items-center gap-3 px-4 py-3.5">
          <button
            onClick={() => onToggleWatched(lesson.id, !lesson.isWatched)}
            className="flex-shrink-0 transition-colors"
            title={lesson.isWatched ? 'Marcar como no visto' : 'Marcar como visto'}
          >
            {lesson.isWatched
              ? <CheckCircle2 className="w-5 h-5 text-green-500" />
              : <Circle className="w-5 h-5 text-slate-300 hover:text-slate-400" />}
          </button>

          <span className="text-xs text-slate-400 w-6 flex-shrink-0 tabular-nums font-medium">{lesson.order_index}</span>

          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium leading-snug ${lesson.isWatched ? 'text-slate-400 line-through decoration-slate-300' : 'text-slate-800'}`}>
              {lesson.title}
            </p>
            {durationStr && (
              <div className="flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span className="text-xs text-slate-400">{durationStr}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            {lesson.video_url && isAudio && (
              <button
                onClick={() => {
                  setAudioOpen(!audioOpen)
                  if (!lesson.isWatched) onToggleWatched(lesson.id, true)
                }}
                className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${
                  audioOpen
                    ? 'border-blue-300 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                <Play className="w-3 h-3" />
                Audio
              </button>
            )}
            {lesson.video_url && !isAudio && (
              <a
                href={lesson.video_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => !lesson.isWatched && onToggleWatched(lesson.id, true)}
              >
                <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs">
                  <Play className="w-3 h-3" />
                  Ver
                </Button>
              </a>
            )}
            {hasAiContent && (
              <button
                onClick={() => setSlidesOpen(true)}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 font-medium transition-colors"
                title="Ver en modo slides"
              >
                <Layers className="w-3 h-3" />
                Slides
              </button>
            )}
            {hasAiContent && (
              <button
                onClick={() => setOpen(!open)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                title="Ver material de estudio"
              >
                {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* ── Inline Audio Player ── */}
        {audioOpen && isAudio && lesson.video_url && (
          <div className="border-t border-slate-100 px-5 py-4 bg-blue-50/40">
            <div className="flex items-center gap-2 mb-2">
              <Play className="w-3.5 h-3.5 text-blue-500" />
              <span className="text-xs font-semibold text-blue-700">Reproduciendo</span>
            </div>
            <audio
              controls
              autoPlay
              controlsList="nodownload"
              className="w-full h-9"
              style={{ accentColor: '#2563eb' }}
              onEnded={() => !lesson.isWatched && onToggleWatched(lesson.id, true)}
            >
              <source src={lesson.video_url} type="audio/mpeg" />
              Tu navegador no soporta la reproducción de audio.
            </audio>
          </div>
        )}

        {/* ── AI Study Material (expanded view) ── */}
        {open && hasAiContent && (
          <div className="border-t border-slate-100">

            {/* Summary */}
            {lesson.ai_summary && (
              <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                <SectionHeader icon={FileText} label="Resumen" color="bg-blue-50 text-blue-700" />
                <div className="text-sm text-slate-700">
                  <Prose>{lesson.ai_summary}</Prose>
                </div>
              </div>
            )}

            {/* Key concepts */}
            {lesson.ai_key_concepts && lesson.ai_key_concepts.length > 0 && (
              <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                <SectionHeader icon={BookOpen} label="Conceptos clave" color="bg-indigo-50 text-indigo-700" />
                <div className="space-y-2">
                  {lesson.ai_key_concepts.map((c: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-indigo-50/50 border border-indigo-100 rounded-lg px-4 py-3">
                      <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-600 text-[10px] font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="text-sm text-slate-700 flex-1">
                        <Prose>{c}</Prose>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mnemonics */}
            {lesson.ai_mnemonics && lesson.ai_mnemonics.length > 0 && (
              <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                <SectionHeader icon={Brain} label="Nemotecnias" color="bg-amber-50 text-amber-700" />
                <div className="space-y-3">
                  {lesson.ai_mnemonics.map((m: any, i: number) => (
                    <div key={i} className="bg-amber-50 border border-amber-200 rounded-xl overflow-hidden">
                      <div className="px-4 py-2 bg-amber-100/60 border-b border-amber-200">
                        <span className="text-xs text-amber-700 font-medium">{m.para}</span>
                      </div>
                      <div className="px-4 py-3">
                        <p className="font-bold text-amber-900 text-sm mb-2">"{m.nemotecnia}"</p>
                        <p className="text-xs text-amber-800 text-justify leading-relaxed">{m.explicacion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* High yield */}
            {lesson.ai_high_yield && lesson.ai_high_yield.length > 0 && (
              <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                <SectionHeader icon={Target} label="Puntos clave EUNACOM" color="bg-red-50 text-red-700" />
                <div className="space-y-2">
                  {lesson.ai_high_yield.map((p: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 bg-red-50/50 border border-red-100 rounded-lg px-4 py-3">
                      <span className="text-red-500 font-bold text-sm flex-shrink-0 mt-0.5">★</span>
                      <div className="text-sm text-slate-700 flex-1">
                        <Prose>{p}</Prose>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Algorithms */}
            {lesson.ai_algorithms && lesson.ai_algorithms.length > 0 && (
              <div className="px-5 pt-5 pb-4 border-b border-slate-100">
                <SectionHeader icon={Cpu} label="Algoritmos clínicos" color="bg-slate-100 text-slate-700" />
                <div className="space-y-1.5">
                  {lesson.ai_algorithms.map((a: string, i: number) => (
                    <div key={i} className="font-mono text-xs bg-slate-900 text-emerald-400 px-4 py-2.5 rounded-lg border border-slate-700 leading-relaxed">{a}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Review questions */}
            {lesson.ai_review_qs && lesson.ai_review_qs.length > 0 && (
              <div className="px-5 pt-5 pb-5">
                <SectionHeader icon={MessageSquare} label="Preguntas de repaso" color="bg-green-50 text-green-700" />
                <div className="space-y-3">
                  {lesson.ai_review_qs.map((q: any, i: number) => (
                    <ReviewQuestion key={i} question={q} index={i + 1} />
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </div>
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SpecialtyDetailPage() {
  // FIX: use useParams() instead of use(params) — React 18 / Next.js 14
  const params = useParams<{ code: string }>()
  const code = params.code as string
  const searchParams = useSearchParams()
  const router = useRouter()

  const [data, setData] = useState<SpecialtyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [configOpen, setConfigOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
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
              .eq('completed', true),
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

        const loadedData: SpecialtyData = {
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
        }

        setData(loadedData)

        // Determine active tab from URL or data
        const urlTab = searchParams.get('tab')
        if (urlTab === 'lessons') {
          setActiveTab('lessons')
        } else if (urlTab === 'analytics') {
          setActiveTab('analytics')
        } else {
          setActiveTab(loadedData.exams.length > 0 ? 'quizzes' : 'lessons')
        }
      } catch (err) {
        console.error('Error loading specialty:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [code, searchParams])

  const toggleWatched = async (lessonId: number, watched: boolean) => {
    try {
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
    } catch (err) {
      console.error('Error toggling lesson:', err)
    }
  }

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

  if (loading) {
    return (
      <div className="space-y-4 max-w-4xl">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-32 rounded-lg" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-500 mb-4">Especialidad no encontrada.</p>
        <Link href="/app/specialties">
          <Button variant="outline">Volver a Especialidades</Button>
        </Link>
      </div>
    )
  }

  const watchedCount = data.lessons.filter((l) => l.isWatched).length
  const lessonPct = data.lessons.length > 0 ? Math.round((watchedCount / data.lessons.length) * 100) : 0
  const completedExams = data.exams.filter((e) => e.completedCount > 0).length
  const examPct = data.exams.length > 0 ? Math.round((completedExams / data.exams.length) * 100) : 0

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Breadcrumb */}
      <Link
        href="/app/specialties"
        className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Especialidades
      </Link>

      {/* ── Header ─────────────────────────────────────── */}
      <div className="bg-white rounded-lg border border-slate-200 p-5">
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              {data.chapterNumber && (
                <span className="text-xs px-2 py-0.5 rounded border border-slate-200 bg-slate-50 font-medium text-slate-600">
                  Capítulo {data.chapterNumber}
                </span>
              )}
              {data.chapterTitle && (
                <span className="text-xs text-slate-400">{data.chapterTitle}</span>
              )}
            </div>
            <h1 className="text-xl font-bold text-slate-900">{data.name}</h1>
            {analytics && (
              <div className="flex items-center gap-3 mt-2">
                <span className={`text-sm font-bold px-2 py-0.5 rounded border ${scoreCx(analytics.avgBest, 'badge')}`}>
                  Promedio {analytics.avgBest}%
                </span>
                {analytics.totalImprovement > 0 && (
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5" />
                    +{analytics.totalImprovement}% mejora
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Video className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Clases</span>
              <span className="ml-auto text-xs text-slate-400 tabular-nums">{watchedCount}/{data.lessons.length}</span>
            </div>
            {data.lessons.length > 0
              ? <Progress value={lessonPct} className="h-1.5 [&>div]:bg-blue-500" />
              : <p className="text-xs text-slate-400">Disponibles próximamente</p>
            }
          </div>
          <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">Cuestionarios</span>
              <span className="ml-auto text-xs text-slate-400 tabular-nums">{completedExams}/{data.exams.length}</span>
            </div>
            {data.exams.length > 0
              ? <Progress value={examPct} className={`h-1.5 ${examPct === 100 ? '[&>div]:bg-green-500' : '[&>div]:bg-blue-500'}`} />
              : <p className="text-xs text-slate-400">Sin cuestionarios aún</p>
            }
          </div>
        </div>
      </div>

      {/* ── Tabs ─────────────────────────────────────────── */}
      <Tabs value={activeTab ?? 'quizzes'} onValueChange={setActiveTab}>
        <TabsList className="bg-slate-100 border border-slate-200">
          <TabsTrigger value="quizzes" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
            <BookOpen className="w-3.5 h-3.5" />
            Cuestionarios
            {data.exams.length > 0 && (
              <span className="text-xs bg-slate-200 data-[state=active]:bg-blue-100 rounded px-1.5 font-medium text-slate-600">
                {data.exams.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="lessons" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
            <Video className="w-3.5 h-3.5" />
            Clases
            {data.lessons.length > 0 && (
              <span className="text-xs bg-slate-200 rounded px-1.5 font-medium text-slate-600">
                {data.lessons.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2 data-[state=active]:bg-white data-[state=active]:text-blue-700">
            <BarChart2 className="w-3.5 h-3.5" />
            Rendimiento
          </TabsTrigger>
        </TabsList>

        {/* ── Quizzes ──────────────────────────────────────── */}
        <TabsContent value="quizzes" className="mt-4 space-y-3">
          {data.exams.length === 0 ? (
            <div className="text-center py-16 rounded-lg border-2 border-dashed border-slate-200">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">Sin cuestionarios aún</p>
              <p className="text-xs text-slate-400 mt-1">Se habilitarán próximamente.</p>
            </div>
          ) : (
            <>
              {analytics && (
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-center">
                    <div className={`text-base font-bold tabular-nums ${scoreCx(analytics.avgBest)}`}>{analytics.avgBest}%</div>
                    <div className="text-[10px] text-slate-400">Promedio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-slate-800 tabular-nums">{completedExams}/{data.exams.length}</div>
                    <div className="text-[10px] text-slate-400">Completados</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-blue-600 tabular-nums">{analytics.totalAttempts}</div>
                    <div className="text-[10px] text-slate-400">Intentos</div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500">
                  {completedExams}/{data.exams.length} completados
                  {analytics && <> · promedio <span className={scoreCx(analytics.avgBest)}>{analytics.avgBest}%</span></>}
                </p>
                <button
                  className="text-xs px-3 py-1.5 rounded border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                  onClick={() => setConfigOpen(true)}
                >
                  Practicar todo
                </button>
              </div>

              <div className="bg-white rounded-lg border border-slate-200 overflow-hidden divide-y divide-slate-100">
                {data.exams.map((exam) => (
                  <div key={exam.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors">
                    {exam.completedCount > 0
                      ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                      : <Circle className="w-4 h-4 text-slate-300 flex-shrink-0" />}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-800">{exam.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-slate-400">{exam.question_count} preguntas</span>
                        {exam.attemptCount > 0 && (
                          <span className="text-xs text-slate-400">· {exam.attemptCount} intento{exam.attemptCount > 1 ? 's' : ''}</span>
                        )}
                        {exam.scoreHistory.length >= 2 && (() => {
                          const diff = exam.lastScore! - exam.scoreHistory[0]
                          if (diff > 3) return <span className="text-[10px] text-green-600">+{diff}%</span>
                          if (diff < -3) return <span className="text-[10px] text-red-400">{diff}%</span>
                          return null
                        })()}
                      </div>
                    </div>

                    {exam.bestScore !== null && (
                      <span className={`text-xs font-medium tabular-nums flex-shrink-0 ${scoreCx(exam.bestScore)}`}>
                        {exam.bestScore}%
                      </span>
                    )}

                    <button
                      className={`flex-shrink-0 text-xs px-3 py-1.5 rounded border transition-colors ${
                        exam.completedCount > 0
                          ? 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600'
                          : 'border-blue-600 bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                      onClick={() => router.push(`/app/exam/${exam.id}`)}
                    >
                      {exam.completedCount > 0 ? 'Repetir' : 'Iniciar'}
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </TabsContent>

        {/* ── Lessons ──────────────────────────────────────── */}
        <TabsContent value="lessons" className="mt-4">
          {data.lessons.length === 0 ? (
            <div className="text-center py-16 rounded-lg border-2 border-dashed border-slate-200">
              <Video className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600 mb-1">Clases próximamente</p>
              <p className="text-sm text-slate-400 max-w-sm mx-auto">
                Las cápsulas de audio con material de estudio se habilitarán próximamente.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm text-slate-600">
                  {watchedCount === data.lessons.length
                    ? 'Todas las clases completadas'
                    : `${data.lessons.length - watchedCount} clase${data.lessons.length - watchedCount > 1 ? 's' : ''} pendiente${data.lessons.length - watchedCount > 1 ? 's' : ''}`}
                </p>
                {watchedCount < data.lessons.length && (
                  <button
                    onClick={() => {
                      const first = data.lessons.find((l) => !l.isWatched && l.video_url)
                      if (first) window.open(first.video_url!, '_blank')
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors"
                  >
                    Continuar
                  </button>
                )}
              </div>
              {data.lessons.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} onToggleWatched={toggleWatched} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* ── Analytics ────────────────────────────────────── */}
        <TabsContent value="analytics" className="mt-4 space-y-4">
          {!analytics ? (
            <div className="text-center py-16 rounded-lg border-2 border-dashed border-slate-200">
              <BarChart2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-600">Sin datos aún</p>
              <p className="text-sm text-slate-400 mt-1 max-w-xs mx-auto">
                Completa al menos un cuestionario para ver tu rendimiento.
              </p>
              <Button size="sm" className="mt-4 bg-blue-600 hover:bg-blue-700" onClick={() => setConfigOpen(true)}>
                <Play className="w-3.5 h-3.5 mr-1.5" />
                Empezar
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: `${analytics.avgBest}%`, label: 'Promedio', cx: scoreCx(analytics.avgBest) },
                  { value: `${completedExams}/${data.exams.length}`, label: 'Completados', cx: 'text-blue-600' },
                  { value: `${analytics.totalAttempts}`, label: 'Intentos', cx: 'text-slate-700' },
                  { value: analytics.totalImprovement > 0 ? `+${analytics.totalImprovement}%` : '—', label: 'Mejora', cx: analytics.totalImprovement > 0 ? 'text-green-600' : 'text-slate-400' },
                ].map(({ value, label, cx }) => (
                  <div key={label} className="bg-white rounded-lg border border-slate-200 p-3 text-center">
                    <div className={`text-xl font-bold tabular-nums ${cx}`}>{value}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="bg-white border border-green-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-3.5 h-3.5 text-green-600" />
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Mejor resultado</span>
                  </div>
                  <p className="text-sm text-slate-800 truncate">{analytics.bestExam.title}</p>
                  <p className={`text-2xl font-bold mt-1 tabular-nums ${scoreCx(analytics.bestExam.bestScore)}`}>
                    {analytics.bestExam.bestScore}%
                  </p>
                </div>
                <div className="bg-white border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Area de mejora</span>
                  </div>
                  <p className="text-sm text-slate-800 truncate">{analytics.worstExam.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className={`text-2xl font-bold tabular-nums ${scoreCx(analytics.worstExam.bestScore)}`}>
                      {analytics.worstExam.bestScore}%
                    </p>
                    {analytics.worstExam.bestScore !== null && analytics.worstExam.bestScore < 70 && (
                      <button
                        className="text-xs px-3 py-1 rounded border border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-600 transition-colors"
                        onClick={() => router.push(`/app/exam/${analytics.worstExam.id}`)}
                      >
                        Repasar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-700 mb-3">Cuestionarios por rendimiento</h3>
                <div className="bg-white rounded-lg border border-slate-200 overflow-hidden divide-y divide-slate-100">
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
                        <div key={exam.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50/60 transition-colors">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1.5">
                              <span className="text-sm text-slate-800 truncate">{exam.title}</span>
                              {exam.attemptCount === 0 && (
                                <Badge className="text-[10px] bg-slate-100 text-slate-500 border border-slate-200 py-0 flex-shrink-0">Pendiente</Badge>
                              )}
                            </div>
                            {exam.attemptCount > 0 && (
                              <div className="flex items-center gap-2">
                                <Progress
                                  value={exam.bestScore ?? 0}
                                  className={`flex-1 h-1.5 ${
                                    (exam.bestScore ?? 0) >= 70 ? '[&>div]:bg-green-500' :
                                    (exam.bestScore ?? 0) >= 50 ? '[&>div]:bg-amber-400' :
                                    '[&>div]:bg-red-400'
                                  }`}
                                />
                                <span className={`text-xs font-bold w-9 text-right flex-shrink-0 tabular-nums ${scoreCx(exam.bestScore)}`}>
                                  {exam.bestScore}%
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {diff !== null && (
                              diff > 3
                                ? <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                                : diff < -3
                                  ? <TrendingDown className="w-3.5 h-3.5 text-red-400" />
                                  : <Minus className="w-3.5 h-3.5 text-slate-300" />
                            )}
                            {exam.attemptCount > 0 && (
                              <span className="text-[10px] text-slate-400">{exam.attemptCount} int.</span>
                            )}
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
