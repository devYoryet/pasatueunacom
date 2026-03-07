import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleString('es-CL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

export function getScoreBadgeColor(score: number): string {
  if (score >= 80) return 'bg-green-100 text-green-800 border-green-200'
  if (score >= 60) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
  return 'bg-red-100 text-red-800 border-red-200'
}

export function getDifficultyLabel(difficulty: string): string {
  const labels: Record<string, string> = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
  }
  return labels[difficulty] ?? difficulty
}

export function getDifficultyColor(difficulty: string): string {
  const colors: Record<string, string> = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  }
  return colors[difficulty] ?? 'bg-gray-100 text-gray-700'
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export const SPECIALTY_CODES = {
  CARDIOLOGIA: 'cardiologia',
  DIABETES: 'diabetes',
  ENDOCRINOLOGIA: 'endocrinologia',
  INFECTOLOGIA: 'infectologia',
  RESPIRATORIO: 'respiratorio',
  GASTRO: 'gastro',
  GERIATRIA: 'geriatria',
  HEMATOLOGIA: 'hematologia',
  NEFROLOGIA: 'nefrologia',
  NEUROLOGIA: 'neurologia',
  REUMATOLOGIA: 'reumatologia',
  PEDIATRIA: 'pediatria',
  GINECOLOGIA: 'ginecologia',
  CIRUGIA: 'cirugia',
  TRAUMATOLOGIA: 'traumatologia',
  UROLOGIA: 'urologia',
  PSIQUIATRIA: 'psiquiatria',
  DERMATOLOGIA: 'dermatologia',
  OFTALMOLOGIA: 'oftalmologia',
  OTORRINO: 'otorrino',
  SALUD_PUBLICA: 'salud_publica',
} as const
