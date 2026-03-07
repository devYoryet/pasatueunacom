'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'sonner'
import {
  Upload,
  FileText,
  Image,
  Loader2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Check,
  Database,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils'
import type { ParsedQuestion } from '@/lib/supabase/types'
import { createClient } from '@/lib/supabase/client'

const STEPS = ['Entrada', 'Revisión', 'Importar']

interface ParsedWithCheck extends ParsedQuestion {
  selected: boolean
  id: number
}

export default function ImportPage() {
  const [step, setStep] = useState(0)
  const [rawText, setRawText] = useState('')
  const [images, setImages] = useState<{ file: File; base64: string }[]>([])
  const [specialtyId, setSpecialtyId] = useState('')
  const [specialties, setSpecialties] = useState<{ id: number; name: string; icon: string | null }[]>([])
  const [processing, setProcessing] = useState(false)
  const [parsed, setParsed] = useState<ParsedWithCheck[]>([])
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [targetExam, setTargetExam] = useState('')
  const [exams, setExams] = useState<{ id: number; title: string }[]>([])
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<number | null>(null)

  // Load specialties on mount
  useState(() => {
    const load = async () => {
      const supabase = createClient()
      const [specsRes, examsRes] = await Promise.all([
        supabase.from('specialties').select('id, name, icon').order('name'),
        supabase.from('exams').select('id, title').eq('is_active', true).order('title'),
      ])
      setSpecialties(specsRes.data ?? [])
      setExams(examsRes.data ?? [])
    }
    load()
  })

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = (e.target?.result as string).split(',')[1]
        setImages((prev) => [...prev, { file, base64 }])
      }
      reader.readAsDataURL(file)
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] },
    multiple: true,
  })

  const handleProcess = async () => {
    if (!rawText && images.length === 0) {
      toast.error('Ingresa texto o sube imágenes')
      return
    }

    setProcessing(true)
    try {
      const body: Record<string, unknown> = {
        specialtyId: specialtyId || undefined,
      }

      if (rawText) {
        body.rawText = rawText
      } else {
        body.images = images.map((i) => i.base64)
      }

      const res = await fetch('/api/admin/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const err = await res.json()
        toast.error(err.error ?? 'Error al procesar')
        return
      }

      const data = await res.json()
      const withCheck = data.questions.map((q: ParsedQuestion, i: number) => ({
        ...q,
        selected: true,
        id: i,
      }))
      setParsed(withCheck)
      setStep(1)
      toast.success(`${data.count} preguntas extraídas`)
    } catch {
      toast.error('Error al procesar. Verifica tu API key de OpenAI.')
    } finally {
      setProcessing(false)
    }
  }

  const handleImport = async () => {
    const selectedQuestions = parsed.filter((q) => q.selected)
    if (selectedQuestions.length === 0) {
      toast.error('Selecciona al menos una pregunta')
      return
    }

    setImporting(true)
    try {
      const res = await fetch('/api/admin/import', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: selectedQuestions,
          specialtyId: specialtyId || undefined,
          examId: targetExam || undefined,
        }),
      })

      if (!res.ok) {
        toast.error('Error al importar')
        return
      }

      const data = await res.json()
      setImportResult(data.imported)
      setStep(2)
      toast.success(`${data.imported} preguntas importadas exitosamente`)
    } catch {
      toast.error('Error al importar preguntas')
    } finally {
      setImporting(false)
    }
  }

  const selectedCount = parsed.filter((q) => q.selected).length

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="section-title">Importador de preguntas</h1>
        <p className="text-slate-500 text-sm mt-1">
          Pega texto de Moodle o sube screenshots. La IA extrae y reescribe las preguntas automáticamente.
        </p>
      </div>

      {/* STEPPER */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
              i < step && 'bg-green-500 text-white',
              i === step && 'bg-blue-600 text-white',
              i > step && 'bg-slate-200 text-slate-400'
            )}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={cn(
              'text-sm font-medium',
              i === step ? 'text-slate-900' : 'text-slate-400'
            )}>
              {s}
            </span>
            {i < STEPS.length - 1 && <div className="w-8 h-0.5 bg-slate-200 ml-2" />}
          </div>
        ))}
      </div>

      {/* STEP 0: INPUT */}
      {step === 0 && (
        <Card>
          <CardContent className="pt-6 space-y-5">
            <Tabs defaultValue="text">
              <TabsList>
                <TabsTrigger value="text" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Pegar texto
                </TabsTrigger>
                <TabsTrigger value="image" className="gap-2">
                  <Image className="w-4 h-4" />
                  Subir imagen
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-4">
                <Textarea
                  value={rawText}
                  onChange={(e) => setRawText(e.target.value)}
                  rows={12}
                  placeholder="Pega aquí el texto copiado de la plataforma Moodle...
El sistema detectará automáticamente las preguntas, opciones y retroalimentaciones."
                  className="font-mono text-sm"
                />
                <p className="text-xs text-slate-400 mt-2">
                  {rawText.length} caracteres · El sistema extrae y reescribe automáticamente
                </p>
              </TabsContent>

              <TabsContent value="image" className="mt-4">
                <div
                  {...getRootProps()}
                  className={cn(
                    'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all',
                    isDragActive
                      ? 'border-blue-400 bg-blue-50'
                      : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
                  )}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-600 font-medium">
                    {isDragActive ? 'Suelta las imágenes aquí' : 'Arrastra screenshots aquí'}
                  </p>
                  <p className="text-slate-400 text-sm mt-1">o haz clic para seleccionar archivos</p>
                  <p className="text-xs text-slate-400 mt-3">Acepta: PNG, JPG, WEBP</p>
                </div>
                {images.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-4">
                    {images.map((img, i) => (
                      <div key={i} className="relative">
                        <img
                          src={`data:image/jpeg;base64,${img.base64}`}
                          alt={`Screenshot ${i + 1}`}
                          className="w-24 h-24 object-cover rounded-xl border border-slate-200"
                        />
                        <button
                          onClick={() => setImages((prev) => prev.filter((_, j) => j !== i))}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="space-y-1.5">
              <Label>Especialidad destino (opcional — la IA también la detecta)</Label>
              <Select value={specialtyId} onValueChange={setSpecialtyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Detectar automáticamente" />
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

            <Button
              onClick={handleProcess}
              disabled={processing}
              size="lg"
              className="w-full gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analizando preguntas con IA...
                </>
              ) : (
                <>🤖 Procesar con IA →</>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* STEP 1: REVIEW */}
      {step === 1 && (
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Badge variant="success" className="gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                    {parsed.length} preguntas extraídas
                  </Badge>
                  <span className="text-sm text-slate-500">{selectedCount} seleccionadas</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setParsed((p) => p.map((q) => ({ ...q, selected: true })))}
                  >
                    Seleccionar todas
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setParsed((p) => p.map((q) => ({ ...q, selected: false })))}
                  >
                    Deseleccionar
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-100">
                      <th className="text-left pb-3 font-medium w-8"></th>
                      <th className="text-left pb-3 font-medium">#</th>
                      <th className="text-left pb-3 font-medium">Preview</th>
                      <th className="text-center pb-3 font-medium hidden sm:table-cell">Correcta</th>
                      <th className="text-left pb-3 font-medium hidden md:table-cell">Tema</th>
                      <th className="text-center pb-3 font-medium hidden sm:table-cell">Tabla</th>
                      <th className="text-right pb-3 font-medium">Ver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {parsed.map((q) => (
                      <>
                        <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3">
                            <Checkbox
                              checked={q.selected}
                              onCheckedChange={(checked) =>
                                setParsed((p) =>
                                  p.map((item) => item.id === q.id ? { ...item, selected: !!checked } : item)
                                )
                              }
                            />
                          </td>
                          <td className="py-3 pr-3 text-slate-400 text-xs">{q.id + 1}</td>
                          <td className="py-3 pr-4">
                            <span className="text-slate-700">
                              {q.stem.replace(/[#\*\|]/g, '').trim().slice(0, 80)}
                              {q.stem.length > 80 ? '...' : ''}
                            </span>
                          </td>
                          <td className="py-3 text-center hidden sm:table-cell">
                            <span className="font-bold text-green-600 uppercase">{q.correct_option}</span>
                          </td>
                          <td className="py-3 pr-4 hidden md:table-cell">
                            <Badge variant="secondary" className="text-xs">{q.detected_topic}</Badge>
                          </td>
                          <td className="py-3 text-center hidden sm:table-cell">
                            {q.has_table && <Badge variant="info" className="text-xs">Tabla</Badge>}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => setExpandedId(expandedId === q.id ? null : q.id)}
                              className="text-slate-400 hover:text-slate-600"
                            >
                              {expandedId === q.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                          </td>
                        </tr>
                        {expandedId === q.id && (
                          <tr key={`${q.id}-expanded`}>
                            <td colSpan={7} className="pb-4 px-4">
                              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                                <div className="markdown-content text-sm text-slate-700">
                                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{q.stem}</ReactMarkdown>
                                </div>
                                <div className="space-y-1.5">
                                  {['a', 'b', 'c', 'd', 'e'].map((l) => {
                                    const text = q[`option_${l}` as keyof typeof q] as string
                                    if (!text) return null
                                    return (
                                      <div key={l} className={cn(
                                        'flex gap-2 text-sm p-2 rounded-lg',
                                        l === q.correct_option ? 'bg-green-100 text-green-800' : 'text-slate-600'
                                      )}>
                                        <span className="font-bold uppercase w-4 flex-shrink-0">{l}.</span>
                                        {text}
                                      </div>
                                    )
                                  })}
                                </div>
                                <div className="text-xs text-slate-500 border-t pt-3">
                                  <span className="font-semibold">Explicación:</span> {q.explanation.slice(0, 200)}...
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-1.5">
                <Label>Examen destino (opcional)</Label>
                <Select value={targetExam} onValueChange={setTargetExam}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sin asignar a examen específico" />
                  </SelectTrigger>
                  <SelectContent>
                    {exams.map((e) => (
                      <SelectItem key={e.id} value={String(e.id)}>{e.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setStep(0)}>← Volver</Button>
                <Button onClick={handleImport} disabled={importing || selectedCount === 0} className="flex-1 gap-2">
                  {importing ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Importando...</>
                  ) : (
                    <><Database className="w-4 h-4" />Importar {selectedCount} preguntas</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* STEP 2: SUCCESS */}
      {step === 2 && (
        <Card>
          <CardContent className="pt-10 pb-10 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-2">
              ¡{importResult} preguntas importadas!
            </h2>
            <p className="text-slate-500 mb-8">
              Las preguntas han sido guardadas exitosamente en la base de datos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  setStep(0)
                  setRawText('')
                  setImages([])
                  setParsed([])
                  setImportResult(null)
                }}
                className="gap-2"
              >
                <Upload className="w-4 h-4" />
                Importar más preguntas
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
