'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  ArrowRight, BookOpen, Target, BarChart3, Clock, CheckCircle,
  Star, ChevronRight, Zap, Shield, Brain, TrendingUp, Play,
  Award, Users, ChevronDown
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

/* ─── Animated counter ────────────────────────────────────────────── */
function CountUp({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true
        const dur = 1600
        const step = target / (dur / 16)
        let cur = 0
        const t = setInterval(() => {
          cur += step
          if (cur >= target) { setCount(target); clearInterval(t) }
          else setCount(Math.floor(cur))
        }, 16)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString('es-CL')}{suffix}</span>
}

/* ─── Quiz mockup card (hero right side) ──────────────────────────── */
function QuizMockup() {
  const [selected, setSelected] = useState<string | null>(null)
  const [answered, setAnswered] = useState(false)

  const options = [
    { key: 'a', text: 'Aumentar la dosis de Lantus' },
    { key: 'b', text: 'Aumentar cristalina de desayuno y almuerzo' },
    { key: 'c', text: 'Aumentar cristalina de almuerzo y cena', correct: true },
    { key: 'd', text: 'Aumentar Lantus y las 3 insulinas' },
    { key: 'e', text: 'Agregar dosis matinal de Lantus' },
  ]

  const handleSelect = (key: string) => {
    if (answered) return
    setSelected(key)
    setAnswered(true)
  }

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Glow */}
      <div className="absolute -inset-4 bg-teal-400/20 rounded-3xl blur-2xl" />
      <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 text-xs border">Diabetes · P.1</Badge>
            <div className="flex items-center gap-1.5 text-orange-300 text-xs font-mono">
              <Clock className="w-3.5 h-3.5" />
              <span>1:24</span>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="p-5">
          <p className="text-sm text-slate-700 leading-relaxed mb-4 font-medium">
            Un paciente diabético tipo 1 con glicemias postalmuerzo 190 y postcena 210 (preprandiales normales).
            Su HbA1c es 8%. ¿Cuál es la conducta más adecuada?
          </p>

          <div className="space-y-2 mb-4">
            {options.map((opt) => {
              let cls = 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer'
              if (answered && selected === opt.key) {
                cls = opt.correct
                  ? 'border-green-400 bg-green-50'
                  : 'border-red-400 bg-red-50'
              } else if (answered && opt.correct) {
                cls = 'border-green-400 bg-green-50'
              }

              return (
                <div
                  key={opt.key}
                  onClick={() => handleSelect(opt.key)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 select-none ${cls}`}
                >
                  <span className="text-slate-500 font-mono text-xs w-4 flex-shrink-0">{opt.key}.</span>
                  <span className={`text-slate-700 ${answered && opt.correct ? 'font-medium text-green-700' : ''}`}>
                    {opt.text}
                  </span>
                  {answered && opt.correct && (
                    <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
                  )}
                </div>
              )
            })}
          </div>

          {answered && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800 leading-relaxed">
              <strong>Retroalimentación:</strong> Las glicemias postprandiales dependen de la insulina rápida.
              El objetivo postprandial es &lt;180 mg/dl. En este caso, solo el almuerzo y cena están elevados.
            </div>
          )}

          {!answered && (
            <p className="text-xs text-slate-400 text-center">Haz clic en una opción para responder</p>
          )}
        </div>

        {/* Nav dots */}
        <div className="px-5 pb-4 flex items-center justify-between">
          <div className="flex gap-1.5">
            {[...Array(5)].map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full transition-colors ${
                i === 0 ? (answered ? 'bg-green-400' : 'bg-blue-500') : 'bg-slate-200'
              }`} />
            ))}
          </div>
          <span className="text-xs text-slate-400">1 / 15 preguntas</span>
        </div>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl px-4 py-2.5 flex items-center gap-2 border border-slate-100">
        <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs font-medium text-slate-700">Retroalimentación inmediata</span>
      </div>
    </div>
  )
}

