'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OptionButtonProps {
  letter: string
  text: string
  state: 'default' | 'selected' | 'correct' | 'incorrect' | 'correct-unhighlighted'
  onClick: () => void
  disabled?: boolean
}

const stateStyles: Record<string, string> = {
  default: 'border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer',
  selected: 'border-blue-500 bg-blue-50 cursor-pointer',
  correct: 'border-green-500 bg-green-50 cursor-default',
  incorrect: 'border-red-500 bg-red-50 cursor-default',
  'correct-unhighlighted': 'border-green-400 bg-green-50 cursor-default',
}

export default function OptionButton({ letter, text, state, onClick, disabled }: OptionButtonProps) {
  return (
    <motion.button
      initial={false}
      animate={{
        scale: state === 'correct' || state === 'incorrect' ? 1.01 : 1,
      }}
      transition={{ duration: 0.15 }}
      onClick={onClick}
      disabled={disabled || state === 'correct' || state === 'incorrect' || state === 'correct-unhighlighted'}
      className={cn(
        'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 flex items-start gap-3',
        stateStyles[state]
      )}
    >
      <span
        className={cn(
          'flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold',
          state === 'default' && 'bg-slate-100 text-slate-600',
          state === 'selected' && 'bg-blue-500 text-white',
          state === 'correct' && 'bg-green-500 text-white',
          state === 'incorrect' && 'bg-red-500 text-white',
          state === 'correct-unhighlighted' && 'bg-green-400 text-white',
        )}
      >
        {letter}
      </span>
      <span className={cn(
        'flex-1 text-sm leading-relaxed pt-0.5',
        state === 'default' && 'text-slate-700',
        state === 'selected' && 'text-blue-800 font-medium',
        state === 'correct' && 'text-green-800 font-medium',
        state === 'incorrect' && 'text-red-800',
        state === 'correct-unhighlighted' && 'text-green-700',
      )}>
        {text}
      </span>
      {(state === 'correct' || state === 'correct-unhighlighted') && (
        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
      )}
      {state === 'incorrect' && (
        <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      )}
    </motion.button>
  )
}
