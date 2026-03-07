'use client'

import { useEffect } from 'react'
import { useQuizStore } from '@/lib/quiz/useQuizStore'
import { getTimerStrokeColor } from '@/lib/quiz/quizUtils'
import { formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface QuizTimerProps {
  totalTime: number
}

export default function QuizTimer({ totalTime }: QuizTimerProps) {
  const { timeRemaining, timerActive, tickTimer } = useQuizStore()

  useEffect(() => {
    if (!timerActive) return
    const interval = setInterval(tickTimer, 1000)
    return () => clearInterval(interval)
  }, [timerActive, tickTimer])

  const radius = 22
  const circumference = 2 * Math.PI * radius
  const progress = totalTime > 0 ? (timeRemaining / totalTime) : 1
  const strokeDashoffset = circumference * (1 - progress)
  const strokeColor = getTimerStrokeColor(timeRemaining, totalTime)

  const isCritical = totalTime > 0 && timeRemaining / totalTime < 0.2

  return (
    <div className={cn('relative flex items-center justify-center w-16 h-16', isCritical && 'timer-critical')}>
      <svg width="64" height="64" className="rotate-[-90deg]">
        {/* Background circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className="text-xs font-bold tabular-nums"
          style={{ color: strokeColor }}
        >
          {formatTime(timeRemaining)}
        </span>
      </div>
    </div>
  )
}
