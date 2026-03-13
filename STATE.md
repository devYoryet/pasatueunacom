# EunacomGo — Current State

_Last updated: 2026-03-13 | Branch: claude/fix-gitignore-MlQtm_

## Active Branch

`claude/fix-gitignore-MlQtm` — Diabetes content capsules sprint

## What's Working

- ✅ Full authentication flow (signup, login, profile creation)
- ✅ Quiz engine (practice + simulation modes, timed, flagging)
- ✅ Admin panel (question CRUD, AI generation, bulk import)
- ✅ Student dashboard (exams, history, stats, coverage)
- ✅ EUNACOM content pages (que-es, fechas, guia, normativa-2026)
- ✅ Basic SEO (root metadata, OG tags, sitemap, robots)
- ✅ Supabase Auth + RLS
- ✅ Landing page with animated counter

## In Progress (This Sprint)

- ✅ GSD context engineering files (PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md)
- ✅ SEO overhaul (previous sprint — merged)
- ✅ **UI/UX — Blackboard-style redesign (Sprint 2026-03-13):**
  - Crash fix: reemplazado `use(params)` → `useParams()` en `[code]/page.tsx` (era React 19-only)
  - Sidebar: dark navy `#1c2c3e` con nav items usando `bg-blue-600` para activo
  - Chapter headers: dark `bg-[#1c2c3e] text-white` estilo módulos Blackboard
  - Semana activa: `border-l-2 border-l-blue-600` + `bg-blue-50`
  - Section headers (Video/Quiz/Audio): `bg-slate-200 text-slate-700` — contraste mayor
  - Botones Iniciar: `bg-blue-700` — más visible que el bg-blue-600 previo
  - Stat cards dashboard: colores por categoría (blue/green/amber)
  - Emojis eliminados de TIPS array y dashboard
  - Tab "Clases" link desde dashboard funcional via `?tab=lessons`
- 🔄 **Capítulo 1 Diabetes — Cápsulas de Audio:**
  - 24 SRTs del Dr. Guevara procesados como cápsulas profesionales
  - Guion reescrito + resumen + nemotecnia + pregunta EUNACOM por cápsula
  - `content/transcripts/01-diabetes/` — 24 TXTs listos para `process-audio.ts`
  - `content/diabetes/` — **21/24 cápsulas .md completas** (faltan 08,09,10,11,12,22,23,24)
  - `supabase/migrations/002_seed_lessons_diabetes.sql` — seed SQL listo
  - `public/audio/diabetes-clasificacion.mp3` — audio generado localmente (espeak-ng/MBROLA)
  - **Audio integrado en chapter view:** AudioCapsuleSection con player inline
  - **Audio integrado en lesson detail:** LessonCard con player expandible
  - ⏳ Pendiente: ejecutar `002_seed_lessons_diabetes.sql` en Supabase SQL editor
  - ⏳ Pendiente: ejecutar `supabase/update_lesson_audio.sql` para setear `video_url`
  - ⏳ O llamar `POST /api/admin/update-lesson-audio` (admin) para actualizar desde UI
  - ⏳ Pendiente: subir MP3s de calidad (OpenAI TTS nova) cuando haya acceso red sin proxy
  - ⏳ Siguiente: repetir ciclo para Cap. 2 Endocrinología (seed_endocrinologia_2_*.sql listos)

## Generación de Audio con OpenAI TTS

La página admin `/admin/audio` permite generar MP3s de calidad para cada cápsula.

**Antes de usar:**
1. Ir a Supabase SQL editor → ejecutar `supabase/create_audio_bucket.sql` (crea bucket "audio")
2. Verificar que `OPENAI_API_KEY` esté en Vercel → Settings → Environment Variables
3. Ir a `eunacomgo.cl/admin/audio` → elegir voz `nova` + velocidad 0.92 → "Generar"

**Voces recomendadas para español:**
- `nova` — Cálida, natural ✅ Mejor opción
- `alloy` — Neutra, clara

## Pending DB Actions (run in Supabase SQL editor)

```sql
-- 1. Crear bucket Storage para audios
-- File: supabase/create_audio_bucket.sql

-- 2. Run lesson seed (creates 24 lessons for diabetes)
-- File: supabase/migrations/002_seed_lessons_diabetes.sql

-- 3. (Opcional) Audio temporal local para cápsula 1
-- File: supabase/update_lesson_audio.sql
-- Reemplazar luego con URL de Supabase Storage generada por /admin/audio
```

## Known Issues / Tech Debt

- ⚠️ Google Fonts loaded from CDN (performance hit) — should migrate to next/font
- ⚠️ No Sentry error tracking in production
- ⚠️ Video course platform DB schema exists but UI not built
- ⚠️ No E2E tests for quiz flow
- ⚠️ sitemap was missing /admin block (now fixed)

## Environment Variables Needed

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
OPENAI_API_KEY=
```

## How to Start a New Session with GSD

1. Read PROJECT.md for project overview
2. Read STATE.md to understand current state
3. Read REQUIREMENTS.md for current sprint goals
4. Read ROADMAP.md for big picture
5. Then: "Continue working on [specific task from ROADMAP/STATE]"

## Recent Commits

```
8937d0b feat: audio player + MBROLA audio generado para cápsula 1 diabetes
879f353 feat: Blackboard redesign + crash fix (use(params) → useParams)
b1a1bb4 feat: rebrand to EunacomGo and add EUNACOM guides
51ddd9e fix git ignore
```

## Database Status

- Schema defined in `supabase/schema.sql`
- All core tables created
- Video course tables created (course_editions, lessons, enrollments, lesson_progress)
- RLS policies active on main tables

## Deployment

- **Hosting:** Vercel (auto-deploy on push to main)
- **Database:** Supabase (production project)
- **Domain:** eunacomgo.cl (DNS pointing to Vercel)
