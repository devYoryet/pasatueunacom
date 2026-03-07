import OpenAI from 'openai'
import type { ParsedQuestion } from '@/lib/supabase/types'

const PARSER_SYSTEM_PROMPT = `Eres un extractor experto de preguntas médicas tipo EUNACOM chileno.
Recibirás texto copiado de una plataforma educativa con preguntas médicas.

Tu tarea tiene DOS pasos:
PASO 1 — EXTRACCIÓN: Identifica cada pregunta, sus opciones, la correcta y la explicación.
PASO 2 — REESCRITURA: Reescribe cada pregunta cambiando datos superficiales PERO
manteniendo exactamente el mismo concepto clínico evaluado.
  - Cambia: edad del paciente (±5-15 años), valores de laboratorio dentro de
    rangos clínicamente equivalentes (no cambies el significado diagnóstico),
    sexo si es clínicamente neutro, nombre de medicamentos por su genérico.
  - NO cambies: el concepto médico evaluado, la dificultad, la lógica diagnóstica.
  - Reescribe la explicación de forma original y educativa en español de Chile.

REGLAS:
- Terminología en español chileno (hemoglucotest, HGT, poli, APS, isapre)
- Si el enunciado tiene tabla de datos, conviértela a markdown con headers:
  | | Preprandial | Postprandial |
  |---|---|---|
  | Desayuno | 80 | 120 |
- Si hay menos de 5 opciones, genera tú una opción E plausible pero incorrecta
- Detecta la especialidad: diabetes/endocrinologia/cardiologia/nefrologia/
  reumatologia/hematologia/infectologia/respiratorio/gastro/neurologia/
  geriatria/pediatria/ginecologia/cirugia/psiquiatria/dermatologia/
  oftalmologia/otorrino/salud_publica

RESPONDE ÚNICAMENTE con un JSON array válido, sin texto adicional:
[
  {
    "stem": "enunciado completo reescrito",
    "option_a": "primera opción sin la letra",
    "option_b": "segunda opción",
    "option_c": "tercera opción",
    "option_d": "cuarta opción",
    "option_e": "quinta opción",
    "correct_option": "c",
    "explanation": "explicación educativa reescrita",
    "has_table": false,
    "detected_topic": "diabetes",
    "difficulty": "medium"
  }
]`

export async function parseQuestionsFromText(
  rawText: string,
  specialtyHint?: string
): Promise<ParsedQuestion[]> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const userMessage = specialtyHint
    ? `Especialidad detectada: ${specialtyHint}\n\nTexto a procesar:\n${rawText}`
    : rawText

  const completion = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'system', content: PARSER_SYSTEM_PROMPT },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.3,
    max_tokens: 8000,
  })

  const content = completion.choices[0]?.message?.content
  if (!content) throw new Error('No se recibió respuesta de la IA')

  // Extract JSON from response
  const jsonMatch = content.match(/\[[\s\S]*\]/)
  if (!jsonMatch) throw new Error('Formato de respuesta inválido')

  const parsed = JSON.parse(jsonMatch[0]) as ParsedQuestion[]
  return parsed
}

export async function parseQuestionsFromImages(
  imageBase64Array: string[]
): Promise<ParsedQuestion[]> {
  const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  // First, transcribe all images
  const transcriptions: string[] = []

  for (const imageBase64 of imageBase64Array) {
    const transcription = await client.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Transcribe exactamente el texto de esta imagen de pregunta médica. Incluye el enunciado, todas las opciones (A-E), la opción correcta si está marcada, y la retroalimentación/explicación si aparece. Mantén el formato original.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${imageBase64}`,
                detail: 'high',
              },
            },
          ],
        },
      ],
      max_tokens: 2000,
    })

    const text = transcription.choices[0]?.message?.content
    if (text) transcriptions.push(text)
  }

  const combinedText = transcriptions.join('\n\n---\n\n')
  return parseQuestionsFromText(combinedText)
}
