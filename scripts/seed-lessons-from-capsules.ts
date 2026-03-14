/**
 * seed-lessons-from-capsules.ts
 *
 * Lee los archivos markdown de cápsulas desde content/diabetes/
 * y genera un SQL seed para la tabla `lessons` en Supabase.
 *
 * También puede insertar directamente si se proveen las variables de entorno.
 *
 * Uso:
 *   # Generar SQL (sin Supabase):
 *   npx ts-node scripts/seed-lessons-from-capsules.ts --output sql
 *
 *   # Insertar directo a Supabase:
 *   npx ts-node scripts/seed-lessons-from-capsules.ts --output db
 *
 *   # Solo una especialidad:
 *   npx ts-node scripts/seed-lessons-from-capsules.ts --specialty diabetes --output sql
 */

import fs from 'fs'
import path from 'path'

// ─── Config ───────────────────────────────────────────────────────────────────

const CAPSULES_DIR   = path.join(process.cwd(), 'content', 'diabetes')
const TRANSCRIPTS_DIR = path.join(process.cwd(), 'content', 'transcripts', '01-diabetes')
const SRT_SOURCE_DIR = path.join(process.cwd(), '01 Diabetes')
const OUTPUT_SQL     = path.join(process.cwd(), 'supabase', 'migrations', '002_seed_lessons_diabetes.sql')

// ─── Types ────────────────────────────────────────────────────────────────────

interface ParsedCapsule {
  order_index: number
  title: string
  ai_summary: string
  ai_key_concepts: string[]
  ai_mnemonics: Array<{ para: string; nemotecnia: string; explicacion: string }>
  ai_high_yield: string[]
  ai_algorithms: string[]
  ai_review_qs: Array<{ pregunta: string; respuesta: string }>
  txt_content: string
  srt_content: string
  duration_seconds: number | null
}

// ─── Parser ───────────────────────────────────────────────────────────────────

