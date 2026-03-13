'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Play, Loader2, CheckCircle2, AlertCircle, Volume2,
  ChevronDown, ChevronUp, RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Lesson {
  id: number
  title: string
  order_index: number
  specialty_id: number
  video_url: string | null
  duration_seconds: number | null
  is_available: boolean
  txt_content: string | null
  specialty_code: string
  specialty_name: string
}

type VoiceOption = 'nova' | 'alloy' | 'echo' | 'fable' | 'onyx' | 'shimmer'

const VOICE_DESCRIPTIONS: Record<VoiceOption, string> = {
  nova:    'Nova — Cálida, natural, la mejor para español latino (recomendada)',
  alloy:   'Alloy — Neutra y clara, versátil',
  echo:    'Echo — Masculina, profunda',
  fable:   'Fable — Expresiva y narrativa',
  onyx:    'Onyx — Masculina, autoritaria',
  shimmer: 'Shimmer — Femenina, suave',
}

export default function AudioAdminPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<Set<number>>(new Set())
  const [results, setResults] = useState<Record<number, { ok: boolean; msg: string; url?: string }>>({})
  const [voice, setVoice] = useState<VoiceOption>('nova')
  const [speed, setSpeed] = useState(0.92)
  const [openSpecialty, setOpenSpecialty] = useState<string | null>('diabetes')
  const [preview, setPreview] = useState<{ id: number; url: string } | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('lessons')
        .select('id, title, order_index, specialty_id, video_url, duration_seconds, is_available, txt_content, specialties(code, name)')
        .order('order_index')

      if (data) {
        setLessons(data.map((l: any) => ({
          ...l,
          specialty_code: l.specialties?.code ?? '',
          specialty_name: l.specialties?.name ?? '',
        })))
      }
      setLoading(false)
    }
    load()
  }, [])

  const generateAudio = async (lessonId: number) => {
    setGenerating((prev) => new Set(prev).add(lessonId))
    setResults((prev) => ({ ...prev, [lessonId]: { ok: false, msg: 'Generando...' } }))

    try {
      const res = await fetch('/api/admin/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lesson_id: lessonId, voice, speed }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setResults((prev) => ({
          ...prev,
          [lessonId]: { ok: true, msg: `✓ ${data.size_kb} KB`, url: data.publicUrl },
        }))
        setLessons((prev) =>
          prev.map((l) => l.id === lessonId ? { ...l, video_url: data.publicUrl } : l)
        )
        toast.success(`Audio generado: ${data.title}`)
      } else {
        setResults((prev) => ({
          ...prev,
          [lessonId]: { ok: false, msg: data.error ?? 'Error desconocido' },
        }))
        toast.error(data.error ?? 'Error generando audio')
      }
    } catch (e: any) {
      setResults((prev) => ({
        ...prev,
        [lessonId]: { ok: false, msg: e.message },
      }))
      toast.error(e.message)
    } finally {
      setGenerating((prev) => {
        const next = new Set(prev)
        next.delete(lessonId)
        return next
      })
    }
  }

  // Agrupar por especialidad
  const bySpecialty = lessons.reduce<Record<string, Lesson[]>>((acc, l) => {
    const key = l.specialty_code || 'sin_especialidad'
    if (!acc[key]) acc[key] = []
    acc[key].push(l)
    return acc
  }, {})

  const totalLessons = lessons.length
  const withAudio = lessons.filter((l) => l.video_url).length
  const withScript = lessons.filter((l) => l.txt_content).length

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-900">Generador de Audio IA</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Genera MP3s con OpenAI TTS (tts-1-hd) para cada cápsula de audio.
          El audio se sube a Supabase Storage y se actualiza el <code className="bg-slate-100 px-1 rounded text-xs">video_url</code>.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total cápsulas', value: totalLessons, color: 'text-slate-700' },
          { label: 'Con guion', value: withScript, color: 'text-blue-700' },
          { label: 'Con audio', value: withAudio, color: 'text-green-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white rounded-lg border border-slate-300 p-4 text-center shadow-sm">
            <div className={`text-2xl font-bold tabular-nums ${color}`}>{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>

      {/* Config */}
      <div className="bg-white rounded-lg border border-slate-300 p-4 space-y-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-800">Configuración de Voz</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Voz OpenAI</label>
            <select
              value={voice}
              onChange={(e) => setVoice(e.target.value as VoiceOption)}
              className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Object.entries(VOICE_DESCRIPTIONS).map(([v, desc]) => (
                <option key={v} value={v}>{desc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              Velocidad: <span className="text-blue-700 font-bold">{speed}×</span>
              <span className="text-slate-400 font-normal ml-1">(0.75 = lento, 1.0 = normal)</span>
            </label>
            <input
              type="range"
              min={0.75}
              max={1.0}
              step={0.01}
              value={speed}
              onChange={(e) => setSpeed(parseFloat(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400 mt-0.5">
              <span>0.75× lento</span>
              <span>1.0× normal</span>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
          <strong>Requisito:</strong> La variable <code className="bg-amber-100 px-1 rounded">OPENAI_API_KEY</code> debe estar configurada
          en las variables de entorno de Vercel. El audio se genera en el servidor (no en el navegador).
        </div>

        {/* Preview player */}
        {preview && (
          <div className="border border-blue-200 rounded-lg p-3 bg-blue-50">
            <div className="text-xs font-semibold text-blue-800 mb-2">Reproduciendo preview</div>
            <audio controls autoPlay className="w-full h-9">
              <source src={preview.url} type="audio/mpeg" />
            </audio>
          </div>
        )}
      </div>

      {/* Lessons by specialty */}
      <div className="space-y-3">
        {Object.entries(bySpecialty).map(([specCode, specLessons]) => {
          const specName = specLessons[0]?.specialty_name || specCode
          const audioCount = specLessons.filter((l) => l.video_url).length
          const isOpen = openSpecialty === specCode

          return (
            <div key={specCode} className="rounded-lg border border-slate-300 overflow-hidden shadow-sm">
              {/* Specialty header */}
              <button
                onClick={() => setOpenSpecialty(isOpen ? null : specCode)}
                className="w-full flex items-center gap-3 px-5 py-3.5 bg-[#1c2c3e] hover:bg-[#243547] transition-colors text-left"
              >
                <Volume2 className="w-4 h-4 text-white/70 flex-shrink-0" />
                <span className="font-semibold text-white text-sm flex-1">{specName}</span>
                <span className="text-xs text-white/60">{audioCount}/{specLessons.length} con audio</span>
                {isOpen
                  ? <ChevronUp className="w-4 h-4 text-white/60" />
                  : <ChevronDown className="w-4 h-4 text-white/60" />
                }
              </button>

              {isOpen && (
                <div className="divide-y divide-slate-100 bg-white">
                  {/* Batch generate button */}
                  <div className="px-4 py-2.5 bg-slate-50 flex items-center justify-between border-b border-slate-200">
                    <span className="text-xs text-slate-600">
                      {specLessons.filter(l => l.txt_content).length} con guion · {audioCount} con audio
                    </span>
                    <button
                      className="text-xs px-3 py-1.5 rounded border border-blue-300 text-blue-700 hover:bg-blue-50 font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      disabled={specLessons.some((l) => generating.has(l.id))}
                      onClick={async () => {
                        const pending = specLessons.filter((l) => l.txt_content && !l.video_url)
                        for (const l of pending) {
                          await generateAudio(l.id)
                        }
                      }}
                    >
                      <RefreshCw className="w-3 h-3" />
                      Generar todos sin audio
                    </button>
                  </div>

                  {specLessons.map((lesson) => {
                    const isGen = generating.has(lesson.id)
                    const result = results[lesson.id]
                    const hasScript = !!lesson.txt_content
                    const hasAudio = !!lesson.video_url

                    return (
                      <div key={lesson.id} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                        {/* Status icon */}
                        <div className="flex-shrink-0 w-5">
                          {isGen
                            ? <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />
                            : result?.ok
                            ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                            : hasAudio
                            ? <CheckCircle2 className="w-4 h-4 text-green-400" />
                            : result && !result.ok
                            ? <AlertCircle className="w-4 h-4 text-red-500" />
                            : <div className="w-4 h-4 rounded-full border-2 border-slate-300" />
                          }
                        </div>

                        {/* Number */}
                        <span className="text-xs font-mono text-slate-400 w-6 flex-shrink-0">
                          {lesson.order_index}.
                        </span>

                        {/* Title + status */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-slate-800 leading-tight truncate">{lesson.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            {!hasScript && (
                              <span className="text-[10px] text-amber-600">Sin guion</span>
                            )}
                            {hasAudio && (
                              <span className="text-[10px] text-green-600 font-medium">Audio OK</span>
                            )}
                            {result && !isGen && (
                              <span className={`text-[10px] ${result.ok ? 'text-green-600' : 'text-red-500'}`}>
                                {result.msg}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {(hasAudio || result?.url) && (
                            <button
                              onClick={() => {
                                const url = result?.url || lesson.video_url!
                                setPreview(preview?.id === lesson.id ? null : { id: lesson.id, url })
                              }}
                              className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                              title="Escuchar"
                            >
                              <Play className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            disabled={!hasScript || isGen}
                            onClick={() => generateAudio(lesson.id)}
                            className={`text-xs px-3 py-1.5 rounded border font-medium transition-colors flex items-center gap-1.5 ${
                              !hasScript
                                ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                                : isGen
                                ? 'border-blue-200 bg-blue-50 text-blue-600 cursor-wait'
                                : hasAudio
                                ? 'border-slate-300 text-slate-600 hover:border-orange-300 hover:text-orange-700'
                                : 'border-blue-700 bg-blue-700 text-white hover:bg-blue-800'
                            }`}
                          >
                            {isGen
                              ? <><Loader2 className="w-3 h-3 animate-spin" />Generando...</>
                              : hasAudio
                              ? <><RefreshCw className="w-3 h-3" />Regenerar</>
                              : <>Generar</>
                            }
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
