import { Badge } from '@/components/ui/badge'

const specialties = [
  { icon: '❤️', name: 'Cardiología', questions: 105, available: true },
  { icon: '🩸', name: 'Diabetes y Nutrición', questions: 45, available: true },
  { icon: '🧬', name: 'Endocrinología', questions: 120, available: true },
  { icon: '🦠', name: 'Infectología', questions: 120, available: true },
  { icon: '🫁', name: 'Respiratorio', questions: 105, available: true },
  { icon: '🫀', name: 'Gastroenterología', questions: 90, available: true },
  { icon: '👴', name: 'Geriatría', questions: 30, available: true },
  { icon: '💉', name: 'Hemato-Oncología', questions: 105, available: true },
  { icon: '🫘', name: 'Nefrología', questions: 120, available: true },
  { icon: '🧠', name: 'Neurología', questions: 90, available: true },
  { icon: '🦴', name: 'Reumatología', questions: 60, available: true },
  { icon: '🧒', name: 'Pediatría', questions: 0, available: false },
  { icon: '👶', name: 'Ginecología y Obstetricia', questions: 0, available: false },
  { icon: '🔪', name: 'Cirugía', questions: 0, available: false },
  { icon: '🧘', name: 'Psiquiatría', questions: 0, available: false },
  { icon: '🩹', name: 'Dermatología', questions: 0, available: false },
  { icon: '🏥', name: 'Salud Pública', questions: 0, available: false },
]

export default function SpecialtyScroll() {
  return (
    <div className="overflow-x-auto pb-4 -mx-4 px-4">
      <div className="flex gap-4 min-w-max sm:min-w-0 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-4">
        {specialties.map((spec) => (
          <div
            key={spec.name}
            className={`flex-shrink-0 w-40 sm:w-auto bg-white rounded-2xl border p-4 text-center transition-all duration-200
              ${spec.available
                ? 'border-slate-200 hover:border-blue-300 hover:shadow-md cursor-pointer'
                : 'border-slate-100 opacity-60'
              }`}
          >
            <div className="text-3xl mb-3">{spec.icon}</div>
            <div className="text-sm font-medium text-slate-800 mb-2 leading-tight">{spec.name}</div>
            {spec.available ? (
              <div className="text-xs text-blue-600 font-medium">{spec.questions} preguntas</div>
            ) : (
              <Badge variant="secondary" className="text-xs">Próximamente</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
