/**
 * PasaTuEunacom — Audio Transcript Processor
 *
 * Lee archivos .txt desde content/transcripts/<specialty>/
 * y genera material de estudio IA para cada lección.
 * Guarda el resultado en la tabla `lessons` de Supabase.
 *
 * Uso:
 *   npx ts-node scripts/process-audio.ts --specialty cardiologia
 *   npx ts-node scripts/process-audio.ts --specialty all
 *   npx ts-node scripts/process-audio.ts --file content/transcripts/03-cardiologia/01-arritmias.txt
 *
 * Variables de entorno requeridas:
 *   OPENAI_API_KEY
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY  (service role, no anon key)
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// ─── Config ───────────────────────────────────────────────────────────────────

const CONTENT_DIR = path.join(process.cwd(), 'content', 'transcripts')
const PROMPT_FILE = path.join(process.cwd(), 'prompts', 'process-audio-transcript.md')
const DELAY_MS    = 1200 // Rate limit: ~50 req/min

// Mapping: folder prefix → specialty code in DB
const SPECIALTY_MAP: Record<string, string> = {
  '01-diabetes':          'diabetes',
  '02-endocrinologia':    'endocrinologia',
  '03-cardiologia':       'cardiologia',
  '04-reumatologia':      'reumatologia',
  '05-gastroenterologia': 'gastro',
  '06-hematologia':       'hematologia',
  '07-nefrologia':        'nefrologia',
  '08-infectologia':      'infectologia',
  '09-respiratorio':      'respiratorio',
  '10-neurologia':        'neurologia',
  '11-geriatria':         'geriatria',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function parseLessonMeta(filename: string): { order: number; title: string } {
  // Filename format: "01-manejo-urgencia-arritmias.txt" or "1.- Manejo de urgencia.txt"
  const base = path.basename(filename, path.extname(filename))
  const match = base.match(/^(\d+)[.\-–_\s]+(.+)$/)
  if (!match) return { order: 0, title: base }
  const order = parseInt(match[1])
  const title = match[2]
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim()
  return { order, title }
}

function buildUserPrompt(specialtyName: string, order: number, title: string, transcript: string): string {
  const truncated = transcript.length > 12000
    ? transcript.substring(0, 12000) + '\n... [transcript truncado por longitud]'
    : transcript

  return `Especialidad: ${specialtyName}
Clase N°${order}: ${title}

--- INICIO DEL TRANSCRIPT ---
${truncated}
--- FIN DEL TRANSCRIPT ---

Genera el JSON tal como se especificó. Sin texto adicional, sin markdown fence.`
}

// ─── Core processing function ─────────────────────────────────────────────────

async function processLesson(
  openai: OpenAI,
  supabase: ReturnType<typeof createClient>,
  specialtyId: number,
  specialtyName: string,
  folderName: string,
  filename: string,
) {
  const filePath = path.join(CONTENT_DIR, folderName, filename)
  const transcript = fs.readFileSync(filePath, 'utf-8').trim()

  if (transcript.length < 100) {
    console.log(`  ⚠️  Skipping ${filename} — transcript too short`)
    return
  }

  const { order, title } = parseLessonMeta(filename)
  console.log(`  🔄 Processing: [${order}] ${title}`)

  let aiData: any = {}
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.3,
      max_tokens: 3000,
      messages: [
        {
          role: 'system',
          content: `Eres un docente médico especialista en preparación para el EUNACOM chileno.
Tu tarea es analizar la transcripción de una cápsula de clase y generar material de estudio de alta calidad.
Basa TODO en el contenido del transcript. No inventes información.
Usa terminología médica correcta en español. Prioriza puntos frecuentes en el EUNACOM.
Responde ÚNICAMENTE con el JSON especificado. Sin texto adicional ni markdown.`,
        },
        {
          role: 'user',
          content: buildUserPrompt(specialtyName, order, title, transcript),
        },
      ],
    })

    const raw = completion.choices[0]?.message?.content ?? '{}'
    aiData = JSON.parse(raw)
  } catch (e: any) {
    console.log(`  ❌ AI error for ${filename}: ${e.message}`)
    return
  }

  // Upsert into lessons table
  const { error } = await supabase
    .from('lessons')
    .upsert(
      {
        specialty_id:    specialtyId,
        title,
        order_index:     order,
        txt_content:     transcript,
        ai_summary:      aiData.resumen ?? null,
        ai_key_concepts: aiData.conceptos_clave ?? [],
        ai_mnemonics:    aiData.nemotecnias ?? [],
        ai_high_yield:   aiData.puntos_eunacom ?? [],
        ai_algorithms:   aiData.algoritmos ?? [],
        ai_review_qs:    aiData.preguntas_repaso ?? [],
        ai_processed_at: new Date().toISOString(),
        is_available:    true,
      },
      { onConflict: 'specialty_id,order_index' }
    )

  if (error) {
    console.log(`  ❌ DB error: ${error.message}`)
  } else {
    console.log(`  ✅ Saved: ${title}`)
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2)
  const specialtyArg = args[args.indexOf('--specialty') + 1] ?? 'all'
  const fileArg      = args[args.indexOf('--file') + 1]

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  // Load specialty IDs from DB
  const { data: specialties } = await supabase
    .from('specialties')
    .select('id, code, name')
  const specMap = Object.fromEntries((specialties ?? []).map((s: any) => [s.code, s]))

  // Process single file
  if (fileArg) {
    const parts = fileArg.split('/')
    const folder = parts[parts.length - 2]
    const code   = SPECIALTY_MAP[folder]
    const spec   = specMap[code]
    if (!spec) {
      console.error(`Unknown specialty folder: ${folder}`)
      process.exit(1)
    }
    await processLesson(openai, supabase, spec.id, spec.name, folder, parts[parts.length - 1])
    return
  }

  // Determine which folders to process
  const folders = specialtyArg === 'all'
    ? Object.keys(SPECIALTY_MAP)
    : Object.entries(SPECIALTY_MAP)
        .filter(([, code]) => code === specialtyArg || `0x-${specialtyArg}` === specialtyArg)
        .map(([folder]) => folder)

  // Also check direct folder name match
  const allFolders = fs.existsSync(CONTENT_DIR)
    ? fs.readdirSync(CONTENT_DIR).filter((f) => fs.statSync(path.join(CONTENT_DIR, f)).isDirectory())
    : []

  const targetFolders = specialtyArg === 'all'
    ? allFolders
    : allFolders.filter((f) => {
        const code = SPECIALTY_MAP[f]
        return code === specialtyArg || f.includes(specialtyArg)
      })

  if (targetFolders.length === 0) {
    console.log('No transcript folders found. Add .txt files to content/transcripts/<specialty>/')
    console.log('Available specialties:', Object.keys(SPECIALTY_MAP).join(', '))
    process.exit(0)
  }

  for (const folder of targetFolders) {
    const code = SPECIALTY_MAP[folder]
    const spec = specMap[code]

    if (!spec) {
      console.log(`⚠️  Skipping folder "${folder}" — no specialty found for code "${code}"`)
      continue
    }

    const folderPath = path.join(CONTENT_DIR, folder)
    const files = fs.readdirSync(folderPath)
      .filter((f) => f.endsWith('.txt'))
      .sort()

    console.log(`\n📚 Processing ${spec.name} (${files.length} files)`)

    for (const file of files) {
      await processLesson(openai, supabase, spec.id, spec.name, folder, file)
      await sleep(DELAY_MS) // Rate limit
    }
  }

  console.log('\n🎉 Done!')
}

main().catch(console.error)
