'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Sparkles, Loader2, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { Specialty, ParsedQuestion } from '@/lib/supabase/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'

const COUNT_OPTIONS = [5, 10, 20, 50]

export default function GeneratePage() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [specialtyId, setSpecialtyId] = useState('')
  const [count, setCount] = useState(10)
  const [focusFailed, setFocusFailed] = useState(false)
  const [increaseDifficulty, setIncreaseDifficulty] = useState(false)
  const [includeTabular, setIncludeTabular] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState<ParsedQuestion[]>([])
  const [progress, setProgress] = useState(0)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('specialties')
        .select('*')
        .eq('is_available', true)
        .order('name')
      setSpecialties(data ?? [])
    }
    load()
  }, [])

  const handleGenerate = async () => {
    if (!specialtyId) {
      toast.error('Selecciona una especialidad')
      return
    }

    setGenerating(true)
    setGenerated([])
    setProgress(0)
    setSaved(false)

    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          specialtyId: parseInt(specialtyId),
          count,
          focusFailed,
          increaseDifficulty,
          includeTabular,
        }),
      })

      if (!res.ok) {
        toast.error('Error al generar preguntas')
        return
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) return

      let buffer = ''
      const questions: ParsedQuestion[] = []

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.question) {
                questions.push(data.question)
                setGenerated([...questions])
                setProgress((questions.length / count) * 100)
              }
            } catch {
              // Partial JSON, continue
            }
          }
        }
      }

      if (questions.length === 0) {
        toast.error('No se generaron preguntas. Verifica tu API key.')
      } else {
        toast.success(`${questions.length} preguntas generadas`)
      }
    } catch {
      toast.error('Error de conexión al generar preguntas')
    } finally {
      setGenerating(false)
    }
  }

  const handleSave = async () => {
    if (generated.length === 0) return

    setSaving(true)
    try {
      const res = await fetch('/api/admin/import', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: generated,
          specialtyId: parseInt(specialtyId),
          isAiGenerated: true,
        }),
      })

      if (!res.ok) {
        toast.error('Error al guardar')
        return
      }

      const data = await res.json()
      setSaved(true)
      toast.success(`${data.imported} preguntas guardadas`)
    } catch {
      toast.error('Error al guardar preguntas')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="section-title">Generador de preguntas IA</h1>
        <p className="text-slate-500 text-sm mt-1">
          Crea preguntas adicionales basadas en el banco existente.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* CONFIG */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-500" />
              Configuración
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-1.5">
              <Label>Especialidad</Label>
              <Select value={specialtyId} onValueChange={setSpecialtyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar especialidad..." />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.icon} {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Cantidad de preguntas</Label>
              <div className="flex gap-2">
                {COUNT_OPTIONS.map((n) => (
                  <button
                    key={n}
                    onClick={() => setCount(n)}
                    className={cn(
                      'flex-1 py-2 rounded-xl border-2 text-sm font-medium transition-all',
                      count === n
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Basadas en más falladas</Label>
                  <p className="text-xs text-slate-400">Usa estadísticas de errores</p>
                </div>
                <Switch checked={focusFailed} onCheckedChange={setFocusFailed} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Aumentar dificultad</Label>
                  <p className="text-xs text-slate-400">Más difícil que las fuente</p>
                </div>
                <Switch checked={increaseDifficulty} onCheckedChange={setIncreaseDifficulty} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Incluir tablas de datos</Label>
                  <p className="text-xs text-slate-400">Al menos 30% con tablas</p>
                </div>
                <Switch checked={includeTabular} onCheckedChange={setIncludeTabular} />
              </div>
            </div>

            <Button
              onClick={handleGenerate}
              disabled={generating || !specialtyId}
              size="lg"
              className="w-full gap-2"
            >
              {generating ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Generando...</>
              ) : (
                <>⚡ Generar con IA</>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* PROGRESS / RESULTS */}
        <div className="space-y-4">
          {generating && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-700">Generando preguntas...</span>
                  <span className="text-sm text-slate-400">{generated.length}/{count}</span>
                </div>
                <Progress value={progress} className="h-2 mb-4" />
                <p className="text-xs text-slate-400 text-center">
                  Esto puede tardar 30-60 segundos
                </p>
              </CardContent>
            </Card>
          )}

          {generated.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {generated.length} preguntas generadas
                  </CardTitle>
                  {!saved ? (
                    <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
                      {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                      Guardar todas
                    </Button>
                  ) : (
                    <Badge variant="success" className="gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Guardadas
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4 max-h-96 overflow-y-auto">
                {generated.map((q, i) => (
                  <div key={i} className="border border-slate-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary" className="text-xs">#{i + 1}</Badge>
                      <Badge variant="secondary" className="text-xs">{q.detected_topic}</Badge>
                      {q.has_table && <Badge variant="info" className="text-xs">Tabla</Badge>}
                    </div>
                    <div className="markdown-content text-sm text-slate-700">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {q.stem.slice(0, 200)}
                      </ReactMarkdown>
                    </div>
                    <div className="text-xs text-green-600 font-medium mt-2">
                      Correcta: {q.correct_option.toUpperCase()}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {!generating && generated.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="pt-12 pb-12 text-center text-slate-400">
                <Sparkles className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Las preguntas generadas aparecerán aquí.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
