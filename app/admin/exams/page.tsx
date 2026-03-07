'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { RefreshCw } from 'lucide-react'
import type { Exam, Specialty } from '@/lib/supabase/types'

interface ExamWithSpec extends Exam {
  specialties: Specialty | null
  questionCount: number
}

export default function AdminExamsPage() {
  const [exams, setExams] = useState<ExamWithSpec[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const supabase = createClient()
    const { data: examsData } = await supabase
      .from('exams')
      .select('*, specialties(*)')
      .order('specialty_id')
      .order('order_index')

    if (!examsData) { setLoading(false); return }

    const examIds = examsData.map((e) => e.id)
    const { data: counts } = await supabase
      .from('exam_questions')
      .select('exam_id')
      .in('exam_id', examIds)

    const countMap: Record<number, number> = {}
    ;(counts ?? []).forEach((c: any) => {
      countMap[c.exam_id] = (countMap[c.exam_id] ?? 0) + 1
    })

    setExams(examsData.map((e: any) => ({
      ...e,
      questionCount: countMap[e.id] ?? 0,
    })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const toggleActive = async (examId: number, current: boolean) => {
    const supabase = createClient()
    await supabase.from('exams').update({ is_active: !current }).eq('id', examId)
    toast.success(current ? 'Examen desactivado' : 'Examen activado')
    load()
  }

  if (loading) return <Skeleton className="h-96" />

  const grouped = exams.reduce((acc, exam) => {
    const key = exam.specialties?.name ?? 'Sin especialidad'
    if (!acc[key]) acc[key] = []
    acc[key].push(exam)
    return acc
  }, {} as Record<string, ExamWithSpec[]>)

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Exámenes</h1>
          <p className="text-slate-500 text-sm mt-1">{exams.length} exámenes en total</p>
        </div>
        <Button variant="outline" size="sm" onClick={load} className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </Button>
      </div>

      {Object.entries(grouped).map(([specialty, specExams]) => (
        <Card key={specialty}>
          <CardContent className="pt-6">
            <h3 className="font-heading font-semibold text-slate-800 mb-4">
              {specExams[0]?.specialties?.icon} {specialty}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-100">
                    <th className="text-left pb-2 font-medium">Título</th>
                    <th className="text-center pb-2 font-medium">Tipo</th>
                    <th className="text-center pb-2 font-medium">Preguntas</th>
                    <th className="text-center pb-2 font-medium">Estado</th>
                    <th className="text-right pb-2 font-medium">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {specExams.map((exam) => (
                    <tr key={exam.id} className="hover:bg-slate-50">
                      <td className="py-2.5 pr-4 font-medium text-slate-800">{exam.title}</td>
                      <td className="py-2.5 text-center">
                        <Badge variant="secondary" className="text-xs">{exam.exam_type}</Badge>
                      </td>
                      <td className="py-2.5 text-center text-slate-500">
                        {exam.questionCount}/{exam.question_count}
                      </td>
                      <td className="py-2.5 text-center">
                        {exam.is_active ? (
                          <Badge variant="success">Activo</Badge>
                        ) : (
                          <Badge variant="secondary">Inactivo</Badge>
                        )}
                      </td>
                      <td className="py-2.5 text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs"
                          onClick={() => toggleActive(exam.id, exam.is_active)}
                        >
                          {exam.is_active ? 'Desactivar' : 'Activar'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
