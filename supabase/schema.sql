-- ================================================
-- PasaTuEunacom — Database Schema
-- ================================================

-- ENUMS
CREATE TYPE user_role AS ENUM ('admin', 'student');
CREATE TYPE subscription_status AS ENUM ('active', 'inactive', 'trial');
CREATE TYPE exam_type AS ENUM ('topic', 'repaso', 'simulation');
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE attempt_mode AS ENUM ('practice', 'simulation', 'topic');

-- ================================================
-- EUNACOM AREAS (7 áreas oficiales)
-- ================================================
CREATE TABLE eunacom_areas (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  percent_weight INTEGER NOT NULL,
  question_count INTEGER NOT NULL,
  order_index INTEGER NOT NULL
);

-- ================================================
-- PROFILES
-- ================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  subscription_status subscription_status NOT NULL DEFAULT 'inactive',
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- SPECIALTIES (21 subespecialidades)
-- ================================================
CREATE TABLE specialties (
  id SERIAL PRIMARY KEY,
  area_id INTEGER REFERENCES eunacom_areas(id),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  order_index INTEGER NOT NULL,
  has_own_quizzes BOOLEAN DEFAULT TRUE,
  icon TEXT,
  is_available BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- TOPICS
-- ================================================
CREATE TABLE topics (
  id SERIAL PRIMARY KEY,
  specialty_id INTEGER REFERENCES specialties(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- QUESTIONS
-- ================================================
CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  specialty_id INTEGER REFERENCES specialties(id) ON DELETE SET NULL,
  topic_id INTEGER REFERENCES topics(id) ON DELETE SET NULL,
  stem TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  option_e TEXT,
  correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('a','b','c','d','e')),
  explanation TEXT NOT NULL,
  difficulty difficulty DEFAULT 'medium',
  has_table BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  ai_generated BOOLEAN DEFAULT FALSE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- EXAMS
-- ================================================
CREATE TABLE exams (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  specialty_id INTEGER REFERENCES specialties(id) ON DELETE SET NULL,
  exam_type exam_type NOT NULL DEFAULT 'topic',
  time_limit_seconds INTEGER,
  question_count INTEGER NOT NULL,
  order_index INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- EXAM_QUESTIONS
-- ================================================
CREATE TABLE exam_questions (
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  question_id INTEGER REFERENCES questions(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  PRIMARY KEY (exam_id, question_id)
);

-- ================================================
-- ATTEMPTS
-- ================================================
CREATE TABLE attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  exam_id INTEGER REFERENCES exams(id) ON DELETE CASCADE,
  mode attempt_mode NOT NULL DEFAULT 'practice',
  answers JSONB NOT NULL DEFAULT '{}',
  correct_count INTEGER DEFAULT 0,
  total_questions INTEGER NOT NULL,
  score_percent DECIMAL(5,2),
  time_used_seconds INTEGER,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  finished_at TIMESTAMPTZ,
  is_completed BOOLEAN DEFAULT FALSE
);

-- ================================================
-- QUESTION_STATS
-- ================================================
CREATE TABLE question_stats (
  question_id INTEGER PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
  times_shown INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  times_incorrect INTEGER DEFAULT 0,
  difficulty_score DECIMAL(3,2) DEFAULT 0.50,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- IMPORT_LOGS
-- ================================================
CREATE TABLE import_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES profiles(id),
  source_type TEXT CHECK (source_type IN ('text', 'image', 'ai_generated')),
  questions_extracted INTEGER DEFAULT 0,
  questions_imported INTEGER DEFAULT 0,
  specialty_id INTEGER REFERENCES specialties(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================
-- FUNCTIONS
-- ================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, email, role, subscription_status)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'student'),
    'inactive'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Update question_stats on attempt completion
CREATE OR REPLACE FUNCTION update_question_stats(
  p_question_id INTEGER,
  p_is_correct BOOLEAN
)
RETURNS VOID AS $$
BEGIN
  INSERT INTO question_stats (question_id, times_shown, times_correct, times_incorrect)
  VALUES (p_question_id, 1, CASE WHEN p_is_correct THEN 1 ELSE 0 END, CASE WHEN p_is_correct THEN 0 ELSE 1 END)
  ON CONFLICT (question_id) DO UPDATE SET
    times_shown = question_stats.times_shown + 1,
    times_correct = question_stats.times_correct + CASE WHEN p_is_correct THEN 1 ELSE 0 END,
    times_incorrect = question_stats.times_incorrect + CASE WHEN p_is_correct THEN 0 ELSE 1 END,
    difficulty_score = CASE
      WHEN (question_stats.times_shown + 1) = 0 THEN 0.5
      ELSE (question_stats.times_incorrect::DECIMAL + CASE WHEN p_is_correct THEN 0 ELSE 1 END) /
           (question_stats.times_shown::DECIMAL + 1)
    END,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- ================================================
-- ROW LEVEL SECURITY
-- ================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE eunacom_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE specialties ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "own_profile_select" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "own_profile_update" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admin_all_profiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- EUNACOM AREAS — public read
CREATE POLICY "public_areas_read" ON eunacom_areas
  FOR SELECT USING (true);

-- SPECIALTIES — public read
CREATE POLICY "public_specialties_read" ON specialties
  FOR SELECT USING (true);

CREATE POLICY "admin_manage_specialties" ON specialties
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- TOPICS — authenticated read
CREATE POLICY "authenticated_topics_read" ON topics
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "admin_manage_topics" ON topics
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- QUESTIONS — only active subscribers
CREATE POLICY "active_students_read" ON questions
  FOR SELECT USING (
    is_active = TRUE AND (
      EXISTS (
        SELECT 1 FROM profiles
        WHERE id = auth.uid()
        AND (subscription_status IN ('active', 'trial') OR role = 'admin')
      )
    )
  );

CREATE POLICY "admin_manage_questions" ON questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- EXAMS — authenticated read
CREATE POLICY "authenticated_exams_read" ON exams
  FOR SELECT USING (
    auth.uid() IS NOT NULL AND is_active = TRUE
  );

CREATE POLICY "admin_manage_exams" ON exams
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- EXAM_QUESTIONS — authenticated read
CREATE POLICY "authenticated_exam_questions_read" ON exam_questions
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "admin_manage_exam_questions" ON exam_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ATTEMPTS — own only
CREATE POLICY "own_attempts" ON attempts
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "admin_view_attempts" ON attempts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- QUESTION_STATS — authenticated read
CREATE POLICY "authenticated_stats_read" ON question_stats
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "admin_manage_stats" ON question_stats
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- IMPORT_LOGS — admin only
CREATE POLICY "admin_import_logs" ON import_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ================================================
-- SEED DATA: EUNACOM AREAS
-- ================================================
INSERT INTO eunacom_areas (name, percent_weight, question_count, order_index) VALUES
('Medicina Interna', 37, 67, 1),
('Pediatría', 16, 29, 2),
('Obstetricia y Ginecología', 16, 29, 3),
('Cirugía', 12, 20, 4),
('Psiquiatría', 8, 14, 5),
('Especialidades', 6, 12, 6),
('Salud Pública', 5, 9, 7);

-- ================================================
-- SEED DATA: SPECIALTIES
-- ================================================
INSERT INTO specialties (area_id, name, code, order_index, has_own_quizzes, icon, is_available) VALUES
(1, 'Cardiología', 'cardiologia', 1, true, '❤️', true),
(1, 'Diabetes y Nutrición', 'diabetes', 2, true, '🩸', true),
(1, 'Endocrinología', 'endocrinologia', 3, true, '🧬', true),
(1, 'Infectología', 'infectologia', 4, true, '🦠', true),
(1, 'Respiratorio', 'respiratorio', 5, true, '🫁', true),
(1, 'Gastroenterología', 'gastro', 6, true, '🫀', true),
(1, 'Geriatría', 'geriatria', 7, false, '👴', true),
(1, 'Hemato-Oncología', 'hematologia', 8, true, '💉', true),
(1, 'Nefrología', 'nefrologia', 9, true, '🫘', true),
(1, 'Neurología', 'neurologia', 10, true, '🧠', true),
(1, 'Reumatología', 'reumatologia', 11, true, '🦴', true),
(2, 'Pediatría General', 'pediatria', 1, true, '🧒', false),
(3, 'Ginecología y Obstetricia', 'ginecologia', 1, true, '👶', false),
(4, 'Cirugía General', 'cirugia', 1, true, '🔪', false),
(4, 'Traumatología', 'traumatologia', 2, true, '🦷', false),
(4, 'Urología', 'urologia', 3, true, '🔵', false),
(5, 'Psiquiatría', 'psiquiatria', 1, true, '🧘', false),
(6, 'Dermatología', 'dermatologia', 1, true, '🩹', false),
(6, 'Oftalmología', 'oftalmologia', 2, true, '👁️', false),
(6, 'Otorrinolaringología', 'otorrino', 3, true, '👂', false),
(7, 'Salud Pública', 'salud_publica', 1, true, '🏥', false);

-- ================================================
-- SEED DATA: EXAMS
-- ================================================
INSERT INTO exams (title, specialty_id, exam_type, question_count, order_index) VALUES
('1.1 Cuestionario Diabetes', 2, 'topic', 15, 1),
('1.2 Cuestionario Diabetes', 2, 'topic', 15, 2),
('1.3 Cuestionario Diabetes', 2, 'topic', 15, 3),
('2.1 Cuestionario Endocrinología', 3, 'topic', 15, 1),
('2.2 Cuestionario Endocrinología', 3, 'topic', 15, 2),
('2.3 Cuestionario Endocrinología', 3, 'topic', 15, 3),
('2.4 Cuestionario Endocrinología', 3, 'topic', 15, 4),
('2.5 Cuestionario Endocrinología', 3, 'topic', 15, 5),
('2.6 Cuestionario Endocrinología', 3, 'topic', 15, 6),
('2.7 Cuestionario Endocrinología', 3, 'topic', 15, 7),
('2.8 Cuestionario Endocrinología', 3, 'topic', 15, 8),
('3.1 Cuestionario Cardiología', 1, 'topic', 15, 1),
('3.2 Cuestionario Cardiología', 1, 'topic', 15, 2),
('3.3 Cuestionario Cardiología', 1, 'topic', 15, 3),
('3.4 Cuestionario Cardiología', 1, 'topic', 15, 4),
('3.5 Cuestionario Cardiología', 1, 'topic', 15, 5),
('3.6 Cuestionario Cardiología', 1, 'topic', 15, 6),
('3.7 Cuestionario Cardiología', 1, 'topic', 15, 7),
('4.1 Cuestionario Nefrología', 9, 'topic', 15, 1),
('4.2 Cuestionario Nefrología', 9, 'topic', 15, 2),
('4.3 Cuestionario Nefrología', 9, 'topic', 15, 3),
('4.4 Cuestionario Nefrología', 9, 'topic', 15, 4),
('4.5 Cuestionario Nefrología', 9, 'topic', 15, 5),
('4.6 Cuestionario Nefrología', 9, 'topic', 15, 6),
('4.7 Cuestionario Nefrología', 9, 'topic', 15, 7),
('4.8 Cuestionario Nefrología', 9, 'topic', 15, 8),
('5.1 Cuestionario Reumatología', 11, 'topic', 15, 1),
('5.2 Cuestionario Reumatología', 11, 'topic', 15, 2),
('5.3 Cuestionario Reumatología', 11, 'topic', 15, 3),
('5.4 Cuestionario Reumatología', 11, 'topic', 15, 4),
('6.1 Cuestionario Hematología', 8, 'topic', 15, 1),
('6.2 Cuestionario Hematología', 8, 'topic', 15, 2),
('6.3 Cuestionario Hematología', 8, 'topic', 15, 3),
('6.4 Cuestionario Hematología', 8, 'topic', 15, 4),
('6.5 Cuestionario Hematología', 8, 'topic', 15, 5),
('6.6 Cuestionario Hematología', 8, 'topic', 15, 6),
('6.7 Cuestionario Hematología', 8, 'topic', 15, 7),
('7.1 Cuestionario Infectología', 4, 'topic', 15, 1),
('7.2 Cuestionario Infectología', 4, 'topic', 15, 2),
('7.3 Cuestionario Infectología', 4, 'topic', 15, 3),
('7.4 Cuestionario Infectología', 4, 'topic', 15, 4),
('7.5 Cuestionario Infectología', 4, 'topic', 15, 5),
('7.6 Cuestionario Infectología', 4, 'topic', 15, 6),
('7.7 Cuestionario Infectología', 4, 'topic', 15, 7),
('7.8 Cuestionario Infectología', 4, 'topic', 15, 8),
('8.1 Cuestionario Respiratorio', 5, 'topic', 15, 1),
('8.2 Cuestionario Respiratorio', 5, 'topic', 15, 2),
('8.3 Cuestionario Respiratorio', 5, 'topic', 15, 3),
('8.4 Cuestionario Respiratorio', 5, 'topic', 15, 4),
('8.5 Cuestionario Respiratorio', 5, 'topic', 15, 5),
('8.6 Cuestionario Respiratorio', 5, 'topic', 15, 6),
('8.7 Cuestionario Respiratorio', 5, 'topic', 15, 7),
('9.1 Cuestionario Gastroenterología', 6, 'topic', 15, 1),
('9.2 Cuestionario Gastroenterología', 6, 'topic', 15, 2),
('9.3 Cuestionario Gastroenterología', 6, 'topic', 15, 3),
('9.4 Cuestionario Gastroenterología', 6, 'topic', 15, 4),
('9.5 Cuestionario Gastroenterología', 6, 'topic', 15, 5),
('9.6 Cuestionario Gastroenterología', 6, 'topic', 15, 6),
('10.1 Cuestionario Neurología', 10, 'topic', 15, 1),
('10.2 Cuestionario Neurología', 10, 'topic', 15, 2),
('10.3 Cuestionario Neurología', 10, 'topic', 15, 3),
('10.4 Cuestionario Neurología', 10, 'topic', 15, 4),
('10.5 Cuestionario Neurología', 10, 'topic', 15, 5),
('10.6 Cuestionario Neurología', 10, 'topic', 15, 6),
('Prueba Repaso 1 — Medicina Interna', NULL, 'repaso', 70, 1),
('Simulacro EUNACOM Completo', NULL, 'simulation', 180, 1);