/* ─── Specialty pill grid ─────────────────────────────────────────── */
const specialties = [
  { icon: '❤️', name: 'Cardiología', q: 105, ok: true },
  { icon: '🩸', name: 'Diabetes', q: 45, ok: true },
  { icon: '🧬', name: 'Endocrinología', q: 120, ok: true },
  { icon: '🦠', name: 'Infectología', q: 120, ok: true },
  { icon: '🫁', name: 'Respiratorio', q: 105, ok: true },
  { icon: '🫀', name: 'Gastroenterología', q: 90, ok: true },
  { icon: '💉', name: 'Hemato-Oncología', q: 105, ok: true },
  { icon: '🫘', name: 'Nefrología', q: 120, ok: true },
  { icon: '🧠', name: 'Neurología', q: 90, ok: true },
  { icon: '🦴', name: 'Reumatología', q: 60, ok: true },
  { icon: '👴', name: 'Geriatría', q: 30, ok: true },
  { icon: '🧒', name: 'Pediatría', q: 0, ok: false },
  { icon: '👶', name: 'Gineco-Obstétrica', q: 0, ok: false },
  { icon: '🔪', name: 'Cirugía', q: 0, ok: false },
  { icon: '🧘', name: 'Psiquiatría', q: 0, ok: false },
  { icon: '🏥', name: 'Salud Pública', q: 0, ok: false },
]

