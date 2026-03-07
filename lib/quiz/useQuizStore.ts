'use client'

import { create } from 'zustand'
import type { Question, Exam, AttemptMode } from '@/lib/supabase/types'

interface QuizState {
  examId: number | null
  exam: Exam | null
  questions: Question[]
  currentIndex: number
  answers: Record<number, string>
  flagged: Set<number>
  timeRemaining: number
  timerActive: boolean
  mode: AttemptMode
  showFeedback: boolean
  startedAt: Date | null
  isSubmitting: boolean
  attemptId: string | null

  initExam: (exam: Exam, questions: Question[], mode: AttemptMode, timeLimitSeconds?: number) => void
  selectAnswer: (questionId: number, option: string) => void
  toggleFlag: (questionId: number) => void
  goToQuestion: (index: number) => void
  nextQuestion: () => void
  prevQuestion: () => void
  tickTimer: () => void
  setShowFeedback: (show: boolean) => void
  submitExam: () => Promise<string>
  resetExam: () => void
}

export const useQuizStore = create<QuizState>((set, get) => ({
  examId: null,
  exam: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  flagged: new Set(),
  timeRemaining: 0,
  timerActive: false,
  mode: 'practice',
  showFeedback: false,
  startedAt: null,
  isSubmitting: false,
  attemptId: null,

  initExam: (exam, questions, mode, timeLimitSeconds) => {
    set({
      examId: exam.id,
      exam,
      questions,
      currentIndex: 0,
      answers: {},
      flagged: new Set(),
      timeRemaining: timeLimitSeconds ?? 0,
      timerActive: (timeLimitSeconds ?? 0) > 0,
      mode,
      showFeedback: false,
      startedAt: new Date(),
      isSubmitting: false,
      attemptId: null,
    })
  },

  selectAnswer: (questionId, option) => {
    const { mode } = get()
    set((state) => ({
      answers: { ...state.answers, [questionId]: option },
      showFeedback: mode === 'practice',
    }))
  },

  toggleFlag: (questionId) => {
    set((state) => {
      const newFlagged = new Set(state.flagged)
      if (newFlagged.has(questionId)) {
        newFlagged.delete(questionId)
      } else {
        newFlagged.add(questionId)
      }
      return { flagged: newFlagged }
    })
  },

  goToQuestion: (index) => {
    const { questions } = get()
    if (index >= 0 && index < questions.length) {
      set({ currentIndex: index, showFeedback: false })
    }
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get()
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1, showFeedback: false })
    }
  },

  prevQuestion: () => {
    const { currentIndex } = get()
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1, showFeedback: false })
    }
  },

  tickTimer: () => {
    const { timeRemaining, timerActive } = get()
    if (!timerActive || timeRemaining <= 0) return

    if (timeRemaining === 1) {
      set({ timeRemaining: 0, timerActive: false })
      get().submitExam()
    } else {
      set({ timeRemaining: timeRemaining - 1 })
    }
  },

  setShowFeedback: (show) => set({ showFeedback: show }),

  submitExam: async () => {
    const { examId, answers, questions, startedAt, mode, isSubmitting } = get()
    if (isSubmitting || !examId) return ''

    set({ isSubmitting: true })

    try {
      const now = new Date()
      const timeUsed = startedAt
        ? Math.floor((now.getTime() - startedAt.getTime()) / 1000)
        : 0

      let correctCount = 0
      questions.forEach((q) => {
        const userAnswer = answers[q.id]
        if (userAnswer && userAnswer === q.correct_option) {
          correctCount++
        }
      })

      const scorePercent = (correctCount / questions.length) * 100

      const res = await fetch('/api/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId,
          answers,
          correctCount,
          totalQuestions: questions.length,
          scorePercent,
          timeUsedSeconds: timeUsed,
          mode,
        }),
      })

      if (!res.ok) throw new Error('Error al enviar examen')

      const data = await res.json()
      set({ isSubmitting: false, attemptId: data.attemptId })
      return data.attemptId as string
    } catch {
      set({ isSubmitting: false })
      throw new Error('Error al guardar resultados')
    }
  },

  resetExam: () => {
    set({
      examId: null,
      exam: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      flagged: new Set(),
      timeRemaining: 0,
      timerActive: false,
      mode: 'practice',
      showFeedback: false,
      startedAt: null,
      isSubmitting: false,
      attemptId: null,
    })
  },
}))
