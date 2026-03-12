# EunacomGo — Roadmap

## Phase 1: SEO Foundation (Current) ✅ In Progress

**Goal:** Own the "EUNACOM preparation" search space in Chile

### Deliverables
- [x] Root metadata with OG tags and JSON-LD EducationalOrganization schema
- [x] robots.txt configured
- [x] sitemap.xml with main public routes
- [ ] **Enhanced root layout** — canonical, Twitter Cards, richer JSON-LD
- [ ] **Robots** — block /admin and /app from indexing
- [ ] **Sitemap** — add new SEO pages, proper priorities
- [ ] **FAQ schema** on que-es page (rich snippets)
- [ ] **HowTo schema** on guia-estudio page
- [ ] **BreadcrumbList** on all content pages
- [ ] **/eunacom/especialidades** — specialty overview hub page
- [ ] **/eunacom/preguntas-frecuentes** — comprehensive FAQ page
- [ ] **GSD context files** — PROJECT.md, REQUIREMENTS.md, ROADMAP.md, STATE.md

**Target keywords:**
- preparacion eunacom (Volume: ~3,600/mo CL)
- banco preguntas eunacom (~1,900/mo)
- simulacro eunacom online (~880/mo)
- eunacom 2026 normativa (~590/mo)
- eunacom que es (~720/mo)

---

## Phase 2: Specialty Content Hub (~2-4 weeks)

**Goal:** Rank for long-tail specialty keywords + drive organic signups

### Deliverables
- [ ] 11 individual specialty pages `/eunacom/especialidades/[slug]` with:
  - Overview of the specialty in EUNACOM context
  - Key topics and subtopics
  - Study tips
  - CTA to practice questions
  - Schema.org Course markup
- [ ] Internal linking between specialty pages and content hub
- [ ] XML sitemap updated for all 11 specialty pages
- [ ] Specialty-specific meta descriptions targeting long-tail queries

**Target keywords per specialty:**
- "preguntas eunacom medicina interna"
- "eunacom pediatria temas"
- "eunacom cirugia preguntas"
- etc.

---

## Phase 3: Video Course Platform (~4-6 weeks)

**Goal:** Launch paid video course, monetize beyond subscriptions

### Deliverables
- [ ] Enrollment flow (Transbank or Stripe for CL)
- [ ] Video player component (Vimeo/Cloudflare Stream)
- [ ] Progress tracking with completion %
- [ ] AI-enhanced lesson pages (summaries, mnemonics, key concepts)
- [ ] Transcript viewer with timestamps
- [ ] Course landing page with syllabus and pricing

---

## Phase 4: Engagement & Retention (~6-8 weeks)

**Goal:** Reduce churn, increase daily active users

### Deliverables
- [ ] Streak tracking (daily practice streak)
- [ ] Email reminders (Resend integration)
- [ ] Study plan generator (AI-powered based on exam date)
- [ ] Performance leaderboard (anonymous opt-in)
- [ ] "Weak areas" smart review sessions
- [ ] Progress share cards (social media sharing)

---

## Phase 5: Scale (~3 months)

**Goal:** 10x question bank, enter LatAm expansion

### Deliverables
- [ ] Question approval workflow for admin
- [ ] Community question submissions (moderated)
- [ ] Colombia USMLE equivalent preparation module
- [ ] Institutional plans (universities, hospitals)
- [ ] API for content partners

---

## Technical Debt Backlog

- [ ] Replace Google Fonts with self-hosted fonts (performance)
- [ ] Add Sentry error tracking
- [ ] Add Vercel Analytics + Speed Insights
- [ ] Implement ISR for specialty content pages
- [ ] Add E2E tests (Playwright) for quiz flow
- [ ] RLS policy audit on all Supabase tables
- [ ] Migrate to next/font from Google Fonts CDN
