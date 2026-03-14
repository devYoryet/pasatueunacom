'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Bot, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ProfeGoIAProps {
  /** Specialty code for context (e.g. 'diabetes') */
  specialtyCode?: string
  specialtyName?: string
  /** Lesson ID for lesson-scoped context */
  lessonId?: number
  lessonTitle?: string
  /** Suggested questions to show */
  suggestions?: string[]
  /** Initial collapsed state */
  defaultCollapsed?: boolean
}

const DEFAULT_SUGGESTIONS = [
  '¿Qué temas son más evaluados en EUNACOM?',
  'Dame una mnemotecnia para recordar mejor',
  '¿Cuál es la trampa más frecuente en preguntas de EUNACOM?',
]

const DAILY_LIMIT = 5

export default function ProfeGoIA({
  specialtyCode,
  specialtyName,
  lessonId,
  lessonTitle,
  suggestions,
  defaultCollapsed = true,
}: ProfeGoIAProps) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [usedToday, setUsedToday] = useState(0)
  const [limitReached, setLimitReached] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const contextRef = lessonTitle ?? specialtyName
  const activeSuggestions = suggestions ?? DEFAULT_SUGGESTIONS

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading || limitReached) return

    const question = text.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: question }])
    setLoading(true)

    try {
      const res = await fetch('/api/profe-goia/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          specialtyCode,
          lessonId,
          contextRef,
        }),
      })

      if (res.status === 429) {
        setLimitReached(true)
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: '⚠️ Has alcanzado el límite de 5 consultas diarias. ¡Vuelve mañana para seguir estudiando con Profe GoIA!',
          },
        ])
        setLoading(false)
        return
      }

      if (!res.ok) throw new Error('API error')

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No stream')

      let assistantMessage = ''
      setMessages((prev) => [...prev, { role: 'assistant', content: '' }])

      const decoder = new TextDecoder()
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value)
        const lines = text.split('\n')
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))
            if (data.delta) {
              assistantMessage += data.delta
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: assistantMessage }
                return updated
              })
            }
            if (data.done) {
              setUsedToday(data.usedToday ?? usedToday + 1)
              if ((data.usedToday ?? 0) >= DAILY_LIMIT) setLimitReached(true)
            }
          } catch {}
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Hubo un error al conectar con Profe GoIA. Intenta de nuevo.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const remaining = DAILY_LIMIT - usedToday

  return (
    <div className="rounded-xl border-2 border-[#1c2c3e] overflow-hidden shadow-lg">
      {/* Header */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-[#1c2c3e] text-white hover:bg-[#243447] transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center flex-shrink-0 shadow">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 text-left">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm">Profe GoIA</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          </div>
          <div className="text-[10px] text-blue-200 leading-tight">
            {contextRef ? `Tutor IA · ${contextRef}` : 'Tu tutor IA para el EUNACOM'}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {usedToday > 0 && (
            <span className="text-[10px] bg-white/10 text-blue-200 px-2 py-0.5 rounded-full">
              {remaining}/{DAILY_LIMIT} restantes
            </span>
          )}
          {collapsed ? (
            <ChevronDown className="w-4 h-4 text-blue-200" />
          ) : (
            <ChevronUp className="w-4 h-4 text-blue-200" />
          )}
        </div>
      </button>

      {!collapsed && (
        <div className="bg-white flex flex-col">
          {/* Messages */}
          <div className="min-h-[180px] max-h-[320px] overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 text-center py-2">
                  Hola 👋 Soy <strong>Profe GoIA</strong>. ¿En qué te ayudo hoy?
                </p>
                {activeSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    disabled={loading || limitReached}
                    className="w-full text-left text-xs px-3 py-2 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-colors text-slate-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {s}
                  </button>
                ))}
              </div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#1c2c3e] text-white rounded-tr-sm'
                        : 'bg-slate-100 text-slate-700 rounded-tl-sm'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-xs max-w-none prose-headings:text-sm prose-headings:font-bold prose-strong:text-slate-800 prose-p:my-1">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                    {msg.role === 'assistant' && msg.content === '' && (
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Daily limit bar */}
          {usedToday > 0 && (
            <div className="px-3 pb-1">
              <div className="flex justify-between text-[10px] text-slate-400 mb-0.5">
                <span>Consultas de hoy</span>
                <span>{usedToday}/{DAILY_LIMIT}</span>
              </div>
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${usedToday >= DAILY_LIMIT ? 'bg-red-400' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`}
                  style={{ width: `${(usedToday / DAILY_LIMIT) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 pt-1 border-t border-slate-100 flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading || limitReached}
              placeholder={limitReached ? 'Límite diario alcanzado (5/5)' : 'Pregunta a Profe GoIA...'}
              rows={1}
              className="flex-1 resize-none text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:bg-slate-50"
              style={{ minHeight: '36px', maxHeight: '80px' }}
            />
            <Button
              size="sm"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || loading || limitReached}
              className="bg-[#1c2c3e] hover:bg-[#243447] text-white px-3 h-9 flex-shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
