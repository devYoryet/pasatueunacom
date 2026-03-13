'use client'

import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { X, ChevronLeft, ChevronRight, BookOpen, Brain, Target, MessageSquare, FileText, CheckCircle, XCircle } from 'lucide-react'
import type { Lesson } from '@/lib/supabase/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Slide {
  type: 'cover' | 'summary' | 'concept' | 'mnemonic' | 'highyield' | 'question'
  title: string
  content: any
  index?: number
  total?: number
}

function buildSlides(lesson: Lesson): Slide[] {
  const slides: Slide[] = []

  // Cover slide
  slides.push({ type: 'cover', title: lesson.title, content: null })

  // Summary
  if (lesson.ai_summary) {
    slides.push({ type: 'summary', title: 'Resumen', content: lesson.ai_summary })
  }

  // Key concepts — one per slide
  if (lesson.ai_key_concepts?.length) {
    lesson.ai_key_concepts.forEach((c, i) => {
      slides.push({
        type: 'concept',
        title: 'Concepto Clave',
        content: c,
        index: i + 1,
        total: lesson.ai_key_concepts.length,
      })
    })
  }

  // Mnemonics — one per slide
  if (lesson.ai_mnemonics?.length) {
    lesson.ai_mnemonics.forEach((m, i) => {
      slides.push({
        type: 'mnemonic',
        title: 'Nemotecnia',
        content: m,
        index: i + 1,
        total: lesson.ai_mnemonics.length,
      })
    })
  }

  // High yield — grouped in 3 per slide
  if (lesson.ai_high_yield?.length) {
    const chunkSize = 4
    for (let i = 0; i < lesson.ai_high_yield.length; i += chunkSize) {
      const chunk = lesson.ai_high_yield.slice(i, i + chunkSize)
      slides.push({
        type: 'highyield',
        title: 'Puntos EUNACOM',
        content: chunk,
        index: Math.floor(i / chunkSize) + 1,
        total: Math.ceil(lesson.ai_high_yield.length / chunkSize),
      })
    }
  }

  // Review questions — one per slide
  if (lesson.ai_review_qs?.length) {
    lesson.ai_review_qs.forEach((q, i) => {
      slides.push({
        type: 'question',
        title: 'Pregunta de Repaso',
        content: q,
        index: i + 1,
        total: lesson.ai_review_qs.length,
      })
    })
  }

  return slides
}

// ─── Slide Renderers ──────────────────────────────────────────────────────────

function CoverSlide({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
        <BookOpen className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 leading-tight max-w-lg">{title}</h1>
      <p className="text-sm text-slate-400 mt-4">Usa las flechas o las teclas ← → para navegar</p>
    </div>
  )
}

