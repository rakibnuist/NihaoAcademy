-- ─────────────────────────────────────────────────────────────────────────────
-- Phase 3 — AI Mock Test Engine
-- CSCA-format MCQ tests: Math 48Q · Physics 48Q · Chemistry 48Q · Chinese 80Q
-- Each question is tagged by topic/subtopic for AI result review
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Mock test templates ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mock_tests (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug      text NOT NULL,
  subject          text NOT NULL
    CHECK (subject IN ('math','physics','chemistry','chinese')),
  title            text NOT NULL,
  description      text,
  difficulty       text NOT NULL DEFAULT 'intermediate'
    CHECK (difficulty IN ('beginner','intermediate','advanced')),
  question_count   integer NOT NULL DEFAULT 48,
  duration_minutes integer NOT NULL DEFAULT 60,
  is_active        boolean NOT NULL DEFAULT true,
  sort_order       integer NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mock_tests_subject_idx ON mock_tests (subject, is_active);

-- ── Questions ─────────────────────────────────────────────────────────────────
-- question_text supports LaTeX via \( \) markers for math rendering
CREATE TABLE IF NOT EXISTS mock_questions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id         uuid NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
  topic           text NOT NULL,           -- e.g. "Calculus", "Mechanics"
  subtopic        text,                    -- e.g. "Integration by Parts"
  question_text   text NOT NULL,
  option_a        text NOT NULL,
  option_b        text NOT NULL,
  option_c        text NOT NULL,
  option_d        text NOT NULL,
  correct_option  text NOT NULL
    CHECK (correct_option IN ('A','B','C','D')),
  explanation     text,                    -- shown after submission
  difficulty      integer NOT NULL DEFAULT 2
    CHECK (difficulty BETWEEN 1 AND 3),    -- 1=easy 2=medium 3=hard
  sort_order      integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mock_questions_test_idx  ON mock_questions (test_id, sort_order);
CREATE INDEX IF NOT EXISTS mock_questions_topic_idx ON mock_questions (topic);

-- ── Student attempts ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mock_attempts (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id       uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  test_id          uuid NOT NULL REFERENCES mock_tests(id) ON DELETE CASCADE,
  started_at       timestamptz NOT NULL DEFAULT now(),
  submitted_at     timestamptz,
  status           text NOT NULL DEFAULT 'in_progress'
    CHECK (status IN ('in_progress','submitted','reviewed')),
  score            integer CHECK (score BETWEEN 0 AND 100),  -- 0-100 scale
  correct_count    integer,
  total_questions  integer,
  time_taken_secs  integer,                -- seconds from start to submit
  ai_review        text,                   -- AI-generated review text (Markdown)
  created_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS mock_attempts_student_idx ON mock_attempts (student_id, created_at DESC);

-- ── Per-question answer details ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mock_attempt_details (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id       uuid NOT NULL REFERENCES mock_attempts(id) ON DELETE CASCADE,
  question_id      uuid NOT NULL REFERENCES mock_questions(id) ON DELETE CASCADE,
  selected_option  text CHECK (selected_option IN ('A','B','C','D')),  -- null = skipped
  is_correct       boolean,
  time_spent_secs  integer,              -- seconds on this question
  UNIQUE (attempt_id, question_id)
);

CREATE INDEX IF NOT EXISTS mock_attempt_details_attempt_idx ON mock_attempt_details (attempt_id);

-- ── Topic performance view ────────────────────────────────────────────────────
-- Pre-computed per-topic stats for the AI review page
CREATE OR REPLACE VIEW mock_topic_performance AS
SELECT
  mad.attempt_id,
  mq.topic,
  mq.subtopic,
  COUNT(*)                          AS total,
  SUM(CASE WHEN mad.is_correct THEN 1 ELSE 0 END) AS correct,
  ROUND(
    100.0 * SUM(CASE WHEN mad.is_correct THEN 1 ELSE 0 END) / COUNT(*),
    1
  )                                 AS pct_correct
FROM mock_attempt_details mad
JOIN mock_questions mq ON mq.id = mad.question_id
GROUP BY mad.attempt_id, mq.topic, mq.subtopic;

-- ── RLS ───────────────────────────────────────────────────────────────────────
ALTER TABLE mock_tests           ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_questions       ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_attempts        ENABLE ROW LEVEL SECURITY;
ALTER TABLE mock_attempt_details ENABLE ROW LEVEL SECURITY;

-- mock_tests: public read for active tests
CREATE POLICY "Active mock tests are public"
  ON mock_tests FOR SELECT USING (is_active = true);

-- mock_questions: only enrolled / in-attempt students read
CREATE POLICY "Questions visible during active attempt"
  ON mock_questions FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM mock_attempts ma
      WHERE ma.test_id = mock_questions.test_id
        AND ma.student_id = auth.uid()
        AND ma.status = 'in_progress'
    )
  );

-- mock_questions: also visible for reviewing submitted attempts
CREATE POLICY "Questions visible for review"
  ON mock_questions FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM mock_attempts ma
      WHERE ma.test_id = mock_questions.test_id
        AND ma.student_id = auth.uid()
        AND ma.status IN ('submitted','reviewed')
    )
  );

-- mock_attempts: students manage their own
CREATE POLICY "Students read own attempts"
  ON mock_attempts FOR SELECT USING (student_id = auth.uid());

