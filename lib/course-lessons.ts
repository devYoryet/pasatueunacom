// Static lesson data per specialty
// Videos are derived from the actual audio capsules provided by the course.
// The first FREE_VIDEO_COUNT videos in each specialty are accessible on the free tier.

export const FREE_VIDEO_COUNT = 2

export interface Lesson {
  number: number
  title: string
  duration?: string // e.g., "12 min"
}

export interface StudyMaterial {
  title: string
  type: 'summary' | 'reference' | 'guide'
}

export interface SpecialtyContent {
  code: string
  videos: Lesson[]
  materials: StudyMaterial[]
  notes?: string              // Extra note displayed at bottom of section
  relatedTopics?: Lesson[]   // Sub-specialty topics listed below main videos
}

// ─── Free-tier AI mockup content (one per specialty for marketing) ────────────
// This is shown to free users as a preview of the AI-generated study material.

export interface AIMockupContent {
  lessonTitle: string
  summary: string
  keyConcepts: string[]
  mnemonic: { text: string; explanation: string }
  highYield: string[]
  clinicalAlgorithm: string
}

export const FREE_AI_MOCKUP: Record<string, AIMockupContent> = {
  diabetes: {
    lessonTitle: '1.- Diabetes Mellitus tipo 2 — Generalidades',
    summary:
      'La DM tipo 2 es la principal causa de diabetes en adultos (90%). Fisiopatología: resistencia periférica a insulina (músculo, hígado) + disfunción progresiva de células β. A diferencia de DM1, NO hay destrucción autoinmune, sino un déficit insulínico relativo. El diagnóstico se confirma con 2 mediciones alteradas.',
    keyConcepts: [
      'Glicemia en ayuno ≥126 mg/dL (x2) = criterio diagnóstico DM',
      'HbA1c ≥6.5% = criterio diagnóstico (refleja glicemia de 3 meses)',
      'Glicemia aleatoria ≥200 mg/dL con síntomas = DM directamente',
      'Prediabetes: glicemia ayuno 100–125 mg/dL o HbA1c 5.7–6.4%',
      'DM1: autoinmune, absoluta (anti-GAD, anti-IA2); DM2: metabólica, relativa',
    ],
    mnemonic: {
      text: '"POLI x3" para síntomas cardinales de DM',
      explanation: 'POLIuria · POLIdipsia · POLIfagia → los 3 síntomas clásicos de hiperglicemia',
    },
    highYield: [
      'EUNACOM pregunta frecuentemente DM1 vs DM2 (fisiopatología + tratamiento)',
      'Metformina = primera línea en DM2 (contraindicada en TFG <30)',
      'Insulinizar si: HbA1c >9%, fracaso de ≥2 hipoglicemiantes, o descompensación',
      'Criterio de mal control: HbA1c ≥7% en la mayoría de pacientes',
    ],
    clinicalAlgorithm:
      'Dx DM2 → Metas: HbA1c <7% / Glicemia ayuno <130 / PP <180\n→ Metformina + cambio estilo de vida\n→ Si HbA1c >7% a los 3 meses: agregar 2.ª línea (iSGLT2 / GLP1 / sulfonilurea)\n→ Si HbA1c >9% o síntomas: iniciar insulina directamente',
  },
  cardiologia: {
    lessonTitle: '1.- Manejo de urgencia en arritmias',
    summary:
      'Las arritmias son alteraciones del ritmo o frecuencia cardíaca. En urgencias, el primer paso es evaluar ESTABILIDAD HEMODINÁMICA (PA, conciencia, dolor torácico, edema pulmonar). Un paciente inestable con cualquier taquiarritmia se cardiovierte eléctricamente de inmediato.',
    keyConcepts: [
      'Inestabilidad hemodinámica: hipotensión, síncope, dolor isquémico, edema pulmonar',
      'Taquicardia con QRS ancho: presumir TV hasta probar lo contrario',
      'Cardioversión eléctrica sincronizada: taquiarritmia + inestabilidad',
      'Desfibrilación no sincronizada: FV / TV sin pulso (PCR)',
      'Adenosina: de elección en TSV regular de QRS estrecho estable',
    ],
    mnemonic: {
      text: '"PARA" para el manejo inicial de arritmias',
      explanation:
        'Pulso (¿tiene?) → Ancho del QRS → Regularidad → Acción farmacológica o eléctrica',
    },
    highYield: [
      'EUNACOM: "¿Primer paso en taquicardia?" → Evaluar estabilidad hemodinámica',
      'FA con <48h y estable → cardioversión farmacológica (amiodarona) o eléctrica',
      'FA crónica → control de frecuencia (betabloqueador, digoxina) + anticoagulación',
      'Wolff-Parkinson-White + FA → NUNCA adenosina ni digoxina (riesgo FV)',
    ],
    clinicalAlgorithm:
      'Taquiarritmia → ¿Estable?\n→ NO: Cardioversión eléctrica sincronizada 100-200J\n→ SÍ: QRS estrecho → adenosina (TSV) / amiodarona (FA)\n         QRS ancho → amiodarona IV (TV estable) / cardioversión (TV inestable)',
  },
}

