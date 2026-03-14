'use client'

import { useState } from 'react'
import { Bot, Sparkles, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface IncorrectItem {
  stem: string
  correct_option: string
  user_answer: string
  option_a: string | null
  option_b: string | null
  option_c: string | null
  option_d: string | null
  option_e: string | null
  explanation: string | null
}

interface QuizReviewBubbleProps {
  attemptId: string
  examTitle: string
  score: number
  incorrectItems: IncorrectItem[]
}

export default function QuizReviewBubble({
  attemptId,
  examTitle,
  score,
  incorrectItems,
}: QuizReviewBubbleProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'dismissed'>('idle')
  const [response, setResponse] = useState('')
  const [expanded, setExpanded] = useState(true)
  const [limitReached, setLimitReached] = useState(false)

  if (state === 'dismissed') return null
  if (incorrectItems.length === 0) return null

  const handleAnalyze = async () => {
    setState('loading')
    try {
      const res = await fetch('/api/profe-goia/quiz-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId, examTitle, score, incorrectItems }),
      })

      if (res.status === 429) {
        setLimitReached(true)
        setResponse('Has alcanzado el límite diario de 5 consultas con Profe GoIA. ¡Vuelve mañana!')
        setState('done')
        return
      }
      if (!res.ok) throw new Error('API error')

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream')

      setState('done')
      let full = ''
      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        for (const line of text.split('\n')) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.delta) {
              full += data.delta
              setResponse(full)
            }
          } catch {}
        }
      }
    } catch {
      setResponse('⚠️ Error al conectar con Profe GoIA. Intenta de nuevo.')
      setState('done')
    }
  }

  return (
    <div className="rounded-xl border-2 border-[#1c2c3e] overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#1c2c3e] to-[#243447]">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow ring-2 ring-white/20">
          <Bot className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-white">Profe GoIA</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          </div>
          <div className="text-[11px] text-blue-200 leading-tight truncate">
            {examTitle}
          </div>
        </div>
        <div className="flex items-center gap-1">
          {state === 'done' && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-blue-200 hover:text-white p-1 rounded transition-colors"
            >
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <button
            onClick={() => setState('dismissed')}
            className="text-blue-200 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {state === 'idle' && (
        <div className="bg-white p-4 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 bg-slate-100 rounded-xl rounded-tl-sm px-3 py-2">
              <p className="text-sm text-slate-700 leading-relaxed">
                ¡Hola! Noté que tuviste <strong className="text-red-600">{incorrectItems.length} errores</strong> en este cuestionario.
                <br />
                ¿Quieres que te diga <strong>en qué conceptos debes reforzar</strong>? 🎯
              </p>
            </div>
          </div>
          <div className="flex gap-2 pl-11">
            <Button
              onClick={handleAnalyze}
              className="flex-1 bg-[#1c2c3e] hover:bg-[#243447] text-white text-sm gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Sí, analiza mis errores
            </Button>
            <Button
              variant="outline"
              onClick={() => setState('dismissed')}
              className="text-slate-500 text-sm"
            >
              Ahora no
            </Button>
          </div>
        </div>
      )}

      {state === 'loading' && (
        <div className="bg-white p-6 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
          <div className="text-sm text-slate-600 text-center">
            Profe GoIA está analizando tus respuestas...
          </div>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>
      )}

      {state === 'done' && expanded && (
        <div className="bg-white">
          <div className="px-4 py-3 max-h-[480px] overflow-y-auto">
            <div className="prose prose-sm max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-strong:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-h2:text-base prose-h2:mt-4 prose-h2:mb-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{response}</ReactMarkdown>
            </div>
          </div>
          {!limitReached && (
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50">
              <p className="text-xs text-slate-500 text-center">
                Esta respuesta fue guardada en tu historial de Profe GoIA.
                Puedes revisarla en cualquier momento en{' '}
                <a href="/app/profe-goia" className="text-blue-600 hover:underline font-medium">
                  Mi Profe GoIA
                </a>
                .
              </p>
            </div>
          )}
        </div>
      )}

      {state === 'done' && !expanded && (
        <div className="bg-white px-4 py-2">
          <p className="text-xs text-slate-500 text-center">
            Análisis guardado · <a href="/app/profe-goia" className="text-blue-600 hover:underline">Ver en historial</a>
          </p>
        </div>
      )}
    </div>
  )
}
