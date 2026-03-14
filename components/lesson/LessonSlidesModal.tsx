'use client'

import { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { X, ChevronLeft, ChevronRight, BookOpen, Brain, Target, MessageSquare, FileText, CheckCircle, XCircle, Trophy, RotateCcw, Zap } from 'lucide-react'
import type { Lesson } from '@/lib/supabase/types'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Slide {
  type: 'cover' | 'summary' | 'concept' | 'mnemonic' | 'highyield' | 'question' | 'results'
  title: string
  content: any
  index?: number
  total?: number
  questionIndex?: number // 0-based index among question slides only
}

function buildSlides(lesson: Lesson): Slide[] {
  const slides: Slide[] = []

  slides.push({ type: 'cover', title: lesson.title, content: null })

  if (lesson.ai_summary) {
    slides.push({ type: 'summary', title: 'Resumen', content: lesson.ai_summary })
  }

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

  if (lesson.ai_review_qs?.length) {
    lesson.ai_review_qs.forEach((q, i) => {
      slides.push({
        type: 'question',
        title: 'Pregunta de Repaso',
        content: q,
        index: i + 1,
        total: lesson.ai_review_qs.length,
        questionIndex: i,
      })
    })
    // Results slide after all questions
    slides.push({
      type: 'results',
      title: 'Resultados',
      content: { total: lesson.ai_review_qs.length },
    })
  }

  return slides
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function detectCorrectOption(respuesta: string): string | null {
  const patterns = [
    /^([A-E])[).]/m,
    /respuesta\s+(?:correcta\s+)?(?:es\s+)?(?:la\s+opci[oó]n\s+)?([A-E])\b/i,
    /(?:correcta?)\s+(?:es\s+)?(?:la\s+opci[oó]n\s+)?([A-E])\b/i,
    /opci[oó]n\s+([A-E])\s+(?:es|son)\s+(?:la\s+)?correc/i,
    /\b([A-E])\)\s+es\s+(?:la\s+)?(?:respuesta\s+)?correc/i,
    /\bcorrecta?:\s*([A-E])\b/i,
  ]
  for (const p of patterns) {
    const m = respuesta.match(p)
    if (m) return m[1].toUpperCase()
  }
  return null
}

function parseQuestion(pregunta: string) {
  const lines = pregunta.split('\n')
  const questionLines: string[] = []
  const options: { letter: string; text: string }[] = []
  lines.forEach((line) => {
    const m = line.trim().match(/^([A-Ea-e])[).]\s+(.+)/)
    if (m) {
      options.push({ letter: m[1].toUpperCase(), text: m[2] })
    } else {
      questionLines.push(line)
    }
  })
  return { questionText: questionLines.join('\n').trim(), options }
}

// ─── Slide Renderers ──────────────────────────────────────────────────────────

function CoverSlide({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-8">
      {/* EnacomGo badge */}
      <div className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide mb-6">
        <Zap className="w-3 h-3" />
        EnacomGo
      </div>
      <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-5">
        <BookOpen className="w-8 h-8 text-blue-600" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 leading-tight max-w-lg">{title}</h1>
      <p className="text-sm text-slate-400 mt-4">Usa las flechas o las teclas ← → para navegar</p>
    </div>
  )
}

