import type { Metadata } from 'next'

const baseUrl = 'https://eunacomgo.cl'
const pageUrl = `${baseUrl}/eunacom/especialidades`

export const metadata: Metadata = {
  title: 'Especialidades del EUNACOM: guía por área médica',
  description:
    'Conoce las 11 especialidades médicas evaluadas en el EUNACOM en Chile: Medicina Interna, Pediatría, Cirugía, Obstetricia, Psiquiatría, Salud Pública y más. Guías de estudio por área.',
  alternates: { canonical: pageUrl },
  openGraph: {
    title: 'Especialidades del EUNACOM: guía por área médica',
    description:
      'Las 11 especialidades del EUNACOM: qué pesa más, qué temas evalúa cada área y cómo prepararte. Guías de estudio por especialidad.',
    url: pageUrl,
    type: 'website',
  },
}

const specialties = [
  {
    slug: 'medicina-interna',
    name: 'Medicina Interna',
    weight: 'Mayor peso del examen',
    topics: [
      'Cardiología (HTA, ICC, arritmias, cardiopatía isquémica)',
      'Endocrinología (diabetes mellitus, hipotiroidismo, tiroides)',
      'Neumología (EPOC, asma, neumonía, TEP)',
      'Nefrología (IRA, ERC, trastornos hidroelectrolíticos)',
      'Neurología (ACV, epilepsia, demencias)',
      'Reumatología (LES, artritis reumatoide, osteoartritis)',
      'Infectología (sepsis, neumonía, VIH, tuberculosis)',
      'Gastroenterología (úlcera péptica, hepatitis, cirrosis)',
      'Hematología (anemias, coagulopatías, linfomas)',
    ],
    color: 'teal',
    priority: 'Alta',
    description:
      'Medicina Interna concentra la mayor parte del puntaje EUNACOM. El dominio de sus subespecialidades —especialmente cardiología, endocrinología y neumología— es indispensable para aprobar.',
  },
  {
    slug: 'pediatria',
    name: 'Pediatría',
    weight: 'Segundo mayor peso',
    topics: [
      'Desarrollo infantil y supervisión de salud',
      'Enfermedades respiratorias (bronquiolitis, neumonía, asma pediátrica)',
      'Enfermedades diarreicas y deshidratación',
      'Vacunación y calendario PNI',
      'Neonatología (RN normal y patológico)',
      'Infecciones frecuentes en niños',
      'Urgencias pediátricas',
      'Nutrición infantil y lactancia materna',
    ],
    color: 'blue',
    priority: 'Alta',
    description:
      'Pediatría es la segunda área de mayor peso en el EUNACOM. Se evalúan desde neonatología hasta el manejo de enfermedades prevalentes en la infancia y la supervisión de salud del niño sano.',
  },
  {
    slug: 'cirugia',
    name: 'Cirugía',
    weight: 'Peso relevante',
    topics: [
      'Abdomen agudo (apendicitis, colecistitis, obstrucción intestinal)',
      'Trauma y urgencias quirúrgicas',
      'Patología de mama',
      'Cáncer colorrectal',
      'Hernias',
      'Patología vascular (TVP, isquemia arterial)',
      'Quemados',
      'Postoperatorio y complicaciones',
    ],
    color: 'orange',
    priority: 'Alta',
    description:
      'Cirugía evalúa el diagnóstico y manejo inicial de las urgencias quirúrgicas más frecuentes. El énfasis está en la toma de decisiones clínicas más que en técnicas quirúrgicas específicas.',
  },
  {
    slug: 'obstetricia-ginecologia',
    name: 'Obstetricia y Ginecología',
    weight: 'Peso relevante',
    topics: [
      'Control prenatal y embarazo normal',
      'Patologías del embarazo (preeclampsia, diabetes gestacional)',
      'Parto normal y complicado',
      'Puerperio',
      'Ginecología (DIU, anticoncepción, ITS)',
      'Patología cervical y cáncer ginecológico',
      'Climaterio y menopausia',
      'Urgencias obstétricas (DPPNI, placenta previa)',
    ],
    color: 'pink',
    priority: 'Alta',
    description:
      'OBGYN abarca desde el control prenatal hasta las urgencias obstétricas y la ginecología preventiva. Es una de las áreas con mayor representación en la sección práctica (SP) del EUNACOM.',
  },
  {
    slug: 'salud-publica',
    name: 'Salud Pública y Medicina Preventiva',
    weight: 'Peso moderado-alto',
    topics: [
      'Epidemiología básica (incidencia, prevalencia, riesgo relativo)',
      'Medicina preventiva y EMPAM',
      'Programa de enfermedades crónicas (ECV, diabetes)',
      'Vacunación adultos y PAE',
      'Medicina familiar y APS',
      'Bioestadística aplicada',
      'Salud mental comunitaria',
      'Notificación de enfermedades',
    ],
    color: 'green',
    priority: 'Alta',
    description:
      'Salud Pública evalúa el razonamiento epidemiológico y la práctica preventiva en APS. En el contexto chileno, incluye programas como GES/AUGE, EMPAM y el sistema de salud público.',
  },
  {
    slug: 'psiquiatria',
    name: 'Psiquiatría',
    weight: 'Peso moderado',
    topics: [
      'Depresión mayor y trastornos del ánimo',
      'Trastornos de ansiedad',
      'Psicosis y esquizofrenia',
      'Trastornos por uso de sustancias',
      'Crisis suicida y manejo de urgencia',
      'Farmacología psiquiátrica básica',
      'Demencias y trastornos cognitivos',
      'Trastornos del sueño',
    ],
    color: 'purple',
    priority: 'Media-Alta',
    description:
      'Psiquiatría aborda el diagnóstico y manejo inicial de los trastornos mentales más prevalentes. Se enfatiza el enfoque de atención primaria y la derivación oportuna.',
  },
  {
    slug: 'traumatologia',
    name: 'Traumatología y Ortopedia',
    weight: 'Peso moderado',
    topics: [
      'Fracturas frecuentes (Colles, clavícula, cadera)',
      'Trauma de columna',
      'Lesiones de rodilla y hombro',
      'Patología de columna lumbar',
      'Displasia de cadera en lactante',
      'Fracturas en niños (supracondílea)',
      'Politrauma y ATLS',
      'Artrosis',
    ],
    color: 'amber',
    priority: 'Media',
    description:
      'Traumatología evalúa el reconocimiento y manejo inicial de lesiones musculoesqueléticas comunes, con especial énfasis en urgencias traumatológicas.',
  },
  {
    slug: 'oftalmologia',
    name: 'Oftalmología',
    weight: 'Peso menor',
    topics: [
      'Ojo rojo y urgencias oculares',
      'Glaucoma: diagnóstico y derivación',
      'Retinopatía diabética',
      'Catarata',
      'Trauma ocular',
      'Patología en niños (ambliopía, estrabismo)',
      'Conjuntivitis bacteriana, viral, alérgica',
    ],
    color: 'cyan',
    priority: 'Media-Baja',
    description:
      'Oftalmología se enfoca en el reconocimiento de urgencias oculares y patologías frecuentes que el médico general debe saber derivar oportunamente.',
  },
  {
    slug: 'otorrinolaringologia',
    name: 'Otorrinolaringología',
    weight: 'Peso menor',
    topics: [
      'Otitis media aguda y crónica',
      'Faringoamigdalitis',
      'Sinusitis y rinitis',
      'Hipoacusia y vértigo',
      'Epistaxis',
      'Patología de cuello (tiroides, adenopatías)',
      'Disfonía y laringitis',
    ],
    color: 'indigo',
    priority: 'Media-Baja',
    description:
      'ORL evalúa las patologías de cabeza y cuello de mayor prevalencia en la práctica de APS, con énfasis en el diagnóstico y manejo inicial antes de la derivación especializada.',
  },
  {
    slug: 'dermatologia',
    name: 'Dermatología',
    weight: 'Peso menor',
    topics: [
      'Dermatitis atópica y de contacto',
      'Psoriasis',
      'Infecciones cutáneas (celulitis, impétigo, tiñas)',
      'Infecciones de transmisión sexual (sífilis, herpes)',
      'Melanoma y cáncer de piel',
      'Acné',
      'Urticaria y angioedema',
      'Lesiones por fotoexposición',
    ],
    color: 'rose',
    priority: 'Media-Baja',
    description:
      'Dermatología evalúa el reconocimiento de las lesiones cutáneas más frecuentes y el manejo en APS, con especial atención a las urgencias dermatológicas y oncología cutánea.',
  },
  {
    slug: 'urologia',
    name: 'Urología',
    weight: 'Peso menor',
    topics: [
      'Infección urinaria (ITU, pielonefritis)',
      'Cólico renal y urolitiasis',
      'Hiperplasia benigna de próstata',
      'Cáncer de próstata (PSA, diagnóstico)',
      'Insuficiencia renal aguda y crónica',
      'Disfunción eréctil',
      'Patología escrotal (torsión testicular, epididimitis)',
      'Incontinencia urinaria',
    ],
    color: 'slate',
    priority: 'Media-Baja',
    description:
      'Urología abarca el diagnóstico y manejo inicial de las patologías urológicas más prevalentes, con énfasis en urgencias como la torsión testicular y el cólico renal.',
  },
]

