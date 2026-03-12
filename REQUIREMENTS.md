# EunacomGo — Requirements

## Current Sprint: SEO + GSD Integration

### SEO Goals
- [ ] Rank in top 3 for "preparacion EUNACOM Chile"
- [ ] Rank for "banco preguntas EUNACOM"
- [ ] Rank for "simulacro EUNACOM online"
- [ ] Rank for specialty terms: "preguntas EUNACOM medicina interna", etc.
- [ ] Rich snippets in Google via FAQ, HowTo, BreadcrumbList, Course schema
- [ ] All public pages indexed (sitemap covers all routes)
- [ ] Private routes (/admin, /app) blocked from indexing

### GSD Integration Goals
- [ ] PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md created
- [ ] All future Claude sessions can start with `/gsd:init` to load context
- [ ] Atomic commits per feature, proper branch naming

---

## Core Product Requirements

### Authentication
- [x] Email/password signup via Supabase Auth
- [x] Auto-create profile on signup (DB trigger)
- [x] Role-based access: admin vs student
- [x] Subscription gating for exam access

### Quiz Engine
- [x] Practice mode: immediate feedback per question
- [x] Simulation mode: no feedback until submit
- [x] Timed exams with countdown
- [x] Question flagging
- [x] Question navigation
- [x] Results with score and answer review
- [ ] Adaptive difficulty (prioritize weak areas automatically)

### Student Dashboard
- [x] Available exams listing
- [x] Exam history
- [x] Stats overview
- [x] Specialty coverage analysis
- [ ] Streak tracking / gamification
- [ ] Study plan generator

### Admin Panel
- [x] Question CRUD
- [x] Bulk import (text/image)
- [x] AI question generation (OpenAI)
- [x] User management
- [x] Exam creation
- [ ] Question approval workflow
- [ ] Import quality scoring

### Content / SEO Hub
- [x] /eunacom/que-es
- [x] /eunacom/fechas-y-modalidades
- [x] /eunacom/guia-estudio
- [x] /eunacom/normativa-2026
- [ ] /eunacom/especialidades (overview + 11 individual pages)
- [ ] /eunacom/preguntas-frecuentes
- [ ] /blog (long-form SEO articles)

### Video Course Platform
- [x] DB schema (course_editions, lessons, enrollments, lesson_progress)
- [ ] Enrollment flow (payment integration)
- [ ] Video player with progress tracking
- [ ] AI-powered lesson summaries and mnemonics
- [ ] Transcript viewer

---

## Non-Functional Requirements

- **Performance:** LCP < 2.5s, CLS < 0.1 (Core Web Vitals)
- **SEO:** Structured data on all public pages, sitemap updated with new routes
- **Security:** No PII in logs, RLS policies on all Supabase tables, admin routes protected
- **Accessibility:** ARIA labels on interactive elements, keyboard navigation
- **Mobile-first:** All pages functional at 375px+

---

## Constraints

- Spanish language only (Chilean medical audience)
- Must not replace or contradict official EUNACOM information — always link to eunacom.cl
- AI-generated questions require human review before publishing
- Questions must not include copyrighted exam material verbatim
