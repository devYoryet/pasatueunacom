'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Info, Bell } from 'lucide-react'
import { toast } from 'sonner'
import type { EunacomArea, Specialty } from '@/lib/supabase/types'

interface AreaWithSpecialties extends EunacomArea {
  specialties: Specialty[]
  availableCount: number
}

export default function CoveragePage() {
  const [areas, setAreas] = useState<AreaWithSpecialties[]>([])
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [notifyLoading, setNotifyLoading] = useState(false)
  const [userProgress, setUserProgress] = useState<Record<number, number>>({})

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      const [areasRes, specsRes] = await Promise.all([
        supabase.from('eunacom_areas').select('*').order('order_index'),
        supabase.from('specialties').select('*').order('order_index'),
      ])

      const areasData = areasRes.data ?? []
      const specsData = specsRes.data ?? []

      const withSpecialties: AreaWithSpecialties[] = areasData.map((area: any) => {
        const areaSpecs = specsData.filter((s: any) => s.area_id === area.id)
        return {
          ...area,
          specialties: areaSpecs,
          availableCount: areaSpecs.filter((s: any) => s.is_available).length,
        }
      })

      setAreas(withSpecialties)

      // User progress
      if (user) {
        const { data: attempts } = await supabase
          .from('attempts')
          .select('score_percent, exams(specialty_id)')
          .eq('user_id', user.id)
          .eq('is_completed', true)

        const areaScores: Record<number, { total: number; count: number }> = {}
        ;(attempts ?? []).forEach((a: any) => {
          const specId = a.exams?.specialty_id
          if (specId) {
            const spec = specsData.find((s: any) => s.id === specId)
            if (spec?.area_id) {
              const areaId = spec.area_id
              if (!areaScores[areaId]) areaScores[areaId] = { total: 0, count: 0 }
              areaScores[areaId].total += a.score_percent ?? 0
              areaScores[areaId].count++
            }
          }
        })

        const progress: Record<number, number> = {}
        Object.entries(areaScores).forEach(([areaId, data]) => {
          progress[parseInt(areaId)] = Math.round(data.total / data.count)
        })
        setUserProgress(progress)
      }

      setLoading(false)
    }

    load()
  }, [])

  const handleNotify = async () => {
    if (!email) {
      toast.error('Ingresa tu email')
      return
    }
    setNotifyLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setNotifyLoading(false)
    setEmail('')
    toast.success('¡Te avisaremos cuando llegue la próxima especialidad!')
  }

  const totalCoverage = areas.reduce((sum, area) => {
    const areaIsAvailable = area.availableCount === area.specialties.length && area.specialties.length > 0
    return sum + (areaIsAvailable ? area.percent_weight : 0)
  }, 0)

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-40" />
        <div className="space-y-4">
          {[...Array(7)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="section-title">Cobertura EUNACOM</h1>
        <p className="text-slate-500 text-sm mt-1">
          Visualiza qué porcentaje del examen real ya puedes practicar.
        </p>
      </div>

      {/* BIG INDICATOR */}
      <Card className="bg-gradient-to-br from-blue-900 to-slate-900 text-white border-0">
        <CardContent className="pt-8 pb-8 text-center">
          <div className="text-6xl sm:text-7xl font-heading font-black mb-3 text-blue-300">
            {totalCoverage}%
          </div>
          <div className="text-lg font-semibold mb-2">del EUNACOM disponible</div>
          <p className="text-blue-300 text-sm max-w-sm mx-auto">
            Suficiente para practicar toda el Área 1 — Medicina Interna, la más importante del examen.
          </p>
        </CardContent>
      </Card>

      {/* AREAS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            Distribución por área oficial
            <button className="text-slate-400 hover:text-slate-600">
              <Info className="w-4 h-4" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {areas.map((area) => {
            const isFullyAvailable = area.availableCount === area.specialties.length && area.specialties.length > 0
            const isPartiallyAvailable = area.availableCount > 0 && !isFullyAvailable
            const userScore = userProgress[area.id]

            return (
              <div key={area.id}>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <span className="font-medium text-slate-800 text-sm">{area.name}</span>
                    <span className="text-xs text-slate-400 ml-2">
                      ({area.percent_weight}% · {area.question_count} preg.)
                    </span>
                  </div>
                  {isFullyAvailable ? (
                    <Badge variant="success" className="text-xs">100% disponible</Badge>
                  ) : isPartiallyAvailable ? (
                    <Badge variant="warning" className="text-xs">Parcial</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">Próximamente</Badge>
                  )}
                </div>

                <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                  {isFullyAvailable && (
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                      style={{ width: '100%' }}
                    />
                  )}
                  {userScore !== undefined && isFullyAvailable && (
                    <div
                      className="absolute left-0 top-0 bottom-0 bg-green-400/40 rounded-full"
                      style={{ width: `${userScore}%` }}
                    />
                  )}
                </div>

                {userScore !== undefined && isFullyAvailable && (
                  <p className="text-xs text-slate-400 mt-1">
                    Tu promedio en esta área: <span className="font-medium text-slate-600">{userScore}%</span>
                  </p>
                )}

                {area.specialties.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {area.specialties.map((spec) => (
                      <span
                        key={spec.id}
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          spec.is_available
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {spec.icon} {spec.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* NOTIFY */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Bell className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-slate-900">Notifícame cuando llegue Pediatría</div>
              <div className="text-sm text-slate-500">Te avisamos cuando se publique la siguiente especialidad.</div>
            </div>
          </div>
          <div className="flex gap-3">
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleNotify} disabled={notifyLoading}>
              {notifyLoading ? 'Guardando...' : 'Notifícame'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
