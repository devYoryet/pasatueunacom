// ================================================
// PasaTuEunacom — Course Calendar (Static Data)
// EUNACOM Julio 2026
// ================================================

export type ChapterColor = 'blue' | 'purple' | 'green' | 'orange'
export type TestType = 'diagnostic' | 'chapter' | 'simulation' | 'final'

export interface CourseWeek {
  week: number
  start: string // YYYY-MM-DD
  end: string   // YYYY-MM-DD
  topic: string
  specialtyCodes: string[]
  isRepaso?: boolean
}

export interface CourseChapter {
  number: number
  title: string
  color: ChapterColor
  weeks: CourseWeek[]
}

export interface TestDate {
  date: string // YYYY-MM-DD
  title: string
  type: TestType
  description: string
}

export interface CourseCalendar {
  courseId: string
  courseName: string
  startDate: string
  endDate: string
  chapters: CourseChapter[]
  testDates: TestDate[]
}

export const COURSE_CALENDAR: CourseCalendar = {
  courseId: 'eunacom-julio-2026',
  courseName: 'EUNACOM Julio 2026',
  startDate: '2026-01-05',
  endDate: '2026-07-10',
  chapters: [
    {
      number: 1,
      title: 'Medicina Interna',
      color: 'blue',
      weeks: [
        { week: 1,  start: '2026-01-05', end: '2026-01-11', topic: 'Diabetes',               specialtyCodes: ['diabetes'] },
        { week: 2,  start: '2026-01-12', end: '2026-01-18', topic: 'Endocrinología',          specialtyCodes: ['endocrinologia'] },
        { week: 3,  start: '2026-01-19', end: '2026-01-25', topic: 'Cardiología',             specialtyCodes: ['cardiologia'] },
        { week: 4,  start: '2026-01-26', end: '2026-02-01', topic: 'Reumatología',            specialtyCodes: ['reumatologia'] },
        { week: 5,  start: '2026-02-02', end: '2026-02-08', topic: 'Gastroenterología',       specialtyCodes: ['gastro'] },
        { week: 6,  start: '2026-02-09', end: '2026-02-15', topic: 'Hematología',             specialtyCodes: ['hematologia'] },
        { week: 7,  start: '2026-02-16', end: '2026-02-22', topic: 'Nefrología',              specialtyCodes: ['nefrologia'] },
        { week: 8,  start: '2026-02-23', end: '2026-03-01', topic: 'Infectología',            specialtyCodes: ['infectologia'] },
        { week: 9,  start: '2026-03-02', end: '2026-03-08', topic: 'Respiratorio',            specialtyCodes: ['respiratorio'] },
        { week: 10, start: '2026-03-09', end: '2026-03-15', topic: 'Neurología + Geriatría',  specialtyCodes: ['neurologia', 'geriatria'] },
        { week: 11, start: '2026-03-16', end: '2026-03-22', topic: 'Repaso + Pruebas',        specialtyCodes: [], isRepaso: true },
      ],
    },
    {
      number: 2,
      title: 'Psiquiatría, Salud Pública, Cirugía y Especialidades',
      color: 'purple',
      weeks: [
        { week: 12, start: '2026-03-23', end: '2026-03-29', topic: 'Psiquiatría',             specialtyCodes: ['psiquiatria'] },
        { week: 13, start: '2026-03-30', end: '2026-04-05', topic: 'Salud Pública',           specialtyCodes: ['salud_publica'] },
        { week: 14, start: '2026-04-06', end: '2026-04-12', topic: 'Otorrinolaringología',    specialtyCodes: ['otorrino'] },
        { week: 15, start: '2026-04-13', end: '2026-04-19', topic: 'Oftalmología',            specialtyCodes: ['oftalmologia'] },
        { week: 16, start: '2026-04-20', end: '2026-04-26', topic: 'Dermatología + Urología', specialtyCodes: ['dermatologia', 'urologia'] },
        { week: 17, start: '2026-04-27', end: '2026-05-03', topic: 'Traumatología',           specialtyCodes: ['traumatologia'] },
        { week: 18, start: '2026-05-04', end: '2026-05-10', topic: 'Cirugía y Anestesia',     specialtyCodes: ['cirugia'] },
        { week: 19, start: '2026-05-11', end: '2026-05-17', topic: 'Repaso + Pruebas',        specialtyCodes: [], isRepaso: true },
      ],
    },
    {
      number: 3,
      title: 'Obstetricia, Ginecología y Pediatría',
      color: 'green',
      weeks: [
        { week: 20, start: '2026-05-18', end: '2026-05-24', topic: 'Ginecología',             specialtyCodes: ['ginecologia'] },
        { week: 21, start: '2026-05-25', end: '2026-05-31', topic: 'Obstetricia',             specialtyCodes: ['ginecologia'] },
        { week: 22, start: '2026-06-01', end: '2026-06-07', topic: 'Pediatría',               specialtyCodes: ['pediatria'] },
        { week: 23, start: '2026-06-08', end: '2026-06-14', topic: 'Repaso + Pruebas',        specialtyCodes: [], isRepaso: true },
      ],
    },
    {
      number: 4,
      title: 'Repasos y Simulacros',
      color: 'orange',
      weeks: [
        { week: 24, start: '2026-06-15', end: '2026-06-21', topic: 'Repasos + Pruebas',       specialtyCodes: [], isRepaso: true },
        { week: 25, start: '2026-06-22', end: '2026-06-28', topic: 'Repasos + Pruebas',       specialtyCodes: [], isRepaso: true },
        { week: 26, start: '2026-06-29', end: '2026-07-05', topic: 'Repaso + Prueba Final',   specialtyCodes: [], isRepaso: true },
      ],
    },
  ],
  testDates: [
    { date: '2026-01-09', title: 'Prueba Diagnóstica',   type: 'diagnostic',  description: 'Ensayo 180 preguntas tipo EUNACOM' },
    { date: '2026-02-13', title: 'Prueba N°1',           type: 'chapter',     description: 'Capítulo 1 — Medicina Interna' },
    { date: '2026-03-20', title: 'Prueba N°2',           type: 'chapter',     description: 'Capítulo 1 — Repaso General' },
    { date: '2026-05-15', title: 'Prueba Capítulo 2',    type: 'chapter',     description: 'Psiquiatría, Cirugía y Especialidades' },
    { date: '2026-06-12', title: 'Prueba Capítulo 3',    type: 'chapter',     description: 'Obstetricia, Ginecología y Pediatría' },
    { date: '2026-06-26', title: 'Ensayo 180 N°1',       type: 'simulation',  description: 'Simulacro EUNACOM completo' },
    { date: '2026-07-03', title: 'Ensayo 180 N°2',       type: 'simulation',  description: 'Simulacro EUNACOM completo' },
    { date: '2026-07-10', title: 'Ensayo Final',          type: 'final',       description: 'Ensayo final 180 preguntas N°3' },
  ],
}

