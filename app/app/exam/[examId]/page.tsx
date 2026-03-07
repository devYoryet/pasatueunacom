'use client'

import { useEffect, useState, use } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, AlertCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useQuizStore } from '@/lib/quiz/useQuizStore'
import QuestionCard from '@/components/quiz/QuestionCard'
import QuizTimer from '@/components/quiz/QuizTimer'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import type { Question, Exam, Specialty, AttemptMode } from '@/lib/supabase/types'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

interface ExamWithSpecialty extends Exam {
  specialties: Specialty | null
}

export default function ExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = (searchParams.get('mode') ?? 'practice') as AttemptMode

  const [exam, setExam] = useState<ExamWithSpecialty | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [showFinishDialog, setShowFinishDialog] = useState(false)

  const {
    currentIndex,
    answers,
    flagged,
    timeRemaining,
    isSubmitting,
    mode: storeMode,
    showFeedback,
    initExam,
    nextQuestion,
    prevQuestion,
    goToQuestion,
    submitExam,
    resetExam,
  } = useQuizStore()

  useEffect(() => {
    const load = async () => {
      const supabase = createClient()
      const examId = parseInt(resolvedParams.examId)

      const [examRes, questionsRes] = await Promise.all([
        supabase
          .from('exams')
          .select('*, specialties(*)')
          .eq('id', examId)
          .single(),
        supabase
          .from('exam_questions')
          .select('question_id, order_index, questions(*)')
          .eq('exam_id', examId)
          .order('order_index'),
      ])

      if (examRes.error || !examRes.data) {
        toast.error('Examen no encontrado')
        router.push('/app/specialties')
        return
      }

      const qs = (questionsRes.data ?? [])
        .map((eq: any) => eq.questions)
        .filter(Boolean) as Question[]

      setExam(examRes.data as ExamWithSpecialty)
      setQuestions(qs)

      initExam(
        examRes.data as Exam,
        qs,
        mode,
        mode === 'simulation' ? 4 * 60 * 60 : undefined
      )

      setLoading(false)
    }

    load()

    return () => {
      resetExam()
    }
  }, [resolvedParams.examId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSubmit = async () => {
    try {
      const attemptId = await submitExam()
      router.push(`/app/exam/${resolvedParams.examId}/results?attemptId=${attemptId}`)
    } catch {
      toast.error('Error al guardar los resultados. Intenta de nuevo.')
    }
    setShowFinishDialog(false)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      nextQuestion()
    } else if (storeMode === 'practice') {
      handleSubmit()
    } else {
      setShowFinishDialog(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-eunacom-bg flex flex-col">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-6">
          <Skeleton className="h-6 w-48" />
        </div>
        <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-8 space-y-4">
          <Skeleton className="h-6 w-64" />
          <Skeleton className="h-48" />
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!exam || questions.length === 0) return null

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const answeredCount = Object.keys(answers).length

  return (
    <div className="min-h-screen bg-eunacom-bg flex flex-col">
      {/* FIXED HEADER */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 sm:px-6 h-16">
          <button
            onClick={() => setShowExitDialog(true)}
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>

          <div className="flex items-center gap-3">
            <Badge variant="info" className="hidden sm:flex">{exam.specialties?.name}</Badge>
            <span className="font-heading font-semibold text-slate-900 text-sm sm:text-base truncate max-w-40 sm:max-w-none">
              {exam.title}
            </span>
          </div>

          {storeMode !== 'practice' && (
            <QuizTimer totalTime={exam.time_limit_seconds ?? 14400} />
          )}
          {storeMode === 'practice' && <div className="w-16" />}
        </div>

        {/* Progress bar */}
        <div className="px-4 sm:px-6 pb-2">
          <div className="flex items-center gap-3">
            <Progress value={progress} className="flex-1 h-1.5" />
            <span className="text-xs text-slate-400 whitespace-nowrap">
              {currentIndex + 1}/{questions.length}
            </span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-24 pb-28">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            specialtyName={exam.specialties?.name}
            onNext={handleNext}
          />

          {/* Simulation: Question grid nav */}
          {storeMode === 'simulation' && (
            <div className="mt-8">
              <div className="text-xs text-slate-500 mb-3 font-medium">Navegación rápida</div>
              <div className="flex flex-wrap gap-1.5">
                {questions.map((q, i) => (
                  <button
                    key={q.id}
                    onClick={() => goToQuestion(i)}
                    className={cn(
                      'w-8 h-8 rounded-lg text-xs font-medium transition-all',
                      i === currentIndex && 'bg-blue-600 text-white',
                      i !== currentIndex && answers[q.id] && 'bg-slate-200 text-slate-600',
                      i !== currentIndex && !answers[q.id] && 'bg-white border border-slate-200 text-slate-400',
                      flagged.has(q.id) && i !== currentIndex && 'border-yellow-400 bg-yellow-50 text-yellow-700'
                    )}
                  >
                    {flagged.has(q.id) ? '🚩' : i + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FIXED FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-4 sm:px-6 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={prevQuestion}
            disabled={currentIndex === 0}
            className="gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          <span className="text-xs text-slate-400">
            {answeredCount}/{questions.length} respondidas
          </span>

          <div className="flex gap-2">
            {storeMode === 'simulation' && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => setShowFinishDialog(true)}
                className="text-xs"
              >
                Finalizar
              </Button>
            )}
            {storeMode !== 'simulation' && !showFeedback && (
              <Button
                size="sm"
                onClick={handleNext}
                disabled={!answers[currentQuestion.id]}
                className="gap-2"
              >
                <span className="hidden sm:inline">
                  {currentIndex === questions.length - 1 ? 'Ver resultados' : 'Siguiente'}
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </footer>

      {/* EXIT DIALOG */}
      <Dialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              ¿Salir del examen?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            Si sales ahora, perderás tu progreso en este intento.
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowExitDialog(false)}>
              Continuar examen
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                resetExam()
                router.push('/app/specialties')
              }}
            >
              Salir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FINISH DIALOG */}
      <Dialog open={showFinishDialog} onOpenChange={setShowFinishDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Finalizar examen?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-500">
            Has respondido {answeredCount} de {questions.length} preguntas.
            {answeredCount < questions.length && (
              <span className="text-orange-600 font-medium">
                {' '}{questions.length - answeredCount} preguntas sin responder quedarán en blanco.
              </span>
            )}
          </p>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowFinishDialog(false)}>
              Seguir revisando
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting} className="gap-2">
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              Ver resultados
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
