'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CalendarDays, Target, Stethoscope, Trophy, TrendingUp, Clock, BarChart3, ChevronRight } from 'lucide-react'
import {
  COURSE_CALENDAR,
  getDaysUntilNextTest,
  getDaysUntilCourseEnd,
  type TestDate,
} from '@/lib/course-calendar'
import RAGChat from '@/components/rag/RAGChat'

// ─── Clinical tips (rotating daily) ──────────────────────────────────────────

const TIPS = [
  { area: 'Cardiología',       tip: 'FA + inestabilidad hemodinámica: cardioversión eléctrica inmediata. No esperes antiarrítmicos.' },
  { area: 'Diabetes',          tip: 'Metformina primera línea en DM2. Suspender si TFG < 30 mL/min o contraste yodado.' },
  { area: 'Neumología',        tip: 'EPOC: FEV1/FVC < 0.70 post broncodilatador. Exacerbación grave: PaCO₂ elevado = agotamiento.' },
  { area: 'Neurología',        tip: 'ACV isquémico: tPA hasta 4.5h del inicio. Contraindicado en hemorrágico o INR > 1.7.' },
  { area: 'Infectología',      tip: 'Sepsis = SOFA ≥ 2. Bundle 1h: hemocultivos, antibióticos y fluidos 30 mL/kg.' },
  { area: 'Hematología',       tip: 'Anemia ferropénica: ferritina baja + TIBC alto. Primera causa mundial de anemia.' },
  { area: 'Nefrología',        tip: 'IRA prerrenal: FENa < 1%, densidad > 1020. Renal: FENa > 2%, cilindros granulosos.' },
  { area: 'Reumatología',      tip: 'Anti-CCP: más específico para AR. FR positivo también en infecciones y sarcoidosis.' },
  { area: 'Gastroenterología', tip: 'H. pylori: triple terapia 14 días. Verificar erradicación con UBT o Ag en deposiciones.' },
  { area: 'Asma',              tip: 'Crisis grave: SpO₂ < 92%, pCO₂ normal o elevado (fatiga). UCI. No usar sedantes.' },
  { area: 'Endocrinología',    tip: 'Hipotiroidismo: TSH alto + T4L bajo. Hashimoto = anti-TPO positivo. Tratamiento: levotiroxina.' },
  { area: 'Insuf. cardíaca',   tip: 'IC con FEyVI reducida: IECA + betabloqueador + espironolactona reducen mortalidad.' },
]

function getTodayTip() {
  const doy = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  return TIPS[doy % TIPS.length]
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────

function MiniCalendar({ testDates }: { testDates: TestDate[] }) {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
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
  const monthName = today.toLocaleString('es-CL', { month: 'long', year: 'numeric' })

  return (
    <div>
      <p className="text-sm font-semibold text-slate-700 mb-3 capitalize">{monthName}</p>
      <div className="grid grid-cols-7 mb-1">
        {['L','M','M','J','V','S','D'].map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-slate-400">{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />
          const isToday = day === todayD
          const isExam = testDaySet.has(day)
          const isPast = day < todayD
          return (
            <div
              key={i}
              title={isExam ? getTitle(day) : undefined}
              className={`flex items-center justify-center text-xs rounded-full mx-auto my-0.5 w-7 h-7 ${
                isToday ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-200' :
                isExam  ? 'bg-amber-400 text-white font-bold cursor-help' :
                isPast  ? 'text-slate-300' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              {day}
            </div>
          )
        })}
      </div>
      <div className="flex items-center gap-3 mt-3 text-[10px] text-slate-400">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />Prueba</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />Hoy</span>
      </div>
    </div>
  )
}

// ─── GadgetSidebar ────────────────────────────────────────────────────────────

export default function GadgetSidebar() {
  const nextTest = useMemo(() => getDaysUntilNextTest(), [])
  const daysLeft = useMemo(() => getDaysUntilCourseEnd(), [])
  const tip = useMemo(() => getTodayTip(), [])

  return (
    <div className="space-y-4">

      {/* Mini calendar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
        <MiniCalendar testDates={COURSE_CALENDAR.testDates} />
        <Link href="/app/calendar" className="block mt-4">
          <Button variant="outline" size="sm" className="w-full text-xs gap-1.5">
            <CalendarDays className="w-3.5 h-3.5" />
            Calendario completo
          </Button>
        </Link>
      </div>

      {/* Next exam countdown */}
      {nextTest && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Próxima prueba</span>
          </div>
          <div className={`text-3xl font-bold tabular-nums ${nextTest.days <= 7 ? 'text-red-600' : nextTest.days <= 14 ? 'text-amber-600' : 'text-slate-800'}`}>
            {nextTest.days === 0 ? '¡Hoy!' : `${nextTest.days}d`}
          </div>
          <div className="text-sm font-medium text-slate-700 mt-1">{nextTest.test.title}</div>
          <div className="text-xs text-slate-400 mt-0.5">
            {new Date(nextTest.test.date).toLocaleDateString('es-CL', { day: 'numeric', month: 'long' })}
          </div>
        </div>
      )}

      {/* Clinical tip */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm">
        <div className="flex items-center gap-1.5 mb-3">
          <Stethoscope className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Perla del día</span>
        </div>
        <div className="text-xs font-semibold text-blue-700 mb-1">{tip.area}</div>
        <p className="text-xs text-slate-600 leading-relaxed">{tip.tip}</p>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
        {[
          { href: '/app/stats',    icon: TrendingUp, label: 'Estadísticas', sub: 'Análisis de rendimiento' },
          { href: '/app/history',  icon: Clock,      label: 'Historial',    sub: 'Todos los intentos' },
          { href: '/app/coverage', icon: BarChart3,  label: 'Cobertura',    sub: 'Temario EUNACOM' },
        ].map(({ href, icon: Icon, label, sub }) => (
          <Link
            key={href}
            href={href}
            className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
              <Icon className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-slate-700">{label}</div>
              <div className="text-xs text-slate-400">{sub}</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-400" />
          </Link>
        ))}
      </div>

      {/* EUNACOM countdown */}
      {daysLeft !== null && daysLeft > 0 && (
        <div className="rounded-lg border border-slate-200 bg-white p-4 text-center shadow-sm">
          <Trophy className="w-4 h-4 mx-auto mb-2 text-amber-500" />
          <div className="text-3xl font-bold text-slate-800 tabular-nums">{daysLeft}</div>
          <div className="text-slate-500 text-xs mt-1">días para el EUNACOM</div>
        </div>
      )}

      {/* AI Tutor */}
      <RAGChat specialtyCode="diabetes" specialtyName="Diabetes y Glicemia" />

    </div>
  )
}
