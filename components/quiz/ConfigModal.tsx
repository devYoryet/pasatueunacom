'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, BookOpen, Target, Trophy } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Specialty, Exam } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'

interface ConfigModalProps {
  open: boolean
  onClose: () => void
  specialty: Specialty
  exams: Exam[]
}

type Mode = 'practice' | 'topic' | 'simulation'
type QuestionCount = 10 | 20 | 40 | 'all'

const MODE_OPTIONS = [
  {
    id: 'practice' as Mode,
    icon: BookOpen,
    title: 'Práctica Libre',
    desc: 'Sin tiempo, feedback inmediato por pregunta',
    color: 'border-blue-200 bg-blue-50',
    activeColor: 'border-blue-500 bg-blue-50',
  },
  {
    id: 'topic' as Mode,
    icon: Target,
    title: 'Modo Tema',
    desc: 'Elige cuestionario específico, con o sin tiempo',
    color: 'border-slate-200 bg-white',
    activeColor: 'border-green-500 bg-green-50',
  },
  {
    id: 'simulation' as Mode,
    icon: Trophy,
    title: 'Simulacro EUNACOM',
    desc: '180 preguntas, tiempo real, feedback al final',
    color: 'border-slate-200 bg-white',
    activeColor: 'border-purple-500 bg-purple-50',
  },
]

export default function ConfigModal({ open, onClose, specialty, exams }: ConfigModalProps) {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>('practice')
  const [selectedExam, setSelectedExam] = useState<string>('')
  const [questionCount, setQuestionCount] = useState<QuestionCount>(20)
  const [timerEnabled, setTimerEnabled] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(90)
  const [loading, setLoading] = useState(false)

  const handleStart = async () => {
    if (mode === 'topic' && !selectedExam) {
      toast.error('Selecciona un cuestionario')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/exam/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode,
          specialtyId: specialty.id,
          examId: selectedExam || undefined,
          questionCount: questionCount === 'all' ? 999 : questionCount,
          timerEnabled,
          timerSeconds: timerEnabled ? timerSeconds : undefined,
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error ?? 'Error al iniciar el examen')
        return
      }

      const data = await res.json()
      onClose()
      router.push(`/app/exam/${data.examId}?mode=${mode}&attemptId=${data.attemptId}`)
    } catch {
      toast.error('Error al iniciar el examen')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{specialty.icon}</span>
            {specialty.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* STEP 1: MODE */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">1. Elige el modo</h3>
            <div className="space-y-2">
              {MODE_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setMode(opt.id)}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border-2 transition-all duration-150',
                    mode === opt.id ? opt.activeColor : 'border-slate-200 bg-white hover:border-slate-300'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <opt.icon className={cn(
                      'w-5 h-5 flex-shrink-0',
                      mode === opt.id ? 'text-blue-600' : 'text-slate-400'
                    )} />
                    <div>
                      <div className="font-medium text-slate-900 text-sm">{opt.title}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{opt.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* STEP 2: CONFIG */}
          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">2. Configuración</h3>
            <div className="space-y-4">
              {mode === 'topic' && (
                <div className="space-y-1.5">
                  <Label>Cuestionario</Label>
                  <Select value={selectedExam} onValueChange={setSelectedExam}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un cuestionario" />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={String(exam.id)}>
                          {exam.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {mode !== 'simulation' && (
                <div className="space-y-1.5">
                  <Label>Cantidad de preguntas</Label>
                  <div className="flex gap-2">
                    {([10, 20, 40, 'all'] as QuestionCount[]).map((count) => (
                      <button
                        key={count}
                        onClick={() => setQuestionCount(count)}
                        className={cn(
                          'flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all',
                          questionCount === count
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        )}
                      >
                        {count === 'all' ? 'Todas' : count}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {mode !== 'simulation' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label>Cronómetro por pregunta</Label>
                    <Switch checked={timerEnabled} onCheckedChange={setTimerEnabled} />
                  </div>
                  {timerEnabled && (
                    <div className="flex gap-2">
                      {[60, 90, 120, 180].map((secs) => (
                        <button
                          key={secs}
                          onClick={() => setTimerSeconds(secs)}
                          className={cn(
                            'flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all',
                            timerSeconds === secs
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-slate-200 text-slate-600 hover:border-slate-300'
                          )}
                        >
                          {secs}s
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {mode === 'simulation' && (
                <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-4 h-4 text-purple-600" />
                    <span className="font-medium text-purple-800 text-sm">Simulacro EUNACOM</span>
                  </div>
                  <p className="text-xs text-purple-600">
                    180 preguntas distribuidas por área oficial. Tiempo total: 4 horas.
                    No recibirás feedback hasta el final.
                  </p>
                </div>
              )}
            </div>
          </div>

          <Button onClick={handleStart} className="w-full" size="lg" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cargando preguntas...
              </>
            ) : (
              'Comenzar examen →'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
