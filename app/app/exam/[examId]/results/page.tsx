'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { CheckCircle, XCircle, Clock, RotateCcw, BarChart3, ArrowLeft, ChevronDown, ChevronUp, Flag, BookOpen, Lightbulb } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatTime, getScoreColor } from '@/lib/utils'
import type { Attempt, Question, Exam } from '@/lib/supabase/types'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import QuizReviewBubble from '@/components/profe-goia/QuizReviewBubble'

interface AttemptWithData extends Attempt {
  exams: (Exam & { specialties: { name: string } | null }) | null
}

function ScoreCounter({ target, duration = 1500 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(Math.round(target))
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])

  return <>{count}</>
}

interface QuestionReviewItem {
  question: Question
  userAnswer: string | undefined
  isCorrect: boolean
  isFlagged: boolean
}

// Visual answer map: colored number grid
function QuestionMap({
  items,
  onSelect,
}: {
  items: QuestionReviewItem[]
  onSelect: (questionId: number) => void
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Mapa de respuestas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {items.map((item, i) => (
            <button
              key={item.question.id}
              onClick={() => onSelect(item.question.id)}
              className={cn(
                'w-9 h-9 rounded-lg text-sm font-bold flex items-center justify-center transition-all hover:scale-110 hover:shadow-md',
                item.isCorrect
                  ? 'bg-green-100 text-green-700 border-2 border-green-300 hover:bg-green-200'
                  : 'bg-red-100 text-red-700 border-2 border-red-300 hover:bg-red-200'
              )}
              title={item.isCorrect ? `Pregunta ${i + 1}: Correcta` : `Pregunta ${i + 1}: Incorrecta — ver explicación`}
            >
              {i + 1}
            </button>
          ))}
        </div>
        <div className="flex gap-6 mt-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-green-300" />
            Correcta
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-red-300" />
            Incorrecta — clic para ver explicación
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Study recommendations: list of incorrect questions with explanation preview
function StudyRecommendations({
  items,
  onSelect,
}: {
  items: QuestionReviewItem[]
  onSelect: (questionId: number) => void
}) {
  const incorrectItems = items.filter((item) => !item.isCorrect)
  if (incorrectItems.length === 0) return null

  return (
    <Card className="border-amber-200">
      <CardHeader className="bg-amber-50 rounded-t-2xl pb-3">
        <CardTitle className="text-base flex items-center gap-2 text-amber-800">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          ¿Qué repasar?
        </CardTitle>
        <p className="text-sm text-amber-700 mt-1">
          Tuviste {incorrectItems.length} respuesta{incorrectItems.length !== 1 ? 's' : ''} incorrecta{incorrectItems.length !== 1 ? 's' : ''}.
          Haz clic en cada una para ir directo a su explicación.
        </p>
      </CardHeader>
      <CardContent className="pt-4 space-y-2">
        {incorrectItems.map((item) => {
          const globalIndex = items.findIndex((i) => i.question.id === item.question.id)
          const explanationPreview = item.question.explanation
            .replace(/[#*|]/g, '')
            .trim()
            .slice(0, 130)
          return (
            <button
              key={item.question.id}
              onClick={() => onSelect(item.question.id)}
              className="w-full text-left flex items-start gap-3 p-3 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-colors group"
            >
              <span className="flex-shrink-0 w-7 h-7 rounded-lg bg-red-100 text-red-700 text-xs font-bold flex items-center justify-center group-hover:bg-red-200">
                {globalIndex + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-500 mb-0.5">Retroalimentación:</p>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {explanationPreview}{item.question.explanation.length > 130 ? '...' : ''}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5 group-hover:text-amber-500" />
            </button>
          )
        })}
      </CardContent>
    </Card>
  )
}

function QuestionReviewRow({
  item,
  index,
  expanded,
  onToggle,
}: {
  item: QuestionReviewItem
  index: number
  expanded: boolean
  onToggle: () => void
}) {
  const OPTIONS = ['a', 'b', 'c', 'd', 'e'] as const
  const LETTERS = ['A', 'B', 'C', 'D', 'E']

  const getOptionText = (letter: 'a' | 'b' | 'c' | 'd' | 'e') => {
    const map: Record<string, string | null | undefined> = {
      a: item.question.option_a,
      b: item.question.option_b,
      c: item.question.option_c,
      d: item.question.option_d,
      e: item.question.option_e,
    }
    return map[letter]
  }

  return (
    <div
      id={`q-${item.question.id}`}
      className={cn(
        'border rounded-xl overflow-hidden transition-colors',
        item.isCorrect ? 'border-slate-200' : 'border-red-200'
      )}
    >
      <button
        onClick={onToggle}
        className={cn(
          'w-full text-left p-4 flex items-center gap-3 transition-colors',
          item.isCorrect ? 'hover:bg-slate-50' : 'hover:bg-red-50/50'
        )}
      >
        <span className="text-sm text-slate-400 w-6 text-center flex-shrink-0">{index + 1}</span>
        {item.isCorrect ? (
          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
        ) : (
          <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        )}
        {item.isFlagged && <Flag className="w-4 h-4 text-yellow-500 flex-shrink-0" />}
        <div className="flex-1 min-w-0">
          <span className="flex-1 text-sm text-slate-700 truncate block">
            {item.question.stem.replace(/[#*|]/g, '').trim().slice(0, 80)}
            {item.question.stem.length > 80 ? '...' : ''}
          </span>
          {!item.isCorrect && !expanded && (
            <span className="text-xs text-red-500 mt-0.5 block">
              Toca para ver la explicación →
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
        )}
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50">
          <div className="markdown-content text-sm text-slate-700 mb-4 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {item.question.stem}
            </ReactMarkdown>
          </div>

          <div className="space-y-2 mb-4">
            {OPTIONS.map((letter, i) => {
              const text = getOptionText(letter)
              if (!text) return null
              const isCorrect = letter === item.question.correct_option
              const isUserAnswer = letter === item.userAnswer
              return (
                <div
                  key={letter}
                  className={cn(
                    'flex items-start gap-2 p-2.5 rounded-lg text-sm',
                    isCorrect && 'bg-green-50 border border-green-200',
                    isUserAnswer && !isCorrect && 'bg-red-50 border border-red-200',
                    !isCorrect && !isUserAnswer && 'bg-white border border-slate-100'
                  )}
                >
                  <span className={cn(
                    'w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0',
                    isCorrect && 'bg-green-500 text-white',
                    isUserAnswer && !isCorrect && 'bg-red-500 text-white',
                    !isCorrect && !isUserAnswer && 'bg-slate-100 text-slate-500'
                  )}>
                    {LETTERS[i]}
                  </span>
                  <span className={cn(
                    'flex-1',
                    isCorrect && 'text-green-800 font-medium',
                    isUserAnswer && !isCorrect && 'text-red-800',
                    !isCorrect && !isUserAnswer && 'text-slate-600'
                  )}>
                    {text}
                  </span>
                  {isCorrect && <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0 mt-0.5" />}
                  {isUserAnswer && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0 mt-0.5" />}
                </div>
              )
            })}
          </div>

          <div className={cn(
            'rounded-xl p-4',
            item.isCorrect
              ? 'bg-blue-50 border border-blue-200'
              : 'bg-amber-50 border border-amber-200'
          )}>
            <div className="flex items-center gap-1.5 mb-2">
              <BookOpen className={cn('w-3.5 h-3.5', item.isCorrect ? 'text-blue-600' : 'text-amber-600')} />
              <div className={cn('text-xs font-semibold', item.isCorrect ? 'text-blue-700' : 'text-amber-700')}>
                Explicación
              </div>
            </div>
            <div className="markdown-content text-sm text-slate-700 leading-relaxed">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {item.question.explanation}
              </ReactMarkdown>
            </div>
            {!item.isCorrect && (
              <div className="mt-3 pt-3 border-t border-amber-200 flex items-start gap-2">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  Asegúrate de entender bien este concepto. Lee la explicación con atención y practica preguntas similares para consolidar el aprendizaje.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function ResultsPage({ params }: { params: { examId: string } }) {
  const examId = params.examId
  const searchParams = useSearchParams()
  const attemptId = searchParams.get('attemptId')

  const [attempt, setAttempt] = useState<AttemptWithData | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'incorrect' | 'flagged'>('all')
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    const load = async () => {
      if (!attemptId) return

      const supabase = createClient()

      const [attemptRes, questionsRes] = await Promise.all([
        supabase
          .from('attempts')
          .select('*, exams(*, specialties(name))')
          .eq('id', attemptId)
          .single(),
        supabase
          .from('exam_questions')
          .select('order_index, questions(*)')
          .eq('exam_id', parseInt(examId, 10))
          .order('order_index'),
      ])

      setAttempt(attemptRes.data as AttemptWithData)
      setQuestions(
        (questionsRes.data ?? []).map((eq: any) => eq.questions).filter(Boolean)
      )
      setLoading(false)
    }

    load()
  }, [attemptId, examId])

  if (loading) {
    return (
      <div className="min-h-screen bg-eunacom-bg p-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <Skeleton className="h-48" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-24" />)}
          </div>
          <Skeleton className="h-64" />
        </div>
      </div>
    )
  }

  if (!attempt) return null

  const score = Math.round(attempt.score_percent ?? 0)
  const passed = score >= 60
  const correctCount = attempt.correct_count ?? 0
  const incorrectCount = attempt.total_questions - correctCount
  const unanswered = attempt.total_questions - Object.keys(attempt.answers).length

  const answers = attempt.answers as Record<string, string>

  const reviewItems: QuestionReviewItem[] = questions.map((q) => ({
    question: q,
    userAnswer: answers[String(q.id)],
    isCorrect: answers[String(q.id)] === q.correct_option,
    isFlagged: false,
  }))

  const filteredItems = reviewItems.filter((item) => {
    if (filter === 'incorrect') return !item.isCorrect
    if (filter === 'flagged') return item.isFlagged
    return true
  })

  const chartData = [
    { name: 'Correctas', value: correctCount, color: '#10B981' },
    { name: 'Incorrectas', value: incorrectCount, color: '#EF4444' },
    ...(unanswered > 0 ? [{ name: 'Sin responder', value: unanswered, color: '#94A3B8' }] : []),
  ]

  const toggleExpanded = (questionId: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(questionId)) {
        next.delete(questionId)
      } else {
        next.add(questionId)
      }
      return next
    })
  }

  const expandAndScrollTo = (questionId: number) => {
    setFilter('all')
    setExpandedIds((prev) => new Set([...prev, questionId]))
    setTimeout(() => {
      document.getElementById(`q-${questionId}`)?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }, 150)
  }

  return (
    <div className="min-h-screen bg-eunacom-bg">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* BACK */}
        <Link href="/app/specialties">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>
        </Link>

        {/* SCORE HERO */}
        <Card className="overflow-hidden">
          <div className={cn(
            'px-6 py-10 text-center',
            passed ? 'bg-gradient-to-br from-green-50 to-emerald-100' : 'bg-gradient-to-br from-red-50 to-rose-100'
          )}>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, type: 'spring' }}
            >
              <div className={cn(
                'text-8xl font-heading font-black mb-2 leading-none',
                score >= 80 ? 'text-green-700' : score >= 60 ? 'text-yellow-600' : 'text-red-700'
              )}>
                <ScoreCounter target={score} />%
              </div>
              <div className={cn(
                'text-2xl font-heading font-semibold mb-1',
                passed ? 'text-green-800' : 'text-red-800'
              )}>
                {passed ? '✅ Aprobado' : '❌ No aprobado'}
              </div>
              <div className="text-sm text-slate-500">
                {attempt.exams?.title}
              </div>
            </motion.div>
          </div>

          <CardContent className="pt-6">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-heading font-bold text-green-600">{correctCount}</div>
                <div className="text-xs text-slate-500 mt-0.5">Correctas</div>
              </div>
              <div>
                <div className="text-2xl font-heading font-bold text-red-500">{incorrectCount}</div>
                <div className="text-xs text-slate-500 mt-0.5">Incorrectas</div>
              </div>
              <div>
                <div className="text-2xl font-heading font-bold text-slate-600">
                  {attempt.time_used_seconds ? formatTime(attempt.time_used_seconds) : '—'}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">Tiempo</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* PROFE GOIA BUBBLE */}
        {incorrectCount > 0 && attemptId && (
          <QuizReviewBubble
            attemptId={attemptId}
            examTitle={attempt.exams?.title ?? 'Cuestionario'}
            score={score}
            incorrectItems={reviewItems
              .filter((item) => !item.isCorrect)
              .map((item) => ({
                stem: item.question.stem,
                correct_option: item.question.correct_option,
                user_answer: item.userAnswer ?? '',
                option_a: item.question.option_a ?? null,
                option_b: item.question.option_b ?? null,
                option_c: item.question.option_c ?? null,
                option_d: item.question.option_d ?? null,
                option_e: item.question.option_e ?? null,
                explanation: item.question.explanation ?? null,
              }))}
          />
        )}
        {/* QUESTION MAP */}
        <QuestionMap items={reviewItems} onSelect={expandAndScrollTo} />

        {/* STUDY RECOMMENDATIONS */}
        <StudyRecommendations items={reviewItems} onSelect={expandAndScrollTo} />

        {/* CHART */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribución de respuestas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="value"
                    paddingAngle={2}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} preguntas`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-600">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* REVIEW */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <CardTitle className="text-base">Revisión de preguntas</CardTitle>
              <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
                <TabsList>
                  <TabsTrigger value="all" className="text-xs">Todas ({questions.length})</TabsTrigger>
                  <TabsTrigger value="incorrect" className="text-xs">Incorrectas ({incorrectCount})</TabsTrigger>
                  <TabsTrigger value="flagged" className="text-xs">Marcadas</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredItems.map((item, i) => (
              <QuestionReviewRow
                key={item.question.id}
                item={item}
                index={i}
                expanded={expandedIds.has(item.question.id)}
                onToggle={() => toggleExpanded(item.question.id)}
              />
            ))}
            {filteredItems.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-sm">
                No hay preguntas en este filtro.
              </div>
            )}
          </CardContent>
        </Card>

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href={`/app/exam/${examId}`} className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <RotateCcw className="w-4 h-4" />
              Intentar de nuevo
            </Button>
          </Link>
          <Link href="/app/stats" className="flex-1">
            <Button variant="outline" className="w-full gap-2">
              <BarChart3 className="w-4 h-4" />
              Ver estadísticas
            </Button>
          </Link>
          <Link href="/app/specialties" className="flex-1">
            <Button className="w-full gap-2">
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
