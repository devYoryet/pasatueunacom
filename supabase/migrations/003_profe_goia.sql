-- ================================================
-- PasaTuEunacom — Migration 003
-- Profe GoIA: AI tutor sessions + daily limits
-- ================================================
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS profe_goia_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date  DATE NOT NULL DEFAULT CURRENT_DATE,   -- For daily limit tracking
  context_type  TEXT NOT NULL DEFAULT 'general',      -- 'general' | 'quiz_review' | 'lesson'
  context_ref   TEXT,     -- e.g. "Cuestionario 1.3 Diabetes" or lesson title
  context_id    TEXT,     -- attempt_id or lesson_id
  question      TEXT NOT NULL,
  response      TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast daily limit lookups
CREATE INDEX IF NOT EXISTS idx_profe_goia_user_date
  ON profe_goia_sessions (user_id, session_date);

-- RLS
ALTER TABLE profe_goia_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own sessions"
  ON profe_goia_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON profe_goia_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Daily limit view (optional convenience)
CREATE OR REPLACE VIEW profe_goia_daily_usage AS
SELECT
  user_id,
  session_date,
  COUNT(*) AS queries_used
FROM profe_goia_sessions
GROUP BY user_id, session_date;
