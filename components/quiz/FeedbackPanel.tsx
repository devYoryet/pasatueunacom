'use client'

import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { CheckCircle, XCircle, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FeedbackPanelProps {
  isCorrect: boolean
  correctLetter: string
  explanation: string
  onNext: () => void
  isLastQuestion: boolean
}

export default function FeedbackPanel({
  isCorrect,
  correctLetter,
  explanation,
  onNext,
  isLastQuestion,
}: FeedbackPanelProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={cn(
          'mt-6 rounded-2xl border-2 overflow-hidden',
          isCorrect
            ? 'border-green-200 bg-green-50'
            : 'border-red-200 bg-red-50'
        )}
      >
        {/* Header */}
        <div className={cn(
          'px-6 py-4 flex items-center gap-3',
          isCorrect ? 'bg-green-100 border-b border-green-200' : 'bg-red-100 border-b border-red-200'
        )}>
          {isCorrect ? (
            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
          )}
          <span className={cn(
            'font-heading font-semibold text-lg',
            isCorrect ? 'text-green-800' : 'text-red-800'
          )}>
            {isCorrect
              ? '¡Correcto!'
              : `Incorrecto — la respuesta correcta era ${correctLetter.toUpperCase()}`}
          </span>
        </div>

        {/* Explanation */}
        <div className="p-6">
          <div className="markdown-content text-slate-700 text-sm leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {explanation}
            </ReactMarkdown>
          </div>

          <div className="mt-6 flex justify-end">
            <Button onClick={onNext} className="gap-2">
              {isLastQuestion ? 'Ver resultados' : 'Siguiente pregunta'}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
