import type { Question, Attempt } from '@/lib/supabase/types'

export function calculateScore(questions: Question[], answers: Record<number, string>) {
  let correct = 0
  let incorrect = 0
  let unanswered = 0

  questions.forEach((q) => {
    const answer = answers[q.id]
    if (!answer) {
      unanswered++
    } else if (answer === q.correct_option) {
      correct++
    } else {
      incorrect++
    }
  })

  const total = questions.length
  const scorePercent = total > 0 ? (correct / total) * 100 : 0

  return { correct, incorrect, unanswered, total, scorePercent }
}

export function isApproved(score: number): boolean {
  return score >= 60
}

export function getTimerColor(timeRemaining: number, totalTime: number): string {
  if (totalTime === 0) return 'text-blue-600'
  const ratio = timeRemaining / totalTime
  if (ratio > 0.5) return 'text-green-600'
  if (ratio > 0.2) return 'text-yellow-600'
  return 'text-red-600'
}

export function getTimerStrokeColor(timeRemaining: number, totalTime: number): string {
  if (totalTime === 0) return '#3B82F6'
  const ratio = timeRemaining / totalTime
  if (ratio > 0.5) return '#10B981'
  if (ratio > 0.2) return '#F59E0B'
  return '#EF4444'
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function getOptionLabel(option: string): string {
  return option.toUpperCase()
}

export function formatAttemptResult(attempt: Attempt): {
  passed: boolean
  scoreLabel: string
  scoreColor: string
} {
  const score = attempt.score_percent ?? 0
  const passed = score >= 60
  return {
    passed,
    scoreLabel: passed ? 'Aprobado' : 'No aprobado',
    scoreColor: score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600',
  }
}
