'use client'

import { useState, useRef, useEffect } from 'react'
import { Sparkles, Send, X, ChevronDown, Loader2, Brain } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface RAGChatProps {
  specialtyCode?: string
  specialtyName?: string
}

export default function RAGChat({
  specialtyCode = 'diabetes',
  specialtyName = 'Diabetes y Glicemia',
}: RAGChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: `¡Hola! Soy tu tutor de **${specialtyName}**. Puedes preguntarme cualquier cosa sobre el contenido de las cápsulas: diagnóstico, tratamiento, algoritmos clínicos, diferencias entre tipos, etc. ¿Qué quieres repasar?`,
        },
      ])
    }
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [open, specialtyName])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const question = input.trim()
    if (!question || loading) return

    const userMsg: Message = { role: 'user', content: question }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    let assistantText = ''
    const assistantMsg: Message = { role: 'assistant', content: '' }
    setMessages((prev) => [...prev, assistantMsg])

    try {
      const res = await fetch('/api/rag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, specialtyCode }),
      })

      if (!res.ok || !res.body) {
        throw new Error('Error en la respuesta')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6)
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            if (parsed.text) {
              assistantText += parsed.text
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: assistantText }
                return updated
              })
            }
            if (parsed.error) {
              assistantText = 'Lo siento, ocurrió un error al procesar tu pregunta. Intenta de nuevo.'
              setMessages((prev) => {
                const updated = [...prev]
                updated[updated.length - 1] = { role: 'assistant', content: assistantText }
                return updated
              })
            }
          } catch {
            // ignore parse errors
          }
        }
      }
    } catch {
      setMessages((prev) => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Lo siento, no pude conectarme. Verifica tu conexión e intenta de nuevo.',
        }
        return updated
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
      {/* Header — always visible */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Brain className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 text-left">
          <div className="text-sm font-semibold text-slate-800">Tutor IA</div>
          <div className="text-xs text-slate-400">{specialtyName}</div>
        </div>
        <div className={`transition-transform ${open ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="border-t border-slate-100">
          {/* Messages */}
          <div className="h-64 overflow-y-auto p-3 space-y-3 bg-slate-50/50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-tr-none'
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-xs max-w-none prose-p:my-1 prose-strong:text-slate-900 prose-ul:my-1">
                      <ReactMarkdown>{msg.content || '...'}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex gap-2 justify-start">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl rounded-tl-none px-3 py-2 shadow-sm">
                  <Loader2 className="w-3.5 h-3.5 text-blue-500 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggested questions */}
          {messages.length <= 1 && (
            <div className="px-3 py-2 border-t border-slate-100 flex gap-1.5 flex-wrap">
              {[
                '¿Cuándo insulinizar en DM2?',
                'Criterios diagnósticos de DM',
                'DM1 vs DM2 diferencias',
              ].map((q) => (
                <button
                  key={q}
                  onClick={() => { setInput(q) }}
                  className="text-[11px] px-2 py-1 rounded-full border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t border-slate-100 bg-white">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre el contenido de las clases..."
              className="flex-1 text-xs rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-200 transition-colors"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors flex-shrink-0"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
