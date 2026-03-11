'use client'

import { useState, useMemo } from 'react'
import { COURSE_CALENDAR, getDaysUntilNextTest, type TestDate } from '@/lib/course-calendar'
import { CalendarDays, Target, ChevronDown, ChevronUp, Info } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

// ─── Month Grid ───────────────────────────────────────────────────────────────

function MonthGrid({ year, month, testDates }: { year: number; month: number; testDates: TestDate[] }) {
  const today = new Date()
  const todayY = today.getFullYear()
  const todayM = today.getMonth()
  const todayD = today.getDate()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7

  const testDaySet = new Set(
    testDates
      .filter((t) => { const d = new Date(t.date); return d.getFullYear() === year && d.getMonth() === month })
      .map((t) => new Date(t.date).getDate())
  )

  const getTitle = (day: number) =>
    testDates.find((t) => { const d = new Date(t.date); return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day })?.title

  const cells: (number | null)[] = [...Array(firstDow).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  const monthName = new Date(year, month).toLocaleString('es-CL', { month: 'long' })

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <h3 className="text-sm font-semibold text-slate-800 mb-3 capitalize">{monthName} {year}</h3>
      <div className="grid grid-cols-7 mb-1">
        {['L','M','M','J','V','S','D'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-slate-400 py-0.5">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />
          const isToday = year === todayY && month === todayM && day === todayD
          const isExam = testDaySet.has(day)
          const isPast = new Date(year, month, day) < new Date(todayY, todayM, todayD)
          return (
            <div
              key={i} title={isExam ? getTitle(day) : undefined}
              className={`flex items-center justify-center text-xs rounded-full mx-auto my-0.5 w-7 h-7 transition-colors ${
                isToday ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-200' :
                isExam  ? 'bg-amber-400 text-white font-bold cursor-help hover:bg-amber-500' :
                isPast  ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >{day}</div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Test Dates Timeline ──────────────────────────────────────────────────────

function TestTimeline({ testDates }: { testDates: TestDate[] }) {
  const today = new Date(); today.setHours(0, 0, 0, 0)

  const TYPE_STYLES: Record<string, string> = {
    diagnostic:  'bg-slate-100 text-slate-700 border-slate-200',
    chapter:     'bg-blue-100 text-blue-700 border-blue-200',
    simulation:  'bg-amber-100 text-amber-700 border-amber-200',
    final:       'bg-red-100 text-red-700 border-red-200',
  }
  const TYPE_LABELS: Record<string, string> = {
    diagnostic: 'Diagnóstica', chapter: 'Capítulo', simulation: 'Ensayo', final: 'Final',
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {testDates.map((test, i) => {
        const testDay = new Date(test.date); testDay.setHours(0, 0, 0, 0)
        const isPast = testDay < today
        const isToday = testDay.getTime() === today.getTime()
        const daysAway = Math.ceil((testDay.getTime() - today.getTime()) / 86400000)

        return (
          <div
            key={i}
            className={`flex items-center gap-4 px-5 py-4 border-b border-slate-50 last:border-0 transition-colors ${
              isToday ? 'bg-amber-50' : isPast ? 'bg-slate-50/50' : 'hover:bg-slate-50'
            }`}
          >
            {/* Date column */}
            <div className="w-16 flex-shrink-0 text-center">
              <div className={`text-lg font-heading font-bold ${isPast ? 'text-slate-300' : 'text-slate-800'}`}>
                {new Date(test.date).toLocaleDateString('es-CL', { day: 'numeric' })}
              </div>
              <div className={`text-xs font-medium capitalize ${isPast ? 'text-slate-300' : 'text-slate-500'}`}>
                {new Date(test.date).toLocaleDateString('es-CL', { month: 'short' })}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className={`text-sm font-semibold ${isPast ? 'text-slate-400' : 'text-slate-800'}`}>
                {test.title}
              </div>
              <div className={`text-xs mt-0.5 ${isPast ? 'text-slate-300' : 'text-slate-500'}`}>
                {test.description}
              </div>
            </div>

            {/* Badge + countdown */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <Badge variant="outline" className={`text-xs border ${TYPE_STYLES[test.type] ?? 'bg-slate-100 text-slate-600'}`}>
                {TYPE_LABELS[test.type] ?? test.type}
              </Badge>
              {!isPast && (
                <span className={`text-xs font-bold tabular-nums ${daysAway <= 7 ? 'text-red-600' : daysAway <= 14 ? 'text-amber-600' : 'text-slate-500'}`}>
                  {isToday ? '¡Hoy!' : `${daysAway}d`}
                </span>
              )}
              {isPast && (
                <span className="text-xs text-slate-300">✓</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CalendarPage() {
  const [gridsOpen, setGridsOpen] = useState(true)
  const nextTest = useMemo(() => getDaysUntilNextTest(), [])

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div>
        <h1 className="section-title">Calendario del Curso</h1>
        <p className="text-slate-500 text-sm mt-1">
          EUNACOM Julio 2026 · 5 enero — 10 julio 2026 · 26 semanas
          {nextTest && (
            <span className={`ml-2 font-medium ${nextTest.days <= 7 ? 'text-red-600' : nextTest.days <= 14 ? 'text-amber-600' : 'text-blue-600'}`}>
              · {nextTest.test.title} en {nextTest.days === 0 ? '¡Hoy!' : `${nextTest.days} días`}
            </span>
          )}
        </p>
      </div>

      {/* Monthly grids (collapsible) */}
      <div className="rounded-2xl border border-slate-200 overflow-hidden bg-white">
        <button
          onClick={() => setGridsOpen(!gridsOpen)}
          className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
        >
          <CalendarDays className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <span className="text-sm font-semibold text-slate-800 flex-1">Calendarios Mensuales</span>
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />Prueba</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />Hoy</span>
          </div>
          {gridsOpen ? <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />}
        </button>
        {gridsOpen && (
          <div className="border-t border-slate-100 p-5">
            <p className="flex items-center gap-1.5 text-xs text-slate-400 mb-4">
              <Info className="w-3.5 h-3.5" />
              Hover sobre las fechas amarillas para ver el nombre de la prueba
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[0, 1, 2, 3, 4, 5, 6].map((m) => (
                <MonthGrid key={m} year={2026} month={m} testDates={COURSE_CALENDAR.testDates} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Test dates timeline */}
      <div>
        <h2 className="flex items-center gap-2 text-base font-heading font-semibold text-slate-800 mb-3">
          <Target className="w-4 h-4 text-slate-400" />
          Guía de Pruebas y Ensayos
        </h2>
        <TestTimeline testDates={COURSE_CALENDAR.testDates} />
      </div>
    </div>
  )
}
