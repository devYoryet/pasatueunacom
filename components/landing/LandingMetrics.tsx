'use client'

import { useEffect, useRef, useState } from 'react'

interface Metric {
  value: number
  label: string
  suffix: string
}

const metrics: Metric[] = [
  { value: 1000, label: 'Preguntas clínicas', suffix: '+' },
  { value: 17, label: 'Especialidades', suffix: '' },
  { value: 482, label: 'Clases disponibles', suffix: '' },
  { value: 7, label: 'Áreas EUNACOM', suffix: '' },
]

function useCountUp(target: number, duration: number = 1500, enabled: boolean = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!enabled) return
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration, enabled])

  return count
}

function MetricCard({ value, label, suffix, enabled }: Metric & { enabled: boolean }) {
  const count = useCountUp(value, 1500, enabled)

  return (
    <div className="text-center">
      <div className="text-4xl sm:text-5xl font-heading font-black text-blue-900 mb-2">
        {count.toLocaleString('es-CL')}{suffix}
      </div>
      <div className="text-sm text-slate-500 font-medium">{label}</div>
    </div>
  )
}

export default function LandingMetrics() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12"
    >
      {metrics.map((metric) => (
        <MetricCard key={metric.label} {...metric} enabled={visible} />
      ))}
    </div>
  )
}
