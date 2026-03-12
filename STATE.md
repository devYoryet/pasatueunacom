# EunacomGo — Current State

_Last updated: 2026-03-12 | Branch: claude/integrate-gsm-seo-4SBD5_

## Active Branch

`claude/integrate-gsm-seo-4SBD5` — SEO + GSD integration sprint

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

- 🔄 SEO overhaul:
  - layout.tsx — canonical, Twitter Cards, richer JSON-LD
  - robots.ts — block private routes
  - sitemap.ts — expanded with new pages
  - Per-page structured data (FAQ, HowTo, Article, Breadcrumb schemas)
- 🔄 New SEO pages:
  - /eunacom/especialidades
  - /eunacom/preguntas-frecuentes
- 🔄 GSD context engineering files (this file + PROJECT.md, REQUIREMENTS.md, ROADMAP.md)

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