// ─── Specialty lesson data ────────────────────────────────────────────────────

export const SPECIALTY_LESSONS: Record<string, SpecialtyContent> = {
  // ── Capítulo 1: Medicina Interna ───────────────────────────────────────────

  diabetes: {
    code: 'diabetes',
    videos: [
      { number: 1, title: 'Diabetes Mellitus tipo 2 — Generalidades' },
      { number: 2, title: 'Fisiopatología DM tipo 1 y tipo 2' },
      { number: 3, title: 'Criterios diagnósticos de Diabetes' },
      { number: 4, title: 'Tratamiento no farmacológico DM2' },
      { number: 5, title: 'Fármacos hipoglicemiantes orales' },
      { number: 6, title: 'Insulinoterapia' },
      { number: 7, title: 'Complicaciones agudas: hipoglicemia, CAD, EHH' },
      { number: 8, title: 'Complicaciones crónicas: nefropatía y retinopatía' },
      { number: 9, title: 'Neuropatía diabética y pie diabético' },
    ],
    materials: [
      { title: 'Algoritmo de manejo de DM2', type: 'guide' },
      { title: 'Tabla de hipoglicemiantes orales', type: 'reference' },
      { title: 'Slides de clases', type: 'summary' },
    ],
  },

  endocrinologia: {
    code: 'endocrinologia',
    videos: [
      { number: 1, title: 'Hipotiroidismo — diagnóstico y manejo' },
      { number: 2, title: 'Hipertiroidismo y tirotoxicosis' },
      { number: 3, title: 'Nódulo tiroideo y cáncer de tiroides' },
      { number: 4, title: 'Insuficiencia suprarrenal' },
      { number: 5, title: 'Síndrome de Cushing' },
      { number: 6, title: 'Feocromocitoma' },
      { number: 7, title: 'Hiperparatiroidismo y trastornos del calcio' },
      { number: 8, title: 'Osteoporosis' },
    ],
    materials: [
      { title: 'Resumen eje hipotálamo-hipófisis-tiroides', type: 'summary' },
    ],
  },

  cardiologia: {
    code: 'cardiologia',
    videos: [
      { number: 1, title: 'Manejo de urgencia en arritmias' },
      { number: 2, title: 'Paro cardiorespiratorio' },
      { number: 3, title: 'Reanimación cardiopulmonar (RCP)' },
      { number: 4, title: 'Bradiarritmias y bloqueos cardíacos' },
      { number: 5, title: 'Fibrilación auricular' },
      { number: 6, title: 'Antiarrítmicos' },
      { number: 7, title: 'Fármacos anticoagulantes' },
      { number: 8, title: 'Resumen del manejo de la fibrilación auricular' },
      { number: 9, title: 'Fibrilación auricular crónica' },
      { number: 10, title: 'Fibrilación auricular de reciente comienzo' },
      { number: 11, title: 'Flutter auricular' },
      { number: 12, title: 'Taquicardia paroxística supraventicular' },
      { number: 13, title: 'Taquicardia ventricular y canalopatías' },
      { number: 14, title: 'Extrasístoles' },
      { number: 15, title: 'Angina crónica' },
      { number: 16, title: 'Dolor torácico' },
      { number: 17, title: 'Electrocardiograma en síndrome coronario agudo' },
      { number: 18, title: 'Marcadores de isquemia miocárdica' },
      { number: 19, title: 'Síndrome coronario agudo' },
      { number: 20, title: 'Complicaciones mecánicas del infarto miocárdico' },
      { number: 21, title: 'Arritmias en el infarto' },
      { number: 22, title: 'Infarto de ventrículo derecho' },
      { number: 23, title: 'Insuficiencia cardíaca (generalidades)' },
      { number: 24, title: 'Insuficiencia cardíaca (tratamiento)' },
      { number: 25, title: 'Cardiopatía coronaria' },
      { number: 26, title: 'Cor pulmonale' },
      { number: 27, title: 'Valvulopatías (generalidades)' },
      { number: 28, title: 'Valvulopatías izquierdas (semiología)' },
      { number: 29, title: 'Valvulopatías derechas (semiología)' },
      { number: 30, title: 'Miocardiopatías' },
      { number: 31, title: 'Foramen oval permeable' },
      { number: 32, title: 'Soplo funcional' },
      { number: 33, title: 'Enfermedades del pericardio' },
      { number: 34, title: 'Miocarditis aguda' },
      { number: 35, title: 'Fiebre reumática' },
      { number: 36, title: 'Clasificación del shock' },
      { number: 37, title: 'Cardiopatías congénitas (clasificación y generalidades)' },
      { number: 38, title: 'Cardiopatías congénitas (detalles semiología)' },
      { number: 39, title: 'Disección aórtica' },
      { number: 40, title: 'Aneurisma de la aorta abdominal' },
      { number: 41, title: 'Isquemia aguda de extremidades inferiores' },
      { number: 42, title: 'Isquemia crónica de extremidades inferiores' },
      { number: 43, title: 'Estenosis carotídea' },
      { number: 44, title: 'Trombosis venosa profunda (TVP)' },
      { number: 45, title: 'Tromboembolismo pulmonar (TEP)' },
      { number: 46, title: 'Tromboembolismo pulmonar masivo' },
      { number: 47, title: 'Detalles en tromboembolismo pulmonar' },
      { number: 48, title: 'Insuficiencia venosa de extremidades inferiores' },
    ],
    materials: [
      { title: 'Resumen de Semiología Cardíaca', type: 'summary' },
      { title: 'Resumen de electrocardiogramas', type: 'reference' },
    ],
  },

  reumatologia: {
    code: 'reumatologia',
    videos: [
      { number: 1, title: 'Artritis reumatoide — diagnóstico' },
      { number: 2, title: 'Artritis reumatoide — tratamiento' },
      { number: 3, title: 'Lupus eritematoso sistémico' },
      { number: 4, title: 'Espondiloartropatías' },
      { number: 5, title: 'Artritis gotosa' },
      { number: 6, title: 'Artrosis' },
      { number: 7, title: 'Síndrome de Sjögren y esclerodermia' },
    ],
    materials: [
      { title: 'Tabla de enfermedades autoinmunes y sus anticuerpos', type: 'reference' },
    ],
  },

  gastroenterologia: {
    code: 'gastroenterologia',
    videos: [
      { number: 1, title: 'Enfermedad por reflujo gastroesofágico (ERGE)' },
      { number: 2, title: 'Úlcera péptica y H. pylori' },
      { number: 3, title: 'Síndrome de intestino irritable' },
      { number: 4, title: 'Enfermedad inflamatoria intestinal (Crohn y CU)' },
      { number: 5, title: 'Cirrosis hepática' },
      { number: 6, title: 'Hepatitis virales' },
      { number: 7, title: 'Pancreatitis aguda y crónica' },
      { number: 8, title: 'Colelitiasis y colecistitis' },
      { number: 9, title: 'Hemorragia digestiva alta y baja' },
    ],
    materials: [
      { title: 'Criterios de Child-Pugh y MELD', type: 'reference' },
    ],
  },

  hematologia: {
    code: 'hematologia',
    videos: [
      { number: 1, title: 'Anemia — enfoque general y clasificación' },
      { number: 2, title: 'Anemia ferropénica' },
      { number: 3, title: 'Anemia megaloblástica (B12 y folato)' },
      { number: 4, title: 'Anemia hemolítica' },
      { number: 5, title: 'Leucemias agudas' },
      { number: 6, title: 'Linfomas (Hodgkin y no Hodgkin)' },
      { number: 7, title: 'Trastornos de coagulación y trombocitopenia' },
      { number: 8, title: 'Mieloma múltiple' },
    ],
    materials: [
      { title: 'Algoritmo diagnóstico de anemias', type: 'guide' },
    ],
  },

  nefrologia: {
    code: 'nefrologia',
    videos: [
      { number: 1, title: 'Insuficiencia renal aguda — clasificación' },
      { number: 2, title: 'Insuficiencia renal aguda — manejo' },
      { number: 3, title: 'Enfermedad renal crónica' },
      { number: 4, title: 'Síndrome nefrótico' },
      { number: 5, title: 'Síndrome nefrítico y glomerulonefritis' },
      { number: 6, title: 'Alteraciones del sodio (hipo/hipernatremia)' },
      { number: 7, title: 'Alteraciones del potasio (hipo/hipercalemia)' },
      { number: 8, title: 'Trastornos ácido-base' },
      { number: 9, title: 'Infección del tracto urinario' },
    ],
    materials: [
      { title: 'Interpretación de gases arteriales', type: 'guide' },
    ],
  },

  infectologia: {
    code: 'infectologia',
    videos: [
      { number: 1, title: 'Sepsis y shock séptico' },
      { number: 2, title: 'Neumonía adquirida en la comunidad' },
      { number: 3, title: 'VIH/SIDA — diagnóstico y manejo' },
      { number: 4, title: 'Tuberculosis' },
      { number: 5, title: 'Meningitis bacteriana' },
      { number: 6, title: 'Endocarditis infecciosa' },
      { number: 7, title: 'Infecciones de piel y tejidos blandos' },
      { number: 8, title: 'Fiebre de origen desconocido' },
    ],
    materials: [
      { title: 'Antibióticos y espectro de acción', type: 'reference' },
    ],
  },

  respiratorio: {
    code: 'respiratorio',
    videos: [
      { number: 1, title: 'Asma bronquial — diagnóstico y clasificación' },
      { number: 2, title: 'Asma bronquial — tratamiento y crisis' },
      { number: 3, title: 'EPOC — diagnóstico y estadificación' },
      { number: 4, title: 'EPOC — tratamiento y exacerbación' },
      { number: 5, title: 'Cáncer de pulmón' },
      { number: 6, title: 'Derrame pleural y neumotórax' },
      { number: 7, title: 'Síndrome de apnea obstructiva del sueño (SAOS)' },
    ],
    materials: [
      { title: 'Interpretación de espirometría', type: 'guide' },
    ],
  },

  neurologia: {
    code: 'neurologia',
    videos: [
      { number: 1, title: 'Accidente cerebrovascular isquémico' },
      { number: 2, title: 'Accidente cerebrovascular hemorrágico' },
      { number: 3, title: 'Epilepsia — clasificación y tratamiento' },
      { number: 4, title: 'Cefalea y migraña' },
      { number: 5, title: 'Enfermedad de Parkinson' },
      { number: 6, title: 'Esclerosis múltiple' },
      { number: 7, title: 'Síndrome de Guillain-Barré' },
      { number: 8, title: 'Miastenia gravis' },
    ],
    materials: [
      { title: 'Score NIHSS y criterios de tPA', type: 'reference' },
    ],
  },

  geriatria: {
    code: 'geriatria',
    videos: [
      { number: 1, title: 'Generalidades de Geriatría' },
      { number: 2, title: 'Delirium y demencia' },
      { number: 3, title: 'Causas específicas de demencia' },
      { number: 4, title: 'Deterioro cognitivo menor' },
      { number: 5, title: 'Sarcopenia y caídas en el adulto mayor' },
      { number: 6, title: 'Depresión y abuso en el adulto mayor' },
    ],
    relatedTopics: [
      { number: 1, title: 'Incontinencia urinaria' },
      { number: 2, title: 'Incontinencia urinaria — Manejo' },
      { number: 3, title: 'Vejiga neurogénica' },
    ],
    materials: [],
    notes: 'Geriatría se evalúa junto a los demás temas de Medicina Interna.',
  },
}
