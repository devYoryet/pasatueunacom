import type { Metadata } from 'next'

const baseUrl = 'https://eunacomgo.cl'
const pageUrl = `${baseUrl}/eunacom/guia-estudio`

export const metadata: Metadata = {
  title: 'Guía de estudio para el EUNACOM: plan y estrategia',
  description:
    'Plan de estudio sugerido para el EUNACOM: priorización por especialidad, simulacros, repaso activo y cómo aprovechar al máximo la plataforma EunacomGo para aprobar.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Guía de estudio para el EUNACOM: plan y estrategia',
    description:
      'Estrategia completa para preparar el EUNACOM: ciclos de práctica, priorización de especialidades y cómo usar EunacomGo.',
    url: pageUrl,
    type: 'article',
  },
}

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Cómo prepararse para el EUNACOM paso a paso',
  description:
    'Guía de estudio para el EUNACOM con ciclos de práctica, priorización de áreas y uso efectivo de simulacros.',
  step: [
    {
      '@type': 'HowToStep',
      position: 1,
      name: 'Entender el peso de cada área',
      text: 'Identifica qué especialidades tienen mayor peso en el EUNACOM. Medicina Interna y sus subespecialidades concentran la mayor parte del puntaje. Prioriza estas áreas al inicio del estudio.',
    },
    {
      '@type': 'HowToStep',
      position: 2,
      name: 'Diagnóstico inicial',
      text: 'Haz un bloque de preguntas por especialidad para medir tu nivel real y detectar áreas débiles antes de empezar el estudio formal.',
    },
    {
      '@type': 'HowToStep',
      position: 3,
      name: 'Ciclos de refuerzo',
      text: 'Revisa la retroalimentación de preguntas falladas, concéntrate en los temas subyacentes y vuelve a practicar las mismas áreas hasta dominarlas.',
    },
    {
      '@type': 'HowToStep',
      position: 4,
      name: 'Simulacros cronometrados',
      text: 'Realiza simulacros largos con tiempo real para habituarte al formato y la presión del EUNACOM real. Analiza tus resultados para ajustar el plan de estudio.',
    },
    {
      '@type': 'HowToStep',
      position: 5,
      name: 'Aprovechar las estadísticas',
      text: 'Usa los reportes de la plataforma para identificar especialidades bajas, detectar patrones de error y medir tu velocidad de respuesta por bloque.',
    },
  ],
  tool: [
    {
      '@type': 'HowToTool',
      name: 'EunacomGo — Banco de preguntas EUNACOM',
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Guía de estudio EUNACOM', item: pageUrl },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Guía de estudio para el EUNACOM: cómo usar EunacomGo',
  description:
    'Plan de estudio sugerido para el EUNACOM: priorización por especialidad, simulacros, repaso activo y estadísticas de progreso.',
  url: pageUrl,
  publisher: {
    '@type': 'Organization',
    name: 'EunacomGo',
    url: baseUrl,
  },
  inLanguage: 'es-CL',
}

export default function GuiaEstudioEunacomPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xs font-mono">EG</span>
            </div>
            <span className="font-heading font-semibold text-slate-900 text-base tracking-tight">
              Eunacom<span className="text-teal-600">Go</span>
            </span>
          </a>
          <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-600">
            <a href="/eunacom/que-es" className="hover:text-teal-700">¿Qué es el EUNACOM?</a>
            <a href="/eunacom/fechas-y-modalidades" className="hover:text-teal-700">Fechas y modalidades</a>
            <a href="/eunacom/guia-estudio" className="text-teal-700 font-semibold">Guía de estudio</a>
            <a href="/eunacom/especialidades" className="hover:text-teal-700">Especialidades</a>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-1.5">
          <a href="/" className="hover:text-teal-700">Inicio</a>
          <span>/</span>
          <span className="text-slate-600">Guía de estudio EUNACOM</span>
        </nav>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <header className="mb-8">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-[0.2em] mb-3">
            Estrategia de estudio
          </p>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4">
            Guía de estudio para el EUNACOM
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Más que memorizar preguntas, el EUNACOM exige integrar clínica, fisiopatología y
            manejo práctico. Esta guía te propone una estrategia realista para organizar tu
            estudio y usar EunacomGo como eje central de práctica.
          </p>
        </header>

        <section className="space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              1. Entender el peso de cada área
            </h2>
            <p className="mb-3">
              No todas las áreas pesan lo mismo en el examen. Aunque el detalle exacto varía
              según proceso, históricamente Medicina Interna y sus subespecialidades concentran
              una parte muy relevante del puntaje.
            </p>
            <p>
              Por eso en EunacomGo priorizamos inicialmente Medicina Interna (cardio,
              respiratorio, nefro, endócrino, infecciosas, neuro, etc.), para que construyas un
              núcleo sólido antes de expandirte a otras áreas.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              2. Ciclos de práctica: diagnóstico → refuerzo → simulacro
            </h2>
            <p className="mb-3">
              Una forma eficaz de preparar el examen es trabajar en ciclos cortos de enfoque:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Diagnóstico:</strong> haces un bloque de preguntas por especialidad para
                medir tu nivel real.
              </li>
              <li>
                <strong>Refuerzo:</strong> revisas la retroalimentación, te concentras en las
                preguntas falladas y relees los temas subyacentes.
              </li>
              <li>
                <strong>Simulacro:</strong> cada cierto tiempo rindes un simulacro cronometrado
                largo para habituarte al formato y la presión de tiempo.
              </li>
            </ul>
            <p className="mt-2">
              La plataforma te ayuda a cerrar estos ciclos con sus modos de práctica, historial
              de intentos y estadísticas.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              3. Cómo usar EunacomGo semana a semana
            </h2>
            <p className="mb-3">
              Una pauta simple (que puedes adaptar a tu carga laboral) podría ser:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>3–4 sesiones cortas entre semana (30–45 minutos) centradas en una especialidad.</li>
              <li>1 sesión larga en fin de semana tipo simulacro parcial.</li>
              <li>Revisión escrita de las preguntas con mayor dificultad o dudas.</li>
            </ul>
            <p className="mt-2">
              La clave es la constancia: pequeñas sesiones frecuentes consolidan mejor la
              información que maratones aisladas.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              4. Aprovechar las estadísticas de la plataforma
            </h2>
            <p className="mb-3">
              En lugar de estudiar "a ciegas", utiliza los reportes que te ofrece la plataforma:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Identifica en qué especialidades estás bajo tu promedio.</li>
              <li>Detecta patrones de error (por ejemplo, manejo agudo vs. crónico).</li>
              <li>Registra cuánto tiempo real tardas en responder bloques de preguntas.</li>
            </ul>
            <p className="mt-2">
              Con estos datos puedes decidir de forma objetiva dónde invertir las próximas horas
              de estudio.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              5. Material complementario y fuentes oficiales
            </h2>
            <p className="mb-3">
              Ninguna plataforma de preguntas reemplaza las fuentes oficiales ni los textos
              clínicos de referencia. Por eso recomendamos:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Revisar siempre las guías clínicas y consensos vigentes en Chile.</li>
              <li>Complementar con manuales de Medicina Interna y textos de urgencias.</li>
              <li>
                Verificar requisitos, fechas y documentos directamente en{' '}
                <a
                  href="https://www.eunacom.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 hover:text-teal-900 underline underline-offset-2"
                >
                  la página del EUNACOM
                </a>
                .
              </li>
            </ul>
          </article>

          <article className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
            <h2 className="text-lg font-semibold text-teal-900 mb-2">
              ¿Listo para empezar a practicar?
            </h2>
            <p className="text-teal-800 text-sm mb-4">
              Accede a cientos de preguntas clínicas ordenadas por especialidad y empieza a
              medir tu progreso real en el EUNACOM.
            </p>
            <div className="flex gap-3">
              <a
                href="/register"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Empieza gratis
              </a>
              <a
                href="/eunacom/especialidades"
                className="inline-block bg-white border border-teal-200 hover:border-teal-400 text-teal-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Ver especialidades
              </a>
            </div>
          </article>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} EunacomGo. Preparación para el EUNACOM en Chile.</span>
          <span>
            Hecho por{' '}
            <a
              href="https://pulsadotech.cl"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-slate-700"
            >
              pulsadotech.cl
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
