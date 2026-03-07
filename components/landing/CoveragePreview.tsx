const areas = [
  { name: 'Medicina Interna', weight: 37, questions: 67, coverage: 100, available: true },
  { name: 'Pediatría', weight: 16, questions: 29, coverage: 0, available: false },
  { name: 'Obstetricia y Ginecología', weight: 16, questions: 29, coverage: 0, available: false },
  { name: 'Cirugía', weight: 12, questions: 20, coverage: 0, available: false },
  { name: 'Psiquiatría', weight: 8, questions: 14, coverage: 0, available: false },
  { name: 'Especialidades', weight: 6, questions: 12, coverage: 0, available: false },
  { name: 'Salud Pública', weight: 5, questions: 9, coverage: 0, available: false },
]

export default function CoveragePreview() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
        <div className="text-center mb-8">
          <div className="text-5xl font-heading font-black text-blue-900 mb-2">37%</div>
          <div className="text-slate-500 font-medium">del EUNACOM ya disponible</div>
          <div className="text-sm text-slate-400 mt-1">Suficiente para practicar toda el Área 1 — la más importante</div>
        </div>

        <div className="space-y-4">
          {areas.map((area) => (
            <div key={area.name}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-700">{area.name}</span>
                  <span className="text-xs text-slate-400">({area.weight}% · {area.questions} preg.)</span>
                </div>
                {area.available ? (
                  <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">100% disponible</span>
                ) : (
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Próximamente</span>
                )}
              </div>
              <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                {area.available ? (
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000"
                    style={{ width: '100%' }}
                  />
                ) : (
                  <div className="h-full w-0 bg-slate-300 rounded-full" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-sm text-slate-500">
            Actualizamos el contenido semana a semana.{' '}
            <span className="text-blue-600 font-medium">Recibe notificaciones</span>{' '}
            cuando llegue tu especialidad.
          </p>
        </div>
      </div>
    </div>
  )
}
