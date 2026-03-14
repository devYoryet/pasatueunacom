'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
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
  TrendingUp, CheckCircle, Clock,
  ArrowRight, Headphones,
} from 'lucide-react'
import {
  COURSE_CALENDAR, CHAPTER_COLORS, formatWeekRange, getCurrentCourseWeek,
  getDaysUntilCourseEnd,
  type CourseWeek,
} from '@/lib/course-calendar'
import {
  SPECIALTY_LESSONS, FREE_AI_MOCKUP, FREE_VIDEO_COUNT,
  type SpecialtyContent,
} from '@/lib/course-lessons'
import { getScoreColor, getGreeting } from '@/lib/utils'

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

interface LessonItem {
  id: number
  title: string
  order_index: number
  duration_seconds: number | null
  video_url: string | null
  is_available: boolean
}

interface SpecialtyData extends Specialty {
  exams: ExamStatus[]
  rawExams: any[]
  totalExams: number
  completedExams: number
  avgScore: number
  lessons: LessonItem[]
}

// ─── Audio Capsule Section (dark-themed, expanded inside week card) ───────────

function AudioCapsuleSectionDark({
  lessons,
  specCode,
  specName,
}: {
  lessons: LessonItem[]
  specCode: string
  specName: string
}) {
  const [playingId, setPlayingId] = useState<number | null>(null)
  const available = lessons.filter((l) => l.is_available)
  if (available.length === 0) return null

  return (
    <div className="border-t border-white/10">
      {/* Section header */}
      <div className="flex items-center gap-2.5 px-5 py-3 bg-white/5">
        <Headphones className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span className="text-sm font-semibold text-white">Cápsulas de Audio</span>
        <span className="text-white/40 text-xs ml-0.5">({available.length})</span>
        <Link
          href={`/app/specialties/${specCode}?tab=lessons`}
          className="ml-auto text-xs text-blue-400 hover:text-blue-300 font-medium transition-colors"
          onClick={(e) => e.stopPropagation()}
        >
          Ver todas →
        </Link>
      </div>
      {/* Lesson rows */}
      {available.slice(0, 5).map((lesson) => {
        const durationMin = lesson.duration_seconds ? `${Math.floor(lesson.duration_seconds / 60)} min` : null
        const isAudio = !!(lesson.video_url && /\.(mp3|m4a|ogg|wav|aac)(\?|$)/i.test(lesson.video_url))
        const isPlaying = playingId === lesson.id
        return (
          <div key={lesson.id} className="border-t border-white/5">
            <div className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/5 transition-colors">
              <span className="text-xs font-mono text-white/30 w-5 flex-shrink-0">{lesson.order_index}.</span>
              <Link
                href={`/app/lesson/${lesson.id}`}
                className="text-sm text-blue-300 hover:text-blue-200 flex-1 leading-tight transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                {lesson.title}
              </Link>
              {durationMin && (
                <span className="text-xs text-white/30 flex-shrink-0 hidden sm:block">{durationMin}</span>
              )}
              {lesson.video_url && isAudio && (
                <button
                  onClick={(e) => { e.stopPropagation(); setPlayingId(isPlaying ? null : lesson.id) }}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded border transition-colors flex-shrink-0 ${
                    isPlaying
                      ? 'border-blue-400 bg-blue-600 text-white'
                      : 'border-white/20 bg-white/5 text-white/70 hover:border-blue-400 hover:text-blue-300'
                  }`}
                >
                  <Play className="w-3 h-3" />
                  {isPlaying ? 'Pausar' : 'Escuchar'}
                </button>
              )}
              {!lesson.video_url && (
                <span className="text-xs text-white/25 flex-shrink-0">Próximamente</span>
              )}
            </div>
            {isPlaying && isAudio && lesson.video_url && (
              <div className="px-5 pb-3 bg-blue-900/20 border-t border-blue-500/20">
                <audio
                  controls autoPlay className="w-full h-9 mt-2"
                  onEnded={() => setPlayingId(null)}
                >
                  <source src={lesson.video_url} type="audio/mpeg" />
                </audio>
              </div>
            )}
          </div>
        )
      })}
      {available.length > 5 && (
        <Link
          href={`/app/specialties/${specCode}?tab=lessons`}
          className="flex items-center justify-center gap-1 py-2.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-colors border-t border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          <ChevronDown className="w-3.5 h-3.5" />
          Ver {available.length - 5} cápsulas más
        </Link>
      )}
    </div>
  )
}

// ─── Free AI Mockup Panel ─────────────────────────────────────────────────────

function AIContentPanel({ specCode }: { specCode: string }) {
  const mockup = FREE_AI_MOCKUP[specCode]
  if (!mockup) return null

  return (
    <div className="mx-5 mb-3 rounded-lg border border-blue-500/30 bg-blue-900/20 p-4 text-sm">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
        <span className="font-semibold text-blue-300 text-xs uppercase tracking-wide">
          Material IA — {mockup.lessonTitle}
        </span>
        <Badge className="ml-auto text-[10px] bg-green-900/40 text-green-400 border border-green-500/30 font-semibold">
          Gratis
        </Badge>
      </div>
      <p className="text-white/70 leading-relaxed text-xs mb-3">{mockup.summary}</p>
      <div className="mb-3">
        <div className="text-xs font-semibold text-white/60 mb-1.5">Conceptos clave</div>
        <ul className="space-y-1">
          {mockup.keyConcepts.map((c, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs text-white/60">
              <span className="text-blue-400 mt-0.5 flex-shrink-0">–</span>
              {c}
            </li>
          ))}
        </ul>
      </div>
      <div className="mb-3 bg-amber-900/20 border border-amber-500/30 rounded-lg px-3 py-2">
        <div className="text-xs font-semibold text-amber-400 mb-1">{mockup.mnemonic.text}</div>
        <div className="text-xs text-amber-300/70">{mockup.mnemonic.explanation}</div>
      </div>
      <div className="bg-[#0d1117] rounded-lg px-3 py-2">
        <div className="text-xs font-semibold text-slate-400 mb-1">Algoritmo clínico</div>
        <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono leading-relaxed">
          {mockup.clinicalAlgorithm}
        </pre>
      </div>
    </div>
  )
}

// ─── Premium Upgrade CTA ──────────────────────────────────────────────────────

function PremiumBannerDark({ count }: { count: number }) {
  return (
    <div className="mx-5 mb-3 rounded-lg border border-amber-500/30 bg-amber-900/20 p-4">
      <div className="flex items-start gap-3">
        <Lock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold text-amber-300">
            {count} {count === 1 ? 'cápsula bloqueada' : 'cápsulas bloqueadas'}
          </p>
          <p className="text-xs text-amber-400/70 mt-0.5">
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

// ─── Video Section (dark-themed) ──────────────────────────────────────────────

function VideoSectionDark({
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
    <div className="border-t border-white/10">
      <div className="flex items-center gap-2.5 px-5 py-3 bg-white/5">
        <Video className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span className="text-sm font-semibold text-white">Cápsulas de Audio ({videos.length})</span>
        {!isPremium && lockedCount > 0 && (
          <Badge className="ml-auto text-[10px] bg-amber-900/40 text-amber-400 border-amber-500/30 font-semibold">
            {FREE_VIDEO_COUNT} gratis · {lockedCount} Premium
          </Badge>
        )}
      </div>
      {hasMockup && <div className="pt-3"><AIContentPanel specCode={specCode} /></div>}
      <div>
        {visible.map((video) => {
          const isFree = video.number <= FREE_VIDEO_COUNT
          const isLocked = !isPremium && !isFree
          const watchKey = `${specCode}-v${video.number}`
          const isWatched = watchedSet.has(watchKey)
          return (
            <div
              key={video.number}
              className={`flex items-center gap-3 px-5 py-2.5 border-t border-white/5 transition-colors ${
                isLocked ? 'opacity-50' : 'hover:bg-white/5'
              }`}
            >
              <button
                disabled={isLocked}
                onClick={() => !isLocked && onToggleWatch(watchKey)}
                className="flex-shrink-0"
              >
                {isWatched
                  ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                  : isLocked
                  ? <Lock className="w-4 h-4 text-white/20" />
                  : <Circle className="w-4 h-4 text-white/20 hover:text-white/40 transition-colors" />
                }
              </button>
              <span className="text-xs font-mono text-white/30 w-5 flex-shrink-0">{video.number}.</span>
              <span className={`text-sm flex-1 leading-tight ${isWatched ? 'text-white/30 line-through' : 'text-white/80'}`}>
                {video.title}
              </span>
              {isFree && !isLocked && (
                <Badge className="text-[10px] bg-green-900/40 text-green-400 border-green-500/30 flex-shrink-0">Gratis</Badge>
              )}
              {isLocked && (
                <Badge className="text-[10px] bg-amber-900/40 text-amber-400 border-amber-500/30 flex-shrink-0">Premium</Badge>
              )}
            </div>
          )
        })}
        {videos.length > PREVIEW && !showAll && (
          <button
            onClick={() => setShowAll(true)}
            className="w-full flex items-center justify-center gap-1 py-2.5 text-xs text-blue-400 hover:text-blue-300 hover:bg-white/5 transition-colors border-t border-white/5"
          >
            <ChevronDown className="w-3.5 h-3.5" />
            Ver {videos.length - PREVIEW} más
          </button>
        )}
        {videos.length > PREVIEW && showAll && (
          <button
            onClick={() => setShowAll(false)}
            className="w-full flex items-center justify-center gap-1 py-2.5 text-xs text-white/40 hover:bg-white/5 transition-colors border-t border-white/5"
          >
            <ChevronUp className="w-3.5 h-3.5" />
            Mostrar menos
          </button>
        )}
      </div>
      {!isPremium && lockedCount > 0 && <div className="pt-2 pb-1"><PremiumBannerDark count={lockedCount} /></div>}
    </div>
  )
}

// ─── Materials Section (dark-themed with slides) ──────────────────────────────

function MaterialSectionDark({ content, isPremium }: { content: SpecialtyContent; isPremium: boolean }) {
  if (content.materials.length === 0) return null

  return (
    <div className="border-t border-white/10">
      <div className="flex items-center gap-2.5 px-5 py-3 bg-white/5">
        <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span className="text-sm font-semibold text-white">Material de apoyo</span>
      </div>
      {content.materials.map((m, i) => (
        <div key={i} className="flex items-center gap-3 px-5 py-2.5 border-t border-white/5">
          {isPremium
            ? <FileText className="w-4 h-4 text-blue-400 flex-shrink-0" />
            : <Lock className="w-4 h-4 text-white/20 flex-shrink-0" />
          }
          <span className={`text-sm ${isPremium ? 'text-white/80' : 'text-white/40'}`}>{m.title}</span>
          {!isPremium && (
            <Badge className="ml-auto text-[10px] bg-amber-900/40 text-amber-400 border-amber-500/30 font-semibold">
              Premium
            </Badge>
          )}
        </div>
      ))}
      {/* Slides placeholder */}
      <div className="flex items-center gap-3 px-5 py-2.5 border-t border-white/5">
        {isPremium
          ? <FileText className="w-4 h-4 text-purple-400 flex-shrink-0" />
          : <Lock className="w-4 h-4 text-white/20 flex-shrink-0" />
        }
        <span className={`text-sm ${isPremium ? 'text-white/80' : 'text-white/40'}`}>Slides de clases</span>
        {!isPremium && (
          <Badge className="ml-auto text-[10px] bg-amber-900/40 text-amber-400 border-amber-500/30 font-semibold">
            Premium
          </Badge>
        )}
      </div>
    </div>
  )
}

// ─── Quiz Section (dark-themed) ───────────────────────────────────────────────

function QuizSectionDark({ exams, specCode }: { exams: ExamStatus[]; specCode: string }) {
  const router = useRouter()
  const topicExams = exams.filter((e) => e.exam_type === 'topic')
  if (topicExams.length === 0) return null

  return (
    <div className="border-t border-white/10">
      <div className="flex items-center gap-2.5 px-5 py-3 bg-white/5">
        <ClipboardList className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <span className="text-sm font-semibold text-white">Cuestionarios ({topicExams.length})</span>
      </div>
      {topicExams.map((exam) => (
        <div
          key={exam.id}
          className={`flex items-center gap-3 px-5 py-2.5 border-t border-white/5 transition-colors ${
            exam.isCompleted ? 'bg-green-900/10' : 'hover:bg-white/5'
          }`}
        >
          {exam.isCompleted
            ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
            : <Circle className="w-4 h-4 text-white/20 flex-shrink-0" />
          }
          <div className="flex-1 min-w-0">
            <p className={`text-sm leading-tight ${exam.isCompleted ? 'text-white/50' : 'text-white/80'}`}>
              {exam.title}
            </p>
            <p className="text-xs text-white/30 mt-0.5">{exam.question_count || 15} preguntas</p>
          </div>
          {exam.avgScore !== null && (
            <span className={`text-xs font-bold tabular-nums flex-shrink-0 ${getScoreColor(exam.avgScore)}`}>
              {exam.avgScore}%
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/app/exam/${exam.id}`) }}
            className={`text-xs flex-shrink-0 px-3 py-1.5 rounded border transition-colors font-medium ${
              exam.isCompleted
                ? 'border-white/20 text-white/60 hover:border-blue-400 hover:text-blue-300'
                : 'border-blue-500 bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {exam.isCompleted ? 'Repasar' : 'Iniciar'}
          </button>
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
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-slate-200 last:border-0 ${isCurrent ? 'bg-blue-50 border-l-2 border-l-blue-600' : ''}`}>
        <ClipboardList className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <div className="flex-1">
          <span className="text-sm text-slate-800 font-medium">{week.topic}</span>
          <span className="text-xs text-slate-500 ml-2">S{week.week} · {dateRange}</span>
        </div>
        {isCurrent && <span className="text-xs font-semibold text-blue-700 flex-shrink-0">Esta semana</span>}
      </div>
    )
  }

  if (specialties.length === 0) return null

  const totalExams = specialties.reduce((s, sp) => s + sp.totalExams, 0)
  const completedExams = specialties.reduce((s, sp) => s + sp.completedExams, 0)
  const pct = totalExams > 0 ? Math.round((completedExams / totalExams) * 100) : 0
  const isDone = totalExams > 0 && completedExams >= totalExams
  const isStarted = completedExams > 0 && !isDone

  const content = specialties.length === 1 ? SPECIALTY_LESSONS[specialties[0].code] : null
  const totalVideos = content?.videos.length ?? 0
  const watchedVideos = totalVideos > 0
    ? content!.videos.filter((v) => watchedSet.has(`${specialties[0].code}-v${v.number}`)).length
    : 0

  return (
    <div className={`border-b border-slate-200 last:border-0 ${isCurrent ? 'border-l-2 border-l-blue-600' : ''}`}>
      {/* Row header */}
      <div
        className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
          isCurrent ? 'bg-blue-50 hover:bg-blue-100/60' : 'hover:bg-slate-100'
        }`}
        onClick={() => setOpen(!open)}
      >
        <div className="flex-shrink-0">
          {isDone
            ? <CheckCircle2 className="w-5 h-5 text-green-500" />
            : isStarted
            ? <Clock3 className={`w-5 h-5 ${color.text}`} />
            : <Circle className="w-5 h-5 text-slate-300" />
          }
        </div>
        <span className="text-xs font-mono text-slate-500 w-6 flex-shrink-0">S{week.week}</span>
        <span className="text-xs text-slate-500 w-16 flex-shrink-0 hidden sm:block">{dateRange}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-semibold ${isCurrent ? 'text-blue-700' : 'text-slate-900'}`}>
              {week.topic}
            </span>
            {isCurrent && (
              <span className="text-xs px-1.5 py-0.5 rounded border border-blue-400 bg-blue-600 font-semibold text-white hidden sm:inline">
                Esta semana
              </span>
            )}
          </div>
          <span className="text-xs text-slate-500 sm:hidden">{dateRange}</span>
        </div>

        <div className="hidden sm:flex items-center gap-3 flex-shrink-0 text-xs text-slate-500">
          {totalVideos > 0 && <span>{watchedVideos}/{totalVideos} vídeos</span>}
          {totalExams > 0 && (
            <>
              <span className="text-slate-300">·</span>
              <div className="flex items-center gap-1.5">
                <span>{completedExams}/{totalExams} cuest.</span>
                <div className="w-10">
                  <Progress value={pct} className={`h-1.5 ${isDone ? '[&>div]:bg-green-500' : '[&>div]:bg-blue-600'}`} />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 flex-shrink-0">
          {specialties.length === 1 && (
            <Link href={`/app/specialties/${specialties[0].code}`} onClick={(e) => e.stopPropagation()}>
              <span className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors rounded">
                <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </Link>
          )}
          {open
            ? <ChevronUp className="w-4 h-4 text-slate-500" />
            : <ChevronDown className="w-4 h-4 text-slate-500" />
          }
        </div>
      </div>

      {/* Expanded content — dark sober theme */}
      {open && (
        <div className="border-t border-slate-200">
          {specialties.map((spec) => {
            const lessonContent = SPECIALTY_LESSONS[spec.code]
            const hasLessons = spec.lessons.length > 0
            const hasVideos = lessonContent && lessonContent.videos.length > 0
            const hasMaterials = lessonContent && lessonContent.materials.length > 0

            return (
              <div key={spec.id} className="bg-[#1c2c3e]">
                {/* Spec header with CTA */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm">{spec.name}</h3>
                    <p className="text-white/40 text-xs mt-0.5">
                      {spec.completedExams}/{spec.totalExams} cuestionarios · {spec.lessons.length} cápsulas
                    </p>
                  </div>
                  <Link
                    href={`/app/specialties/${spec.code}`}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded border border-blue-500/60 bg-blue-600/20 text-blue-300 hover:bg-blue-600/40 hover:border-blue-400 transition-colors font-medium">
                      Abrir curso completo
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </Link>
                </div>

                {/* Audio capsules from DB */}
                {hasLessons && (
                  <AudioCapsuleSectionDark
                    lessons={spec.lessons}
                    specCode={spec.code}
                    specName={spec.name}
                  />
                )}

                {/* Static video content */}
                {lessonContent && (
                  <>
                    {!hasLessons && hasVideos && (
                      <VideoSectionDark
                        content={lessonContent}
                        specCode={spec.code}
                        isPremium={isPremium}
                        watchedSet={watchedSet}
                        onToggleWatch={onToggleWatch}
                      />
                    )}
                    {hasMaterials && (
                      <MaterialSectionDark content={lessonContent} isPremium={isPremium} />
                    )}
                  </>
                )}

                {!lessonContent && !hasLessons && (
                  <div className="px-5 py-4 border-t border-white/10">
                    <p className="text-xs text-white/30 italic">Contenido audiovisual disponible próximamente.</p>
                  </div>
                )}

                <QuizSectionDark exams={spec.exams} specCode={spec.code} />
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
    <div className="rounded-lg border border-slate-300 overflow-hidden shadow-sm">
      {/* Chapter header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left bg-[#1c2c3e] hover:bg-[#243547] transition-colors"
      >
        <div className="w-9 h-9 rounded bg-white/20 flex items-center justify-center flex-shrink-0 font-bold text-base text-white border border-white/30">
          {chapter.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-white text-sm">Capítulo {chapter.number}</span>
            {hasCurrentWeek && (
              <span className="text-xs px-2 py-0.5 rounded border border-blue-300 bg-blue-600 font-semibold text-white">En curso</span>
            )}
          </div>
          <p className="text-xs text-white/60 truncate mt-0.5">{chapter.title}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {totalExams > 0 && (
            <div className="text-right hidden sm:block">
              <div className={`text-sm font-bold tabular-nums ${chapterPct === 100 ? 'text-green-400' : 'text-white'}`}>{chapterPct}%</div>
              <div className="text-xs text-white/50">{completedExams}/{totalExams}</div>
            </div>
          )}
          {totalExams > 0 && (
            <div className="w-14 hidden sm:block">
              <Progress value={chapterPct} className={`h-1.5 bg-white/20 ${chapterPct === 100 ? '[&>div]:bg-green-400' : '[&>div]:bg-blue-400'}`} />
            </div>
          )}
          {open ? <ChevronUp className="w-4 h-4 text-white/70" /> : <ChevronDown className="w-4 h-4 text-white/70" />}
        </div>
      </button>

      {/* Mobile progress */}
      {totalExams > 0 && (
        <div className="flex items-center gap-2 px-5 py-2 bg-[#243547] sm:hidden border-t border-white/10">
          <Progress value={chapterPct} className={`flex-1 h-1.5 bg-white/20 ${chapterPct === 100 ? '[&>div]:bg-green-400' : '[&>div]:bg-blue-400'}`} />
          <span className={`text-sm font-bold ${chapterPct === 100 ? 'text-green-400' : 'text-white'}`}>{chapterPct}%</span>
        </div>
      )}

      {/* Chapter weeks */}
      {open && (
        <div className="bg-white">
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
  const [profile, setProfile] = useState<{ full_name: string } | null>(null)
  const [stats, setStats] = useState({ todayCount: 0, avgScore: 0, totalAttempts: 0 })
  const [lastIncomplete, setLastIncomplete] = useState<{ exam_id: number; title: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [configOpen, setConfigOpen] = useState(false)
  const [selectedSpec, setSelectedSpec] = useState<SpecialtyData | null>(null)
  const [watchedSet, setWatchedSet] = useState<Set<string>>(new Set())
  const [isPremium] = useState(false)

  const currentWeek = useMemo(() => getCurrentCourseWeek(), [])
  const currentWeekNum = currentWeek?.week ?? null
  const daysLeft = useMemo(() => getDaysUntilCourseEnd(), [])

  const courseProgress = useMemo(() => {
    const total = Object.values(specialtyMap).reduce((s, sp) => s + sp.totalExams, 0)
    const done = Object.values(specialtyMap).reduce((s, sp) => s + sp.completedExams, 0)
    return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
  }, [specialtyMap])

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

      const today = new Date(); today.setHours(0, 0, 0, 0)

      const [profileRes, specsRes, examsRes, attRes, todayRes, incompleteRes, lessonsRes] = await Promise.all([
        user
          ? supabase.from('profiles').select('full_name').eq('id', user.id).single()
          : Promise.resolve({ data: null }),
        supabase.from('specialties').select('*, eunacom_areas(*)').order('order_index'),
        supabase.from('exams').select('id, title, specialty_id, exam_type, question_count, order_index').eq('is_active', true).order('order_index'),
        user
          ? supabase.from('attempts').select('exam_id, score_percent, finished_at').eq('user_id', user.id).eq('is_completed', true).order('finished_at', { ascending: false }).limit(200)
          : Promise.resolve({ data: [] }),
        user
          ? supabase.from('attempts').select('id').eq('user_id', user.id).eq('is_completed', true).gte('finished_at', today.toISOString())
          : Promise.resolve({ data: [] }),
        user
          ? supabase.from('attempts').select('exam_id, exams(title)').eq('user_id', user.id).eq('is_completed', false).order('started_at', { ascending: false }).limit(1).maybeSingle()
          : Promise.resolve({ data: null }),
        supabase.from('lessons').select('id, title, order_index, duration_seconds, video_url, is_available, specialty_id').eq('is_available', true).order('order_index'),
      ])

      const specs = (specsRes.data ?? []) as any[]
      const exams = (examsRes.data ?? []) as any[]
      const attempts = (attRes.data ?? []) as { exam_id: number; score_percent: number | null; finished_at: string }[]
      const allLessons = (lessonsRes.data ?? []) as any[]

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
        const specLessons = allLessons.filter((l: any) => l.specialty_id === spec.id)

        map[spec.code] = {
          ...spec,
          exams: examsWithStatus,
          rawExams: specExams,
          totalExams: topicExams.length,
          completedExams: completedTopicCount,
          avgScore,
          lessons: specLessons,
        }
      }

      const avgScore = attempts.length > 0
        ? Math.round(attempts.reduce((s, a) => s + (a.score_percent ?? 0), 0) / attempts.length)
        : 0

      const inc = incompleteRes.data as any

      setProfile(profileRes.data)
      setSpecialtyMap(map)
      setStats({
        todayCount: (todayRes.data as any[])?.length ?? 0,
        avgScore,
        totalAttempts: attempts.length,
      })
      setLastIncomplete(inc ? { exam_id: inc.exam_id, title: inc.exams?.title ?? 'Examen' } : null)
      setLoading(false)
    }

    load()
  }, [])

  if (loading) {
    return (
      <div className="space-y-5 max-w-4xl">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-20 rounded-2xl" />
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
      </div>
    )
  }

  const firstName = profile?.full_name?.split(' ')[0] ?? ''

  return (
    <div className="space-y-5 max-w-4xl">

        {/* Greeting + overall progress */}
        <div>
          <h1 className="text-xl font-bold text-slate-900">
            {getGreeting()}{firstName ? `, ${firstName}` : ''}
          </h1>
          <p className="text-slate-500 text-sm mt-0.5">
            EUNACOM Julio 2026
            {daysLeft !== null && daysLeft > 0 && (
              <span className="ml-1 text-slate-700 font-medium">· {daysLeft} días restantes</span>
            )}
            {currentWeek && (
              <span className="ml-1 text-slate-400">· Semana {currentWeek.week}: {currentWeek.topic}</span>
            )}
          </p>
        </div>

        {/* Global progress bar */}
        {courseProgress.total > 0 && (
          <div className="flex items-center gap-3">
            <Progress value={courseProgress.pct} className="flex-1 h-2.5 [&>div]:bg-blue-500" />
            <span className="text-sm font-bold text-blue-700 flex-shrink-0 w-10 text-right">{courseProgress.pct}%</span>
            <span className="text-xs text-slate-400 flex-shrink-0">{courseProgress.done}/{courseProgress.total} cuest.</span>
          </div>
        )}

        {/* Continue banner */}
        {lastIncomplete && (
          <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
            <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-medium text-slate-800 truncate">{lastIncomplete.title}</span>
              <span className="text-xs text-slate-400 ml-2">Sin terminar</span>
            </div>
            <Link href={`/app/exam/${lastIncomplete.exam_id}`}>
              <Button size="sm" className="gap-1.5 flex-shrink-0">
                Continuar <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        )}

        {/* Stats strip */}
        {stats.totalAttempts > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: stats.todayCount,      l: 'Hoy',      icon: CheckCircle, cx: 'text-blue-700' },
              { v: `${stats.avgScore}%`,  l: 'Promedio', icon: TrendingUp,  cx: 'text-green-700' },
              { v: stats.totalAttempts,   l: 'Total',    icon: BookOpen,    cx: 'text-slate-700' },
            ].map(({ v, l, icon: Icon, cx }) => (
              <div key={l} className="bg-white rounded-lg border border-slate-200 p-3 text-center shadow-sm">
                <Icon className={`w-3.5 h-3.5 mx-auto mb-1.5 ${cx}`} size={14} />
                <div className={`text-base font-bold tabular-nums ${cx}`}>{v}</div>
                <div className="text-[11px] text-slate-500 font-medium">{l}</div>
              </div>
            ))}
          </div>
        )}

        {/* General section */}
        <div className="bg-white rounded-lg border border-slate-300 overflow-hidden shadow-sm">
          <div className="px-5 py-3 border-b border-slate-300 flex items-center gap-3 bg-slate-200">
            <BookOpen className="w-4 h-4 text-slate-600" />
            <span className="font-semibold text-slate-800 text-sm">General</span>
          </div>
          <div>
            <Link
              href="/app/calendar"
              className="flex items-center gap-3 px-5 py-3 border-b border-slate-200 hover:bg-slate-50 transition-colors group"
            >
              <CalendarDays className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <span className="text-sm text-slate-800 group-hover:text-blue-700 transition-colors flex-1">Calendario del Curso</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </Link>
            <div className="flex items-center gap-3 px-5 py-3 border-b border-slate-200 text-slate-500">
              <Bell className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Avisos del curso</span>
            </div>
            <div className="flex items-center gap-3 px-5 py-3">
              <Target className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-slate-800">Prueba diagnóstica: Reconstrucción Eunacom agosto 2021</span>
                <div className="text-xs text-slate-500 mt-0.5">09 ene 2026 · 180 preguntas</div>
              </div>
              <Badge className="bg-amber-100 text-amber-800 border border-amber-300 text-xs font-semibold">Diagnóstica</Badge>
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