// ──────────────────────────────────────────────
// Utility helpers
// ──────────────────────────────────────────────

/** Returns the current week entry (1-26) based on today's date, or null if outside course dates */
export function getCurrentCourseWeek(): CourseWeek | null {
  const today = new Date()
  today.setHours(12, 0, 0, 0)
  for (const chapter of COURSE_CALENDAR.chapters) {
    for (const week of chapter.weeks) {
      const start = new Date(week.start)
      const end = new Date(week.end)
      end.setHours(23, 59, 59, 999)
      if (today >= start && today <= end) return week
    }
  }
  return null
}

/** Days remaining until the next upcoming test date */
export function getDaysUntilNextTest(): { test: TestDate; days: number } | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (const test of COURSE_CALENDAR.testDates) {
    const d = new Date(test.date)
    d.setHours(0, 0, 0, 0)
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    if (diff >= 0) return { test, days: diff }
  }
  return null
}

/** Days remaining until end of course */
export function getDaysUntilCourseEnd(): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const end = new Date(COURSE_CALENDAR.endDate)
  end.setHours(0, 0, 0, 0)
  return Math.max(0, Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
}

/** Format date range as "5–11 ene" */
export function formatWeekRange(start: string, end: string): string {
  const s = new Date(start)
  const e = new Date(end)
  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const startDay = s.getDate()
  const endDay = e.getDate()
  const month = months[e.getMonth()]
  return `${startDay}–${endDay} ${month}`
}

/** Chapter color → Tailwind classes */
export const CHAPTER_COLORS: Record<ChapterColor, { bg: string; text: string; border: string; badge: string; progress: string; dot: string }> = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',  badge: 'bg-blue-100 text-blue-700',   progress: '[&>div]:bg-blue-500',   dot: 'bg-blue-500' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200',badge: 'bg-purple-100 text-purple-700',progress: '[&>div]:bg-purple-500', dot: 'bg-purple-500' },
  green:  { bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',badge: 'bg-emerald-100 text-emerald-700',progress:'[&>div]:bg-emerald-500',dot:'bg-emerald-500'},
  orange: { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200', badge: 'bg-amber-100 text-amber-700',  progress: '[&>div]:bg-amber-500',  dot: 'bg-amber-500' },
}