/* ─── Feature card ────────────────────────────────────────────────── */
function FeatureCard({
  icon: Icon, title, desc, accent,
}: { icon: React.ElementType; title: string; desc: string; accent: string }) {
  return (
    <div className="group bg-white rounded-2xl p-7 border border-slate-200 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className={`w-12 h-12 rounded-2xl ${accent} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

/* ─── Main page ───────────────────────────────────────────────────── */
export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ── NAV ─────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        navScrolled
          ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200'
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/30">
              <span className="text-white font-bold text-sm font-mono">PE</span>
            </div>
            <span className="font-heading font-extrabold text-slate-900 text-lg tracking-tight">
              PasaTu<span className="text-teal-600">Eunacom</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#plataforma" className="text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium">Plataforma</a>
            <a href="#especialidades" className="text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium">Especialidades</a>
            <a href="#precios" className="text-sm text-slate-600 hover:text-teal-600 transition-colors font-medium">Precios</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="font-medium">Iniciar sesión</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white shadow-md shadow-teal-500/20 font-medium">
                Comenzar gratis
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B1120 0%, #0F2542 40%, #0D3B4F 100%)' }}>

        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }} />
          {/* Glows */}
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          {/* ECG Line */}
          <svg className="absolute bottom-0 left-0 right-0 w-full opacity-10" viewBox="0 0 1400 80" preserveAspectRatio="none">
            <path d="M0,40 L200,40 L225,15 L250,65 L275,5 L300,75 L325,40 L550,40 L575,20 L600,60 L625,10 L650,70 L675,40 L900,40 L925,18 L950,62 L975,8 L1000,72 L1025,40 L1400,40"
              fill="none" stroke="#5EEAD4" strokeWidth="2.5" />
          </svg>
          {/* Dots */}
          {[...Array(20)].map((_, i) => (
            <div key={i}
              className="absolute w-1 h-1 bg-teal-400/30 rounded-full"
              style={{ top: `${10 + (i * 17) % 80}%`, left: `${(i * 11) % 100}%` }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <div>
            <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/20 rounded-full px-4 py-1.5 mb-8">
              <span className="text-lg">🇨🇱</span>
              <span className="text-teal-300 text-sm font-medium">Diseñado para el EUNACOM chileno</span>
            </div>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-heading font-black text-white leading-[1.1] mb-6"
              style={{ fontFamily: 'Outfit, Inter, system-ui' }}>
              Practica como en el examen.{' '}
              <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
                Aprueba de verdad.
              </span>
            </h1>

            <p className="text-blue-200 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              +1.000 preguntas clínicas con retroalimentación experta, organizadas por especialidad,
              con cronómetro y estadísticas personalizadas de progreso.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/register">
                <Button size="lg"
                  className="bg-teal-500 hover:bg-teal-400 text-white shadow-xl shadow-teal-500/30 font-semibold text-base px-8 w-full sm:w-auto gap-2">
                  Comenzar gratis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent font-medium text-base px-8 w-full sm:w-auto">
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                Sin tarjeta de crédito
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                Retroalimentación experta
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-400" />
                Actualización continua
              </span>
            </div>
          </div>

          {/* Right: Live Quiz mockup */}
          <div className="flex justify-center lg:justify-end">
            <QuizMockup />
          </div>
        </div>

        {/* Scroll indicator */}
        <a href="#stats" className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 hover:text-white/70 transition-colors flex flex-col items-center gap-1 animate-bounce">
          <span className="text-xs">Descubrir</span>
          <ChevronDown className="w-5 h-5" />
        </a>
      </section>

      {/* ── STATS BAR ───────────────────────────────────────────── */}
      <section id="stats" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 1000, suffix: '+', label: 'Preguntas clínicas', color: 'text-teal-600' },
              { value: 17, suffix: '', label: 'Especialidades', color: 'text-blue-600' },
              { value: 482, suffix: '', label: 'Clases disponibles', color: 'text-purple-600' },
              { value: 7, suffix: '', label: 'Áreas del EUNACOM', color: 'text-orange-500' },
            ].map((s) => (
              <div key={s.label}>
                <div className={`text-4xl sm:text-5xl font-heading font-black mb-2 ${s.color}`} style={{ fontFamily: 'Outfit, Inter' }}>
                  <CountUp target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM PREVIEW ────────────────────────────────────── */}
      <section id="plataforma" className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div>
              <Badge className="bg-teal-50 text-teal-700 border-teal-200 mb-6">Plataforma completa</Badge>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-6 leading-tight"
                style={{ fontFamily: 'Outfit, Inter' }}>
                Todo lo que necesitas para aprobar el EUNACOM
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Estudia de la misma forma que lo harás en el examen. Con casos clínicos reales,
                opciones múltiples A-E, retroalimentación inmediata y análisis de tu rendimiento.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Brain, title: '3 modos de práctica', desc: 'Libre, cronometrado o simulacro EUNACOM completo', color: 'text-purple-600 bg-purple-50' },
                  { icon: TrendingUp, title: 'Estadísticas detalladas', desc: 'Ve tu progreso por especialidad, identifica puntos débiles', color: 'text-blue-600 bg-blue-50' },
                  { icon: Zap, title: 'Retroalimentación experta', desc: 'Cada respuesta incluye una explicación clínica detallada', color: 'text-teal-600 bg-teal-50' },
                  { icon: BarChart3, title: 'Historial de intentos', desc: 'Revisa todos tus cuestionarios anteriores y qué falló', color: 'text-orange-500 bg-orange-50' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors group">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800 text-sm">{item.title}</div>
                      <div className="text-slate-500 text-sm">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Navigation panel mockup */}
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-teal-100 to-blue-100 rounded-3xl blur-2xl opacity-60" />
              <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Top bar */}
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  <div className="ml-4 text-slate-400 text-xs font-mono">pasatueunacom.vercel.app/app/exam/1</div>
                </div>
                <div className="flex">
                  {/* Sidebar */}
                  <div className="w-52 bg-slate-900 text-white p-4 min-h-64 flex-shrink-0">
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Medicina Interna</div>
                    <div className="text-xs text-slate-400 mb-2">Pruebas</div>
                    {[
                      { name: '1.1 Cuestionario Diabetes', active: true },
                      { name: '1.2 Cuestionario Diabetes', active: false },
                      { name: '1.3 Cuestionario Diabetes', active: false },
                    ].map((item) => (
                      <div key={item.name} className={`flex items-center gap-2 py-2 px-2 rounded-lg mb-1 text-xs cursor-pointer ${
                        item.active ? 'bg-teal-500 text-white' : 'text-slate-400 hover:text-white'
                      }`}>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.active ? 'bg-white' : 'bg-slate-600'}`} />
                        {item.name}
                      </div>
                    ))}
                    <div className="text-xs text-slate-400 mb-2 mt-4">Endocrinología</div>
                    {['01.- Eje hipotálamo', '02.- Hipopituitarismo'].map((n) => (
                      <div key={n} className="flex items-center gap-2 py-2 px-2 text-xs text-slate-500 cursor-pointer">
                        <div className="w-2 h-2 rounded-full bg-slate-700 flex-shrink-0" />
                        {n}
                      </div>
                    ))}
                  </div>

                  {/* Main area */}
                  <div className="flex-1 p-5 bg-slate-50">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 mb-3">
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Un paciente de 55 años, diabético tipo 2 en tratamiento con metformina 500 mg c/12h,
                        presenta HbA1c de 8.5%, creatinina 1.8 mg/dl…
                      </p>
                      <div className="mt-3 space-y-1.5">
                        {['a. Agregar glibenclamida', 'b. Aumentar metformina', 'c. Iniciar insulina ✓', 'd. Iniciar hemodiálisis'].map((o, i) => (
                          <div key={i} className={`text-xs px-3 py-1.5 rounded-lg border ${
                            i === 2 ? 'border-green-300 bg-green-50 text-green-700 font-medium' : 'border-slate-200 text-slate-500'
                          }`}>{o}</div>
                        ))}
                      </div>
                    </div>
                    {/* Progress dots */}
                    <div className="flex gap-1 flex-wrap">
                      {[...Array(15)].map((_, i) => (
                        <div key={i} className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center font-bold ${
                          i < 4 ? (i === 2 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-700') :
                          i === 4 ? 'bg-blue-500 text-white ring-2 ring-blue-300' : 'bg-white border border-slate-200 text-slate-400'
                        }`}>{i + 1}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 mb-4">Características</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4"
              style={{ fontFamily: 'Outfit, Inter' }}>
              El método que sí funciona
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Aprender para el EUNACOM requiere práctica deliberada. Nuestra plataforma está diseñada para eso.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Target} title="Preguntas clínicas reales"
              desc="Casos clínicos basados en el formato exacto del EUNACOM: 5 opciones, sin penalización, mismo nivel de dificultad."
              accent="bg-red-50 text-red-600" />
            <FeatureCard icon={Brain} title="Retroalimentación experta"
              desc="Cada pregunta incluye una explicación detallada del Dr. Guevara, con el razonamiento clínico completo."
              accent="bg-purple-50 text-purple-600" />
            <FeatureCard icon={BarChart3} title="Estadísticas por área"
              desc="Visualiza tu rendimiento por especialidad y descubre exactamente en qué temas debes enfocarte más."
              accent="bg-teal-50 text-teal-600" />
            <FeatureCard icon={Clock} title="Simulacro cronometrado"
              desc="Practica con el mismo tiempo del examen real: 4 horas para 180 preguntas. Sin presiones falsas."
              accent="bg-orange-50 text-orange-500" />
            <FeatureCard icon={Zap} title="Generación IA de preguntas"
              desc="¿No hay suficientes preguntas de un tema? El sistema puede generar variantes similares con IA."
              accent="bg-yellow-50 text-yellow-600" />
            <FeatureCard icon={Shield} title="Contenido verificado"
              desc="Todas las preguntas son revisadas y basadas en el programa oficial de EUNACOM actualizado."
              accent="bg-blue-50 text-blue-600" />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4"
              style={{ fontFamily: 'Outfit, Inter' }}>
              Tan simple como 1, 2, 3
            </h2>
            <p className="text-slate-500 text-lg">Empieza a practicar en menos de 2 minutos.</p>
          </div>

          <div className="relative">
            {/* Connecting line */}
            <div className="hidden sm:block absolute top-12 left-[16.5%] right-[16.5%] h-0.5 bg-gradient-to-r from-teal-200 via-blue-200 to-purple-200" />

            <div className="grid sm:grid-cols-3 gap-10 text-center">
              {[
                { step: '1', icon: BookOpen, title: 'Elige especialidad', desc: 'Selecciona entre 11 especialidades de Medicina Interna disponibles hoy.', color: 'from-teal-400 to-teal-600' },
                { step: '2', icon: Play, title: 'Practica con el cronómetro', desc: 'Responde preguntas clínicas reales con el mismo formato del EUNACOM.', color: 'from-blue-400 to-blue-600' },
                { step: '3', icon: TrendingUp, title: 'Analiza y mejora', desc: 'Ve tus estadísticas, identifica áreas débiles y enfoca tu estudio.', color: 'from-purple-400 to-purple-600' },
              ].map((item) => (
                <div key={item.step} className="flex flex-col items-center">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${item.color} flex flex-col items-center justify-center shadow-xl mb-6 relative z-10`}>
                    <span className="text-white/60 text-xs font-bold">PASO</span>
                    <span className="text-white text-3xl font-black leading-none">{item.step}</span>
                  </div>
                  <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SPECIALTIES ─────────────────────────────────────────── */}
      <section id="especialidades" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-teal-50 text-teal-700 border-teal-200 mb-4">Cobertura EUNACOM</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4"
              style={{ fontFamily: 'Outfit, Inter' }}>
              17 especialidades, 11 disponibles hoy
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Comenzamos con Medicina Interna completa. Nuevas especialidades se agregan cada semana.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {specialties.map((spec) => (
              <div key={spec.name}
                className={`relative bg-white rounded-2xl border p-4 text-center transition-all duration-200 overflow-hidden ${
                  spec.ok
                    ? 'border-slate-200 hover:border-teal-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer group'
                    : 'border-slate-100 opacity-50'
                }`}>
                {spec.ok && (
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-50/0 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
                <div className="relative text-2xl mb-2">{spec.icon}</div>
                <div className="relative text-xs font-semibold text-slate-800 mb-1.5 leading-tight">{spec.name}</div>
                {spec.ok ? (
                  <div className="relative text-xs text-teal-600 font-medium">{spec.q} preg.</div>
                ) : (
                  <div className="relative text-xs text-slate-400">Pronto</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────────── */}
      <section id="precios" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <Badge className="bg-purple-50 text-purple-700 border-purple-200 mb-4">Planes</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4"
              style={{ fontFamily: 'Outfit, Inter' }}>
              Precios simples y transparentes
            </h2>
            <p className="text-slate-500 text-lg">Sin cobros ocultos. Acceso inmediato.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* FREE */}
            <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8">
              <div className="mb-6">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Plan Gratuito</div>
                <div className="text-5xl font-heading font-black text-slate-900 mb-1" style={{ fontFamily: 'Outfit, Inter' }}>$0</div>
                <div className="text-slate-500 text-sm">Para explorar la plataforma</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  { text: '3 preguntas de muestra por especialidad', ok: true },
                  { text: 'Sin cronómetro', ok: false },
                  { text: 'Sin estadísticas de progreso', ok: false },
                  { text: 'Sin historial de intentos', ok: false },
                ].map(({ text, ok }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-green-100' : 'bg-slate-200'}`}>
                      {ok
                        ? <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                        : <span className="text-slate-400 text-xs">✕</span>
                      }
                    </div>
                    <span className={`text-sm ${ok ? 'text-slate-700' : 'text-slate-400'}`}>{text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full border-slate-300 font-medium">Registrarse gratis</Button>
              </Link>
            </div>

            {/* PRO */}
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl overflow-hidden">
              {/* Glow */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                <div className="bg-gradient-to-r from-teal-400 to-teal-600 text-white text-xs font-bold px-5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                  <Star className="w-3 h-3" />
                  Más popular
                </div>
              </div>
              <div className="relative mb-6 mt-2">
                <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">Plan Pro</div>
                <div className="text-5xl font-heading font-black text-white mb-1" style={{ fontFamily: 'Outfit, Inter' }}>Consultar</div>
                <div className="text-slate-400 text-sm">Activado por el administrador</div>
              </div>
              <ul className="relative space-y-3 mb-8">
                {[
                  'Acceso completo a todas las preguntas',
                  'Cronómetro + 3 modos de práctica',
                  'Estadísticas detalladas por especialidad',
                  'Historial completo de intentos',
                  'Simulacro EUNACOM (180 preguntas)',
                  'Generación de preguntas con IA',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="relative w-full bg-teal-500 hover:bg-teal-400 text-white font-semibold shadow-xl shadow-teal-900/30 gap-2">
                  Activar suscripción
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0B1120 0%, #0F2542 60%, #0D3B4F 100%)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-16 h-16 bg-teal-500/20 border border-teal-500/30 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Award className="w-8 h-8 text-teal-400" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-heading font-black text-white mb-6 leading-tight"
            style={{ fontFamily: 'Outfit, Inter' }}>
            El EUNACOM no espera.{' '}
            <span className="bg-gradient-to-r from-teal-300 to-cyan-300 bg-clip-text text-transparent">
              Empieza hoy.
            </span>
          </h2>
          <p className="text-blue-200 text-xl mb-10 max-w-xl mx-auto">
            Únete a los médicos que se preparan de forma inteligente para el examen más importante de su carrera.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg"
                className="bg-teal-500 hover:bg-teal-400 text-white shadow-xl shadow-teal-900/40 font-semibold text-base px-10 gap-2">
                Comenzar gratis ahora
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-6">Sin tarjeta de crédito · Acceso inmediato</p>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm font-mono">PE</span>
              </div>
              <div>
                <div className="text-white font-heading font-bold">
                  PasaTu<span className="text-teal-400">Eunacom</span>
                </div>
                <div className="text-xs text-slate-600">Estudia inteligente. Aprueba seguro.</div>
              </div>
            </div>
            <div className="flex gap-8 text-sm">
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Contacto</a>
            </div>
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <span>Construido para médicos chilenos</span>
              <span className="text-base">🇨🇱</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