CREATE POLICY "Students create own attempts"
  ON mock_attempts FOR INSERT WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students update own in-progress attempts"
  ON mock_attempts FOR UPDATE USING (student_id = auth.uid() AND status = 'in_progress');

-- mock_attempt_details: students manage their own
CREATE POLICY "Students read own answers"
  ON mock_attempt_details FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM mock_attempts ma
      WHERE ma.id = mock_attempt_details.attempt_id AND ma.student_id = auth.uid()
    )
  );

CREATE POLICY "Students upsert own answers"
  ON mock_attempt_details FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM mock_attempts ma
      WHERE ma.id = mock_attempt_details.attempt_id
        AND ma.student_id = auth.uid()
        AND ma.status = 'in_progress'
    )
  );

CREATE POLICY "Students update own answers"
  ON mock_attempt_details FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM mock_attempts ma
      WHERE ma.id = mock_attempt_details.attempt_id
        AND ma.student_id = auth.uid()
        AND ma.status = 'in_progress'
    )
  );

-- ── Sample seed data: 5 Math questions for Engineering CSCA Mock #1 ───────────
-- (Admin will populate full 48Q banks; these demonstrate the schema)
DO $$
DECLARE
  test_id uuid;
BEGIN
  INSERT INTO mock_tests (course_slug, subject, title, description, difficulty, question_count, duration_minutes, sort_order)
  VALUES
    ('engineering-csca', 'math',     'Math Full Mock #1',    'Complete 48-question CSCA Mathematics mock — Algebra through Calculus', 'intermediate', 48, 60, 1),
    ('engineering-csca', 'physics',  'Physics Full Mock #1', 'Complete 48-question CSCA Physics mock — Mechanics through Modern Physics', 'intermediate', 48, 60, 2),
    ('medical-csca',     'math',     'Math Full Mock #1',    'Complete 48-question CSCA Mathematics mock for Medical track', 'intermediate', 48, 60, 1),
    ('medical-csca',     'chemistry','Chemistry Full Mock #1','Complete 48-question CSCA Chemistry mock — Organic through Physical Chemistry', 'intermediate', 48, 60, 2),
    ('business-csca',    'math',     'Math Full Mock #1',    'Complete 48-question CSCA Mathematics mock for Business track', 'intermediate', 48, 60, 1),
    ('chinese-hsk',      'chinese',  'Professional Chinese Mock #1', '80-question STEM Chinese mock — terminology and reading comprehension', 'intermediate', 80, 90, 1),
    ('all-star-csca',    'math',     'All Star Math Mock #1','Complete 48-question CSCA Mathematics — All Star track', 'advanced', 48, 60, 1),
    ('all-star-csca',    'physics',  'All Star Physics Mock #1','Complete 48-question CSCA Physics — All Star track', 'advanced', 48, 60, 2),
    ('all-star-csca',    'chemistry','All Star Chemistry Mock #1','Complete 48-question CSCA Chemistry — All Star track', 'advanced', 48, 60, 3),
    ('det-crash-course', 'chinese',  'DET Practice Test #1', 'Full DET-style practice test — Reading, Listening, Writing, Speaking', 'intermediate', 48, 45, 1)
  ON CONFLICT DO NOTHING;

  -- Grab the Engineering Math Mock #1 id to add sample questions
  SELECT id INTO test_id FROM mock_tests WHERE course_slug = 'engineering-csca' AND subject = 'math' AND title = 'Math Full Mock #1' LIMIT 1;

  IF test_id IS NOT NULL THEN
    INSERT INTO mock_questions (test_id, topic, subtopic, question_text, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty, sort_order)
    VALUES
      (test_id, 'Calculus', 'Derivatives',
       'Find the derivative of f(x) = 3x³ − 5x² + 2x − 7',
       'f''(x) = 9x² − 10x + 2',
       'f''(x) = 9x² − 5x + 2',
       'f''(x) = 3x² − 10x + 2',
       'f''(x) = 9x² − 10x − 7',
       'A', 'Using the power rule: d/dx(3x³) = 9x², d/dx(−5x²) = −10x, d/dx(2x) = 2, d/dx(−7) = 0', 2, 1),

      (test_id, 'Calculus', 'Integration',
       'Evaluate ∫(2x + 3) dx',
       'x² + 3x + C',
       'x² + 3 + C',
       '2x² + 3x + C',
       '2 + 3x + C',
       'A', '∫2x dx = x², ∫3 dx = 3x, so ∫(2x+3) dx = x² + 3x + C', 1, 2),

      (test_id, 'Algebra', 'Quadratic Equations',
       'Solve: x² − 5x + 6 = 0',
       'x = 2, x = 3',
       'x = −2, x = −3',
       'x = 1, x = 6',
       'x = −1, x = −6',
       'A', 'Factor: (x−2)(x−3) = 0, so x = 2 or x = 3', 1, 3),

      (test_id, 'Algebra', 'Logarithms',
       'If log₂(x) = 5, what is x?',
       '10',
       '25',
       '32',
       '64',
       'C', 'log₂(x) = 5 means 2⁵ = x, so x = 32', 2, 4),

      (test_id, 'Statistics', 'Mean and Variance',
       'The mean of 5, 10, 15, 20, 25 is:',
       '12',
       '15',
       '17',
       '20',
       'B', 'Mean = (5+10+15+20+25)/5 = 75/5 = 15', 1, 5)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
