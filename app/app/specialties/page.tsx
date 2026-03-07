'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ConfigModal from '@/components/quiz/ConfigModal'
import type { Specialty, EunacomArea, Exam } from '@/lib/supabase/types'
import { BookOpen, Play } from 'lucide-react'

interface SpecialtyWithData extends Specialty {
  eunacom_areas: EunacomArea | null
  examCount: number
  questionCount: number
  userScore: number
  exams: Exam[]
}

export default function SpecialtiesPage() {
  const [specialties, setSpecialties] = useState<SpecialtyWithData[]>([])
  const [areas, setAreas] = useState<EunacomArea[]>([])
  const [loading, setLoading] = useState(true)
  const [activeArea, setActiveArea] = useState<string>('all')
  const [configModalOpen, setConfigModalOpen] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<SpecialtyWithData | null>(null)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const [specsRes, areasRes, examsRes] = await Promise.all([
        supabase.from('specialties').select('*, eunacom_areas(*)').order('order_index'),
        supabase.from('eunacom_areas').select('*').order('order_index'),
        supabase.from('exams').select('*').eq('is_active', true).order('order_index'),
      ])

      const specs = specsRes.data ?? []
      const exams = examsRes.data ?? []

      // Get user scores
      let attemptsData: any[] = []
      if (user) {
        const { data } = await supabase
          .from('attempts')
          .select('exam_id, score_percent, exams(specialty_id)')
          .eq('user_id', user.id)
          .eq('is_completed', true)
        attemptsData = data ?? []
      }

      const specialtyScores: Record<number, { total: number; count: number }> = {}
      attemptsData.forEach((a) => {
        const specId = (a.exams as any)?.specialty_id
        if (specId) {
          if (!specialtyScores[specId]) specialtyScores[specId] = { total: 0, count: 0 }
          specialtyScores[specId].total += a.score_percent ?? 0
          specialtyScores[specId].count++
        }
      })

      const withData: SpecialtyWithData[] = specs.map((spec: any) => {
        const specExams = exams.filter((e) => e.specialty_id === spec.id)
        const scores = specialtyScores[spec.id]
        return {
          ...spec,
          examCount: specExams.length,
          questionCount: specExams.reduce((sum, e) => sum + e.question_count, 0),
          userScore: scores ? Math.round(scores.total / scores.count) : 0,
          exams: specExams,
        }
      })

      setSpecialties(withData)
      setAreas(areasRes.data ?? [])
      setLoading(false)
    }

    load()
  }, [])

  const filteredSpecialties =
    activeArea === 'all'
      ? specialties
      : specialties.filter((s) => s.area_id === parseInt(activeArea))

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="section-title">Todas las especialidades</h1>
        <p className="text-slate-500 text-sm mt-1">Selecciona una especialidad para practicar</p>
      </div>

      {/* AREA TABS */}
      <div className="overflow-x-auto -mx-4 px-4 pb-1">
        <Tabs value={activeArea} onValueChange={setActiveArea}>
          <TabsList className="inline-flex w-auto gap-1 bg-slate-100 p-1 h-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm">Todas</TabsTrigger>
            {areas.map((area) => (
              <TabsTrigger key={area.id} value={String(area.id)} className="text-xs sm:text-sm whitespace-nowrap">
                {area.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* SPECIALTY GRID */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSpecialties.map((spec) => (
          <Card
            key={spec.id}
            className={`transition-all duration-200 ${
              spec.is_available
                ? 'hover:shadow-md hover:border-blue-200'
                : 'opacity-60'
            }`}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-3xl mb-2">{spec.icon}</div>
                  <h3 className="font-heading font-semibold text-slate-900 leading-tight">
                    {spec.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {spec.examCount} cuestionarios · {spec.questionCount} preguntas
                  </p>
                </div>
                {spec.is_available ? (
                  <Badge variant="success">Disponible</Badge>
                ) : (
                  <Badge variant="secondary">Próximamente</Badge>
                )}
              </div>

              {spec.is_available && spec.userScore > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>Tu progreso</span>
                    <span className="font-medium">{spec.userScore}%</span>
                  </div>
                  <Progress value={spec.userScore} className="h-1.5" />
                </div>
              )}

              {spec.is_available && (
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    className="flex-1 gap-2"
                    onClick={() => {
                      setSelectedSpecialty(spec)
                      setConfigModalOpen(true)
                    }}
                  >
                    <Play className="w-3.5 h-3.5" />
                    Practicar
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <BookOpen className="w-3.5 h-3.5" />
                    Cuestionarios
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

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
