# EunacomGo — Current State

_Last updated: 2026-03-12 | Branch: claude/fix-gitignore-MlQtm_

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
- 🔄 **Capítulo 1 Diabetes — Cápsulas de Audio:**
  - 24 SRTs del Dr. Guevara procesados como cápsulas profesionales
  - Guion reescrito + resumen + nemotecnia + pregunta EUNACOM por cápsula
  - `content/transcripts/01-diabetes/` — 24 TXTs listos para `process-audio.ts`
  - `content/diabetes/` — **24/24 cápsulas .md completas** ✅
  - `supabase/migrations/002_seed_lessons_diabetes.sql` — seed listo para ejecutar
  - `scripts/seed-lessons-from-capsules.ts` — script para regenerar SQL desde MDs
  - ⏳ Pendiente: ejecutar seed SQL en Supabase SQL editor
  - ⏳ Pendiente: subir MP3s a Vimeo/R2 y actualizar `video_url`
  - ⏳ Siguiente: repetir ciclo para Cap. 2 Endocrinología

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
b1a1bb4 feat: rebrand to EunacomGo and add EUNACOM guides
51ddd9e fix git ignore
7c62edd docs(supabase): README con conexión BD y creación de usuarios
b6a4a00 fix register
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