function parseCapsule(filepath: string): ParsedCapsule | null {
  const content = fs.readFileSync(filepath, 'utf-8')
  const lines   = content.split('\n')

  // Extract order from filename: capsula_01_... → 1
  const basename = path.basename(filepath)
  const orderMatch = basename.match(/capsula_(\d+)_/)
  if (!orderMatch) return null
  const order_index = parseInt(orderMatch[1])

  // Title: first H1 line
  const titleLine = lines.find(l => l.startsWith('# Cápsula'))
  const titleMatch = titleLine?.match(/^# Cápsula \d+:\s*(.+)$/)
  const title = titleMatch?.[1]?.trim() ?? `Cápsula ${order_index}`

  // AI Summary: content between "## Guion para Audio" and next "---"
  const guionStart = lines.findIndex(l => l.includes('## Guion para Audio'))
  const guionEnd   = lines.findIndex((l, i) => i > guionStart && l.trim() === '---')
  const guionLines = guionStart >= 0 && guionEnd > guionStart
    ? lines.slice(guionStart + 2, guionEnd).join('\n').trim()
    : ''
  // Use first 3 paragraphs as summary
  const ai_summary = guionLines.split('\n\n').slice(0, 3).join('\n\n').trim()

  // Key concepts: "## Resumen Clave" bullet points
  const resumeStart = lines.findIndex(l => l.includes('## Resumen Clave'))
  const resumeEnd   = lines.findIndex((l, i) => i > resumeStart && l.trim() === '---')
  const ai_key_concepts: string[] = []
  if (resumeStart >= 0 && resumeEnd > resumeStart) {
    lines.slice(resumeStart + 1, resumeEnd).forEach(l => {
      const m = l.match(/^\s*[-*]\s+\*\*[^:]+:\*\*\s*(.+)$/)
      if (m) ai_key_concepts.push(m[1].trim())
    })
  }

  // Mnemonics: "## Nemotecnia EUNACOM"
  const nemoStart = lines.findIndex(l => l.includes('## Nemotecnia EUNACOM'))
  const nemoEnd   = lines.findIndex((l, i) => i > nemoStart && l.trim() === '---')
  const ai_mnemonics: Array<{ para: string; nemotecnia: string; explicacion: string }> = []
  if (nemoStart >= 0 && nemoEnd > nemoStart) {
    const nemoText = lines.slice(nemoStart + 1, nemoEnd).join('\n')
    // Each mnemonic: bold title + explanation on same or next lines
    const nemoBlocks = nemoText.split('\n\n').filter(b => b.trim())
    nemoBlocks.forEach(block => {
      const boldMatch = block.match(/\*\*([^*]+)\*\*[:\s]*(.*)/)
      if (boldMatch) {
        ai_mnemonics.push({
          para:        boldMatch[1].trim(),
          nemotecnia:  boldMatch[1].trim(),
          explicacion: (boldMatch[2] + block.replace(/\*\*[^*]+\*\*[:\s]*/, '')).trim(),
        })
      }
    })
  }

  // Review questions: "## Pregunta de Autoevaluación"
  // Captures ALL question blocks in the section, each with full text + options
  const pregStart = lines.findIndex(l => l.includes('## Pregunta de Autoevaluación') || l.includes('## Preguntas de Repaso'))
  const ai_review_qs: Array<{ pregunta: string; respuesta: string }> = []
  if (pregStart >= 0) {
    const sectionEnd = lines.findIndex((l, i) => i > pregStart && l.trim() === '---')
    const secLines = lines.slice(pregStart + 1, sectionEnd >= 0 ? sectionEnd : undefined)

    // Find all respuesta line indices within section
    const respIdxs: number[] = []
    secLines.forEach((l, i) => {
      if (/^\*?\*?Respuesta correcta/i.test(l.trim())) respIdxs.push(i)
    })

    // Find all question-start line indices (lines containing **¿...?)
    const qIdxs: number[] = []
    secLines.forEach((l, i) => {
      if (l.includes('**¿') || l.includes('**¿')) {
        // only mark as question start if it's a question line
        if (/\*\*¿.+\?/.test(l) || (l.includes('**¿') && l.includes('?'))) qIdxs.push(i)
      }
    })

    qIdxs.forEach((qIdx) => {
      // The respuesta for this question is the first respuesta line after qIdx
      const rIdx = respIdxs.find(r => r > qIdx)
      if (rIdx === undefined) return
      // pregunta = all lines from qIdx up to (not including) rIdx, cleaned of **
      const pregLines = secLines.slice(qIdx, rIdx)
        .map(l => l.replace(/\*\*/g, '').trim())
        .filter(l => l.length > 0)
      const pregunta = pregLines.join('\n').trim()
      const respuesta = secLines[rIdx].replace(/\*\*/g, '').trim()
      if (pregunta && respuesta) {
        ai_review_qs.push({ pregunta, respuesta })
      }
    })
  }

  // High yield: derive from key concepts (top 3)
  const ai_high_yield = ai_key_concepts.slice(0, 3)

  // Load transcript TXT
  const txtFile = fs.readdirSync(TRANSCRIPTS_DIR)
    .find(f => {
      const num = parseInt(f.split('-')[0])
      return num === order_index
    })
  const txt_content = txtFile
    ? fs.readFileSync(path.join(TRANSCRIPTS_DIR, txtFile), 'utf-8').trim()
    : ''

  // Load SRT
  const srtFile = fs.readdirSync(SRT_SOURCE_DIR)
    .find(f => f.endsWith('.srt') && f.startsWith(`${order_index}_`))
  const srt_content = srtFile
    ? fs.readFileSync(path.join(SRT_SOURCE_DIR, srtFile), 'utf-8').trim()
    : ''

  // Estimate duration from SRT (last timestamp)
  let duration_seconds: number | null = null
  if (srt_content) {
    const timestamps = [...srt_content.matchAll(/(\d{2}):(\d{2}):(\d{2}),\d{3} -->/g)]
    if (timestamps.length > 0) {
      const last = timestamps[timestamps.length - 1]
      duration_seconds = parseInt(last[1]) * 3600 + parseInt(last[2]) * 60 + parseInt(last[3])
    }
  }

  return {
    order_index,
    title,
    ai_summary,
    ai_key_concepts,
    ai_mnemonics,
    ai_high_yield,
    ai_algorithms: [],
    ai_review_qs,
    txt_content,
    srt_content,
    duration_seconds,
  }
}

// ─── SQL Generator ────────────────────────────────────────────────────────────

function escapeSql(s: string): string {
  return s.replace(/'/g, "''")
}

function generateSql(capsules: ParsedCapsule[]): string {
  const lines: string[] = [
    `-- ================================================`,
    `-- Migration 002: Seed Lessons — Diabetes (24 cápsulas)`,
    `-- Generated: ${new Date().toISOString()}`,
    `-- Run in Supabase SQL editor AFTER schema.sql + 001_course_editions_and_lessons.sql`,
    `-- ================================================`,
    ``,
    `-- Get specialty ID for diabetes`,
    `DO $$`,
    `DECLARE`,
    `  v_specialty_id INTEGER;`,
    `BEGIN`,
    `  SELECT id INTO v_specialty_id FROM specialties WHERE code = 'diabetes';`,
    `  IF v_specialty_id IS NULL THEN`,
    `    RAISE EXCEPTION 'Specialty "diabetes" not found. Run schema.sql first.';`,
    `  END IF;`,
    ``,
    `  -- Insert / update 24 lessons for Diabetes`,
    `  -- ON CONFLICT: updates all AI fields if lesson already exists`,
    ``,
  ]

  for (const c of capsules) {
    const summaryEsc    = escapeSql(c.ai_summary)
    const concepts      = JSON.stringify(c.ai_key_concepts).replace(/'/g, "''")
    const mnemonics     = JSON.stringify(c.ai_mnemonics).replace(/'/g, "''")
    const highYield     = JSON.stringify(c.ai_high_yield).replace(/'/g, "''")
    const algorithms    = JSON.stringify(c.ai_algorithms).replace(/'/g, "''")
    const reviewQs      = JSON.stringify(c.ai_review_qs).replace(/'/g, "''")
    const txtEsc        = escapeSql(c.txt_content.slice(0, 10000)) // DB column limit
    const srtEsc        = escapeSql(c.srt_content.slice(0, 20000))
    const duration      = c.duration_seconds !== null ? c.duration_seconds.toString() : 'NULL'
    const titleEsc      = escapeSql(c.title)

    lines.push(`  -- Cápsula ${c.order_index}: ${c.title}`)
    lines.push(`  INSERT INTO lessons (`)
    lines.push(`    specialty_id, title, order_index, duration_seconds,`)
    lines.push(`    txt_content, srt_content,`)
    lines.push(`    ai_summary, ai_key_concepts, ai_mnemonics,`)
    lines.push(`    ai_high_yield, ai_algorithms, ai_review_qs,`)
    lines.push(`    ai_processed_at, is_available, is_free_preview`)
    lines.push(`  ) VALUES (`)
    lines.push(`    v_specialty_id,`)
    lines.push(`    '${titleEsc}',`)
    lines.push(`    ${c.order_index},`)
    lines.push(`    ${duration},`)
    lines.push(`    '${txtEsc}',`)
    lines.push(`    '${srtEsc}',`)
    lines.push(`    '${summaryEsc}',`)
    lines.push(`    '${concepts}'::jsonb,`)
    lines.push(`    '${mnemonics}'::jsonb,`)
    lines.push(`    '${highYield}'::jsonb,`)
    lines.push(`    '${algorithms}'::jsonb,`)
    lines.push(`    '${reviewQs}'::jsonb,`)
    lines.push(`    NOW(),`)
    lines.push(`    TRUE,`)
    lines.push(`    ${c.order_index <= 3 ? 'TRUE' : 'FALSE'}  -- first 3 free preview`)
    lines.push(`  ) ON CONFLICT (specialty_id, order_index)`)
    lines.push(`  DO UPDATE SET`)
    lines.push(`    title            = EXCLUDED.title,`)
    lines.push(`    duration_seconds = EXCLUDED.duration_seconds,`)
    lines.push(`    txt_content      = EXCLUDED.txt_content,`)
    lines.push(`    srt_content      = EXCLUDED.srt_content,`)
    lines.push(`    ai_summary       = EXCLUDED.ai_summary,`)
    lines.push(`    ai_key_concepts  = EXCLUDED.ai_key_concepts,`)
    lines.push(`    ai_mnemonics     = EXCLUDED.ai_mnemonics,`)
    lines.push(`    ai_high_yield    = EXCLUDED.ai_high_yield,`)
    lines.push(`    ai_review_qs     = EXCLUDED.ai_review_qs,`)
    lines.push(`    ai_processed_at  = NOW(),`)
    lines.push(`    is_available     = TRUE;`)
    lines.push(``)
  }

  lines.push(`  RAISE NOTICE 'Diabetes lessons seeded: ${capsules.length} lessons';`)
  lines.push(`END $$;`)
  lines.push(``)

  return lines.join('\n')
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const args   = process.argv.slice(2)
  const output = args[args.indexOf('--output') + 1] ?? 'sql'

  // Find all capsule files
  const capsuleFiles = fs.existsSync(CAPSULES_DIR)
    ? fs.readdirSync(CAPSULES_DIR)
        .filter(f => f.endsWith('.md') && f.startsWith('capsula_'))
        .sort()
    : []

  if (capsuleFiles.length === 0) {
    console.error('No capsule files found in', CAPSULES_DIR)
    process.exit(1)
  }

  console.log(`📚 Found ${capsuleFiles.length} capsule files`)

  const capsules: ParsedCapsule[] = []
  for (const file of capsuleFiles) {
    const parsed = parseCapsule(path.join(CAPSULES_DIR, file))
    if (parsed) {
      capsules.push(parsed)
      console.log(`  ✅ [${parsed.order_index}] ${parsed.title}`)
    } else {
      console.log(`  ⚠️  Could not parse: ${file}`)
    }
  }

  capsules.sort((a, b) => a.order_index - b.order_index)

  if (output === 'sql') {
    const sql = generateSql(capsules)
    fs.writeFileSync(OUTPUT_SQL, sql, 'utf-8')
    console.log(`\n✅ SQL seed written to: ${OUTPUT_SQL}`)
    console.log(`   → Run this in your Supabase SQL editor to seed the lessons table`)
  } else if (output === 'db') {
    // Direct DB insert (requires env vars)
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const { data: specs } = await supabase.from('specialties').select('id').eq('code', 'diabetes').single()
    const specialtyId = (specs as any)?.id
    if (!specialtyId) {
      console.error('Specialty "diabetes" not found in DB')
      process.exit(1)
    }
    for (const c of capsules) {
      const { error } = await supabase.from('lessons').upsert({
        specialty_id:    specialtyId,
        title:           c.title,
        order_index:     c.order_index,
        duration_seconds: c.duration_seconds,
        txt_content:     c.txt_content,
        srt_content:     c.srt_content,
        ai_summary:      c.ai_summary,
        ai_key_concepts: c.ai_key_concepts,
        ai_mnemonics:    c.ai_mnemonics,
        ai_high_yield:   c.ai_high_yield,
        ai_algorithms:   c.ai_algorithms,
        ai_review_qs:    c.ai_review_qs,
        ai_processed_at: new Date().toISOString(),
        is_available:    true,
        is_free_preview: c.order_index <= 3,
      }, { onConflict: 'specialty_id,order_index' })
      if (error) console.error(`  ❌ [${c.order_index}] ${error.message}`)
      else       console.log(`  ✅ [${c.order_index}] ${c.title}`)
    }
    console.log('\n🎉 Done!')
  }
}

main().catch(console.error)
