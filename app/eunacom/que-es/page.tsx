import type { Metadata } from 'next'

const baseUrl = 'https://eunacomgo.cl'
const pageUrl = `${baseUrl}/eunacom/que-es`

export const metadata: Metadata = {
  title: '¿Qué es el EUNACOM? Requisitos, estructura y puntaje',
  description:
    'Guía clara y actualizada sobre qué es el EUNACOM en Chile: secciones teórica y práctica, requisitos para médicos chilenos y extranjeros, puntaje de aprobación y vigencia.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: '¿Qué es el EUNACOM? Requisitos, estructura y puntaje',
    description:
      'Todo lo que necesitas saber sobre el EUNACOM: estructura, quiénes deben rendirlo, puntaje de aprobación y vigencia del resultado.',
    url: pageUrl,
    type: 'article',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: '¿Qué es el EUNACOM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El Examen Único Nacional de Conocimientos de Medicina (EUNACOM) es la prueba que deben rendir y aprobar los médicos que desean ejercer en el sistema público chileno, postular a cargos de planta o becas de especialidad financiadas por el Estado. Se compone de una sección teórica (ST) y una sección práctica (SP).',
      },
    },
    {
      '@type': 'Question',
      name: '¿Quiénes deben rendir el EUNACOM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Deben rendir el EUNACOM los médicos titulados en universidades chilenas y los médicos titulados en el extranjero que desean validar su título para ejercer en Chile. Es obligatorio para ejercer en el sistema público de salud y para postular a becas de especialidad financiadas por el Estado.',
      },
    },
    {
      '@type': 'Question',
      name: '¿El EUNACOM es lo mismo que revalidar el título?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. El EUNACOM evalúa conocimientos y habilidades clínicas, pero no reemplaza los procesos académicos de reconocimiento o revalidación de título médico, que siguen dependiendo de las universidades y autoridades competentes.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Qué pasa si apruebo la teórica pero no la práctica?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Mientras no tengas ambas secciones aprobadas (teórica ST y práctica SP), el examen se considera reprobado para los fines que exige la normativa, como ejercer en el sistema público o postular a becas con financiamiento estatal.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuántas preguntas tiene el EUNACOM teórico?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Según procesos previos, la sección teórica (EUNACOM-ST) utiliza 180 preguntas de selección múltiple (A–E) divididas en dos bloques con descanso intermedio. El número exacto puede variar según el proceso; siempre confirma en la reglamentación oficial.',
      },
    },
    {
      '@type': 'Question',
      name: '¿Cuánto tiempo tiene vigencia el resultado del EUNACOM?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'El resultado de la sección teórica tiene vigencia limitada (normalmente 2 años) para poder rendir o convalidar la sección práctica. Con la normativa 2026, las etapas aprobadas del SP tienen vigencia de 2 años.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '¿Qué es el EUNACOM? Requisitos, estructura y puntaje',
  description:
    'Guía clara y actualizada sobre qué es el EUNACOM en Chile: secciones teórica y práctica, requisitos y puntaje de aprobación.',
  url: pageUrl,
  publisher: {
    '@type': 'Organization',
    name: 'EunacomGo',
    url: baseUrl,
  },
  inLanguage: 'es-CL',
  about: {
    '@type': 'Thing',
    name: 'EUNACOM',
    description: 'Examen Único Nacional de Conocimientos de Medicina, Chile',
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: '¿Qué es el EUNACOM?', item: pageUrl },
  ],
}

