'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import {
  ArrowRight, BookOpen, Target, BarChart3, Clock, CheckCircle,
  Star, ChevronRight, Zap, Shield, Brain, TrendingUp, Play,
  Award, Users, ChevronDown, Menu, X, MessageCircle
} from 'lucide-react'

const WA_PHONE = '56957982154'
const WA_MSG_PRO = encodeURIComponent('Hola! Quiero contratar el Plan Pro de EunacomGo')
const WA_MSG_INFO = encodeURIComponent('Hola! Quiero informacion sobre EunacomGo')
const waLink = (msg: string) => `https://wa.me/${WA_PHONE}?text=${msg}`
import { Button } from '@/components/ui/button'

/* --- Animated counter ------------------------------------------------ */
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

/* --- Quiz mockup card (hero right side) ------------------------------ */
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
      <div className="absolute -inset-4 bg-teal-400/10 rounded-2xl blur-2xl" />
      <div className="relative bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header bar */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs px-2 py-0.5 rounded">Diabetes · P.1</span>
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
              <strong>Retroalimentacion:</strong> Las glicemias postprandiales dependen de la insulina rapida.
              El objetivo postprandial es &lt;180 mg/dl. En este caso, solo el almuerzo y cena estan elevados.
            </div>
          )}

          {!answered && (
            <p className="text-xs text-slate-400 text-center">Haz clic en una opcion para responder</p>
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
        <span className="text-xs font-medium text-slate-700">Retroalimentacion inmediata</span>
      </div>
    </div>
  )
}

/* --- Specialty data -------------------------------------------------- */
const specialties = [
  { color: 'teal', name: 'Cardiologia', q: 105, ok: true },
  { color: 'teal', name: 'Diabetes', q: 45, ok: true },
  { color: 'teal', name: 'Endocrinologia', q: 120, ok: true },
  { color: 'teal', name: 'Infectologia', q: 120, ok: true },
  { color: 'teal', name: 'Respiratorio', q: 105, ok: true },
  { color: 'teal', name: 'Gastroenterologia', q: 90, ok: true },
  { color: 'teal', name: 'Hemato-Oncologia', q: 105, ok: true },
  { color: 'teal', name: 'Nefrologia', q: 120, ok: true },
  { color: 'teal', name: 'Neurologia', q: 90, ok: true },
  { color: 'teal', name: 'Reumatologia', q: 60, ok: true },
  { color: 'teal', name: 'Geriatria', q: 30, ok: true },
  { color: 'slate', name: 'Pediatria', q: 0, ok: false },
  { color: 'slate', name: 'Gineco-Obstetrica', q: 0, ok: false },
  { color: 'slate', name: 'Cirugia', q: 0, ok: false },
  { color: 'slate', name: 'Psiquiatria', q: 0, ok: false },
  { color: 'slate', name: 'Salud Publica', q: 0, ok: false },
]