const colorMap: Record<string, string> = {
  teal: 'bg-teal-50 border-teal-200 text-teal-700',
  blue: 'bg-blue-50 border-blue-200 text-blue-700',
  orange: 'bg-orange-50 border-orange-200 text-orange-700',
  pink: 'bg-pink-50 border-pink-200 text-pink-700',
  green: 'bg-green-50 border-green-200 text-green-700',
  purple: 'bg-purple-50 border-purple-200 text-purple-700',
  amber: 'bg-amber-50 border-amber-200 text-amber-700',
  cyan: 'bg-cyan-50 border-cyan-200 text-cyan-700',
  indigo: 'bg-indigo-50 border-indigo-200 text-indigo-700',
  rose: 'bg-rose-50 border-rose-200 text-rose-700',
  slate: 'bg-slate-100 border-slate-300 text-slate-700',
}

const dotMap: Record<string, string> = {
  teal: 'bg-teal-500',
  blue: 'bg-blue-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  cyan: 'bg-cyan-500',
  indigo: 'bg-indigo-500',
  rose: 'bg-rose-500',
  slate: 'bg-slate-500',
}

const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: 'Especialidades EUNACOM Chile',
  description:
    'Las 11 especialidades médicas evaluadas en el EUNACOM en Chile, con descripción de temas y peso en el examen.',
  url: pageUrl,
  numberOfItems: 11,
  itemListElement: specialties.map((s, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: s.name,
    url: `${baseUrl}/eunacom/especialidades/${s.slug}`,
    description: s.description,
  })),
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Inicio', item: baseUrl },
    { '@type': 'ListItem', position: 2, name: 'Especialidades EUNACOM', item: pageUrl },
  ],
}

