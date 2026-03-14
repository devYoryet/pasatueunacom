'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import GadgetSidebar from '@/components/layout/GadgetSidebar'
import {
  ChevronLeft, ChevronRight, Clock, Play, Pause,
  Lightbulb, Star, BookOpen, BarChart3, FileText, ChevronDown, ChevronUp,
  Brain, CheckCircle2, Circle, Target,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LessonFull {
  id: number
  title: string
  order_index: number
  duration_seconds: number | null
  video_url: string | null
  txt_content: string | null
  ai_summary: string | null
  ai_key_concepts: string[] | null
  ai_mnemonics: { para: string; nemotecnia: string; explicacion: string }[] | null
  ai_high_yield: string[] | null
  ai_algorithms: string[] | null
  ai_review_qs: { pregunta: string; respuesta: string }[] | null
  specialty_id: number
  specialties: {
    id: number
    name: string
    code: string
  } | null
}

interface NavLesson {
  id: number
  title: string
  order_index: number
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────

function Section({
  icon: Icon,
  title,
  accentColor = 'blue',
  children,
  defaultOpen = true,
}: {
  icon: any
  title: string
  accentColor?: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const colorMap: Record<string, string> = {
    blue:   'text-blue-600 bg-blue-50 border-blue-200',
    amber:  'text-amber-700 bg-amber-50 border-amber-200',
    green:  'text-green-700 bg-green-50 border-green-200',
    red:    'text-red-700 bg-red-50 border-red-200',
    purple: 'text-purple-700 bg-purple-50 border-purple-200',
    slate:  'text-slate-700 bg-slate-50 border-slate-200',
  }
  const hdr = colorMap[accentColor] ?? colorMap.blue

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left ${hdr} border-b transition-colors hover:brightness-95`}
      >
        <Icon className="w-4 h-4 flex-shrink-0" />
        <span className="font-semibold text-sm flex-1">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 opacity-60" /> : <ChevronDown className="w-4 h-4 opacity-60" />}
      </button>
      {open && <div className="bg-white p-4">{children}</div>}
    </div>
  )
}

// ─── Review Question Item ─────────────────────────────────────────────────────

function ReviewQuestion({ q, index }: { q: { pregunta: string; respuesta: string }; index: number }) {
  const [showAnswer, setShowAnswer] = useState(false)
  return (
    <div className="border border-slate-200 rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-slate-50">
        <div className="text-xs font-semibold text-slate-500 mb-1.5">Pregunta {index + 1}</div>
        <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">{q.pregunta}</pre>
      </div>
      <div className="px-4 py-2 border-t border-slate-100">
        <button
          onClick={() => setShowAnswer(!showAnswer)}
          className="text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors flex items-center gap-1"
        >
          {showAnswer ? <><ChevronUp className="w-3 h-3" /> Ocultar respuesta</> : <><ChevronDown className="w-3 h-3" /> Ver respuesta</>}
        </button>
        {showAnswer && (
          <div className="mt-3 text-xs text-slate-700 leading-relaxed bg-green-50 border border-green-100 rounded-lg px-3 py-2">
            {q.respuesta}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const router = useRouter()
  const [lesson, setLesson] = useState<LessonFull | null>(null)
  const [allLessons, setAllLessons] = useState<NavLesson[]>([])
  const [loading, setLoading] = useState(true)
  const [playing, setPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const id = parseInt(lessonId, 10)

      const { data } = await supabase
        .from('lessons')
        .select(`
          id, title, order_index, duration_seconds, video_url,
          txt_content, ai_summary, ai_key_concepts,
          ai_mnemonics, ai_high_yield, ai_algorithms, ai_review_qs,
          specialty_id,
          specialties(id, name, code)
        `)
        .eq('id', id)
        .single()

      if (!data) {
        router.push('/app/specialties')
        return
      }

      const lesson = data as any
      setLesson(lesson)

      // Load all lessons for this specialty for prev/next navigation
      const { data: siblings } = await supabase
        .from('lessons')
        .select('id, title, order_index')
        .eq('specialty_id', lesson.specialty_id)
        .eq('is_available', true)
        .order('order_index')

      setAllLessons((siblings ?? []) as NavLesson[])
      setLoading(false)
    }

    load()
  }, [lessonId, router])

  if (loading) {
    return (
      <div className="flex gap-6 max-w-[1400px]">
        <div className="flex-1 space-y-4">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-48 rounded-xl" />
        </div>
        <div className="hidden xl:block w-72 flex-shrink-0">
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!lesson) return null

  const currentIdx = allLessons.findIndex((l) => l.id === lesson.id)
  const prevLesson = currentIdx > 0 ? allLessons[currentIdx - 1] : null
  const nextLesson = currentIdx < allLessons.length - 1 ? allLessons[currentIdx + 1] : null
  const durationMin = lesson.duration_seconds ? Math.floor(lesson.duration_seconds / 60) : null
  const isAudio = !!(lesson.video_url && /\.(mp3|m4a|ogg|wav|aac)(\?|$)/i.test(lesson.video_url))
  const specName = lesson.specialties?.name ?? 'Especialidad'
  const specCode = lesson.specialties?.code ?? ''

  return (
    <div className="flex gap-6 items-start max-w-[1400px]">

      {/* ── MAIN CONTENT ────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link href="/app/specialties" className="hover:text-blue-600 transition-colors">Inicio</Link>
          <span className="text-slate-300">/</span>
          <Link href={`/app/specialties/${specCode}`} className="hover:text-blue-600 transition-colors">{specName}</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-700 font-medium">Cápsula {lesson.order_index}</span>
        </div>

        {/* Title + meta */}
        <div>
          <h1 className="text-lg font-bold text-slate-900 leading-tight">{lesson.title}</h1>
          <div className="flex items-center gap-3 mt-1.5 flex-wrap">
            {durationMin && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <Clock className="w-3.5 h-3.5" />
                {durationMin} min
              </span>
            )}
            <span className="text-xs text-slate-400">Cápsula {lesson.order_index} de {allLessons.length}</span>
          </div>
        </div>

        {/* Audio player */}
        {lesson.video_url && isAudio && (
          <div className="bg-[#1c2c3e] rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                <Play className="w-4 h-4 text-white ml-0.5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{lesson.title}</p>
                {durationMin && <p className="text-white/40 text-xs">{durationMin} min</p>}
              </div>
            </div>
            <audio
              controls
              className="w-full h-10"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              onEnded={() => setPlaying(false)}
            >
              <source src={lesson.video_url} type="audio/mpeg" />
            </audio>
          </div>
        )}

        {/* Prev / Next navigation */}
        <div className="flex items-center gap-3">
          {prevLesson ? (
            <Link href={`/app/lesson/${prevLesson.id}`} className="flex-1">
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-left group">
                <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Anterior</div>
                  <div className="text-xs text-slate-700 truncate group-hover:text-blue-700 transition-colors">{prevLesson.title}</div>
                </div>
              </button>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {nextLesson ? (
            <Link href={`/app/lesson/${nextLesson.id}`} className="flex-1">
              <button className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 transition-colors text-right group">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wide text-right">Siguiente</div>
                  <div className="text-xs text-slate-700 truncate group-hover:text-blue-700 transition-colors text-right">{nextLesson.title}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 flex-shrink-0" />
              </button>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>

        {/* All lessons in this specialty (mini index) */}
        {allLessons.length > 0 && (
          <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <div className="flex items-center gap-3 px-4 py-3 bg-[#1c2c3e]">
              <BookOpen className="w-4 h-4 text-white/60 flex-shrink-0" />
              <span className="text-sm font-semibold text-white flex-1">{specName}</span>
              <span className="text-white/40 text-xs">{allLessons.length} cápsulas</span>
            </div>
            <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto">
              {allLessons.map((l) => {
                const isCurrent = l.id === lesson.id
                return (
                  <Link key={l.id} href={`/app/lesson/${l.id}`}>
                    <div className={`flex items-center gap-3 px-4 py-2.5 transition-colors ${
                      isCurrent ? 'bg-blue-50' : 'hover:bg-slate-50'
                    }`}>
                      {isCurrent
                        ? <Play className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        : <Circle className="w-3.5 h-3.5 text-slate-200 flex-shrink-0" />
                      }
                      <span className={`text-xs font-mono flex-shrink-0 ${isCurrent ? 'text-blue-600' : 'text-slate-400'}`}>
                        {l.order_index}.
                      </span>
                      <span className={`text-sm leading-tight flex-1 min-w-0 truncate ${isCurrent ? 'text-blue-700 font-semibold' : 'text-slate-700'}`}>
                        {l.title}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* ── AI CONTENT SECTIONS ──────────────────── */}

        {/* Summary */}
        {lesson.ai_summary && (
          <Section icon={BookOpen} title="Resumen de la clase" accentColor="blue">
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{lesson.ai_summary}</p>
          </Section>
        )}

        {/* Key concepts */}
        {lesson.ai_key_concepts && lesson.ai_key_concepts.length > 0 && (
          <Section icon={Target} title="Conceptos clave" accentColor="green">
            <ul className="space-y-2">
              {lesson.ai_key_concepts.map((c, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {c}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Mnemonics */}
        {lesson.ai_mnemonics && lesson.ai_mnemonics.length > 0 && (
          <Section icon={Brain} title="Nemotecnias" accentColor="amber">
            <div className="space-y-3">
              {lesson.ai_mnemonics.map((m, i) => (
                <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-3">
                  <div className="text-sm font-bold text-amber-800 mb-1">{m.nemotecnia}</div>
                  <p className="text-xs text-amber-700 leading-relaxed">{m.explicacion?.split('\n')[0]}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* High yield */}
        {lesson.ai_high_yield && lesson.ai_high_yield.length > 0 && (
          <Section icon={Star} title="Alto rendimiento EUNACOM" accentColor="red">
            <ul className="space-y-2">
              {lesson.ai_high_yield.map((h, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <span className="text-red-500 font-bold mt-0.5 flex-shrink-0 text-xs">★</span>
                  {h}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Clinical algorithms */}
        {lesson.ai_algorithms && lesson.ai_algorithms.length > 0 && (
          <Section icon={BarChart3} title="Algoritmos clínicos" accentColor="purple">
            <div className="space-y-3">
              {lesson.ai_algorithms.map((algo: any, i: number) => (
                <div key={i} className="bg-[#0d1117] rounded-lg px-4 py-3">
                  <pre className="text-xs text-green-400 whitespace-pre-wrap font-mono leading-relaxed">
                    {typeof algo === 'string' ? algo : JSON.stringify(algo, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Review questions */}
        {lesson.ai_review_qs && lesson.ai_review_qs.length > 0 && (
          <Section icon={Lightbulb} title={`Preguntas de repaso (${lesson.ai_review_qs.length})`} accentColor="blue" defaultOpen={false}>
            <div className="space-y-3">
              {lesson.ai_review_qs.map((q, i) => (
                <ReviewQuestion key={i} q={q} index={i} />
              ))}
            </div>
          </Section>
        )}

        {/* Transcription */}
        {lesson.txt_content && (
          <div className="rounded-lg border border-slate-200 overflow-hidden shadow-sm">
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-slate-50 border-b border-slate-200 text-left hover:bg-slate-100 transition-colors"
            >
              <FileText className="w-4 h-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-700 flex-1">Transcripción completa</span>
              {showTranscript ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
            {showTranscript && (
              <div className="bg-white p-4 max-h-96 overflow-y-auto">
                <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{lesson.txt_content}</p>
              </div>
            )}
          </div>
        )}

        {/* Bottom navigation */}
        <div className="flex items-center justify-between pt-2">
          {prevLesson ? (
            <Link href={`/app/lesson/${prevLesson.id}`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <ChevronLeft className="w-4 h-4" /> Anterior
              </Button>
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link href={`/app/lesson/${nextLesson.id}`}>
              <Button size="sm" className="gap-1.5 bg-blue-700 hover:bg-blue-800 text-white">
                Siguiente <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          ) : (
            <Link href={`/app/specialties/${specCode}`}>
              <Button size="sm" variant="outline" className="gap-1.5">
                Ver especialidad <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>

      </div>

      {/* ── RIGHT SIDEBAR (gadgets) ───────────────── */}
      <div className="hidden xl:block w-72 flex-shrink-0 sticky top-4">
        <GadgetSidebar />
      </div>

    </div>
  )
}
