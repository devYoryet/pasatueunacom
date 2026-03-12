import type { Metadata } from 'next'

const baseUrl = 'https://eunacomgo.cl'
const pageUrl = `${baseUrl}/eunacom/preguntas-frecuentes`

export const metadata: Metadata = {
  title: 'Preguntas frecuentes sobre el EUNACOM en Chile — FAQ completo',
  description:
    'Respuestas a las preguntas más frecuentes sobre el EUNACOM: estructura, puntaje, vigencia, cuándo rendirlo, cuántas veces se puede rendir, diferencia entre ST y SP, y más.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Preguntas frecuentes sobre el EUNACOM en Chile',
    description:
      'FAQ completo del EUNACOM: inscripción, puntaje de aprobación, vigencia, cuántas veces se puede rendir, ECOE, normativa 2026 y más.',
    url: pageUrl,
    type: 'website',
  },
}

const faqs = [
  {
    category: 'Qué es el EUNACOM',
    items: [
      {
        q: '¿Qué es el EUNACOM?',
        a: 'El Examen Único Nacional de Conocimientos de Medicina (EUNACOM) es la prueba que deben rendir y aprobar los médicos que desean ejercer en el sistema público chileno, postular a cargos de planta o becas de especialidad financiadas por el Estado. Desde 2026, también es obligatorio para emitir licencias médicas (Ley 21.746).',
      },
      {
        q: '¿Quiénes deben rendir el EUNACOM?',
        a: 'Deben rendirlo los médicos titulados en universidades chilenas y los médicos extranjeros que quieren validar su título para ejercer en Chile. Desde la normativa 2026, es obligatorio para ejercer en el sistema público y privado que exija licencias médicas.',
      },
      {
        q: '¿El EUNACOM es lo mismo que revalidar el título?',
        a: 'No. El EUNACOM evalúa conocimientos y habilidades clínicas pero no reemplaza los procesos académicos de reconocimiento de título, que dependen de las universidades chilenas y la Contraloría General de la República.',
      },
      {
        q: '¿Qué beneficios otorga tener el EUNACOM aprobado?',
        a: 'Con el EUNACOM aprobado puedes postular a cargos de planta en el sistema público de salud, acceder a becas de especialidad financiadas por el Estado (APS, hospitalarias), trabajar en instituciones privadas que lo exigen, y emitir licencias médicas (desde mayo 2026).',
      },
    ],
  },
  {
    category: 'Estructura y formato',
    items: [
      {
        q: '¿Cuántas secciones tiene el EUNACOM?',
        a: 'El EUNACOM tiene dos secciones: la Sección Teórica (EUNACOM-ST) y la Sección Práctica (EUNACOM-SP). Para aprobar el examen debes aprobar ambas secciones.',
      },
      {
        q: '¿Cuántas preguntas tiene el EUNACOM teórico?',
        a: 'Según procesos previos, la sección teórica ha utilizado aproximadamente 180 preguntas de selección múltiple con 5 alternativas (A–E), divididas en dos bloques con descanso. El número exacto puede variar según proceso; verifica en eunacom.cl.',
      },
      {
        q: '¿Qué materias evalúa el EUNACOM?',
        a: 'El EUNACOM evalúa 11 áreas: Medicina Interna, Pediatría, Cirugía, Obstetricia y Ginecología, Salud Pública/Medicina Preventiva, Psiquiatría, Traumatología y Ortopedia, Oftalmología, Otorrinolaringología, Dermatología y Urología.',
      },
      {
        q: '¿Qué es el EUNACOM-SP (sección práctica) y cómo se organiza?',
        a: 'La sección práctica se organiza en 4 etapas: Medicina Interna, Pediatría, Cirugía, y Obstetricia-Ginecología. Desde 2026, se rinde exclusivamente en formato ECOE (Examen Clínico Objetivo Estandarizado): estaciones clínicas con rúbricas objetivas.',
      },
      {
        q: '¿Qué es el ECOE en el EUNACOM?',
        a: 'El ECOE (Examen Clínico Objetivo Estandarizado) es el formato de la sección práctica del EUNACOM desde 2026. Consiste en estaciones clínicas con escenarios simulados donde se evalúa entrevista clínica, examen físico, resolución de problemas y comunicación con el paciente.',
      },
    ],
  },
  {
    category: 'Puntaje y aprobación',
    items: [
      {
        q: '¿Cuál es el puntaje mínimo para aprobar el EUNACOM teórico?',
        a: 'El puntaje de corte para aprobar la sección teórica lo define la organización del EUNACOM para cada proceso. No es un número fijo para siempre; consulta la reglamentación oficial del proceso en que te inscribas.',
      },
      {
        q: '¿Qué puntaje necesito para el EUNACOM?',
        a: 'No existe un puntaje universal fijo, ya que el corte puede ajustarse por proceso. Sin embargo, en términos generales, se busca alcanzar al menos el 60–70% de respuestas correctas. La estrategia recomendada es apuntar al 70–75% o más en simulacros para tener margen de seguridad.',
      },
      {
        q: '¿Cuánto tiempo tiene vigencia el resultado del EUNACOM teórico?',
        a: 'El resultado de la sección teórica (EUNACOM-ST) tiene vigencia limitada para acceder a la sección práctica, típicamente 2 años. Verifica el plazo exacto en la normativa del proceso en que rendiste.',
      },
      {
        q: '¿Por qué se dice que el EUNACOM tiene dos puntajes?',
        a: 'Porque la sección teórica entrega un puntaje de aprobación y también un puntaje de selección (ranking). El puntaje de aprobación determina si pasas el examen; el puntaje de selección te posiciona para postular a cargos o becas competitivas.',
      },
    ],
  },
  {
    category: 'Inscripción y fechas',
    items: [
      {
        q: '¿Cuándo se rinde el EUNACOM?',
        a: 'Históricamente la sección teórica se ha rendido dos veces al año: una convocatoria hacia mitad de año (alrededor de julio) y otra a fin de año (alrededor de diciembre). Las fechas exactas varían cada año; revisa eunacom.cl para la convocatoria vigente.',
      },
      {
        q: '¿Cómo me inscribo al EUNACOM?',
        a: 'La inscripción se realiza en línea a través del sitio oficial del EUNACOM (eunacom.cl) dentro del plazo establecido para cada proceso. Debes adjuntar documentación que acredite tu calidad de médico (título, certificado de egreso, etc.) y pagar el arancel correspondiente.',
      },
      {
        q: '¿Cuánto cuesta el EUNACOM?',
        a: 'El arancel del EUNACOM se publica en cada convocatoria oficial y puede ajustarse año a año. Incluye el pago por sección. Revisa el costo actualizado directamente en eunacom.cl al momento de inscribirte.',
      },
      {
        q: '¿Cuántas veces se puede rendir el EUNACOM?',
        a: 'No hay límite de intentos para la sección teórica. Para la sección práctica, con la normativa 2026, cada etapa puede repetirse pero con reinscripción y pago (ya no existe la repetición gratuita). Existen descuentos en la reinscripción según las etapas pendientes.',
      },
    ],
  },
  {
    category: 'Normativa 2026',
    items: [
      {
        q: '¿Qué cambió en el EUNACOM con la normativa 2026?',
        a: 'La normativa 2026 introdujo 6 cambios: (1) EUNACOM obligatorio para emitir licencias médicas (Ley 21.746), (2) eliminación de la repetición gratuita del SP, (3) vigencia de etapas SP extendida a 2 años, (4) plazo reducido para completar las 4 etapas del SP, (5) plazo de apelación más corto, y (6) ECOE como formato exclusivo del SP.',
      },
      {
        q: '¿Desde cuándo el EUNACOM es obligatorio para licencias médicas?',
        a: 'Desde el 24 de mayo de 2026, fecha en que se implementa la exigencia de la Ley 21.746. A partir de esa fecha, para emitir licencias médicas en Chile se requiere tener el EUNACOM completo aprobado (ST + SP).',
      },
      {
        q: '¿Afecta la normativa 2026 a médicos que ya tienen el EUNACOM teórico aprobado?',
        a: 'Depende de tu situación. La normativa establece disposiciones transitorias para quienes ya tenían etapas aprobadas bajo la normativa anterior. Consulta directamente con la organización del EUNACOM (eunacom.cl) para saber cómo te afecta individualmente.',
      },
    ],
  },
  {
    category: 'Preparación y estudio',
    items: [
      {
        q: '¿Cuánto tiempo se necesita para preparar el EUNACOM?',
        a: 'Depende del punto de partida de cada médico. En general, se recomienda un mínimo de 3–6 meses de preparación activa para la sección teórica, con estudio constante de 2–3 horas diarias. Los médicos sin práctica clínica reciente o que no han estudiado desde hace tiempo pueden necesitar 6–12 meses.',
      },
      {
        q: '¿Cómo se estudia para el EUNACOM?',
        a: 'La estrategia más efectiva combina: revisión de guías clínicas y textos de referencia, práctica intensiva con preguntas tipo EUNACOM, simulacros cronometrados, y análisis de estadísticas de progreso. EunacomGo proporciona banco de preguntas y simulacros para sistematizar esta preparación.',
      },
      {
        q: '¿Qué especialidad es más difícil en el EUNACOM?',
        a: 'Varía por estudiante, pero Medicina Interna suele ser la más demandante por su amplitud. Salud Pública y Psiquiatría pueden ser difíciles para médicos con poca experiencia en APS. Obstétrica-Ginecología requiere especial atención para quienes no han hecho rotaciones recientes.',
      },
      {
        q: '¿Sirve practicar preguntas para el EUNACOM?',
        a: 'Sí, y es uno de los pilares del estudio. La práctica con preguntas tipo EUNACOM (caso clínico con 5 alternativas A–E) ayuda a acostumbrarte al formato, a identificar áreas débiles y a mejorar la velocidad de respuesta. Es especialmente útil combinarlo con retroalimentación y revisión de los casos fallados.',
      },
      {
        q: '¿Qué es EunacomGo y cómo ayuda en la preparación?',
        a: 'EunacomGo (eunacomgo.cl) es una plataforma online de preparación para el EUNACOM con banco de preguntas clínicas organizadas por especialidad, simulacros cronometrados que simulan el formato real, estadísticas de progreso y retroalimentación por pregunta. Está diseñada para que cada hora de estudio sea más efectiva.',
      },
    ],
  },
]

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap((cat) =>
    cat.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    }))
  ),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Preguntas frecuentes EUNACOM', item: pageUrl },
  ],
}

