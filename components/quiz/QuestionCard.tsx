'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Badge } from '@/components/ui/badge'
import { Flag } from 'lucide-react'
import { useQuizStore } from '@/lib/quiz/useQuizStore'
import OptionButton from './OptionButton'
import FeedbackPanel from './FeedbackPanel'
import { cn } from '@/lib/utils'
import type { Question } from '@/lib/supabase/types'

interface QuestionCardProps {
  question: Question
  questionNumber: number
  totalQuestions: number
  specialtyName?: string
  onNext: () => void
}

const OPTIONS: { letter: 'a' | 'b' | 'c' | 'd' | 'e'; label: string }[] = [
  { letter: 'a', label: 'A' },
  { letter: 'b', label: 'B' },
  { letter: 'c', label: 'C' },
  { letter: 'd', label: 'D' },
  { letter: 'e', label: 'E' },
]

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  specialtyName,
  onNext,
}: QuestionCardProps) {
  const { answers, flagged, mode, showFeedback, selectAnswer, toggleFlag } = useQuizStore()

  const userAnswer = answers[question.id]
  const hasAnswered = !!userAnswer
  const isFlagged = flagged.has(question.id)

  const getOptionText = (letter: 'a' | 'b' | 'c' | 'd' | 'e'): string => {
    const map = {
      a: question.option_a,
      b: question.option_b,
      c: question.option_c,
      d: question.option_d,
      e: question.option_e ?? '',
    }
    return map[letter]
  }

  const getOptionState = (letter: 'a' | 'b' | 'c' | 'd' | 'e') => {
    if (!hasAnswered || mode === 'simulation') {
      return letter === userAnswer ? 'selected' : 'default'
    }

    // Practice mode - show feedback
    if (showFeedback) {
      if (letter === question.correct_option) {
        return letter === userAnswer ? 'correct' : 'correct-unhighlighted'
      }
      if (letter === userAnswer && userAnswer !== question.correct_option) {
        return 'incorrect'
      }
    }
    return letter === userAnswer ? 'selected' : 'default'
  }

  const isCorrect = userAnswer === question.correct_option

  return (
    <div>
      {/* Question header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Badge variant="info" className="text-xs">
            Pregunta {questionNumber} de {totalQuestions}
          </Badge>
          {specialtyName && (
            <Badge variant="secondary" className="text-xs hidden sm:flex">
              {specialtyName}
            </Badge>
          )}
        </div>
        <button
          onClick={() => toggleFlag(question.id)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all',
            isFlagged
              ? 'bg-yellow-100 text-yellow-700 border border-yellow-300'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          )}
        >
          <Flag className="w-3.5 h-3.5" />
          {isFlagged ? 'Marcada' : 'Marcar'}
        </button>
      </div>

      {/* Stem */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4">
        <div className="markdown-content text-slate-800 text-sm sm:text-base leading-relaxed">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {question.stem}
          </ReactMarkdown>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-2.5">
        {OPTIONS.map(({ letter, label }) => {
          const text = getOptionText(letter)
          if (!text) return null

          return (
            <OptionButton
              key={letter}
              letter={label}
              text={text}
              state={getOptionState(letter)}
              onClick={() => {
                if (!hasAnswered) selectAnswer(question.id, letter)
              }}
              disabled={hasAnswered && mode !== 'simulation'}
            />
          )
        })}
      </div>

      {/* Feedback (Practice mode) */}
      {showFeedback && hasAnswered && mode === 'practice' && (
        <FeedbackPanel
          isCorrect={isCorrect}
          correctLetter={question.correct_option}
          explanation={question.explanation}
          onNext={onNext}
          isLastQuestion={questionNumber === totalQuestions}
        />
      )}
    </div>
  )
}
