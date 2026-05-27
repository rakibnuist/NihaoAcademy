-- ─────────────────────────────────────────────────────────────────────────────
-- Phase 2 — LMS Core
-- lessons, lesson_progress, course_reviews, instructor profile columns
-- Run after 0001_phase1_schema.sql
-- ─────────────────────────────────────────────────────────────────────────────

-- ── Instructor profile enrichment ────────────────────────────────────────────
ALTER TABLE instructors
  ADD COLUMN IF NOT EXISTS bio         text,
  ADD COLUMN IF NOT EXISTS photo_url   text,
  ADD COLUMN IF NOT EXISTS title_label text,          -- e.g. "CSCA Math & Physics"
  ADD COLUMN IF NOT EXISTS course_slugs text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS student_count integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS rating      numeric(2,1) DEFAULT 5.0;

-- ── Lessons ───────────────────────────────────────────────────────────────────
-- One lesson row per video / live session / quiz / resource file.
-- course_slug links to our static course catalog; batch_id is nullable
-- (lessons belong to a course, a batch just schedules them).
CREATE TABLE IF NOT EXISTS lessons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_slug      text NOT NULL,
  batch_id         uuid REFERENCES batches(id) ON DELETE SET NULL,
  title            text NOT NULL,
  type             text NOT NULL CHECK (type IN ('video','live','quiz','resource')),
  week_number      integer NOT NULL DEFAULT 1,
  sort_order       integer NOT NULL DEFAULT 0,
  duration_minutes integer,
  video_url        text,                             -- Bunny.net signed URL
  resource_url     text,                             -- PDF / notes download
  is_free_preview  boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);

-- index for common list queries
CREATE INDEX IF NOT EXISTS lessons_course_slug_idx ON lessons (course_slug, week_number, sort_order);

-- ── Lesson progress ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS lesson_progress (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  lesson_id    uuid NOT NULL REFERENCES lessons(id)  ON DELETE CASCADE,
  watch_percent integer NOT NULL DEFAULT 0
    CHECK (watch_percent BETWEEN 0 AND 100),
  completed    boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  updated_at   timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS lesson_progress_student_idx ON lesson_progress (student_id);

-- auto-set completed_at when completed flips to true
CREATE OR REPLACE FUNCTION set_lesson_completed_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.completed = true AND (OLD.completed = false OR OLD.completed IS NULL) THEN
    NEW.completed_at := now();
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_lesson_completed_at ON lesson_progress;
CREATE TRIGGER trg_lesson_completed_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW EXECUTE FUNCTION set_lesson_completed_at();

-- ── Course reviews ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS course_reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  course_slug text NOT NULL,
  rating      integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, course_slug)
);

CREATE INDEX IF NOT EXISTS course_reviews_slug_idx ON course_reviews (course_slug);

-- ── RLS ───────────────────────────────────────────────────────────────────────

ALTER TABLE lessons          ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews   ENABLE ROW LEVEL SECURITY;

-- lessons: public read for free-preview; enrolled students read all
CREATE POLICY "Free-preview lessons are public"
  ON lessons FOR SELECT
  USING (is_free_preview = true);

CREATE POLICY "Enrolled students read their batch lessons"
  ON lessons FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      batch_id IS NULL OR
      EXISTS (
        SELECT 1 FROM enrollments e
        WHERE e.batch_id = lessons.batch_id
          AND e.student_id = auth.uid()
          AND e.status IN ('active','completed')
      )
    )
  );

-- lesson_progress: students manage their own rows
CREATE POLICY "Students read own progress"
  ON lesson_progress FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students upsert own progress"
  ON lesson_progress FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students update own progress"
  ON lesson_progress FOR UPDATE
  USING (student_id = auth.uid());

-- course_reviews: public read; authenticated students write own
CREATE POLICY "Reviews are public"
  ON course_reviews FOR SELECT
  USING (true);

CREATE POLICY "Students write own review"
  ON course_reviews FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students update own review"
  ON course_reviews FOR UPDATE
  USING (student_id = auth.uid());
