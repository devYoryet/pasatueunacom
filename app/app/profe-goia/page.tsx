'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Bot, Sparkles, MessageSquare, BookOpen, ClipboardList, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface GoIASession {
  id: string
  context_type: 'general' | 'lesson' | 'specialty' | 'quiz_review'
  context_ref: string | null
  context_id: string | null
  question: string
  response: string
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function contextIcon(type: GoIASession['context_type']) {
  if (type === 'quiz_review') return <ClipboardList className="w-4 h-4" />
  if (type === 'lesson') return <BookOpen className="w-4 h-4" />
  return <MessageSquare className="w-4 h-4" />
}

function contextLabel(type: GoIASession['context_type']) {
  if (type === 'quiz_review') return 'Revisión de cuestionario'
  if (type === 'lesson') return 'Clase'
  if (type === 'specialty') return 'Especialidad'
  return 'Consulta general'
}

function contextColor(type: GoIASession['context_type']) {
  if (type === 'quiz_review') return 'bg-amber-100 text-amber-700 border-amber-200'
  if (type === 'lesson') return 'bg-blue-100 text-blue-700 border-blue-200'
  if (type === 'specialty') return 'bg-purple-100 text-purple-700 border-purple-200'
  return 'bg-slate-100 text-slate-600 border-slate-200'
}

function SessionCard({ session }: { session: GoIASession }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className={`inline-flex items-center gap-1 text-xs border px-2 py-0.5 rounded-full ${contextColor(session.context_type)}`}>
              {contextIcon(session.context_type)}
              {contextLabel(session.context_type)}
            </span>
            {session.context_ref && (
              <span className="text-xs text-slate-500 font-medium truncate max-w-[200px]">
                {session.context_ref}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-700 font-medium truncate">{session.question}</p>
          <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
            <Clock className="w-3 h-3" />
            {formatDate(session.created_at)}
          </div>
        </div>
        <div className="flex-shrink-0 mt-1">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50">
          <div className="flex gap-3">
            <div className="w-8 flex-shrink-0" />
            <div className="flex-1 space-y-3">
              {/* User question */}
              <div className="bg-[#1c2c3e] text-white rounded-xl rounded-tl-sm px-3 py-2 text-sm max-w-fit">
                {session.question}
              </div>
              {/* GoIA response */}
              <div className="bg-white border border-slate-200 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-slate-600">Profe GoIA</span>
                  <Sparkles className="w-3 h-3 text-cyan-500" />
                </div>
                <div className="prose prose-sm max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-strong:text-slate-800 prose-p:text-slate-600 prose-li:text-slate-600 prose-h2:text-base prose-h2:mt-3 prose-h2:mb-1.5">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{session.response}</ReactMarkdown>
                </div>
              </div>
              {/* Link back to context */}
              {session.context_type === 'quiz_review' && session.context_id && (
                <Link
                  href={`/app/exam/${session.context_id?.split('-')[0]}/results?attemptId=${session.context_id}`}
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:underline"
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  Ver cuestionario original
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProfeGoIAPage() {
  const [sessions, setSessions] = useState<GoIASession[]>([])
  const [usedToday, setUsedToday] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/profe-goia/history')
      .then((r) => r.json())
      .then((data) => {
        setSessions(data.sessions ?? [])
        setUsedToday(data.usedToday ?? 0)
      })
      .finally(() => setLoading(false))
  }, [])

  const remaining = 5 - usedToday

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg ring-4 ring-blue-100">
          <Bot className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">Mi Profe GoIA</h1>
            <Sparkles className="w-5 h-5 text-cyan-500" />
          </div>
          <p className="text-sm text-slate-500">Tu tutor IA personalizado para el EUNACOM</p>
        </div>
      </div>

      {/* Daily usage */}
      <div className="bg-gradient-to-r from-[#1c2c3e] to-[#243447] rounded-xl p-4 text-white flex items-center gap-4">
        <div className="flex-1">
          <div className="text-sm font-semibold mb-1">Consultas de hoy</div>
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${i < usedToday ? 'bg-cyan-400' : 'bg-white/20'}`}
              />
            ))}
          </div>
          <div className="text-xs text-blue-200 mt-1">{remaining} consultas restantes hoy</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold tabular-nums">{usedToday}<span className="text-blue-300 text-lg">/5</span></div>
          <div className="text-xs text-blue-200">usadas hoy</div>
        </div>
      </div>

      {/* Sessions list */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : sessions.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto">
            <Bot className="w-8 h-8 text-slate-300" />
          </div>
          <div>
            <p className="font-medium text-slate-600">Aún no tienes consultas con Profe GoIA</p>
            <p className="text-sm text-slate-400 mt-1">
              Empieza estudiando una clase o completando un cuestionario.
            </p>
          </div>
          <Link href="/app/specialties">
            <Button className="bg-[#1c2c3e] hover:bg-[#243447] text-white gap-2">
              <BookOpen className="w-4 h-4" />
              Ir a estudiar
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Historial de consultas ({sessions.length})
          </h2>
          <div className="space-y-2">
            {sessions.map((s) => (
              <SessionCard key={s.id} session={s} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