export default function QueEsEunacomPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
            <a href="/eunacom/que-es" className="text-teal-700 font-semibold">
              ¿Qué es el EUNACOM?
            </a>
            <a href="/eunacom/fechas-y-modalidades" className="hover:text-teal-700">
              Fechas y modalidades
            </a>
            <a href="/eunacom/guia-estudio" className="hover:text-teal-700">
              Guía de estudio
            </a>
            <a href="/eunacom/especialidades" className="hover:text-teal-700">
              Especialidades
            </a>
          </nav>
        </div>
      </header>

      {/* Breadcrumb visual */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-1.5">
          <a href="/" className="hover:text-teal-700">Inicio</a>
          <span>/</span>
          <span className="text-slate-600">¿Qué es el EUNACOM?</span>
        </nav>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <header className="mb-8">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-[0.2em] mb-3">
            Guía EUNACOM
          </p>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4">
            ¿Qué es el EUNACOM?
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            El Examen Único Nacional de Conocimientos de Medicina (EUNACOM) es la prueba que
            deben rendir y aprobar los médicos que desean ejercer en el sistema público chileno,
            postular a cargos de planta o becas de especialidad financiadas por el Estado.
          </p>
        </header>

        <section className="space-y-10 text-slate-700 text-sm sm:text-base leading-relaxed">
          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Estructura del examen</h2>
            <p className="mb-3">
              El EUNACOM se compone de dos grandes secciones: una teórica escrita y una práctica
              clínica. Para que el examen se considere aprobado es imprescindible aprobar ambas.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Sección teórica (EUNACOM‑ST)
                </h3>
                <p className="mb-2">
                  Corresponde a una prueba escrita de alternativa de alto volumen. Según procesos
                  previos, se han utilizado 180 preguntas de selección múltiple (A–E) divididas en
                  dos bloques con descanso intermedio.
                </p>
                <p className="mb-2">
                  Evalúa principalmente Medicina Interna, Pediatría, Obstetricia y Ginecología,
                  Cirugía, Psiquiatría, Salud Pública y especialidades afines, con énfasis en la
                  resolución de problemas clínicos más que en preguntas puramente memorísticas.
                </p>
                <p className="text-xs text-slate-500">
                  El número exacto de preguntas, su distribución por área y la duración de cada
                  bloque pueden variar en el tiempo; siempre debes confirmarlo en la reglamentación
                  vigente del examen.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">
                  Sección práctica (EUNACOM‑SP)
                </h3>
                <p className="mb-2">
                  Es una evaluación clínica que se organiza en etapas por áreas (habitualmente
                  Medicina Interna, Pediatría, Obstetricia‑Ginecología y Cirugía). Integra
                  actividades prácticas, observación de desempeño y evaluaciones orales.
                </p>
                <p className="mb-2">
                  En muchos casos, los egresados de escuelas de medicina chilenas acreditadas
                  pueden convalidar esta sección a través de sus internados, mientras que otros
                  médicos deben rendir la sección práctica centralizada.
                </p>
                <p className="text-xs text-slate-500">
                  Los detalles específicos (número de etapas, duración y forma de convalidación)
                  están definidos en la reglamentación oficial del EUNACOM.
                </p>
              </div>
            </div>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Quiénes deben rendirlo</h2>
            <p className="mb-3">
              Deben rendir el EUNACOM los médicos que buscan trabajar en el sistema público
              chileno o acceder a ciertas becas financiadas con fondos estatales. En términos
              generales, se incluyen:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Médicos titulados en universidades chilenas.</li>
              <li>
                Médicos titulados en el extranjero que desean validar su título para ejercer en
                Chile, además de los trámites de reconocimiento académico correspondientes.
              </li>
            </ul>
            <p className="mt-2">
              El resultado del EUNACOM se utiliza principalmente para:
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Postular a cargos de planta en el sistema público de salud.</li>
              <li>Acceder a ciertos programas de beca de especialidad financiados por el Estado.</li>
              <li>Respaldar procesos de contratación en instituciones privadas que lo exigen.</li>
              <li>Emitir licencias médicas (obligatorio desde 2026 según Ley 21.746).</li>
            </ul>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Puntaje de aprobación y vigencia</h2>
            <p className="mb-3">
              El puntaje mínimo de aprobación y la vigencia del resultado son fijados por la
              organización del examen y se actualizan periódicamente. De manera habitual:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                La sección teórica se considera aprobada al superar un puntaje de corte definido
                para cada proceso.
              </li>
              <li>
                El resultado de la sección teórica tiene una vigencia limitada en el tiempo
                (normalmente 2 años) para poder rendir o convalidar la sección práctica.
              </li>
            </ul>
            <p className="mt-2">
              Para información oficial y actualizada siempre debes revisar{' '}
              <a
                href="https://www.eunacom.cl"
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-900 underline underline-offset-2"
              >
                el sitio del EUNACOM
              </a>
              .
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Áreas evaluadas</h2>
            <p className="mb-3">
              La sección teórica cubre 11 grandes áreas médicas. Conocer el peso de cada área
              es clave para priorizar tu estudio:
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {[
                'Medicina Interna (mayor peso)',
                'Pediatría',
                'Cirugía',
                'Obstetricia y Ginecología',
                'Salud Pública y Medicina Preventiva',
                'Psiquiatría',
                'Traumatología y Ortopedia',
                'Oftalmología',
                'Otorrinolaringología',
                'Dermatología',
                'Urología',
              ].map((area) => (
                <div
                  key={area}
                  className="flex items-center gap-2 bg-slate-50 rounded-lg px-3 py-2 text-sm text-slate-700"
                >
                  <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                  {area}
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Para ver guías de estudio por especialidad, visita{' '}
              <a href="/eunacom/especialidades" className="text-teal-700 underline underline-offset-2 hover:text-teal-900">
                nuestra página de especialidades EUNACOM
              </a>
              .
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Preguntas frecuentes</h2>
            <dl className="space-y-4">
              <div>
                <dt className="font-semibold text-slate-900">
                  ¿El EUNACOM es lo mismo que revalidar el título?
                </dt>
                <dd>
                  No. El EUNACOM evalúa conocimientos y habilidades clínicas, pero no reemplaza los
                  procesos académicos de reconocimiento o revalidación de título médico, que siguen
                  dependiendo de las universidades y autoridades competentes.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">
                  ¿Qué pasa si apruebo la teórica pero no la práctica?
                </dt>
                <dd>
                  Mientras no tengas ambas secciones aprobadas, el examen se considera reprobado
                  para los fines que exige la normativa (por ejemplo, ejercer en el sistema público
                  o postular a becas con financiamiento estatal).
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">
                  ¿Puedo preparar solo con bancos de preguntas?
                </dt>
                <dd>
                  Los bancos de preguntas (como EunacomGo) son una herramienta clave para
                  acostumbrarte al formato y nivel de dificultad, pero deben ir acompañados de
                  estudio de guías clínicas y textos de referencia para consolidar fundamentos.
                </dd>
              </div>
              <div>
                <dt className="font-semibold text-slate-900">
                  ¿Cuántas veces se puede rendir el EUNACOM?
                </dt>
                <dd>
                  No hay límite de intentos para la sección teórica. Para la sección práctica, la
                  normativa 2026 introduce cambios en las repeticiones y aranceles. Consulta la
                  reglamentación oficial actualizada en eunacom.cl.
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-sm">
              <a href="/eunacom/preguntas-frecuentes" className="text-teal-700 hover:text-teal-900 font-medium underline underline-offset-2">
                Ver todas las preguntas frecuentes sobre el EUNACOM →
              </a>
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Cómo encaja EunacomGo</h2>
            <p className="mb-3">
              EunacomGo no reemplaza el examen ni entrega información oficial, pero sí te
              permite practicar de forma muy similar a la sección teórica:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Preguntas de caso clínico con 5 alternativas (A–E).</li>
              <li>Enfoque en Medicina Interna y especialidades claves del EUNACOM.</li>
              <li>Modos cronometrados y simulacros extensos.</li>
              <li>Retroalimentación y estadísticas para guiar tu estudio.</li>
            </ul>
            <div className="mt-4 flex gap-3">
              <a
                href="/register"
                className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Empieza gratis
              </a>
              <a
                href="/eunacom/guia-estudio"
                className="inline-block bg-white border border-slate-200 hover:border-teal-400 text-slate-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                Ver guía de estudio
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