export default function PreguntasFrecuentesPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
            <a href="/eunacom/guia-estudio" className="hover:text-teal-700">Guía de estudio</a>
            <a href="/eunacom/especialidades" className="hover:text-teal-700">Especialidades</a>
            <a href="/eunacom/preguntas-frecuentes" className="text-teal-700 font-semibold">FAQ</a>
          </nav>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-1.5">
          <a href="/" className="hover:text-teal-700">Inicio</a>
          <span>/</span>
          <span className="text-slate-600">Preguntas frecuentes EUNACOM</span>
        </nav>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <header className="mb-10">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-[0.2em] mb-3">
            FAQ — Preguntas frecuentes
          </p>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4">
            Preguntas frecuentes sobre el EUNACOM
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Resolvemos las dudas más comunes sobre el EUNACOM en Chile: estructura, puntaje,
            inscripción, normativa 2026 y cómo prepararte de forma efectiva.
          </p>
        </header>

        {/* Category index */}
        <nav className="flex flex-wrap gap-2 mb-8" aria-label="Categorías FAQ">
          {faqs.map((cat) => (
            <a
              key={cat.category}
              href={`#${cat.category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-teal-50 hover:text-teal-700 transition-colors"
            >
              {cat.category}
            </a>
          ))}
        </nav>

        <div className="space-y-10">
          {faqs.map((cat) => (
            <section
              key={cat.category}
              id={cat.category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}
            >
              <h2 className="text-lg font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {cat.category}
              </h2>
              <dl className="space-y-5">
                {cat.items.map((item) => (
                  <div key={item.q} className="bg-slate-50 rounded-xl p-4">
                    <dt className="font-semibold text-slate-900 text-sm mb-2">{item.q}</dt>
                    <dd className="text-slate-600 text-sm leading-relaxed">{item.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-teal-50 border border-teal-200 rounded-2xl p-6">
          <h2 className="text-base font-bold text-teal-900 mb-2">
            ¿Listo para prepararte para el EUNACOM?
          </h2>
          <p className="text-sm text-teal-700 mb-4">
            EunacomGo tiene todo lo que necesitas: banco de preguntas clínicas, simulacros
            cronometrados y estadísticas para guiar tu estudio.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a
              href="/register"
              className="inline-block bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              Empieza gratis
            </a>
            <a
              href="/eunacom/que-es"
              className="inline-block bg-white border border-teal-200 hover:border-teal-400 text-teal-700 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors"
            >
              ¿Qué es el EUNACOM?
            </a>
          </div>
        </div>

        <p className="mt-8 text-xs text-slate-400 leading-relaxed">
          La información de esta página tiene propósito orientativo. Para datos oficiales sobre
          inscripción, fechas, puntajes y reglamentación, siempre consulta{' '}
          <a href="https://www.eunacom.cl" target="_blank" rel="noopener noreferrer"
            className="underline underline-offset-2 text-slate-500 hover:text-slate-700">
            eunacom.cl
          </a>
          .
        </p>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-6 mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} EunacomGo. Preparación para el EUNACOM en Chile.</span>
          <span>
            Hecho por{' '}
            <a href="https://pulsadotech.cl" target="_blank" rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-slate-700">
              pulsadotech.cl
            </a>
          </span>
        </div>
      </footer>
    </div>
  )
}
