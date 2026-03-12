-- ================================================
-- PasaTuEunacom — Migration 001
-- Course Editions, Lessons, Lesson Progress, Enrollments
-- ================================================
-- Run this in your Supabase SQL editor

-- ================================================
-- COURSE EDITIONS
-- Representa cada convocatoria EUNACOM:
--   - EUNACOM Julio 2026
--   - EUNACOM Noviembre 2026
--   - etc.
-- ================================================
CREATE TABLE IF NOT EXISTS course_editions (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,           -- 'Curso EUNACOM Julio 2026'
  slug          TEXT NOT NULL UNIQUE,    -- 'eunacom-julio-2026'
  target_exam_date DATE,                 -- Fecha del EUNACOM real (aprox)
  course_start_date DATE NOT NULL,       -- 5 enero 2026
  course_end_date   DATE NOT NULL,       -- 10 julio 2026
  is_active     BOOLEAN DEFAULT TRUE,
  price_clp     INTEGER DEFAULT 0,       -- Precio en pesos chilenos
  description   TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- EUNACOM Official Dates (administered by ASOFAMECH)
-- Se rinde DOS veces al año:
--   Convocatoria 1: ~miércoles 9 julio  (inscripciones: abril-mayo)
--   Convocatoria 2: ~miércoles 17 diciembre (inscripciones: julio-octubre)
-- Costo oficial 2026: ST CLP $310.000 + SP CLP $655.000
-- Fuente: eunacom.cl / asofamech.cl
-- ─────────────────────────────────────────────────────────────────────────────
INSERT INTO course_editions
  (name, slug, target_exam_date, course_start_date, course_end_date, is_active, price_clp, description)
VALUES
  (
    'Curso EUNACOM Julio 2026',
    'eunacom-julio-2026',
    '2026-07-09',
    '2026-01-05',
    '2026-07-10',
    TRUE,
    190000,
    'Preparación de 26 semanas para el EUNACOM-ST Julio 2026. Cubre los 4 capítulos del programa oficial ASOFAMECH.'
  ),
  (
    'Curso EUNACOM Diciembre 2026',
    'eunacom-diciembre-2026',
    '2026-12-16',
    '2026-07-13',
    '2026-12-12',
    FALSE,
    190000,
    'Para quienes rindan por primera vez en diciembre o repitan después de julio.'
  )
ON CONFLICT (slug) DO NOTHING;


-- ================================================
-- ENROLLMENTS
-- Una suscripción de usuario a una edición de curso.
-- Modelo: pago por curso (no suscripción recurrente).
-- Si repite EUNACOM en noviembre → nueva enrollment.
-- ================================================
CREATE TABLE IF NOT EXISTS enrollments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  edition_id     INTEGER NOT NULL REFERENCES course_editions(id),
  enrolled_at    TIMESTAMPTZ DEFAULT NOW(),
  valid_until    TIMESTAMPTZ,                -- NULL = válido indefinidamente
  payment_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (payment_status IN ('pending', 'paid', 'trial', 'free', 'refunded')),
  payment_ref    TEXT,                       -- referencia Transbank / MercadoPago
  UNIQUE (user_id, edition_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS enrollments_user_idx    ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS enrollments_edition_idx ON enrollments(edition_id);

-- RLS
ALTER TABLE course_editions ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_editions_read" ON course_editions
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_editions" ON course_editions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "own_enrollments" ON enrollments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admin_view_enrollments" ON enrollments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ================================================
-- LESSONS (Clases / Cápsulas de audio)
-- Cada cápsula de ~10-20 min es un registro aquí.
-- El MP3 no se almacena en repo; se usa video_url (Vimeo/YT/R2).
-- El SRT/TXT sí se almacena en la columna srt_content.
-- El material generado por IA se guarda en las columnas AI.
-- ================================================
CREATE TABLE IF NOT EXISTS lessons (
  id               SERIAL PRIMARY KEY,
  specialty_id     INTEGER REFERENCES specialties(id) ON DELETE SET NULL,
  title            TEXT NOT NULL,           -- '1.- Manejo de urgencia en arritmias'
  order_index      INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER,                 -- duración del audio/video
  video_url        TEXT,                    -- URL Vimeo / YouTube / Cloudflare R2

  -- Transcript
  srt_content      TEXT,                    -- contenido completo del .srt
  txt_content      TEXT,                    -- contenido completo del .txt (limpio)

  -- Material generado por IA (se pobla con el agente de procesamiento)
  ai_summary       TEXT,                    -- resumen ejecutivo
  ai_key_concepts  JSONB DEFAULT '[]',      -- ["concepto1", "concepto2", ...]
  ai_mnemonics     JSONB DEFAULT '[]',      -- [{"para":"...","nemotecnia":"...","explicacion":"..."}]
  ai_high_yield    JSONB DEFAULT '[]',      -- puntos de alto rendimiento EUNACOM
  ai_algorithms    JSONB DEFAULT '[]',      -- ["Si X → hacer Y"]
  ai_review_qs     JSONB DEFAULT '[]',      -- [{"pregunta":"...","respuesta":"..."}]
  ai_processed_at  TIMESTAMPTZ,             -- cuándo se procesó con IA

  is_available     BOOLEAN DEFAULT FALSE,
  is_free_preview  BOOLEAN DEFAULT FALSE,   -- acceso gratuito para ver demo
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS lessons_specialty_idx ON lessons(specialty_id);
CREATE UNIQUE INDEX IF NOT EXISTS lessons_specialty_order_unique ON lessons(specialty_id, order_index);

CREATE TRIGGER lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Estudiantes con suscripción activa ven lecciones disponibles
CREATE POLICY "active_students_lessons_read" ON lessons
  FOR SELECT USING (
    is_available = TRUE AND (
      is_free_preview = TRUE
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND (subscription_status IN ('active', 'trial') OR role = 'admin')
      )
    )
  );

CREATE POLICY "admin_manage_lessons" ON lessons
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ================================================
-- LESSON_PROGRESS
-- Tracking de qué lecciones vio el usuario.
-- ================================================
CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id     UUID  NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id   INTEGER NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  watched_at  TIMESTAMPTZ DEFAULT NOW(),
  completed   BOOLEAN DEFAULT TRUE,
  PRIMARY KEY (user_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS lesson_progress_user_idx ON lesson_progress(user_id);

ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "own_lesson_progress" ON lesson_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admin_view_lesson_progress" ON lesson_progress
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- ================================================
-- HELPER FUNCTION: lecciones completadas por especialidad
-- ================================================
CREATE OR REPLACE FUNCTION get_lesson_progress_by_specialty(p_user_id UUID)
RETURNS TABLE(specialty_id INTEGER, total_lessons BIGINT, completed_lessons BIGINT) AS $$
  SELECT
    l.specialty_id,
    COUNT(l.id)                                                           AS total_lessons,
    COUNT(lp.lesson_id)                                                   AS completed_lessons
  FROM lessons l
  LEFT JOIN lesson_progress lp
    ON lp.lesson_id = l.id AND lp.user_id = p_user_id AND lp.completed = TRUE
  WHERE l.is_available = TRUE
  GROUP BY l.specialty_id;
$$ LANGUAGE sql STABLE SECURITY DEFINER;