function SummarySlide({ content }: { content: string }) {
  return (
    <div className="flex flex-col h-full px-8 py-5">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-base font-bold text-slate-900">Resumen</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="prose prose-sm max-w-none text-slate-700 text-justify leading-relaxed [&_strong]:text-slate-900 [&_strong]:font-semibold text-[13px]">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}

function ConceptSlide({ content, index, total }: { content: string; index: number; total: number }) {
  return (
    <div className="flex flex-col h-full px-8 py-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Concepto Clave</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">{index} / {total}</span>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 w-full">
          <div className="text-slate-800 text-[13px] text-justify leading-relaxed [&_strong]:text-indigo-900 [&_strong]:font-semibold">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  )
}

function MnemonicSlide({ content, index, total }: { content: any; index: number; total: number }) {
  return (
    <div className="flex flex-col h-full px-8 py-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Brain className="w-4 h-4 text-amber-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Nemotecnia</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">{index} / {total}</span>
      </div>
      <div className="flex-1 flex flex-col justify-center gap-3">
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wide mb-1.5">Para recordar</p>
          <p className="text-[13px] text-amber-700">{content.para}</p>
        </div>
        <div className="bg-amber-100 border border-amber-300 rounded-xl p-4 text-center">
          <p className="text-xl font-bold text-amber-900">"{content.nemotecnia}"</p>
        </div>
        <div className="bg-white border border-amber-200 rounded-xl p-4">
          <p className="text-[13px] text-slate-700 text-justify leading-relaxed">{content.explicacion}</p>
        </div>
      </div>
    </div>
  )
}

function HighYieldSlide({ content, index, total }: { content: string[]; index: number; total: number }) {
  return (
    <div className="flex flex-col h-full px-8 py-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Target className="w-4 h-4 text-red-600" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Puntos EUNACOM</h2>
        </div>
        {total > 1 && <span className="text-xs text-slate-400 font-medium">{index} / {total}</span>}
      </div>
      <div className="flex-1 flex flex-col justify-center gap-2.5">
        {content.map((point, i) => (
          <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3.5">
            <span className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center text-[11px] font-bold text-red-600 flex-shrink-0 mt-0.5">
              {i + 1}
            </span>
            <div className="text-[13px] text-slate-800 text-justify leading-relaxed [&_strong]:text-red-900 [&_strong]:font-semibold">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{point}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function QuestionSlide({
  content,
  index,
  total,
  questionIndex,
  selectedAnswer,
  onAnswer,
}: {
  content: any
  index: number
  total: number
  questionIndex: number
  selectedAnswer: string | undefined
  onAnswer: (qi: number, letter: string) => void
}) {
  const { questionText, options } = parseQuestion(content.pregunta)
  const correctLetter = detectCorrectOption(content.respuesta)
  const answered = selectedAnswer !== undefined
  const hasOptions = options.length >= 2

  const getOptionStyle = (letter: string) => {
    if (!answered) return 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
    if (letter === correctLetter) return 'bg-green-50 border-green-400 text-green-800 font-semibold'
    if (letter === selectedAnswer && letter !== correctLetter) return 'bg-red-50 border-red-400 text-red-800'
    return 'bg-white border-slate-200 text-slate-400 opacity-60'
  }

  return (
    <div className="flex flex-col h-full px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <MessageSquare className="w-3.5 h-3.5 text-green-600" />
          </div>
          <h2 className="text-sm font-bold text-slate-900">Pregunta de Repaso</h2>
        </div>
        <span className="text-xs text-slate-400 font-medium">{index} / {total}</span>
      </div>

      <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto">
        {/* Question text */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
          <div className="text-[13px] font-medium text-slate-800 leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{questionText}</ReactMarkdown>
          </div>
        </div>

        {/* Options */}
        {hasOptions ? (
          <div className="grid gap-2">
            {options.map(({ letter, text }) => (
              <button
                key={letter}
                disabled={answered}
                onClick={() => onAnswer(questionIndex, letter)}
                className={`flex items-center gap-3 w-full text-left border rounded-xl px-4 py-2.5 text-[13px] transition-all ${getOptionStyle(letter)}`}
              >
                <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                  answered && letter === correctLetter ? 'border-green-500 bg-green-500 text-white' :
                  answered && letter === selectedAnswer ? 'border-red-500 bg-red-500 text-white' :
                  'border-current'
                }`}>{letter}</span>
                {text}
                {answered && letter === correctLetter && <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />}
                {answered && letter === selectedAnswer && letter !== correctLetter && <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />}
              </button>
            ))}
          </div>
        ) : (
          !answered && (
            <button
              onClick={() => onAnswer(questionIndex, '__reveal__')}
              className="py-3 rounded-xl border-2 border-dashed border-green-300 text-green-700 font-medium text-sm hover:bg-green-50 transition-colors"
            >
              Revelar respuesta
            </button>
          )
        )}

        {/* Feedback */}
        {answered && (
          <div className={`rounded-xl p-4 border ${selectedAnswer === correctLetter || selectedAnswer === '__reveal__' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
            <div className="flex items-center gap-2 mb-1.5">
              {(selectedAnswer === correctLetter || selectedAnswer === '__reveal__') ? (
                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-orange-500 flex-shrink-0" />
              )}
              <span className={`text-xs font-semibold uppercase tracking-wide ${selectedAnswer === correctLetter || selectedAnswer === '__reveal__' ? 'text-green-700' : 'text-orange-600'}`}>
                {selectedAnswer === correctLetter || selectedAnswer === '__reveal__' ? '¡Correcto!' : 'Incorrecto — Explicación:'}
              </span>
            </div>
            <div className="text-[13px] text-slate-800 leading-relaxed [&_strong]:font-semibold">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.respuesta}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function ResultsSlide({
  totalQuestions,
  answers,
  questionSlides,
  onRetry,
}: {
  totalQuestions: number
  answers: Record<number, string>
  questionSlides: Slide[]
  onRetry: () => void
}) {
  const correct = questionSlides.reduce((acc, slide, qi) => {
    const selected = answers[qi]
    if (!selected) return acc
    if (selected === '__reveal__') return acc + 1
    const correctLetter = detectCorrectOption(slide.content.respuesta)
    return acc + (correctLetter && selected === correctLetter ? 1 : 0)
  }, 0)

  const answered = Object.keys(answers).length
  const score = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0
  const allPerfect = score === 100
  const passed = score >= 67

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-5">
      {/* Score ring */}
      <div className={`w-28 h-28 rounded-full flex flex-col items-center justify-center border-4 ${
        allPerfect ? 'border-green-400 bg-green-50' : passed ? 'border-blue-400 bg-blue-50' : 'border-orange-400 bg-orange-50'
      }`}>
        <span className={`text-3xl font-black ${allPerfect ? 'text-green-600' : passed ? 'text-blue-600' : 'text-orange-500'}`}>
          {score}
        </span>
        <span className="text-xs font-semibold text-slate-500">/100</span>
      </div>

      {/* Message */}
      <div>
        {allPerfect ? (
          <>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <h3 className="text-lg font-bold text-slate-900">¡Puntaje perfecto!</h3>
              <Trophy className="w-5 h-5 text-yellow-500" />
            </div>
            <p className="text-sm text-slate-500">Dominás este tema. ¡Seguí así!</p>
          </>
        ) : passed ? (
          <>
            <h3 className="text-lg font-bold text-slate-900">¡Buen trabajo!</h3>
            <p className="text-sm text-slate-500">{correct} de {totalQuestions} respuestas correctas</p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-slate-900">Podés mejorar</h3>
            <p className="text-sm text-slate-500">{correct} de {totalQuestions} correctas — repasá y volvé a intentarlo</p>
          </>
        )}
      </div>

      {/* Unanswered note */}
      {answered < totalQuestions && (
        <p className="text-xs text-slate-400">({totalQuestions - answered} preguntas sin responder)</p>
      )}

      {/* Retry button */}
      {!allPerfect && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reintentar preguntas
        </button>
      )}
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
    results: 'bg-green-600',
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
  const [questionAnswers, setQuestionAnswers] = useState<Record<number, string>>({})
  const slides = buildSlides(lesson)
  const questionSlides = slides.filter((s) => s.type === 'question')

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

  const handleAnswer = useCallback((qi: number, letter: string) => {
    setQuestionAnswers((prev) => ({ ...prev, [qi]: letter }))
  }, [])

  const handleRetry = useCallback(() => {
    setQuestionAnswers({})
    const firstQ = slides.findIndex((s) => s.type === 'question')
    if (firstQ !== -1) setCurrent(firstQ)
  }, [slides])

  const slide = slides[current]

  const slideTypeLabel: Record<string, string> = {
    cover: 'EnacomGo',
    summary: 'Resumen',
    concept: 'Conceptos Clave',
    mnemonic: 'Nemotecnias',
    highyield: 'EUNACOM High-Yield',
    question: 'Preguntas de Repaso',
    results: 'Resultados',
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden"
        style={{ height: 'min(680px, 93vh)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-blue-600 text-white px-2 py-0.5 rounded-full text-[11px] font-bold tracking-wide">
              <Zap className="w-2.5 h-2.5" />
              EnacomGo
            </div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {slideTypeLabel[slide.type]}
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
          {slide.type === 'question' && (
            <QuestionSlide
              key={`q-${slide.questionIndex}`}
              content={slide.content}
              index={slide.index!}
              total={slide.total!}
              questionIndex={slide.questionIndex!}
              selectedAnswer={questionAnswers[slide.questionIndex!]}
              onAnswer={handleAnswer}
            />
          )}
          {slide.type === 'results' && (
            <ResultsSlide
              totalQuestions={slide.content.total}
              answers={questionAnswers}
              questionSlides={questionSlides}
              onRetry={handleRetry}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-100">
          <button
            onClick={prev}
            disabled={current === 0}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </button>

          {/* Dot navigation */}
          <div className="flex gap-1.5 max-w-[200px] overflow-hidden">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all flex-shrink-0 ${
                  i === current ? 'bg-blue-500 w-4' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

          <button
            onClick={current === slides.length - 1 ? onClose : next}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            {current === slides.length - 1 ? 'Cerrar' : 'Siguiente'}
            {current < slides.length - 1 && <ChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}
