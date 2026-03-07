export type UserRole = 'admin' | 'student'
export type SubscriptionStatus = 'active' | 'inactive' | 'trial'
export type ExamType = 'topic' | 'repaso' | 'simulation'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type AttemptMode = 'practice' | 'simulation' | 'topic'

export interface Database {
  public: {
    Tables: {
      eunacom_areas: {
        Row: EunacomArea
        Insert: Omit<EunacomArea, 'id'>
        Update: Partial<Omit<EunacomArea, 'id'>>
      }
      profiles: {
        Row: Profile
        Insert: Omit<Profile, 'created_at' | 'updated_at'>
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>
      }
      specialties: {
        Row: Specialty
        Insert: Omit<Specialty, 'id' | 'created_at'>
        Update: Partial<Omit<Specialty, 'id' | 'created_at'>>
      }
      topics: {
        Row: Topic
        Insert: Omit<Topic, 'id' | 'created_at'>
        Update: Partial<Omit<Topic, 'id' | 'created_at'>>
      }
      questions: {
        Row: Question
        Insert: Omit<Question, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Question, 'id' | 'created_at'>>
      }
      exams: {
        Row: Exam
        Insert: Omit<Exam, 'id' | 'created_at'>
        Update: Partial<Omit<Exam, 'id' | 'created_at'>>
      }
      exam_questions: {
        Row: ExamQuestion
        Insert: ExamQuestion
        Update: Partial<ExamQuestion>
      }
      attempts: {
        Row: Attempt
        Insert: Omit<Attempt, 'id' | 'started_at'>
        Update: Partial<Omit<Attempt, 'id'>>
      }
      question_stats: {
        Row: QuestionStats
        Insert: QuestionStats
        Update: Partial<QuestionStats>
      }
      import_logs: {
        Row: ImportLog
        Insert: Omit<ImportLog, 'id' | 'created_at'>
        Update: Partial<Omit<ImportLog, 'id' | 'created_at'>>
      }
    }
    Views: Record<string, unknown>
    Functions: Record<string, unknown>
    Enums: {
      user_role: UserRole
      subscription_status: SubscriptionStatus
      exam_type: ExamType
      difficulty: Difficulty
      attempt_mode: AttemptMode
    }
  }
}

export interface EunacomArea {
  id: number
  name: string
  percent_weight: number
  question_count: number
  order_index: number
}

export interface Profile {
  id: string
  full_name: string
  email: string
  role: UserRole
  subscription_status: SubscriptionStatus
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Specialty {
  id: number
  area_id: number | null
  name: string
  code: string
  order_index: number
  has_own_quizzes: boolean
  icon: string | null
  is_available: boolean
  created_at: string
}

export interface Topic {
  id: number
  specialty_id: number
  title: string
  order_index: number
  created_at: string
}

export interface Question {
  id: number
  specialty_id: number | null
  topic_id: number | null
  stem: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string | null
  correct_option: 'a' | 'b' | 'c' | 'd' | 'e'
  explanation: string
  difficulty: Difficulty
  has_table: boolean
  is_active: boolean
  ai_generated: boolean
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface Exam {
  id: number
  title: string
  specialty_id: number | null
  exam_type: ExamType
  time_limit_seconds: number | null
  question_count: number
  order_index: number | null
  is_active: boolean
  created_by: string | null
  created_at: string
}

export interface ExamQuestion {
  exam_id: number
  question_id: number
  order_index: number
}

export interface Attempt {
  id: string
  user_id: string
  exam_id: number
  mode: AttemptMode
  answers: Record<string, string>
  correct_count: number
  total_questions: number
  score_percent: number | null
  time_used_seconds: number | null
  started_at: string
  finished_at: string | null
  is_completed: boolean
}

export interface QuestionStats {
  question_id: number
  times_shown: number
  times_correct: number
  times_incorrect: number
  difficulty_score: number
  updated_at: string
}

export interface ImportLog {
  id: string
  admin_id: string | null
  source_type: 'text' | 'image' | 'ai_generated' | null
  questions_extracted: number
  questions_imported: number
  specialty_id: number | null
  created_at: string
}

// Extended types with joins
export interface SpecialtyWithArea extends Specialty {
  eunacom_areas: EunacomArea | null
}

export interface ExamWithSpecialty extends Exam {
  specialties: Specialty | null
}

export interface AttemptWithExam extends Attempt {
  exams: ExamWithSpecialty | null
}

export interface QuestionWithStats extends Question {
  question_stats: QuestionStats | null
  specialties: Specialty | null
}

// Parsed question for import wizard
export interface ParsedQuestion {
  stem: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  option_e: string
  correct_option: 'a' | 'b' | 'c' | 'd' | 'e'
  explanation: string
  has_table: boolean
  detected_topic: string
  difficulty: Difficulty
}
