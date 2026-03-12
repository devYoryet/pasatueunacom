import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nueva normativa EUNACOM 2026: cambios clave y cómo prepararte — EunacomGo',
  description:
    'Resumen de la nueva normativa EUNACOM vigente desde 2026: obligación para licencias médicas, ECOE como formato exclusivo, vigencias, plazos y recomendaciones de preparación.',
}

export default function Normativa2026Page() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white border border-emerald-200 rounded-xl flex items-center justify-center">
              <span className="text-emerald-600 font-bold text-xs font-mono">Go</span>
            </div>
            <span className="font-heading font-semibold text-slate-900 text-base tracking-tight">
              Eunacom<span className="text-teal-600">Go</span>
            </span>
          </a>
          <nav className="hidden sm:flex items-center gap-4 text-xs font-medium text-slate-600">
            <a href="/eunacom/que-es" className="hover:text-teal-700">
              ¿Qué es el EUNACOM?
            </a>
            <a href="/eunacom/fechas-y-modalidades" className="hover:text-teal-700">
              Fechas y modalidades
            </a>
            <a href="/eunacom/guia-estudio" className="hover:text-teal-700">
              Guía de estudio
            </a>
            <a href="/eunacom/normativa-2026" className="text-teal-700 font-semibold">
              Normativa 2026
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
        <header className="mb-8">
          <p className="text-xs font-semibold text-teal-600 uppercase tracking-[0.2em] mb-3">
            Normativa EUNACOM 2026
          </p>
          <h1 className="text-3xl sm:text-4xl font-heading font-black text-slate-900 mb-4">
            Nueva normativa EUNACOM desde 2026: qué cambia y por qué importa
          </h1>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Desde el 1 de enero de 2026 rige una nueva normativa EUNACOM que ajusta varios puntos
            críticos del examen, especialmente en la sección práctica (SP). Aquí encontrarás un
            resumen orientativo de los cambios más relevantes y cómo te afectan al planificar tu
            preparación.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            Esta página se basa en información pública disponible en recursos especializados como{' '}
            <a
              href="https://eunamed.com/blog/nueva-normativa-eunacom-2026-guia-completa/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 text-teal-700 hover:text-teal-900"
            >
              la guía de normativa 2026 de EUNAMed
            </a>{' '}
            y en la reglamentación oficial del EUNACOM. No reemplaza a los documentos oficiales.
          </p>
        </header>

        <section className="space-y-10 text-slate-700 text-sm sm:text-base leading-relaxed">
          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Resumen general de la nueva normativa</h2>
            <p className="mb-3">
              La normativa 2026 reemplaza a la versión que estaba vigente desde 2014 (con ajustes
              en 2019) e introduce cambios que impactan tanto la habilitación profesional como la
              forma de rendir y completar el EUNACOM, en especial la sección práctica (SP).
            </p>
            <p>
              En términos simples, los ejes principales son: mayor exigencia para emitir licencias
              médicas, eliminación de ciertas repeticiones gratuitas, extensión de vigencias y
              estandarización total del formato ECOE para el práctico.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-3">Los cambios clave (visión rápida)</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>EUNACOM obligatorio para licencias médicas:</strong> a partir de 2026
                necesitarás tener aprobadas la sección teórica (ST) y práctica (SP) para poder
                emitir licencias, incluso en el sector privado.
              </li>
              <li>
                <strong>Fin de la repetición gratuita de una etapa del SP:</strong> ya no existe
                la “segunda oportunidad sin costo”, aunque se mantienen esquemas de descuento en
                la reinscripción.
              </li>
              <li>
                <strong>Vigencia de etapas prácticas extendida a 2 años:</strong> las etapas
                aprobadas del SP duran más tiempo, lo que te da mayor margen de planificación.
              </li>
              <li>
                <strong>Plazo más corto para completar el SP:</strong> una vez que empiezas las
                evaluaciones prácticas, dispones de menos meses para terminar las cuatro etapas.
              </li>
              <li>
                <strong>Plazo de apelación reducido:</strong> tienes menos días para apelar los
                resultados del práctico, por lo que debes revisar tus notas de inmediato.
              </li>
              <li>
                <strong>ECOE como formato exclusivo del SP:</strong> toda la sección práctica se
                rinde en modalidad ECOE (Examen Clínico Objetivo Estandarizado).
              </li>
            </ul>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              1. EUNACOM obligatorio para emitir licencias médicas
            </h2>
            <p className="mb-3">
              Uno de los cambios más relevantes es que, asociado a la Ley 21.746, el EUNACOM
              completo (ST + SP aprobados) pasa a ser requisito para emitir licencias médicas. Este
              requisito alcanza tanto al sistema público como a gran parte del ejercicio en el
              ámbito privado.
            </p>
            <p>
              Si planeas ejercer en Chile —aunque sea de forma temporal— debes considerar este
              punto dentro de tu planificación profesional, ya que cambia el umbral mínimo para
              trabajar con plena habilitación.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              2. Repetición del SP sin costo: desaparece, pero hay descuentos
            </h2>
            <p className="mb-3">
              La normativa antigua permitía repetir una etapa del EUNACOM práctico sin pagar un
              nuevo arancel. Con la normativa 2026 esto se elimina: cualquier repetición implica
              reinscripción.
            </p>
            <p>
              La buena noticia es que se mantiene un sistema de descuentos en la reinscripción del
              SP, dependiente del número de etapas que debas rendir nuevamente. Aun así, desde el
              punto de vista estratégico, cada intento “cuenta” mucho más.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              3. Vigencia de las etapas del EUNACOM SP: ahora 2 años
            </h2>
            <p className="mb-3">
              Un cambio favorable es la extensión de la vigencia de las etapas aprobadas del SP:
              si apruebas, por ejemplo, Medicina Interna y Pediatría, tienes más tiempo para
              completar Cirugía y Gineco‑Obstetricia antes de que caduque lo ya logrado.
            </p>
            <p>
              Esto te entrega mayor flexibilidad si tu agenda laboral o personal es compleja y no
              puedes concentrar todo el proceso práctico en un período muy corto.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              4. Menos tiempo para completar las cuatro etapas del SP
            </h2>
            <p className="mb-3">
              Paralelamente, el tiempo máximo para completar las cuatro etapas prácticas una vez
              iniciadas las evaluaciones se reduce. Esto obliga a planificar con precisión el
              calendario de exámenes y a llegar bien preparado desde el principio.
            </p>
            <p>
              En la práctica, significa que no puedes “estirar” indefinidamente el proceso: debes
              coordinar pasos de estudio, inscripción y rendición pensando en esa ventana
              temporal.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              5. Plazo de apelación más corto para los resultados del SP
            </h2>
            <p className="mb-3">
              El tiempo para apelar los resultados de la sección práctica se acorta de forma
              significativa. Si no estás de acuerdo con una evaluación, tendrás menos días para
              presentar tus antecedentes y argumentos.
            </p>
            <p>
              La recomendación es revisar tus resultados apenas se publiquen, y tener claridad
              previa sobre el procedimiento de apelación descrito en la normativa oficial.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              6. ECOE como formato exclusivo del EUNACOM práctico
            </h2>
            <p className="mb-3">
              Aunque el ECOE ya era el formato predominante, la normativa 2026 lo consolida como
              modalidad única para el EUNACOM SP. Todas las evaluaciones prácticas se realizan en
              estaciones clínicas estandarizadas, con rúbricas objetivas y tiempos definidos.
            </p>
            <p>
              Esto tiene una consecuencia positiva: el formato se vuelve más predecible. Puedes y
              debes preparar específicamente habilidades clínicas tipo ECOE: entrevista estructurada,
              examen físico focalizado, resolución de problemas y comunicación con pacientes.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Fechas y hitos a considerar</h2>
            <p className="mb-3">
              Algunas fechas relevantes asociadas a la nueva normativa (según las fuentes
              disponibles al momento de escribir esta guía) son:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                <strong>1 de enero de 2026:</strong> entrada en vigencia general de la nueva
                normativa EUNACOM.
              </li>
              <li>
                <strong>24 de mayo de 2026:</strong> fecha a partir de la cual la exigencia de
                EUNACOM completo se vincula formalmente a la emisión de licencias médicas, en el
                contexto de la Ley 21.746.
              </li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              Las fechas exactas de exámenes, inscripciones y recesos se publican en la página
              oficial del EUNACOM y pueden variar cada año. Usa siempre esas fuentes como
              referencia definitiva.
            </p>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Cómo prepararte con EunacomGo</h2>
            <p className="mb-3">
              Con esta normativa, cada intento del práctico se vuelve más valioso. Algunas ideas
              para ajustar tu estrategia:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Completar primero una buena base en la sección teórica ST, priorizando Medicina
                Interna y las áreas de mayor peso.
              </li>
              <li>
                Usar EunacomGo para simular el formato del ST: preguntas de 5 alternativas,
                tiempos reales y simulacros largos.
              </li>
              <li>
                Una vez que tengas un puntaje estable en simulacros, comenzar a planificar el SP
                con foco en habilidades ECOE.
              </li>
              <li>
                Organizar tu calendario personal considerando la ventana limitada para completar
                las cuatro etapas del práctico.
              </li>
            </ul>
          </article>

          <article>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">Fuentes y referencias</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>
                Sitio oficial del EUNACOM:{' '}
                <a
                  href="https://www.eunacom.cl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 text-teal-700 hover:text-teal-900"
                >
                  www.eunacom.cl
                </a>
              </li>
              <li>
                Ley 21.746 — Biblioteca del Congreso Nacional de Chile (licencias médicas y
                exigencia de EUNACOM).
              </li>
              <li>
                Análisis y guías prácticas de EUNAMed, en particular:{' '}
                <a
                  href="https://eunamed.com/blog/nueva-normativa-eunacom-2026-guia-completa/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 text-teal-700 hover:text-teal-900"
                >
                  “Nueva Normativa EUNACOM 2026: Guía Completa”
                </a>
                .
              </li>
            </ul>
            <p className="mt-2 text-xs text-slate-500">
              Revisa periódicamente estas fuentes, ya que pueden aparecer nuevos instructivos,
              circulares o aclaraciones sobre la aplicación de la normativa.
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

