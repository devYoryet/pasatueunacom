# EunacomGo — Project Context

## What is this project?

**EunacomGo** (`eunacomgo.cl`) is a comprehensive medical exam preparation platform for Chilean healthcare professionals preparing for the **EUNACOM** (Examen Único Nacional de Conocimientos de Medicina) — Chile's national medical licensing exam required to practice in the public health system and access state-funded specialization programs.

## Target Users

- **Medical graduates from Chilean universities** who need to pass EUNACOM to enter the public system
- **Foreign medical graduates** validating their titles to practice in Chile
- **Physicians preparing for specialization** (becas MINSAL/APS)

## Core Value Proposition

> "Estudia inteligente. Aprueba seguro."

Practice with clinical case questions (A–E format), timed simulations, and analytics that show where you're weak — so every study hour counts.

## Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3.4 |
| Auth + DB | Supabase (PostgreSQL) |
| State | Zustand 5 |
| Data fetching | TanStack React Query 5 |
| AI | OpenAI SDK 4 + Vercel AI SDK 3 |
| Animations | Framer Motion 11 |
| UI primitives | Radix UI + Shadcn |

## Domain & Deployment

- **Production URL:** https://eunacomgo.cl
- **Platform:** Vercel
- **DB:** Supabase (PostgreSQL)

## Key Directories

```
app/
  eunacom/          # Public SEO content pages
  app/              # Protected student dashboard
  admin/            # Protected admin panel
  api/              # API routes
components/
  landing/          # Landing page sections
  quiz/             # Quiz/exam UI
  ui/               # Radix/Shadcn primitives
lib/
  supabase/         # DB client + types
  quiz/             # Quiz state (Zustand store)
  ai/               # OpenAI helpers
supabase/
  schema.sql        # Full DB schema
  migrations/       # Incremental migrations
```

## Database Overview

- `profiles` — user role (admin/student), subscription status
- `eunacom_areas` — 11 specialty areas with exam weight %
- `questions` — MCQ questions with 5 options, explanation, difficulty
- `exams` — collections of questions (topic/repaso/simulation)
- `attempts` — user quiz sessions with answers and scores
- `course_editions`, `enrollments`, `lessons` — video course platform

## Key Business Rules

1. Users must have `subscription_status IN ('active', 'trial')` to access exams
2. Admin routes require `profiles.role = 'admin'`
3. EUNACOM has 11 specialty areas — Medicina Interna carries the highest weight
4. Questions follow the A–E multiple choice format of the actual exam
5. Two exam modes: **practice** (immediate feedback) and **simulation** (blind, timed)

## EUNACOM Context

The EUNACOM consists of:
- **Sección Teórica (ST):** ~180 MCQs, 2 blocks, covers all 11 specialty areas
- **Sección Práctica (SP):** ECOE clinical stations (Medicina Interna, Pediatría, Cirugía, OBGYN)
- **New 2026 normativa:** mandatory for all medical licenses (Ley 21.746), ECOE-only SP format

## Active Feature Areas

1. **Quiz engine** — core product, working
2. **SEO content hub** — `/eunacom/*` public pages
3. **Admin dashboard** — question CRUD, AI generation, bulk import
4. **Video course** — lessons with AI-processed transcripts (in development)
5. **Analytics** — student progress and coverage analysis

## Development Branch Pattern

All feature work goes to `claude/<feature-name>-<session-id>` branches, then PR to master.
