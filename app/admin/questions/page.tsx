'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import { Search, Plus, Edit, EyeOff, RotateCcw, Loader2 } from 'lucide-react'
import { getDifficultyLabel, getDifficultyColor, truncate } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Question, Specialty } from '@/lib/supabase/types'

interface QuestionWithSpec extends Question {
  specialties: Specialty | null
}

function QuestionForm({
  question,
  specialties,
  onSave,
  onCancel,
}: {
  question?: QuestionWithSpec
  specialties: Specialty[]
  onSave: () => void
  onCancel: () => void
}) {
  const [form, setForm] = useState({
    specialty_id: question?.specialty_id?.toString() ?? '',
    stem: question?.stem ?? '',
    option_a: question?.option_a ?? '',
    option_b: question?.option_b ?? '',
    option_c: question?.option_c ?? '',
    option_d: question?.option_d ?? '',
    option_e: question?.option_e ?? '',
    correct_option: question?.correct_option ?? 'a',
    explanation: question?.explanation ?? '',
    difficulty: question?.difficulty ?? 'medium',
    has_table: question?.has_table ?? false,
  })
  const [saving, setSaving] = useState(false)
  const [preview, setPreview] = useState(false)

  const TABLE_TEMPLATE = `\n\n| | Preprandial | Postprandial |\n|---|---|---|\n| Desayuno | 80 | 120 |\n| Almuerzo | 90 | 190 |\n| Cena | 100 | 210 |\n`

  const handleSave = async () => {
    if (!form.stem || !form.option_a || !form.option_b || !form.option_c || !form.option_d) {
      toast.error('Completa todos los campos requeridos')
      return
    }

    setSaving(true)
    const supabase = createClient()

    const payload = {
      specialty_id: form.specialty_id ? parseInt(form.specialty_id) : null,
      stem: form.stem,
      option_a: form.option_a,
      option_b: form.option_b,
      option_c: form.option_c,
      option_d: form.option_d,
      option_e: form.option_e || null,
      correct_option: form.correct_option as 'a' | 'b' | 'c' | 'd' | 'e',
      explanation: form.explanation,
      difficulty: form.difficulty as any,
      has_table: form.has_table,
      is_active: true,
    }

    if (question) {
      const { error } = await supabase.from('questions').update(payload).eq('id', question.id)
      if (error) { toast.error('Error al actualizar'); setSaving(false); return }
      toast.success('Pregunta actualizada')
    } else {
      const { error } = await supabase.from('questions').insert([payload])
      if (error) { toast.error('Error al crear pregunta'); setSaving(false); return }
      toast.success('Pregunta creada')
    }

    setSaving(false)
    onSave()
  }

  return (
    <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Especialidad</Label>
          <Select value={form.specialty_id} onValueChange={(v) => setForm({ ...form, specialty_id: v })}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar..." />
            </SelectTrigger>
            <SelectContent>
              {specialties.map((s) => (
                <SelectItem key={s.id} value={String(s.id)}>{s.icon} {s.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Dificultad</Label>
          <Select value={form.difficulty} onValueChange={(v) => setForm({ ...form, difficulty: v as any })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Fácil</SelectItem>
              <SelectItem value="medium">Medio</SelectItem>
              <SelectItem value="hard">Difícil</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label>Enunciado *</Label>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Switch
                checked={form.has_table}
                onCheckedChange={(v) => {
                  setForm({ ...form, has_table: v, stem: v ? form.stem + TABLE_TEMPLATE : form.stem })
                }}
              />
              <span className="text-xs text-slate-500">Tiene tabla</span>
            </div>
            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="text-xs text-blue-600 hover:underline"
            >
              {preview ? 'Editar' : 'Vista previa'}
            </button>
          </div>
        </div>
        {preview ? (
          <div className="border border-slate-200 rounded-xl p-4 min-h-[120px] bg-slate-50 markdown-content text-sm">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{form.stem}</ReactMarkdown>
          </div>
        ) : (
          <Textarea
            value={form.stem}
            onChange={(e) => setForm({ ...form, stem: e.target.value })}
            rows={5}
            placeholder="Enunciado clínico completo..."
          />
        )}
      </div>

      {(['a', 'b', 'c', 'd', 'e'] as const).map((letter) => (
        <div key={letter} className="space-y-1.5">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-slate-700">Opción {letter.toUpperCase()}{letter !== 'e' ? ' *' : ''}</label>
            <button
              type="button"
              onClick={() => setForm({ ...form, correct_option: letter })}
              className={`text-xs px-2 py-0.5 rounded-full transition-all ${
                form.correct_option === letter
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {form.correct_option === letter ? '✓ Correcta' : 'Correcta'}
            </button>
          </div>
          <Input
            value={form[`option_${letter}` as keyof typeof form] as string}
            onChange={(e) => setForm({ ...form, [`option_${letter}`]: e.target.value })}
            placeholder={`Texto de la opción ${letter.toUpperCase()}...`}
          />
        </div>
      ))}

      <div className="space-y-1.5">
        <Label>Explicación *</Label>
        <Textarea
          value={form.explanation}
          onChange={(e) => setForm({ ...form, explanation: e.target.value })}
          rows={4}
          placeholder="Explicación educativa completa..."
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={handleSave} disabled={saving} className="flex-1 gap-2">
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {question ? 'Actualizar' : 'Crear pregunta'}
        </Button>
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
      </div>
    </div>
  )
}

export default function AdminQuestionsPage() {
  const [questions, setQuestions] = useState<QuestionWithSpec[]>([])
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterSpec, setFilterSpec] = useState<string>('all')
  const [filterDiff, setFilterDiff] = useState<string>('all')
  const [editQuestion, setEditQuestion] = useState<QuestionWithSpec | undefined>()
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    const supabase = createClient()
    const [questionsRes, specsRes] = await Promise.all([
      supabase
        .from('questions')
        .select('*, specialties(*)')
        .order('created_at', { ascending: false })
        .limit(100),
      supabase.from('specialties').select('*').order('name'),
    ])

    setQuestions((questionsRes.data as QuestionWithSpec[]) ?? [])
    setSpecialties(specsRes.data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDeactivate = async (questionId: number) => {
    const supabase = createClient()
    await supabase.from('questions').update({ is_active: false }).eq('id', questionId)
    toast.success('Pregunta desactivada')
    load()
  }

  const filtered = questions.filter((q) => {
    const matchSearch = q.stem.toLowerCase().includes(search.toLowerCase())
    const matchSpec = filterSpec === 'all' || String(q.specialty_id) === filterSpec
    const matchDiff = filterDiff === 'all' || q.difficulty === filterDiff
    return matchSearch && matchSpec && matchDiff
  })

  if (loading) return <Skeleton className="h-96" />

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="section-title">Banco de preguntas</h1>
          <p className="text-slate-500 text-sm mt-1">{questions.length} preguntas en total</p>
        </div>
        <Button onClick={() => { setEditQuestion(undefined); setShowForm(true) }} className="gap-2">
          <Plus className="w-4 h-4" />
          Nueva pregunta
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Buscar en enunciados..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterSpec} onValueChange={setFilterSpec}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Especialidad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las especialidades</SelectItem>
                {specialties.map((s) => (
                  <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterDiff} onValueChange={setFilterDiff}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Dificultad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="easy">Fácil</SelectItem>
                <SelectItem value="medium">Medio</SelectItem>
                <SelectItem value="hard">Difícil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-slate-500 border-b border-slate-100">
                  <th className="text-left pb-3 font-medium">#</th>
                  <th className="text-left pb-3 font-medium">Enunciado</th>
                  <th className="text-left pb-3 font-medium hidden md:table-cell">Especialidad</th>
                  <th className="text-center pb-3 font-medium hidden sm:table-cell">Dificultad</th>
                  <th className="text-center pb-3 font-medium hidden lg:table-cell">Estado</th>
                  <th className="text-right pb-3 font-medium">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((q) => (
                  <tr key={q.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 pr-2 text-slate-400 text-xs">{q.id}</td>
                    <td className="py-3 pr-4">
                      <div className="text-slate-700 text-sm">{truncate(q.stem.replace(/[#\*\|]/g, ''), 80)}</div>
                      {q.has_table && <Badge variant="info" className="mt-1 text-xs">Tabla</Badge>}
                      {q.ai_generated && <Badge variant="secondary" className="mt-1 ml-1 text-xs">IA</Badge>}
                    </td>
                    <td className="py-3 pr-4 hidden md:table-cell text-slate-500 text-sm">
                      {q.specialties?.name ?? '—'}
                    </td>
                    <td className="py-3 text-center hidden sm:table-cell">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getDifficultyColor(q.difficulty)}`}>
                        {getDifficultyLabel(q.difficulty)}
                      </span>
                    </td>
                    <td className="py-3 text-center hidden lg:table-cell">
                      {q.is_active ? (
                        <Badge variant="success">Activa</Badge>
                      ) : (
                        <Badge variant="secondary">Inactiva</Badge>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => { setEditQuestion(q); setShowForm(true) }}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-400 hover:text-red-600"
                          onClick={() => handleDeactivate(q.id)}
                        >
                          <EyeOff className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400 text-sm">No se encontraron preguntas.</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editQuestion ? 'Editar pregunta' : 'Nueva pregunta'}</DialogTitle>
          </DialogHeader>
          <QuestionForm
            question={editQuestion}
            specialties={specialties}
            onSave={() => { setShowForm(false); load() }}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}
