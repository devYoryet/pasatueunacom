'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import ConfigModal from '@/components/quiz/ConfigModal'
import type { Specialty, EunacomArea, Exam } from '@/lib/supabase/types'
import { BookOpen, Play, CheckCircle2, Clock3, Circle, ChevronDown, ChevronUp } from 'lucide-react'
import { COURSE_CALENDAR, CHAPTER_COLORS } from '@/lib/course-calendar'

interface SpecialtyWithData extends Specialty {
  eunacom_areas: EunacomArea | null
  totalExams: number
  completedExams: number
  avgScore: number
  exams: Exam[]
}

interface ChapterGroup {
  chapterNumber: number
  chapterTitle: string
  color: keyof typeof CHAPTER_COLORS
  specialties: SpecialtyWithData[]
  repasoWeeks: string[]
}

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<SpecialtyWithData[]>([])
  const [loading, setLoading] = useState(true)
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyWithData | null>(null)
  const [openChapters, setOpenChapters] = useState<Set<number>>(new Set([1]))

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const [specsRes, examsRes] = await Promise.all([
        supabase.from('specialties').select('*, eunacom_areas(*)').order('order_index'),
        supabase.from('exams').select('*').eq('is_active', true).order('order_index'),
      ])

      const specs = specsRes.data ?? []
      const exams = examsRes.data ?? []

      // Get user attempts: distinct exam completions + scores
      let attemptsData: { exam_id: number; score_percent: number | null; exams: { specialty_id: number | null } | null }[] = []
      if (user) {
        const { data } = await supabase
          .from('attempts')
          .select('exam_id, score_percent, exams(specialty_id)')
          .eq('user_id', user.id)
          .eq('is_completed', true)
        attemptsData = (data ?? []) as any[]
      }

      // Per-specialty: distinct completed exam count + avg score
      const completedBySpec: Record<number, Set<number>> = {}
      const scoresBySpec: Record<number, number[]> = {}
      for (const a of attemptsData) {
        const specId = (a.exams as any)?.specialty_id
        if (!specId) continue
        if (!completedBySpec[specId]) completedBySpec[specId] = new Set()
        completedBySpec[specId].add(a.exam_id)
        if (!scoresBySpec[specId]) scoresBySpec[specId] = []
        if (a.score_percent != null) scoresBySpec[specId].push(a.score_percent)
      }

      const withData: SpecialtyWithData[] = specs.map((spec: any) => {
        const specExams = exams.filter((e: any) => e.specialty_id === spec.id && e.exam_type === 'topic')
        const completed = completedBySpec[spec.id]?.size ?? 0
        const scores = scoresBySpec[spec.id] ?? []
        return {
          ...spec,
          totalExams: specExams.length,
          completedExams: completed,
          avgScore: scores.length > 0 ? Math.round(scores.reduce((a: number, b: number) => a + b, 0) / scores.length) : 0,
          exams: exams.filter((e: any) => e.specialty_id === spec.id),
        }
      })

      setSpecialties(withData)
      setLoading(false)
    }

    load()
  }, [])

  // Group specialties by course chapter
  const chapterGroups: ChapterGroup[] = COURSE_CALENDAR.chapters.map((chapter) => {
    // Collect all specialty codes for this chapter
    const codes = new Set(chapter.weeks.flatMap((w) => w.specialtyCodes))
    const repasoDates = chapter.weeks.filter((w) => w.isRepaso).map((w) => w.topic)

    const chapterSpecs = specialties.filter((s) => codes.has(s.code))
    return {
      chapterNumber: chapter.number,
      chapterTitle: chapter.title,
      color: chapter.color,
      specialties: chapterSpecs,
      repasoDates,
    }
  })

  // Also include specialties not mapped to any chapter
  const mappedCodes = new Set(COURSE_CALENDAR.chapters.flatMap((c) => c.weeks.flatMap((w) => w.specialtyCodes)))
  const unmapped = specialties.filter((s) => !mappedCodes.has(s.code))

  const toggleChapter = (n: number) => {
    setOpenChapters((prev) => {
      const next = new Set(prev)
      if (next.has(n)) next.delete(n)
      else next.add(n)
      return next
    })
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="section-title">Especialidades del Curso</h1>
        <p className="text-slate-500 text-sm mt-1">Organizado por capítulo del calendario EUNACOM 2026</p>
      </div>

      {chapterGroups.map((group) => {
        const color = CHAPTER_COLORS[group.color]
        const isOpen = openChapters.has(group.chapterNumber)

        // Chapter-level progress
        const availableSpecs = group.specialties.filter((s) => s.is_available)
        const specsWithAnyAttempt = availableSpecs.filter((s) => s.completedExams > 0).length
        const chapterPct = availableSpecs.length > 0
          ? Math.round((specsWithAnyAttempt / availableSpecs.length) * 100)
          : 0

        return (
          <div key={group.chapterNumber} className="rounded-2xl border-2 border-slate-200 overflow-hidden">
            {/* Chapter header */}
            <button
              onClick={() => toggleChapter(group.chapterNumber)}
              className="w-full flex items-center gap-4 p-5 bg-white hover:bg-slate-50 transition-colors text-left"
            >
              <div className={`w-10 h-10 rounded-xl ${color.badge} flex items-center justify-center flex-shrink-0 font-bold text-sm`}>
                {group.chapterNumber}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-semibold text-slate-900">
                  Capítulo {group.chapterNumber}
                </div>
                <p className="text-sm text-slate-500 truncate">{group.chapterTitle}</p>
              </div>

              {/* Chapter progress */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {availableSpecs.length > 0 && (
                  <div className="text-right hidden sm:block">
                    <div className={`text-base font-bold ${color.text}`}>{chapterPct}%</div>
                    <div className="text-xs text-slate-400">{specsWithAnyAttempt}/{availableSpecs.length} iniciados</div>
                  </div>
                )}
                <div className="w-16 hidden sm:block">
                  <Progress value={chapterPct} className={`h-2 ${color.progress}`} />
                </div>
                {isOpen ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </div>
            </button>

            {/* Mobile progress */}
            {availableSpecs.length > 0 && (
              <div className="flex items-center gap-2 px-5 pb-3 bg-white sm:hidden">
                <Progress value={chapterPct} className={`flex-1 h-2 ${color.progress}`} />
                <span className={`text-sm font-bold ${color.text}`}>{chapterPct}%</span>
              </div>
            )}

            {/* Specialty grid */}
            {isOpen && (
              <div className="border-t border-slate-100 bg-slate-50/50 p-5">
                {group.specialties.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-4">
                    Las especialidades de este capítulo se habilitarán próximamente.
                  </p>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.specialties.map((spec) => {
                      const pct = spec.totalExams > 0
                        ? Math.round((spec.completedExams / spec.totalExams) * 100)
                        : 0
                      const isStarted = spec.completedExams > 0
                      const isDone = spec.totalExams > 0 && spec.completedExams >= spec.totalExams

                      return (
                        <Card
                          key={spec.id}
                          className={`transition-all duration-200 ${
                            spec.is_available
                              ? 'hover:shadow-md hover:border-blue-200 bg-white'
                              : 'opacity-60 bg-white'
                          } ${isDone ? `border-green-200` : isStarted ? `${color.border} border-2` : ''}`}
                        >
                          <CardContent className="p-5">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1 min-w-0">
                                <div className="text-2xl mb-1.5">{spec.icon}</div>
                                <h3 className="font-heading font-semibold text-slate-900 leading-tight text-sm">
                                  {spec.name}
                                </h3>
                                <p className="text-xs text-slate-400 mt-0.5">
                                  {spec.totalExams} cuest. · {spec.totalExams * 15} preguntas
                                </p>
                              </div>

                              {/* Status badge */}
                              {!spec.is_available ? (
                                <Badge variant="secondary" className="text-xs">Próximamente</Badge>
                              ) : isDone ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <CheckCircle2 className="w-4 h-4" />
                                  <span className="text-xs font-semibold">Completo</span>
                                </div>
                              ) : isStarted ? (
                                <div className={`flex items-center gap-1 ${color.text}`}>
                                  <Clock3 className="w-4 h-4" />
                                  <span className="text-xs font-semibold">En progreso</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-slate-400">
                                  <Circle className="w-4 h-4" />
                                  <span className="text-xs">Pendiente</span>
                                </div>
                              )}
                            </div>

                            {/* Progress bar */}
                            {spec.is_available && spec.totalExams > 0 && (
                              <div className="mb-3">
                                <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                                  <span>{spec.completedExams}/{spec.totalExams} cuest.</span>
                                  {spec.avgScore > 0 && (
                                    <span className={`font-bold ${
                                      spec.avgScore >= 80 ? 'text-green-600' : spec.avgScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      {spec.avgScore}%
                                    </span>
                                  )}
                                </div>
                                <Progress
                                  value={pct}
                                  className={`h-2 ${isDone ? '[&>div]:bg-green-500' : color.progress}`}
                                />
                              </div>
                            )}

                            {/* Action */}
                            {spec.is_available && (
                              <Button
                                size="sm"
                                className="w-full gap-2 mt-1"
                                variant={isStarted ? 'outline' : 'default'}
                                onClick={() => {
                                  setSelectedSpecialty(spec)
                                  setConfigModalOpen(true)
                                }}
                              >
                                <Play className="w-3.5 h-3.5" />
                                {isDone ? 'Repasar' : isStarted ? 'Continuar' : 'Comenzar'}
                              </Button>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      })}

      {/* Unmapped specialties fallback */}
      {unmapped.length > 0 && (
        <div className="rounded-2xl border border-slate-200 overflow-hidden">
          <div className="p-5 bg-white border-b border-slate-100">
            <h2 className="font-heading font-semibold text-slate-700">Otras especialidades</h2>
          </div>
          <div className="p-5 bg-slate-50/50">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unmapped.map((spec) => (
                <Card key={spec.id} className={`bg-white ${!spec.is_available ? 'opacity-60' : 'hover:shadow-md'}`}>
                  <CardContent className="p-5">
                    <div className="text-2xl mb-1.5">{spec.icon}</div>
                    <h3 className="font-heading font-semibold text-slate-900 text-sm">{spec.name}</h3>
                    {!spec.is_available && <Badge variant="secondary" className="mt-2 text-xs">Próximamente</Badge>}
                    {spec.is_available && (
                      <Button
                        size="sm"
                        className="w-full gap-2 mt-3"
                        onClick={() => {
                          setSelectedSpecialty(spec)
                          setConfigModalOpen(true)
                        }}
                      >
                        <Play className="w-3.5 h-3.5" />
                        Practicar
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedSpecialty && (
        <ConfigModal
          open={configModalOpen}
          onClose={() => {
            setConfigModalOpen(false)
            setSelectedSpecialty(null)
          }}
          specialty={selectedSpecialty}
          exams={selectedSpecialty.exams}
        />
      )}
    </div>
  )
}
