import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fechas EUNACOM y modalidades del examen — EunacomGo',
  description:
    'Resumen orientativo sobre las fechas típicas del EUNACOM en Chile, sus modalidades teórica y práctica y cómo encontrar la próxima fecha oficial del examen.',
}

const externalSources = [
  { name: 'Sitio oficial EUNACOM', url: 'https://www.eunacom.cl' },
  { name: 'EUNAMed (blog especializado)', url: 'https://eunamed.com/blog/fechas-eunacom/' },
  { name: 'ApruebaEUNACOM', url: 'https://apruebaeunacom.cl/blog/sobre-eunacom/inscripcion-eunacom-modalidades-fechas-documentos' },
]

export default function FechasEunacomPage() {
  return (
    <div className="min-h-screen bg-white">
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
            <a href="/eunacom/fechas-y-modalidades" className="text-teal-700 font-semibold">
              Fechas y modalidades
            </a>
            <a href="/eunacom/guia-estudio" className="hover:text-teal-700">Guía de estudio</a>
          </nav>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <header className="mb-8">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-[0.2em] mb-3">
            Fechas y modalidades
          </p>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4">
            Fechas EUNACOM y cómo encontrar la próxima convocatoria
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Las fechas del EUNACOM cambian cada año y siempre deben confirmarse en canales
            oficiales. Aquí encontrarás una guía orientativa para entender en qué períodos
            suele rendirse el examen y cómo localizar rápidamente la próxima convocatoria.
          </p>
        </header>

        <section className="space-y-8 text-slate-700 text-sm sm:text-base leading-relaxed">
          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Calendario típico de la sección teórica
            </h2>
            <p className="mb-3">
              Según la información recopilada de sitios especializados y procesos previos, la
              sección teórica del EUNACOM suele rendirse dos veces al año, habitualmente hacia:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Una convocatoria de mitad de año (alrededor de julio).</li>
              <li>Una segunda convocatoria hacia fin de año (alrededor de diciembre).</li>
            </ul>
            <p className="mt-2">
              Las fechas exactas, plazos de inscripción y valores se publican cada proceso en el
              sitio oficial. Por eso, cualquier fecha que veas en blogs o academias —incluida
              esta guía— debe tomarse como orientativa.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Cómo saber cuál es el próximo EUNACOM
            </h2>
            <p className="mb-3">
              Para identificar la próxima fecha disponible, la ruta más segura es:
            </p>
            <ol className="list-decimal list-inside space-y-2">
              <li>
                Revisar{' '}
                <a
                  href="https://www.eunacom.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-700 hover:text-teal-900 underline underline-offset-2"
                >
                  la página oficial del EUNACOM
                </a>
                , especialmente la sección de inscripción y comunicados.
              </li>
              <li>
                Confirmar las fechas y plazos de inscripción en los documentos PDF o avisos que
                publica la organización del examen.
              </li>
              <li>
                Verificar si hay diferencias entre la fecha de la sección teórica y las fechas
                posteriores de la sección práctica.
              </li>
            </ol>
            <p className="mt-2">
              En EunacomGo mantenemos nuestros contenidos y simulacros alineados con la
              estructura vigente del examen, pero no reemplazamos la información oficial.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Modalidades: teórica y práctica
            </h2>
            <p className="mb-3">
              De forma general, las modalidades del examen se organizan así:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>Teórica:</strong> inscripción en línea, pago del arancel y rendición
                del examen escrito en una fecha única para todo el país.
              </li>
              <li>
                <strong>Práctica:</strong> puede convalidarse mediante internados acreditados o
                rendirse a través de la sección práctica centralizada, con plazos y requisitos
                propios.
              </li>
            </ul>
            <p className="mt-2">
              Cada proceso anual puede introducir ajustes de detalle, por lo que siempre debes
              apoyarte en la documentación del año en que rendirás el examen.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Fuentes que monitoreamos</h2>
            <p className="mb-3">
              Para mantener esta información actualizada revisamos periódicamente los siguientes
              sitios (además del portal oficial):
            </p>
            <ul className="list-disc list-inside space-y-1">
              {externalSources.map((src) => (
                <li key={src.url}>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-teal-700 hover:text-teal-900 underline underline-offset-2"
                  >
                    {src.name}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-slate-500 text-xs">
              Nota: las fechas concretas cambian año a año. Esta página tiene un propósito
              informativo y no sustituye los comunicados oficiales del EUNACOM.
            </p>
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