/* --- Feature card ---------------------------------------------------- */
function FeatureCard({
  icon: Icon, title, desc,
}: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <div className="bg-white rounded-xl p-7 border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-200">
      <div className="w-11 h-11 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center mb-5">
        <Icon className="w-5 h-5" />
      </div>
      <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

/* --- Main page ------------------------------------------------------- */
export default function LandingPage() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [guidesOpen, setGuidesOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setNavScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-slate-900 focus:px-3 focus:py-2 focus:rounded-md focus:shadow-lg"
      >
        Ir al contenido principal
      </a>

      {/* ── NAV ───────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          navScrolled
            ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-200'
            : 'bg-slate-950/95 backdrop-blur-xl'
        }`}
        role="banner"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm font-mono">EG</span>
            </div>
            <span className="font-heading font-extrabold text-lg tracking-tight">
              <span className={navScrolled ? 'text-slate-900' : 'text-slate-50'}>Eunacom</span>
              <span className={navScrolled ? 'text-teal-600' : 'text-teal-300'}>Go</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8" aria-label="Secciones principales">
            <a
              href="#plataforma"
              className={`text-sm font-medium transition-colors ${
                navScrolled ? 'text-slate-700 hover:text-teal-700' : 'text-slate-100 hover:text-teal-300'
              }`}
            >
              Plataforma
            </a>
            <a
              href="#especialidades"
              className={`text-sm font-medium transition-colors ${
                navScrolled ? 'text-slate-700 hover:text-teal-700' : 'text-slate-100 hover:text-teal-300'
              }`}
            >
              Especialidades
            </a>
            <a
              href="#precios"
              className={`text-sm font-medium transition-colors ${
                navScrolled ? 'text-slate-700 hover:text-teal-700' : 'text-slate-100 hover:text-teal-300'
              }`}
            >
              Precios
            </a>
            <div className="relative">
              <button
                type="button"
                onClick={() => setGuidesOpen((open) => !open)}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setGuidesOpen(false)
                }}
                aria-haspopup="true"
                aria-expanded={guidesOpen}
                className={`text-sm font-medium transition-colors inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 ${
                  navScrolled ? 'text-slate-700 hover:text-teal-700' : 'text-slate-100 hover:text-teal-300'
                }`}
              >
                EUNACOM
                <ChevronDown className="w-3 h-3" aria-hidden="true" />
              </button>
              {guidesOpen && (
                <div
                  className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-200 bg-white shadow-lg py-2 z-50"
                  role="menu"
                  aria-label="Guias sobre el EUNACOM"
                  onMouseLeave={() => setGuidesOpen(false)}
                >
                  <Link
                    href="/eunacom/que-es"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    role="menuitem"
                  >
                    <span className="font-medium">Que es el EUNACOM?</span>
                    <span className="block text-xs text-slate-500">
                      Estructura, requisitos y puntaje.
                    </span>
                  </Link>
                  <Link
                    href="/eunacom/fechas-y-modalidades"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    role="menuitem"
                  >
                    <span className="font-medium">Fechas y modalidades</span>
                    <span className="block text-xs text-slate-500">
                      Calendario tipico y como hallar la proxima fecha.
                    </span>
                  </Link>
                  <Link
                    href="/eunacom/guia-estudio"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    role="menuitem"
                  >
                    <span className="font-medium">Guia de estudio</span>
                    <span className="block text-xs text-slate-500">
                      Plan de preparacion con EunacomGo.
                    </span>
                  </Link>
                  <Link
                    href="/eunacom/normativa-2026"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    role="menuitem"
                  >
                    <span className="font-medium">Normativa 2026</span>
                    <span className="block text-xs text-slate-500">
                      Cambios legales y formato ECOE obligatorio.
                    </span>
                  </Link>
                  <Link
                    href="/eunacom/especialidades"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                    role="menuitem"
                  >
                    <span className="font-medium">Especialidades</span>
                    <span className="block text-xs text-slate-500">
                      Las 11 areas con guias de estudio.
                    </span>
                  </Link>
                  <Link
                    href="/eunacom/preguntas-frecuentes"
                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-b-xl"
                    role="menuitem"
                  >
                    <span className="font-medium">Preguntas frecuentes</span>
                    <span className="block text-xs text-slate-500">
                      Todo sobre inscripcion, puntaje y mas.
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden md:block">
              <Button
                variant="ghost"
                size="sm"
                className={`font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-500 ${
                  navScrolled
                    ? 'text-slate-800 hover:text-teal-700'
                    : 'text-slate-100 hover:text-teal-200'
                }`}
              >
                Iniciar sesion
              </Button>
            </Link>
            <Link href="/register" className="hidden md:block">
              <Button
                size="sm"
                className="bg-teal-600 hover:bg-teal-500 text-white font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-teal-400"
              >
                Acceder gratis
              </Button>
            </Link>
            {/* Mobile hamburger */}
            <button
              type="button"
              className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? 'Cerrar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen
                ? <X className={`w-6 h-6 ${navScrolled ? 'text-slate-800' : 'text-white'}`} />
                : <Menu className={`w-6 h-6 ${navScrolled ? 'text-slate-800' : 'text-white'}`} />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE MENU ───────────────────────────────────────────── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>
      )}
      <nav
        className={`fixed top-16 left-0 right-0 z-40 md:hidden transition-all duration-300 ${
          mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
        aria-label="Menu movil"
      >
        <div className="mx-3 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-4 space-y-1">
            <a href="#plataforma" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-sm">
              <Zap className="w-4 h-4 text-teal-500" />
              Plataforma
            </a>
            <a href="#especialidades" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-sm">
              <BookOpen className="w-4 h-4 text-slate-500" />
              Especialidades
            </a>
            <a href="#precios" onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-700 hover:bg-slate-50 font-medium text-sm">
              <Star className="w-4 h-4 text-slate-500" />
              Precios
            </a>
            <hr className="my-2 border-slate-100" />
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest px-3 pt-1">Guias EUNACOM</p>
            {[
              { href: '/eunacom/que-es', label: 'Que es el EUNACOM?' },
              { href: '/eunacom/fechas-y-modalidades', label: 'Fechas y modalidades' },
              { href: '/eunacom/guia-estudio', label: 'Guia de estudio' },
              { href: '/eunacom/especialidades', label: 'Especialidades' },
              { href: '/eunacom/normativa-2026', label: 'Normativa 2026' },
              { href: '/eunacom/preguntas-frecuentes', label: 'Preguntas frecuentes' },
            ].map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 text-sm">
                {item.label}
              </Link>
            ))}
            <hr className="my-2 border-slate-100" />
            <div className="flex gap-2 pt-1">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                <Button variant="outline" className="w-full font-medium text-sm min-h-[44px]">Iniciar sesion</Button>
              </Link>
              <Link href="/register" onClick={() => setMobileMenuOpen(false)} className="flex-1">
                <Button className="w-full bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm min-h-[44px]">Acceder gratis</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <main
        id="main"
        className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-slate-950"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 grid lg:grid-cols-2 gap-16 items-center">

          {/* Left: Text */}
          <div>
            <span className="inline-block border border-teal-500/30 text-teal-400 text-xs font-medium px-3 py-1 rounded-md tracking-wide mb-8">
              Plataforma de preparacion EUNACOM · Chile
            </span>

            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-heading font-black text-white leading-[1.1] mb-6"
              style={{ fontFamily: 'Outfit, Inter, system-ui' }}>
              Prepara el EUNACOM con rigor clinico.
            </h1>

            <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
              Mas de 1.000 preguntas clinicas organizadas por especialidad, con simulacros cronometrados y analisis de rendimiento. Disenado para medicos que necesitan resultados.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link href="/register">
                <Button size="lg"
                  className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-base px-8 w-full sm:w-auto gap-2 min-h-[48px]">
                  Acceder gratis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/20 text-white/80 hover:bg-white/5 bg-transparent font-medium text-base px-8 w-full sm:w-auto min-h-[48px]"
                >
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>

            {/* Trust signals */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                Sin tarjeta de credito
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                Retroalimentacion experta
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-teal-500" />
                Actualizacion continua
              </span>
            </div>

            {/* WhatsApp contact line */}
            <div className="mt-6">
              <a
                href={waLink(WA_MSG_INFO)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-green-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-green-500" />
                Consultas sobre el programa por WhatsApp
              </a>
            </div>
          </div>

          {/* Right: Live Quiz mockup */}
          <div className="flex justify-center lg:justify-end">
            <QuizMockup />
          </div>
        </div>
      </main>

      {/* ── STATS BAR ─────────────────────────────────────────────── */}
      <section id="stats" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 1000, suffix: '+', label: 'Preguntas clinicas' },
              { value: 17, suffix: '', label: 'Especialidades' },
              { value: 482, suffix: '', label: 'Clases disponibles' },
              { value: 7, suffix: '', label: 'Areas del EUNACOM' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-4xl sm:text-5xl font-heading font-black mb-2 text-slate-900" style={{ fontFamily: 'Outfit, Inter' }}>
                  <CountUp target={s.value} suffix={s.suffix} />
                </div>
                <div className="text-sm text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATFORM PREVIEW ──────────────────────────────────────── */}
      <section id="plataforma" className="py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left text */}
            <div>
              <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-4">Plataforma completa</p>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-6 leading-tight"
                style={{ fontFamily: 'Outfit, Inter' }}>
                Una plataforma construida para el EUNACOM
              </h2>
              <p className="text-slate-500 text-lg mb-8 leading-relaxed">
                Estudia de la misma forma que lo haras en el examen. Con casos clinicos reales,
                opciones multiples A-E, retroalimentacion inmediata y analisis de tu rendimiento.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Brain, title: '3 modos de practica', desc: 'Libre, cronometrado o simulacro EUNACOM completo' },
                  { icon: TrendingUp, title: 'Estadisticas detalladas', desc: 'Ve tu progreso por especialidad, identifica puntos debiles' },
                  { icon: Zap, title: 'Retroalimentacion experta', desc: 'Cada respuesta incluye una explicacion clinica detallada' },
                  { icon: BarChart3, title: 'Historial de intentos', desc: 'Revisa todos tus cuestionarios anteriores y que fallo' },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white transition-colors">
                    <div className="w-10 h-10 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center flex-shrink-0">
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
              <div className="absolute -inset-4 bg-slate-200/60 rounded-2xl blur-2xl opacity-60" />
              <div className="relative bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Top bar */}
                <div className="bg-slate-800 px-4 py-3 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                  <div className="ml-4 text-slate-400 text-xs font-mono">eunacomgo.cl/app/exam/1</div>
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
                        item.active ? 'bg-teal-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}>
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${item.active ? 'bg-white' : 'bg-slate-600'}`} />
                        {item.name}
                      </div>
                    ))}
                    <div className="text-xs text-slate-400 mb-2 mt-4">Endocrinologia</div>
                    {['01.- Eje hipotalamo', '02.- Hipopituitarismo'].map((n) => (
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
                        Un paciente de 55 anos, diabetico tipo 2 en tratamiento con metformina 500 mg c/12h,
                        presenta HbA1c de 8.5%, creatinina 1.8 mg/dl...
                      </p>
                      <div className="mt-3 space-y-1.5">
                        {['a. Agregar glibenclamida', 'b. Aumentar metformina', 'c. Iniciar insulina (correcto)', 'd. Iniciar hemodialisis'].map((o, i) => (
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
                          i === 4 ? 'bg-teal-600 text-white ring-2 ring-teal-300' : 'bg-white border border-slate-200 text-slate-400'
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

      {/* ── FEATURES ──────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-4">Metodologia</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4"
              style={{ fontFamily: 'Outfit, Inter' }}>
              Metodo de estudio deliberado
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Aprender para el EUNACOM requiere practica deliberada. Nuestra plataforma esta disenada para eso.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard icon={Target} title="Preguntas clinicas reales"
              desc="Casos clinicos basados en el formato exacto del EUNACOM: 5 opciones, sin penalizacion, mismo nivel de dificultad." />
            <FeatureCard icon={Brain} title="Retroalimentacion experta"
              desc="Cada pregunta incluye una explicacion detallada del Dr. Guevara, con el razonamiento clinico completo." />
            <FeatureCard icon={BarChart3} title="Estadisticas por area"
              desc="Visualiza tu rendimiento por especialidad y descubre exactamente en que temas debes enfocarte mas." />
            <FeatureCard icon={Clock} title="Simulacro cronometrado"
              desc="Practica con el mismo tiempo del examen real: 4 horas para 180 preguntas. Sin presiones falsas." />
            <FeatureCard icon={Zap} title="Generacion de preguntas con IA"
              desc="No hay suficientes preguntas de un tema? El sistema puede generar variantes similares con IA." />
            <FeatureCard icon={Shield} title="Contenido verificado"
              desc="Todas las preguntas son revisadas y basadas en el programa oficial de EUNACOM actualizado." />
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4"
              style={{ fontFamily: 'Outfit, Inter' }}>
              Tres pasos para organizar tu preparacion
            </h2>
            <p className="text-slate-500 text-lg">Empieza a practicar en menos de 2 minutos.</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-10 text-center">
            {[
              {
                step: '1',
                icon: BookOpen,
                title: 'Elige especialidad',
                desc: 'Accede a las 17 areas del programa EUNACOM y organiza tu estudio por bloques tematicos.',
              },
              {
                step: '2',
                icon: Play,
                title: 'Practica con el cronometro',
                desc: 'Responde preguntas clinicas reales con el mismo formato y nivel de dificultad del EUNACOM.',
              },
              {
                step: '3',
                icon: TrendingUp,
                title: 'Analiza y refuerza',
                desc: 'Revisa tus estadisticas por especialidad, identifica areas debiles y enfoca tu estudio donde mas importa.',
              },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-6 text-lg font-black">
                  {item.step}
                </div>
                <h3 className="font-heading font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALTIES ───────────────────────────────────────────── */}
      <section id="especialidades" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-4">Cobertura por especialidad</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4"
              style={{ fontFamily: 'Outfit, Inter' }}>
              Cobertura por especialidad EUNACOM
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              El contenido se libera de forma progresiva para que puedas planificar tu estudio por bloques, sin abrumarte.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {specialties.map((spec) => (
              <div key={spec.name}
                className="bg-white rounded-lg border border-slate-200 p-3 text-left transition-all duration-200 hover:border-slate-300 hover:shadow-sm">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${spec.ok ? 'bg-teal-500' : 'bg-slate-300'}`} />
                  <div className="text-xs font-semibold text-slate-800 leading-tight">{spec.name}</div>
                </div>
                <div className="text-xs text-slate-400 pl-4">
                  {spec.q > 0 ? `${spec.q} preguntas` : 'Proximamente'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────────── */}
      <section id="precios" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <p className="text-xs font-semibold text-teal-600 uppercase tracking-wider mb-4">Precios</p>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4"
              style={{ fontFamily: 'Outfit, Inter' }}>
              Inversion en tu habilitacion profesional
            </h2>
            <p className="text-slate-500 text-lg">Acceso completo al programa por proceso EUNACOM. Sin suscripciones mensuales.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* FREE */}
            <div className="border border-slate-200 rounded-xl p-8 bg-white">
              <div className="mb-6">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Plan Gratuito</div>
                <div className="text-5xl font-heading font-black text-slate-900 mb-1" style={{ fontFamily: 'Outfit, Inter' }}>$0</div>
                <div className="text-slate-500 text-sm">Para explorar la plataforma</div>
              </div>
              <ul className="space-y-3 mb-8">
                {[
                  { text: '3 preguntas de muestra por especialidad', ok: true },
                  { text: 'Sin cronometro', ok: false },
                  { text: 'Sin estadisticas de progreso', ok: false },
                  { text: 'Sin historial de intentos', ok: false },
                ].map(({ text, ok }) => (
                  <li key={text} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${ok ? 'bg-teal-100' : 'bg-slate-100'}`}>
                      {ok
                        ? <CheckCircle className="w-3.5 h-3.5 text-teal-600" />
                        : <span className="text-slate-400 text-xs">-</span>
                      }
                    </div>
                    <span className={`text-sm ${ok ? 'text-slate-700' : 'text-slate-400'}`}>{text}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full border-slate-300 font-medium min-h-[44px]">Registrarse gratis</Button>
              </Link>
            </div>

            {/* PRO */}
            <div className="relative bg-slate-950 rounded-xl p-8 text-white overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl" />
              <div className="relative mb-6">
                <div className="text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">Plan Pro</div>
                <div className="flex items-end gap-2 mb-1">
                  <div className="text-5xl font-heading font-black text-white" style={{ fontFamily: 'Outfit, Inter' }}>$450.000</div>
                  <div className="text-slate-400 text-sm pb-1.5">CLP</div>
                </div>
                <div className="text-slate-400 text-sm mb-1">por proceso EUNACOM</div>
                <div className="text-slate-500 text-xs">Acceso completo hasta que rindas el examen. Si repites el proceso, 20% de descuento sobre el valor total.</div>
              </div>
              <ul className="relative space-y-3 mb-8">
                {[
                  'Acceso completo a todas las preguntas',
                  'Cronometro + 3 modos de practica',
                  'Estadisticas detalladas por especialidad',
                  'Historial completo de intentos',
                  'Simulacro EUNACOM (180 preguntas)',
                  'Generacion de preguntas con IA',
                  'Acceso hasta la fecha del examen',
                  '20% descuento en renovacion',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0" />
                    <span className="text-sm text-slate-300">{f}</span>
                  </li>
                ))}
              </ul>
              <a
                href={waLink(WA_MSG_PRO)}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center gap-2 w-full bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-xl transition-colors text-sm min-h-[44px]"
              >
                <MessageCircle className="w-4 h-4" />
                Contratar por WhatsApp
              </a>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-6 max-w-xl mx-auto">
            El acceso se activa manualmente por el equipo dentro de las 24 horas de confirmar el pago.
          </p>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────────── */}
      <section className="py-24 bg-slate-950 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/3 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <div className="w-14 h-14 bg-teal-500/10 border border-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-8">
            <Award className="w-7 h-7 text-teal-400" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-white mb-6 leading-tight"
            style={{ fontFamily: 'Outfit, Inter' }}>
            El EUNACOM 2026 requiere preparacion seria.
          </h2>
          <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto">
            Accede al programa completo y preparate con el mismo rigor clinico que exige el examen.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg"
                className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-base px-10 gap-2 min-h-[48px]">
                Acceder gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <a
              href={waLink(WA_MSG_PRO)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" variant="outline"
                className="border-white/20 text-white/80 hover:bg-white/5 bg-transparent font-semibold text-base px-8 gap-2 w-full sm:w-auto min-h-[48px]">
                <MessageCircle className="w-5 h-5" />
                Contratar acceso completo
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ── FLOATING WHATSAPP ─────────────────────────────────────── */}
      <a
        href={waLink(WA_MSG_INFO)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold px-4 py-3 rounded-xl shadow-2xl shadow-green-900/40 transition-all hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-5 h-5 shrink-0" />
        <span className="text-sm hidden sm:block">Preguntas? Escribenos</span>
      </a>

      {/* ── FOOTER ────────────────────────────────────────────────── */}
      <footer className="bg-slate-950 text-slate-500 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm font-mono">EG</span>
              </div>
              <div>
                <div className="text-white font-heading font-bold">
                  Eunacom<span className="text-teal-400">Go</span>
                </div>
                <div className="text-xs text-slate-600">Construido para medicos chilenos</div>
              </div>
            </div>

            <div className="flex gap-8 text-sm">
              <a href="/eunacom/preguntas-frecuentes" className="hover:text-white transition-colors">FAQ</a>
              <a href="/eunacom/especialidades" className="hover:text-white transition-colors">Especialidades</a>
              <a
                href={waLink(WA_MSG_INFO)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Contacto
              </a>
            </div>
            <div className="flex flex-col items-center md:items-end gap-1 text-xs text-slate-600">
              <div>Construido para medicos chilenos</div>
              <div>
                Hecho por{' '}
                <a
                  href="https://pulsadotech.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white underline underline-offset-2"
                >
                  pulsadotech.cl
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
