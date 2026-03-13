'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ConfigModal from '@/components/quiz/ConfigModal'
import type { Specialty } from '@/lib/supabase/types'
import {
  BookOpen, Play, CheckCircle2, Clock3, Circle,
  ChevronDown, ChevronUp, ExternalLink, Lock, Sparkles,
  Video, FileText, ClipboardList,
  ChevronRight, CalendarDays, Bell, Target,
} from 'lucide-react'
import {
  COURSE_CALENDAR, CHAPTER_COLORS, formatWeekRange, getCurrentCourseWeek,
  type CourseWeek,
} from '@/lib/course-calendar'
import {
  SPECIALTY_LESSONS, FREE_AI_MOCKUP, FREE_VIDEO_COUNT,
  type SpecialtyContent,
} from '@/lib/course-lessons'
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
  rawExams: any[]
  totalExams: number
  completedExams: number
  avgScore: number
}

// ─── Free AI Mockup Panel ─────────────────────────────────────────────────────

function AIContentPanel({ specCode }: { specCode: string }) {
  const mockup = FREE_AI_MOCKUP[specCode]
  if (!mockup) return null

  return (
    <div className="mx-4 mb-3 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
        <span className="font-semibold text-blue-800 text-xs uppercase tracking-wide">
          Material IA — {mockup.lessonTitle}
        </span>
        <Badge className="ml-auto text-[10px] bg-green-100 text-green-700 border border-green-200 font-semibold">
          Gratis
        </Badge>
      </div>

      <p className="text-slate-700 leading-relaxed text-xs mb-3">{mockup.summary}</p>

      <div className="mb-3">
        <div className="text-xs font-semibold text-slate-600 mb-1.5">Conceptos clave</div>
        <ul className="space-y-1">
          {mockup.keyConcepts.map((c, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">–</span>
              {c}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-3 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        <div className="text-xs font-semibold text-amber-700 mb-1">{mockup.mnemonic.text}</div>
        <div className="text-xs text-amber-600">{mockup.mnemonic.explanation}</div>
      </div>

      <div className="mb-3">
        <div className="text-xs font-semibold text-slate-600 mb-1.5">Alto rendimiento EUNACOM</div>
        <ul className="space-y-1">
          {mockup.highYield.map((h, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-slate-600">
              <span className="text-red-400 mt-0.5 flex-shrink-0">*</span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-slate-800 rounded-lg px-3 py-2">
        <div className="text-xs font-semibold text-slate-300 mb-1">Algoritmo clínico</div>
        <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono leading-relaxed">
          {mockup.clinicalAlgorithm}
        </pre>
      </div>
    </div>
  )
}

// ─── Premium Upgrade CTA ──────────────────────────────────────────────────────

function PremiumBanner({ count }: { count: number }) {
  return (
    <div className="mx-4 mb-3 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-900">
            {count} {count === 1 ? 'cápsula bloqueada' : 'cápsulas bloqueadas'}
          </p>
          <p className="text-xs text-amber-700 mt-0.5">
            Acceso Premium: resúmenes IA, nemotecnias, algoritmos clínicos y todos los cuestionarios.
          </p>
        </div>
        <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white text-xs flex-shrink-0">
          Ver planes
        </Button>
      </div>
    </div>
  )
}

// ─── Video List Section ───────────────────────────────────────────────────────

function VideoSection({
  content,
  specCode,
  isPremium,
  watchedSet,
  onToggleWatch,
}: {
  content: SpecialtyContent
  specCode: string
  isPremium: boolean
  watchedSet: Set<string>
  onToggleWatch: (key: string) => void
}) {
  const [showAll, setShowAll] = useState(false)
  const PREVIEW = 5

  const videos = content.videos
  const lockedCount = isPremium ? 0 : Math.max(0, videos.length - FREE_VIDEO_COUNT)
  const visible = showAll ? videos : videos.slice(0, PREVIEW)
  const hasMockup = !!FREE_AI_MOCKUP[specCode]

  if (videos.length === 0) return null

  return (
    <div className="border-t border-slate-100">
      {/* Section header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50/80 border-b border-slate-100">
        <Video className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Videos ({videos.length})
        </span>
        {!isPremium && lockedCount > 0 && (
          <Badge className="ml-auto text-[10px] bg-amber-100 text-amber-700 border-amber-200">
            {FREE_VIDEO_COUNT} gratis · {lockedCount} Premium
          </Badge>
        )}
      </div>

      {/* Free AI mockup for first video */}
      {hasMockup && (
        <div className="pt-3">
          <AIContentPanel specCode={specCode} />
        </div>
      )}

      {/* Video list */}
      <div>
        {visible.map((video) => {
          const isFree = video.number <= FREE_VIDEO_COUNT
          const isLocked = !isPremium && !isFree
          const watchKey = `${specCode}-v${video.number}`
          const isWatched = watchedSet.has(watchKey)

          return (
            <div
              key={video.number}
              className={`flex items-center gap-3 px-4 py-2 border-b border-slate-50 last:border-0 transition-colors ${
                isLocked ? 'opacity-50' : 'hover:bg-slate-50/60'
              }`}
            >
              {/* Watch toggle */}
              <button
                disabled={isLocked}
                onClick={() => !isLocked && onToggleWatch(watchKey)}
                className="flex-shrink-0"
              >
                {isWatched
                  ? <CheckCircle2 className="w-4 h-4 text-green-500" />
                  : isLocked
                  ? <Lock className="w-4 h-4 text-slate-300" />
                  : <Circle className="w-4 h-4 text-slate-200 hover:text-slate-400 transition-colors" />
                }
              </button>

              {/* Video number */}
              <span className="text-xs font-mono text-slate-400 w-5 flex-shrink-0">{video.number}.</span>

              {/* Title */}
              <span className={`text-sm flex-1 leading-tight ${isWatched ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                {video.title}
              </span>

              {/* Tags */}
              {isFree && !isLocked && (
                <Badge className="text-[10px] bg-green-50 text-green-600 border-green-100 flex-shrink-0">
                  Gratis
                </Badge>
              )}
              {isLocked && (
                <Badge className="text-[10px] bg-amber-50 text-amber-600 border-amber-100 flex-shrink-0">
                  Premium
                </Badge>
              )}
            </div>
          )
        })}

        {/* Show more / less */}
        {videos.length > PREVIEW && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full flex items-center justify-center gap-1 py-2 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 transition-colors"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Ver {videos.length - PREVIEW} videos más
          </button>
        )}
        {videos.length > PREVIEW && showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="w-full flex items-center justify-center gap-1 py-2 text-xs text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            Mostrar menos
          </button>
        )}
      </div>

      {/* Related topics */}
      {content.relatedTopics && content.relatedTopics.length > 0 && (
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/50">
          <p className="text-xs font-semibold text-slate-500 mb-1.5">Temas relacionados</p>
          {content.relatedTopics.map((t) => (
            <div key={t.number} className="flex items-center gap-2 py-1">
              <Circle className="w-3 h-3 text-slate-200 flex-shrink-0" />
              <span className="text-xs text-slate-600">{t.number}.- {t.title}</span>
            </div>
          ))}
        </div>
      )}

      {/* Notes */}
      {content.notes && (
        <div className="px-4 py-2 border-t border-slate-100">
          <p className="text-xs text-slate-400 italic">{content.notes}</p>
        </div>
      )}

      {/* Premium upsell */}
      {!isPremium && lockedCount > 0 && (
        <div className="pt-2 pb-1">
          <PremiumBanner count={lockedCount} />
        </div>
      )}
    </div>
  )
}

// ─── Materials Section ────────────────────────────────────────────────────────

function MaterialSection({ content, isPremium }: { content: SpecialtyContent; isPremium: boolean }) {
  if (content.materials.length === 0) return null

  return (
    <div className="border-t border-slate-100">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50/80 border-b border-slate-100">
        <FileText className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Material de apoyo
        </span>
      </div>
      {content.materials.map((m, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b border-slate-50 last:border-0">
          {isPremium
            ? <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
            : <Lock className="w-4 h-4 text-slate-300 flex-shrink-0" />
          }
          <span className={`text-sm ${isPremium ? 'text-slate-700' : 'text-slate-400'}`}>{m.title}</span>
          {!isPremium && (
            <Badge className="ml-auto text-[10px] bg-amber-50 text-amber-600 border-amber-100">
              Premium
            </Badge>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Quiz Section ─────────────────────────────────────────────────────────────

function QuizSection({ exams }: { exams: ExamStatus[] }) {
  const topicExams = exams.filter((e) => e.exam_type === 'topic')
  if (topicExams.length === 0) return null

  return (
    <div className="border-t border-slate-100">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-50/80 border-b border-slate-100">
        <ClipboardList className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Pruebas ({topicExams.length})
        </span>
      </div>
      {topicExams.map((exam) => (
        <div
          key={exam.id}
          className={`flex items-center gap-3 px-4 py-2.5 border-b border-slate-50 last:border-0 transition-colors ${
            exam.isCompleted ? 'bg-green-50/20' : 'hover:bg-slate-50/50'
          }`}
        >
          {exam.isCompleted
            ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            : <Circle className="w-4 h-4 text-slate-200 flex-shrink-0" />
          }
          <div className="flex-1 min-w-0">
            <p className={`text-sm leading-tight ${exam.isCompleted ? 'text-slate-500' : 'text-slate-700'}`}>
              {exam.title}
            </p>
            <p className="text-xs text-slate-400 mt-0.5">{exam.question_count || 15} preguntas</p>
          </div>
          {exam.avgScore !== null && (
            <span className={`text-xs font-bold tabular-nums ${getScoreColor(exam.avgScore)}`}>
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
      ))}
    </div>
  )
}

// ─── Specialty / Week Row ─────────────────────────────────────────────────────

function SpecialtyWeekRow({
  week,
  specialties,
  isCurrent,
  color,
  isPremium,
  watchedSet,
  onToggleWatch,
  onPracticeAll,
}: {
  week: CourseWeek
  specialties: SpecialtyData[]
  isCurrent: boolean
  color: typeof CHAPTER_COLORS[keyof typeof CHAPTER_COLORS]
  isPremium: boolean
  watchedSet: Set<string>
  onToggleWatch: (key: string) => void
  onPracticeAll: (spec: SpecialtyData) => void
}) {
  const [open, setOpen] = useState(isCurrent)
  const dateRange = formatWeekRange(week.start, week.end)

  if (week.isRepaso) {
    return (
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-slate-100 last:border-0 ${isCurrent ? 'bg-blue-50/40' : ''}`}>
        <ClipboardList className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <div className="flex-1">
          <span className="text-sm text-slate-700">{week.topic}</span>
          <span className="text-xs text-slate-400 ml-2">S{week.week} · {dateRange}</span>
        </div>
        {isCurrent && <span className="text-xs font-semibold text-blue-600 flex-shrink-0">Esta semana</span>}
      </div>
    )
  }

  if (specialties.length === 0) return null

  const totalExams = specialties.reduce((s, sp) => s + sp.totalExams, 0)
  const completedExams = specialties.reduce((s, sp) => s + sp.completedExams, 0)
  const pct = totalExams > 0 ? Math.round((completedExams / totalExams) * 100) : 0
  const isDone = totalExams > 0 && completedExams >= totalExams
  const isStarted = completedExams > 0 && !isDone

  // Video watch progress
  const content = specialties.length === 1 ? SPECIALTY_LESSONS[specialties[0].code] : null
  const totalVideos = content?.videos.length ?? 0
  const watchedVideos = totalVideos > 0
    ? content!.videos.filter((v) => watchedSet.has(`${specialties[0].code}-v${v.number}`)).length
    : 0

  return (
    <div className={`border-b border-slate-100 last:border-0 ${isCurrent ? 'bg-blue-50/30' : ''}`}>
      {/* Row header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50/60 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <div className="flex-shrink-0">
          {isDone
            ? <CheckCircle2 className="w-5 h-5 text-green-500" />
            : isStarted
            ? <Clock3 className={`w-5 h-5 ${color.text}`} />
            : <Circle className="w-5 h-5 text-slate-200" />
          }
        </div>

        <span className="text-xs font-mono text-slate-400 w-6 flex-shrink-0">S{week.week}</span>
        <span className="text-xs text-slate-400 w-16 flex-shrink-0 hidden sm:block">{dateRange}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-medium ${isCurrent ? 'text-blue-700' : 'text-slate-800'}`}>
              {week.topic}
            </span>
            {isCurrent && (
              <span className="text-xs px-1.5 py-0.5 rounded border border-blue-200 bg-blue-50 font-medium text-blue-700 hidden sm:inline">
                Esta semana
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 sm:hidden">{dateRange}</span>
        </div>

        {/* Stats (desktop) */}
        <div className="hidden sm:flex items-center gap-3 flex-shrink-0 text-xs text-slate-400">
          {totalVideos > 0 && (
            <span>{watchedVideos}/{totalVideos} vídeos</span>
          )}
          {totalExams > 0 && (
            <>
              <span className="text-slate-200">·</span>
              <div className="flex items-center gap-1.5">
                <span>{completedExams}/{totalExams} cuest.</span>
                <div className="w-10">
                  <Progress value={pct} className={`h-1.5 ${isDone ? '[&>div]:bg-green-500' : color.progress}`} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {specialties.length === 1 && (
            <Link href={`/app/specialties/${specialties[0].code}`} onClick={(e) => e.stopPropagation()}>
              <span className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors rounded">
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </Link>
          )}
          {open
            ? <ChevronUp className="w-4 h-4 text-slate-300" />
            : <ChevronDown className="w-4 h-4 text-slate-300" />
          }
        </div>
      </div>

      {/* Expanded content */}
      {open && (
        <div className="bg-white/80">
          {specialties.map((spec) => {
            const lessonContent = SPECIALTY_LESSONS[spec.code]
            return (
              <div key={spec.id}>
                {lessonContent && (
                  <>
                    <VideoSection
                      content={lessonContent}
                      specCode={spec.code}
                      isPremium={isPremium}
                      watchedSet={watchedSet}
                      onToggleWatch={onToggleWatch}
                    />
                    <MaterialSection content={lessonContent} isPremium={isPremium} />
                  </>
                )}
                {!lessonContent && (
                  <div className="px-4 py-3 border-t border-slate-100">
                    <p className="text-xs text-slate-400 italic">Contenido audiovisual disponible próximamente.</p>
                  </div>
                )}
                <QuizSection exams={spec.exams} />
              </div>
            )
          })}
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
  isPremium,
  watchedSet,
  onToggleWatch,
  onPracticeAll,
}: {
  chapter: typeof COURSE_CALENDAR.chapters[0]
  specialtyMap: Record<string, SpecialtyData>
  currentWeekNum: number | null
  defaultOpen: boolean
  isPremium: boolean
  watchedSet: Set<string>
  onToggleWatch: (key: string) => void
  onPracticeAll: (spec: SpecialtyData) => void
}) {
  const [open, setOpen] = useState(defaultOpen)
  const color = CHAPTER_COLORS[chapter.color]
  const hasCurrentWeek = chapter.weeks.some((w) => w.week === currentWeekNum)

  const uniqueCodes = [...new Set(chapter.weeks.flatMap((w) => w.specialtyCodes))]
  const specs = uniqueCodes.map((c) => specialtyMap[c]).filter(Boolean)
  const totalExams = specs.reduce((s, sp) => s + sp.totalExams, 0)
  const completedExams = specs.reduce((s, sp) => s + sp.completedExams, 0)
  const chapterPct = totalExams > 0 ? Math.round((completedExams / totalExams) * 100) : 0

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      {/* Chapter header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left bg-slate-50 hover:bg-slate-100 transition-colors border-b border-slate-200"
      >
        <div className={`w-8 h-8 rounded ${color.badge} flex items-center justify-center flex-shrink-0 font-bold text-sm`}>
          {chapter.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-800 text-sm">Capítulo {chapter.number}</span>
            {hasCurrentWeek && (
              <span className="text-xs px-2 py-0.5 rounded border border-blue-200 bg-blue-50 font-medium text-blue-700">En curso</span>
            )}
          </div>
          <p className="text-xs text-slate-500 truncate mt-0.5">{chapter.title}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {totalExams > 0 && (
            <div className="text-right hidden sm:block">
              <div className={`text-sm font-bold tabular-nums ${chapterPct === 100 ? 'text-green-600' : 'text-slate-700'}`}>{chapterPct}%</div>
              <div className="text-xs text-slate-400">{completedExams}/{totalExams}</div>
            </div>
          )}
          {totalExams > 0 && (
            <div className="w-14 hidden sm:block">
              <Progress value={chapterPct} className={`h-1.5 ${chapterPct === 100 ? '[&>div]:bg-green-500' : '[&>div]:bg-blue-500'}`} />
            </div>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </button>

      {/* Mobile progress */}
      {totalExams > 0 && (
        <div className="flex items-center gap-2 px-5 pb-3 bg-slate-50 sm:hidden">
          <Progress value={chapterPct} className={`flex-1 h-1.5 ${chapterPct === 100 ? '[&>div]:bg-green-500' : '[&>div]:bg-blue-500'}`} />
          <span className={`text-sm font-bold ${chapterPct === 100 ? 'text-green-600' : 'text-slate-700'}`}>{chapterPct}%</span>
        </div>
      )}

      {/* Chapter weeks */}
      {open && (
        <div className="border-t border-slate-100 bg-white">
          {chapter.weeks.map((week) => {
            const weekSpecs = week.specialtyCodes.map((c) => specialtyMap[c]).filter(Boolean)
            return (
              <SpecialtyWeekRow
                key={week.week}
                week={week}
                specialties={weekSpecs}
                isCurrent={week.week === currentWeekNum}
                color={color}
                isPremium={isPremium}
                watchedSet={watchedSet}
                onToggleWatch={onToggleWatch}
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
  // Local video watch tracking (persisted in localStorage)
  const [watchedSet, setWatchedSet] = useState<Set<string>>(new Set())
  // In production this comes from the enrollment/profile; for now demo free
  const [isPremium] = useState(false)

  const currentWeek = useMemo(() => getCurrentCourseWeek(), [])
  const currentWeekNum = currentWeek?.week ?? null

  // Load watched videos from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('watched_videos')
      if (saved) setWatchedSet(new Set(JSON.parse(saved)))
    } catch {
      // ignore
    }
  }, [])

  const handleToggleWatch = (key: string) => {
    setWatchedSet((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key); else next.add(key)
      try { localStorage.setItem('watched_videos', JSON.stringify([...next])) } catch {}
      return next
    })
  }

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const [specsRes, examsRes, attRes] = await Promise.all([
        supabase.from('specialties').select('*, eunacom_areas(*)').order('order_index'),
        supabase.from('exams').select('id, title, specialty_id, exam_type, question_count, order_index').eq('is_active', true).order('order_index'),
        user
          ? supabase.from('attempts').select('exam_id, score_percent').eq('user_id', user.id).eq('is_completed', true)
          : Promise.resolve({ data: [] }),
      ])

      const specs = (specsRes.data ?? []) as any[]
      const exams = (examsRes.data ?? []) as any[]
      const attempts = (attRes.data ?? []) as { exam_id: number; score_percent: number | null }[]

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

  if (loading) {
    return (
      <div className="space-y-5 max-w-4xl">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-20 rounded-2xl" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
    )
  }

  return (
    <div className="space-y-5 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="section-title">Contenido del Curso</h1>
        <p className="text-slate-500 text-sm mt-1">
          EUNACOM Julio 2026 — Organizado por semana del calendario
        </p>
      </div>

      {/* General section */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <BookOpen className="w-4 h-4 text-slate-500" />
          <span className="font-semibold text-slate-800 text-sm">General</span>
        </div>
        <div>
          <Link
            href="/app/calendar"
            className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 hover:bg-slate-50 transition-colors group"
          >
            <CalendarDays className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-sm text-slate-700 group-hover:text-blue-600 transition-colors flex-1">Calendario del Curso</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          </Link>
          <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-100 text-slate-400">
            <Bell className="w-4 h-4 flex-shrink-0" />
            <span className="text-sm">Avisos del curso</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-3">
            <Target className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div className="flex-1">
              <span className="text-sm text-slate-700">Prueba diagnóstica: Reconstrucción Eunacom agosto 2021</span>
              <div className="text-xs text-slate-400 mt-0.5">09 ene 2026 · 180 preguntas</div>
            </div>
            <Badge className="bg-amber-50 text-amber-700 border border-amber-200 text-xs">Diagnóstica</Badge>
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
            isPremium={isPremium}
            watchedSet={watchedSet}
            onToggleWatch={handleToggleWatch}
            onPracticeAll={(spec) => {
              setSelectedSpec(spec)
              setConfigOpen(true)
            }}
          />
        )
      })}

      {/* Config modal */}
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
