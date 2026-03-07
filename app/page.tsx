import Link from 'next/link'
import { ArrowRight, BookOpen, Target, BarChart3, Clock, CheckCircle, Star, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import LandingMetrics from '@/components/landing/LandingMetrics'
import SpecialtyScroll from '@/components/landing/SpecialtyScroll'
import CoveragePreview from '@/components/landing/CoveragePreview'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">PE</span>
            </div>
            <span className="font-heading font-bold text-slate-900 text-lg">PasaTuEunacom</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#como-funciona" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Cómo funciona</a>
            <a href="#especialidades" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Especialidades</a>
            <a href="#precios" className="text-sm text-slate-600 hover:text-slate-900 transition-colors">Precios</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Iniciar sesión</Button>
            </Link>
            <Link href="/register">
              <Button size="sm">Comenzar gratis</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-24 pb-20 overflow-hidden" style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #1E3A8A 60%, #1D4ED8 100%)'
      }}>
        {/* SVG Decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* ECG Line */}
          <svg className="absolute top-20 right-0 w-full opacity-10" viewBox="0 0 1200 100" preserveAspectRatio="none">
            <path
              d="M0,50 L200,50 L220,20 L240,80 L260,10 L280,90 L300,50 L500,50 L520,30 L540,70 L560,20 L580,80 L600,50 L800,50 L820,25 L840,75 L860,15 L880,85 L900,50 L1200,50"
              fill="none"
              stroke="#60A5FA"
              strokeWidth="2"
            />
          </svg>
          {/* Molecule circles */}
          <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl" />
          {/* Grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="info" className="mb-6 text-sm px-4 py-1.5">
              🇨🇱 Diseñado para médicos chilenos
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-white leading-tight mb-6">
              Aprueba el EUNACOM con el sistema que entiende{' '}
              <span className="text-blue-300">cómo aprendes</span>
            </h1>
            <p className="text-lg sm:text-xl text-blue-200 mb-10 max-w-3xl mx-auto leading-relaxed">
              Más de 1.000 preguntas clínicas con retroalimentación experta, organizadas
              por especialidad, con cronómetro y estadísticas reales de progreso.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="xl" className="bg-white text-blue-900 hover:bg-blue-50 shadow-xl w-full sm:w-auto gap-2">
                  Comenzar gratis
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="xl"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent w-full sm:w-auto"
                >
                  Ya tengo cuenta
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MÉTRICAS ANIMADAS */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <LandingMetrics />
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section id="como-funciona" className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-4">
              Tan simple como 1, 2, 3
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Empieza a practicar en minutos, sin configuraciones complicadas.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: Target,
                step: '01',
                title: 'Elige especialidad y tema',
                desc: 'Selecciona entre 11 especialidades disponibles de Medicina Interna. Filtra por dificultad o cuestionario específico.',
                color: 'bg-blue-50 text-blue-600',
              },
              {
                icon: Clock,
                step: '02',
                title: 'Practica con cronómetro',
                desc: 'Responde preguntas clínicas reales con retroalimentación inmediata. Activa el modo simulacro para replicar el EUNACOM.',
                color: 'bg-green-50 text-green-600',
              },
              {
                icon: BarChart3,
                step: '03',
                title: 'Analiza tu progreso',
                desc: 'Ve tus estadísticas por especialidad, identifica tus áreas débiles y recibe recomendaciones personalizadas.',
                color: 'bg-purple-50 text-purple-600',
              },
            ].map((item) => (
              <div key={item.step} className="relative">
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 h-full">
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-6`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div className="text-xs font-mono text-slate-400 mb-2">PASO {item.step}</div>
                  <h3 className="text-xl font-heading font-semibold text-slate-900 mb-3">{item.title}</h3>
                  <p className="text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section id="especialidades" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-4">
              17 especialidades cubiertas
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              Comenzamos con Medicina Interna completa. Nuevas especialidades cada semana.
            </p>
          </div>
          <SpecialtyScroll />
        </div>
      </section>

      {/* COBERTURA EUNACOM */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <Badge variant="info" className="mb-4">Exclusivo PasaTuEunacom</Badge>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-4">
              Cobertura real del EUNACOM
            </h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto">
              La única plataforma que muestra exactamente qué porcentaje del examen ya puedes practicar.
            </p>
          </div>
          <CoveragePreview />
        </div>
      </section>

      {/* PRICING */}
      <section id="precios" className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-slate-900 mb-4">
              Planes simples y claros
            </h2>
            <p className="text-slate-500 text-lg">Sin cobros ocultos, sin sorpresas.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* FREE */}
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-heading font-semibold text-slate-900 mb-1">Plan Gratuito</h3>
              <p className="text-slate-500 text-sm mb-6">Para explorar la plataforma</p>
              <div className="text-4xl font-heading font-bold text-slate-900 mb-8">$0</div>
              <ul className="space-y-3 mb-8">
                {[
                  '3 preguntas de muestra por especialidad',
                  'Sin cronómetro',
                  'Sin estadísticas de progreso',
                  'Sin historial de intentos',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-600 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button variant="outline" className="w-full">Registrarse gratis</Button>
              </Link>
            </div>

            {/* PRO */}
            <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 shadow-md relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white border-0 px-4 py-1">
                  <Star className="w-3 h-3 mr-1" />
                  Más popular
                </Badge>
              </div>
              <h3 className="text-xl font-heading font-semibold text-slate-900 mb-1">Plan Pro</h3>
              <p className="text-slate-500 text-sm mb-6">Acceso completo para aprobar</p>
              <div className="text-4xl font-heading font-bold text-blue-700 mb-1">Consultar</div>
              <p className="text-slate-500 text-xs mb-8">Activado por el administrador</p>
              <ul className="space-y-3 mb-8">
                {[
                  'Acceso completo a todas las preguntas',
                  'Cronómetro + 3 modos de práctica',
                  'Estadísticas detalladas por especialidad',
                  'Historial completo de intentos',
                  'Simulacro EUNACOM completo (180 preguntas)',
                  'Generación de preguntas adicionales con IA',
                ].map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link href="/register">
                <Button className="w-full gap-2">
                  Activar suscripción
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-white mb-6">
            Empieza hoy. El EUNACOM no espera.
          </h2>
          <p className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Únete a los médicos que ya están usando PasaTuEunacom para prepararse de forma inteligente.
          </p>
          <Link href="/register">
            <Button size="xl" className="bg-white text-blue-900 hover:bg-blue-50 shadow-xl gap-2">
              Comenzar gratis ahora
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PE</span>
              </div>
              <div>
                <div className="text-white font-heading font-semibold">PasaTuEunacom</div>
                <div className="text-xs text-slate-500">Estudia inteligente. Aprueba seguro.</div>
              </div>
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
              <a href="#" className="hover:text-white transition-colors">Contacto</a>
            </div>
            <div className="text-sm text-slate-500">
              Construido para médicos chilenos 🇨🇱
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