function SummarySlide({ content }: { content: string }) {
  return (
    <div className="flex flex-col h-full px-8 py-6">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900">Resumen</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="prose prose-sm max-w-none text-slate-700 text-justify leading-relaxed [&_strong]:text-slate-900 [&_strong]:font-semibold">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

function ConceptSlide({ content, index, total }: { content: string; index: number; total: number }) {
  return (
    <div className="flex flex-col h-full px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Concepto Clave</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">{index} / {total}</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 w-full">
          <div className="text-slate-800 text-base text-justify leading-relaxed [&_strong]:text-indigo-900 [&_strong]:font-semibold">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

function MnemonicSlide({ content, index, total }: { content: any; index: number; total: number }) {
  return (
    <div className="flex flex-col h-full px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Nemotecnia</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">{index} / {total}</span>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-4">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-2">Para recordar</p>
          <p className="text-sm text-amber-700">{content.para}</p>
        </div>
        <div className="bg-amber-100 border border-amber-300 rounded-xl p-5 text-center">
          <p className="text-xl font-bold text-amber-900">"{content.nemotecnia}"</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-xl p-4">
          <p className="text-sm text-slate-700 text-justify leading-relaxed">{content.explicacion}</p>
        </div>
      </div>
    </div>
  )
}

function HighYieldSlide({ content, index, total }: { content: string[]; index: number; total: number }) {
  return (
    <div className="flex flex-col h-full px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-red-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Puntos EUNACOM</h2>
        </div>
        {total > 1 && <span className="text-xs text-slate-400 font-medium">{index} / {total}</span>}
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3">
        {content.map((point, i) => (
          <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-xs font-bold text-red-600 flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div className="text-sm text-slate-800 text-justify leading-relaxed [&_strong]:text-red-900 [&_strong]:font-semibold">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{point}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuestionSlide({ content, index, total }: { content: any; index: number; total: number }) {
  const [revealed, setRevealed] = useState(false)

  // Parse options if present (lines starting with A) B) C) D) or a. b. c. d.)
  const lines = content.pregunta.split('\n')
  const questionLines: string[] = []
  const optionLines: string[] = []
  lines.forEach((line: string) => {
    if (/^[A-Da-d][).]\s/.test(line.trim())) {
      optionLines.push(line.trim())
    } else {
      questionLines.push(line)
    }
  })
  const questionText = questionLines.join('\n').trim()
  const hasOptions = optionLines.length >= 2

  return (
    <div className="flex flex-col h-full px-8 py-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-4 h-4 text-green-600" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Pregunta de Repaso</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">{index} / {total}</span>
      </div>

      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {/* Question */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <div className="text-sm font-medium text-slate-800 text-justify leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{questionText}</ReactMarkdown>
          </div>
        </div>

        {/* Options if present */}
        {hasOptions && (
          <div className="grid gap-2">
            {optionLines.map((opt, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-lg px-4 py-3 text-sm text-slate-700">
                {opt}
              </div>
            ))}
          </div>
        )}

        {/* Answer reveal */}
        {!revealed ? (
          <button
            onClick={() => setRevealed(true)}
            className="mt-auto w-full py-3 rounded-xl border-2 border-dashed border-green-300 text-green-700 font-medium text-sm hover:bg-green-50 transition-colors"
          >
            Revelar respuesta
          </button>
        ) : (
          <div className="mt-auto bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">Respuesta</span>
            </div>
            <div className="text-sm text-slate-800 text-justify leading-relaxed [&_strong]:text-green-900 [&_strong]:font-semibold">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.respuesta}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function SlideProgressBar({ current, total, slides }: { current: number; total: number; slides: Slide[] }) {
  const typeColors: Record<string, string> = {
    cover: 'bg-blue-400',
    summary: 'bg-blue-500',
    concept: 'bg-indigo-500',
    mnemonic: 'bg-amber-500',
    highyield: 'bg-red-500',
    question: 'bg-green-500',
  }

  return (
    <div className="flex gap-1 px-6 py-2">
      {slides.map((slide, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-all ${
            i === current ? typeColors[slide.type] : i < current ? 'bg-slate-400' : 'bg-slate-200'
          }`}
        />
      ))}
    </div>
  )
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function LessonSlidesModal({
  lesson,
  onClose,
}: {
  lesson: Lesson
  onClose: () => void
}) {
  const [current, setCurrent] = useState(0)
  const slides = buildSlides(lesson)

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), [])
  const next = useCallback(() => setCurrent((c) => Math.min(slides.length - 1, c + 1)), [slides.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [prev, next, onClose])

  // Reset question reveal on slide change
  useEffect(() => { setCurrent((c) => c) }, [current])

  const slide = slides[current]

  const slideTypeLabel: Record<string, string> = {
    cover: '',
    summary: 'Resumen',
    concept: 'Conceptos Clave',
    mnemonic: 'Nemotecnias',
    highyield: 'EUNACOM High-Yield',
    question: 'Preguntas de Repaso',
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
        style={{ height: 'min(600px, 90vh)' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {slideTypeLabel[slide.type] || lesson.title}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 tabular-nums">{current + 1} / {slides.length}</span>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Progress */}
        <SlideProgressBar current={current} total={slides.length} slides={slides} />

        {/* Slide content */}
        <div className="flex-1 overflow-hidden">
          {slide.type === 'cover' && <CoverSlide title={slide.title} />}
          {slide.type === 'summary' && <SummarySlide content={slide.content} />}
          {slide.type === 'concept' && <ConceptSlide content={slide.content} index={slide.index!} total={slide.total!} />}
          {slide.type === 'mnemonic' && <MnemonicSlide content={slide.content} index={slide.index!} total={slide.total!} />}
          {slide.type === 'highyield' && <HighYieldSlide content={slide.content} index={slide.index!} total={slide.total!} />}
          {slide.type === 'question' && <QuestionSlide key={current} content={slide.content} index={slide.index!} total={slide.total!} />}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          {/* Dot navigation */}
          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-blue-500 w-4' : 'bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={current === slides.length - 1 ? onClose : next}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-30 transition-colors"
          >
            {current === slides.length - 1 ? 'Cerrar' : 'Siguiente'}
            {current < slides.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