export default function EspecialidadesPage() {
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(courseSchema) }}
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
            <a href="/eunacom/fechas-y-modalidades" className="hover:text-teal-700">Fechas</a>
            <a href="/eunacom/guia-estudio" className="hover:text-teal-700">Guía de estudio</a>
            <a href="/eunacom/especialidades" className="text-teal-700 font-semibold">Especialidades</a>
            <a href="/eunacom/normativa-2026" className="hover:text-teal-700">Normativa 2026</a>
          </nav>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-400 flex items-center gap-1.5">
          <a href="/" className="hover:text-teal-700">Inicio</a>
          <span>/</span>
          <span className="text-slate-600">Especialidades EUNACOM</span>
        </nav>
      </div>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
        <header className="mb-10 max-w-3xl">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-[0.2em] mb-3">
            Áreas evaluadas
          </p>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4">
            Especialidades del EUNACOM
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            El EUNACOM evalúa 11 áreas médicas. Conocer qué pesa más y cuáles son los temas clave
            de cada especialidad es el primer paso para organizar tu preparación de forma inteligente.
          </p>
        </header>

        {/* Top 5 priority banner */}
        <div className="mb-8 bg-teal-50 border border-teal-200 rounded-2xl p-5">
          <p className="text-sm font-semibold text-teal-800 mb-1">
            Prioriza estas 5 áreas primero
          </p>
          <p className="text-sm text-teal-700">
            Medicina Interna, Pediatría, Cirugía, Obstetricia-Ginecología y Salud Pública concentran
            la mayoría del puntaje. Dominarlas es indispensable para aprobar.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {specialties.map((s) => (
            <article
              key={s.slug}
              className={`rounded-2xl border p-5 ${colorMap[s.color]} flex flex-col gap-3`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="text-base font-bold text-slate-900">{s.name}</h2>
                  <span className="shrink-0 text-xs font-medium px-2 py-0.5 rounded-full bg-white/70 text-slate-600">
                    {s.priority}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium">{s.weight}</p>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed">{s.description}</p>

              <div>
                <p className="text-xs font-semibold text-slate-700 mb-1.5">Temas clave:</p>
                <ul className="space-y-1">
                  {s.topics.slice(0, 4).map((t) => (
                    <li key={t} className="flex items-start gap-1.5 text-xs text-slate-600">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 mt-0.5 ${dotMap[s.color]}`} />
                      {t}
                    </li>
                  ))}
                  {s.topics.length > 4 && (
                    <li className="text-xs text-slate-400 pl-3">
                      +{s.topics.length - 4} temas más
                    </li>
                  )}
                </ul>
              </div>

              <a
                href={`/eunacom/especialidades/${s.slug}`}
                className="mt-auto text-xs font-semibold text-teal-700 hover:text-teal-900 underline underline-offset-2"
              >
                Ver guía de {s.name} →
              </a>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-slate-900 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            Practica preguntas por especialidad
          </h2>
          <p className="text-slate-400 text-sm mb-6 max-w-xl mx-auto">
            En EunacomGo puedes practicar preguntas organizadas por cada una de las 11 especialidades
            del EUNACOM, con retroalimentación inmediata y estadísticas de progreso.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <a
              href="/register"
              className="inline-block bg-teal-500 hover:bg-teal-400 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Empieza gratis
            </a>
            <a
              href="/eunacom/guia-estudio"
              className="inline-block bg-slate-700 hover:bg-slate-600 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-colors"
            >
              Ver guía de estudio
            </a>
          </div>
        </div>

        {/* FAQ quick */}
        <section className="mt-10 max-w-3xl">
          <h2 className="text-xl font-semibold text-slate-900 mb-4">Preguntas frecuentes sobre las especialidades</h2>
          <dl className="space-y-4 text-sm text-slate-700">
            <div>
              <dt className="font-semibold text-slate-900">¿Cuántas especialidades tiene el EUNACOM?</dt>
              <dd className="mt-1">El EUNACOM evalúa 11 grandes áreas médicas. La sección teórica (EUNACOM-ST) cubre todas, mientras que la práctica (EUNACOM-SP) se organiza en 4 etapas principales: Medicina Interna, Pediatría, Cirugía y Ginecología-Obstetricia.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">¿Qué especialidad pesa más en el EUNACOM?</dt>
              <dd className="mt-1">Medicina Interna y sus subespecialidades (cardiología, endocrinología, neumología, neurología, nefrología) concentran la mayor proporción de preguntas. Es la primera área que debes dominar.</dd>
            </div>
            <div>
              <dt className="font-semibold text-slate-900">¿Se puede practicar por especialidad en EunacomGo?</dt>
              <dd className="mt-1">Sí. En EunacomGo puedes seleccionar qué especialidad practicar, hacer simulacros por área y revisar tus estadísticas de desempeño por especialidad para identificar tus puntos débiles.</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm">
            <a href="/eunacom/preguntas-frecuentes" className="text-teal-700 hover:text-teal-900 font-medium underline underline-offset-2">
              Ver todas las preguntas frecuentes →
            </a>
          </p>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-slate-50 py-6 mt-12">
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
