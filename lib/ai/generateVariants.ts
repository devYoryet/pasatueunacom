import type { Question, ParsedQuestion, Difficulty } from '@/lib/supabase/types'

const GENERATOR_SYSTEM_PROMPT = `Eres un experto en medicina interna y diseño de items tipo EUNACOM de Chile.
Recibirás preguntas de ejemplo de una especialidad médica.
Tu tarea: crear N preguntas NUEVAS y ORIGINALES que evalúen los mismos
conceptos con casos clínicos completamente diferentes.

ESTÁNDARES DE CALIDAD:
1. Cada pregunta = caso clínico realista con: edad, sexo, síntomas específicos,
   datos de laboratorio/imágenes concretos, contexto clínico plausible
2. Las 5 opciones deben ser todas plausibles — EVITAR distractores obvios.
   Un médico bien estudiado pero sin dominar el tema podría dudar entre 2-3 opciones.
3. Distribuir la correcta aleatoriamente entre A-E (no siempre C o D)
4. La explicación debe enseñar: explica el razonamiento clínico paso a paso,
   por qué es correcta Y por qué las otras son incorrectas con su lógica.
5. Vocabulario médico chileno: hemoglucotest (no glucómetro), HTA (no HTN),
   policlínico, APS, FONASA, arsenales farmacológicos chilenos (enalapril,
   metformina, glibenclamida, etc.)
6. Dificultad EUNACOM real: aplicación clínica de conocimientos, NO memorización.
   El estudiante debe razonar, no solo recordar.
7. Para preguntas con datos de laboratorio múltiples → usar tabla markdown.

NUNCA repitas el caso clínico de las preguntas ejemplo. Sé creativo con:
- Contextos (APS, urgencia, policlínico especialidad, hospitalizado)
- Comorbilidades que complican la decisión
- Presentaciones atípicas de enfermedades comunes
- Manejo de complicaciones y urgencias

Responde SOLO con JSON array válido en el mismo formato.`

export async function generateQuestionsPrompt(
  count: number,
  exampleQuestions: Question[],
  options: {
    increaseDifficulty?: boolean
    includeTabular?: boolean
    focusOnFailed?: boolean
  }
): Promise<string> {
  const examplesText = exampleQuestions
    .slice(0, 5)
    .map(
      (q, i) => `
EJEMPLO ${i + 1}:
Enunciado: ${q.stem}
A) ${q.option_a}
B) ${q.option_b}
C) ${q.option_c}
D) ${q.option_d}
E) ${q.option_e ?? 'N/A'}
Correcta: ${q.correct_option.toUpperCase()}
Explicación: ${q.explanation}
`
    )
    .join('\n')

  const instructions: string[] = []
  if (options.increaseDifficulty) {
    instructions.push('- Genera preguntas de dificultad ALTA, con presentaciones más complejas y opciones más similares entre sí.')
  }
  if (options.includeTabular) {
    instructions.push('- Al menos 30% de las preguntas deben tener tabla de datos clínicos en markdown.')
  }
  if (options.focusOnFailed) {
    instructions.push('- Enfócate en los conceptos más difíciles del tema, donde los estudiantes suelen equivocarse.')
  }

  const specialInstructions = instructions.length > 0
    ? `\nINSTRUCCIONES ESPECIALES:\n${instructions.join('\n')}`
    : ''

  return `${GENERATOR_SYSTEM_PROMPT}${specialInstructions}

Genera EXACTAMENTE ${count} preguntas nuevas basadas en los siguientes ejemplos:

${examplesText}

Responde SOLO con el JSON array de ${count} preguntas en este formato:
[
  {
    "stem": "enunciado completo",
    "option_a": "primera opción",
    "option_b": "segunda opción",
    "option_c": "tercera opción",
    "option_d": "cuarta opción",
    "option_e": "quinta opción",
    "correct_option": "a",
    "explanation": "explicación detallada",
    "has_table": false,
    "detected_topic": "tema_detectado",
    "difficulty": "medium"
  }
]`
}

export function formatParsedAsQuestion(
  parsed: ParsedQuestion,
  specialtyId: number,
  createdBy: string
): Omit<Question, 'id' | 'created_at' | 'updated_at'> {
  return {
    specialty_id: specialtyId,
    topic_id: null,
    stem: parsed.stem,
    option_a: parsed.option_a,
    option_b: parsed.option_b,
    option_c: parsed.option_c,
    option_d: parsed.option_d,
    option_e: parsed.option_e,
    correct_option: parsed.correct_option as 'a' | 'b' | 'c' | 'd' | 'e',
    explanation: parsed.explanation,
    difficulty: parsed.difficulty as Difficulty,
    has_table: parsed.has_table,
    is_active: true,
    ai_generated: true,
    created_by: createdBy,
  }
}
