/**
 * Supabase database types — auto-generated shape.
 * When you add tables or change columns, run:
 *   npx supabase gen types typescript --project-id <your-project-id> > src/types/database.ts
 *
 * Until then, this hand-crafted version mirrors the Phase 1 migration exactly.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          email: string | null;
          status: "active" | "inactive" | "suspended";
          marketing_source: string | null;
          gender: "male" | "female" | "other" | "prefer_not_to_say" | null;
          avatar_url: string | null;
          interested_courses: string[] | null;
          edu_degree: string | null;
          edu_passing_year: number | null;
          edu_grade: string | null;
          interested_major: string | null;
          guardian_phone: string | null;
          notify_guardian: boolean;
          profile_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          email?: string | null;
          status?: "active" | "inactive" | "suspended";
          marketing_source?: string | null;
          gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
          avatar_url?: string | null;
          interested_courses?: string[] | null;
          edu_degree?: string | null;
          edu_passing_year?: number | null;
          edu_grade?: string | null;
          interested_major?: string | null;
          guardian_phone?: string | null;
          notify_guardian?: boolean;
          profile_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          email?: string | null;
          status?: "active" | "inactive" | "suspended";
          marketing_source?: string | null;
          gender?: "male" | "female" | "other" | "prefer_not_to_say" | null;
          avatar_url?: string | null;
          interested_courses?: string[] | null;
          edu_degree?: string | null;
          edu_passing_year?: number | null;
          edu_grade?: string | null;
          interested_major?: string | null;
          guardian_phone?: string | null;
          notify_guardian?: boolean;
          profile_completed?: boolean;
          updated_at?: string;
        };
      };
      instructors: {
        Row: {
          id: string;
          full_name: string;
          phone: string;
          subject: string | null;
          role: "instructor" | "admin";
          created_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          phone: string;
          subject?: string | null;
          role?: "instructor" | "admin";
          created_at?: string;
        };
        Update: {
          full_name?: string;
          phone?: string;
          subject?: string | null;
          role?: "instructor" | "admin";
        };
      };
      batches: {
        Row: {
          id: string;
          course_slug: string;
          name: string;
          division: "live" | "recorded";
          start_date: string | null;
          schedule: string | null;
          instructor_id: string | null;
          is_active: boolean;
          capacity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_slug: string;
          name: string;
          division: "live" | "recorded";
          start_date?: string | null;
          schedule?: string | null;
          instructor_id?: string | null;
          is_active?: boolean;
          capacity?: number;
          created_at?: string;
        };
        Update: {
          course_slug?: string;
          name?: string;
          division?: "live" | "recorded";
          start_date?: string | null;
          schedule?: string | null;
          instructor_id?: string | null;
          is_active?: boolean;
          capacity?: number;
        };
      };
      enrollments: {
        Row: {
          id: string;
          student_id: string;
          batch_id: string | null;
          status: "pending" | "active" | "completed" | "cancelled";
          fee_status: "unpaid" | "partial" | "paid";
          enrolled_at: string;
          notes: string | null;
        };
        Insert: {
          id?: string;
          student_id: string;
          batch_id?: string | null;
          status?: "pending" | "active" | "completed" | "cancelled";
          fee_status?: "unpaid" | "partial" | "paid";
          enrolled_at?: string;
          notes?: string | null;
        };
        Update: {
          status?: "pending" | "active" | "completed" | "cancelled";
          fee_status?: "unpaid" | "partial" | "paid";
          notes?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          student_id: string;
          amount: number;
          method: "bkash" | "nagad" | "card" | "cash" | "other";
          purpose: string;
          status: "pending" | "success" | "failed" | "refunded";
          paid_at: string | null;
          receipt_no: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          amount: number;
          method: "bkash" | "nagad" | "card" | "cash" | "other";
          purpose: string;
          status?: "pending" | "success" | "failed" | "refunded";
          paid_at?: string | null;
          receipt_no?: string | null;
          created_at?: string;
        };
        Update: {
          status?: "pending" | "success" | "failed" | "refunded";
          paid_at?: string | null;
          receipt_no?: string | null;
        };
      };
      announcements: {
        Row: {
          id: string;
          batch_id: string | null;
          title: string;
          body: string;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          batch_id?: string | null;
          title: string;
          body: string;
          created_by: string;
          created_at?: string;
        };
        Update: {
          title?: string;
          body?: string;
        };
      };
      attendance: {
        Row: {
          id: string;
          student_id: string;
          batch_id: string;
          class_date: string;
          present: boolean;
          marked_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          batch_id: string;
          class_date: string;
          present?: boolean;
          marked_by?: string | null;
          created_at?: string;
        };
        Update: {
          present?: boolean;
          marked_by?: string | null;
        };
      };
      lessons: {
        Row: {
          id: string;
          course_slug: string;
          batch_id: string | null;
          title: string;
          type: "video" | "live" | "quiz" | "resource";
          week_number: number;
          sort_order: number;
          duration_minutes: number | null;
          video_url: string | null;
          resource_url: string | null;
          is_free_preview: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_slug: string;
          batch_id?: string | null;
          title: string;
          type: "video" | "live" | "quiz" | "resource";
          week_number?: number;
          sort_order?: number;
          duration_minutes?: number | null;
          video_url?: string | null;
          resource_url?: string | null;
          is_free_preview?: boolean;
          created_at?: string;
        };
        Update: {
          title?: string;
          type?: "video" | "live" | "quiz" | "resource";
          week_number?: number;
          sort_order?: number;
          duration_minutes?: number | null;
          video_url?: string | null;
          resource_url?: string | null;
          is_free_preview?: boolean;
        };
      };
      lesson_progress: {
        Row: {
          id: string;
          student_id: string;
          lesson_id: string;
          watch_percent: number;
          completed: boolean;
          completed_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          lesson_id: string;
          watch_percent?: number;
          completed?: boolean;
          completed_at?: string | null;
        };
        Update: {
          watch_percent?: number;
          completed?: boolean;
          completed_at?: string | null;
        };
      };
      mock_tests: {
        Row: {
          id: string;
          course_slug: string;
          subject: "math" | "physics" | "chemistry" | "chinese";
          title: string;
          description: string | null;
          difficulty: "beginner" | "intermediate" | "advanced";
          question_count: number;
          duration_minutes: number;
          is_active: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          course_slug: string;
          subject: "math" | "physics" | "chemistry" | "chinese";
          title: string;
          description?: string | null;
          difficulty?: "beginner" | "intermediate" | "advanced";
          question_count?: number;
          duration_minutes?: number;
          is_active?: boolean;
          sort_order?: number;
        };
        Update: {
          title?: string;
          description?: string | null;
          difficulty?: "beginner" | "intermediate" | "advanced";
          is_active?: boolean;
          sort_order?: number;
        };
      };
      mock_questions: {
        Row: {
          id: string;
          test_id: string;
          topic: string;
          subtopic: string | null;
          question_text: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_option: "A" | "B" | "C" | "D";
          explanation: string | null;
          difficulty: number;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          test_id: string;
          topic: string;
          subtopic?: string | null;
          question_text: string;
          option_a: string;
          option_b: string;
          option_c: string;
          option_d: string;
          correct_option: "A" | "B" | "C" | "D";
          explanation?: string | null;
          difficulty?: number;
          sort_order?: number;
        };
        Update: {
          question_text?: string;
          option_a?: string;
          option_b?: string;
          option_c?: string;
          option_d?: string;
          correct_option?: "A" | "B" | "C" | "D";
          explanation?: string | null;
          difficulty?: number;
          sort_order?: number;
        };
      };
      mock_attempts: {
        Row: {
          id: string;
          student_id: string;
          test_id: string;
          started_at: string;
          submitted_at: string | null;
          status: "in_progress" | "submitted" | "reviewed";
          score: number | null;
          correct_count: number | null;
          total_questions: number | null;
          time_taken_secs: number | null;
          ai_review: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          test_id: string;
          started_at?: string;
          status?: "in_progress" | "submitted" | "reviewed";
        };
        Update: {
          submitted_at?: string | null;
          status?: "in_progress" | "submitted" | "reviewed";
          score?: number | null;
          correct_count?: number | null;
          total_questions?: number | null;
          time_taken_secs?: number | null;
          ai_review?: string | null;
        };
      };
      mock_attempt_details: {
        Row: {
          id: string;
          attempt_id: string;
          question_id: string;
          selected_option: "A" | "B" | "C" | "D" | null;
          is_correct: boolean | null;
          time_spent_secs: number | null;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          question_id: string;
          selected_option?: "A" | "B" | "C" | "D" | null;
          is_correct?: boolean | null;
          time_spent_secs?: number | null;
        };
        Update: {
          selected_option?: "A" | "B" | "C" | "D" | null;
          is_correct?: boolean | null;
          time_spent_secs?: number | null;
        };
      };
      course_reviews: {
        Row: {
          id: string;
          student_id: string;
          course_slug: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          course_slug: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          rating?: number;
          comment?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          student_id: string;
          kind: string;
          title: string;
          body: string;
          link: string | null;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          student_id: string;
          kind: string;
          title: string;
          body: string;
          link?: string | null;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          read_at?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      student_status: "active" | "inactive" | "suspended";
      enrollment_status: "pending" | "active" | "completed" | "cancelled";
      fee_status: "unpaid" | "partial" | "paid";
      payment_method: "bkash" | "nagad" | "card" | "cash" | "other";
      payment_status: "pending" | "success" | "failed" | "refunded";
      division: "live" | "recorded";
    };
  };
}

// ── Convenience row types ─────────────────────────────────────────────────────
export type Student = Database["public"]["Tables"]["students"]["Row"];
export type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
export type Instructor = Database["public"]["Tables"]["instructors"]["Row"];
export type Batch = Database["public"]["Tables"]["batches"]["Row"];
export type BatchInsert = Database["public"]["Tables"]["batches"]["Insert"];
export type Enrollment = Database["public"]["Tables"]["enrollments"]["Row"];
export type EnrollmentInsert = Database["public"]["Tables"]["enrollments"]["Insert"];
export type Payment = Database["public"]["Tables"]["payments"]["Row"];
export type Announcement = Database["public"]["Tables"]["announcements"]["Row"];
export type Attendance = Database["public"]["Tables"]["attendance"]["Row"];
export type Lesson = Database["public"]["Tables"]["lessons"]["Row"];
export type LessonInsert = Database["public"]["Tables"]["lessons"]["Insert"];
export type LessonProgress = Database["public"]["Tables"]["lesson_progress"]["Row"];
export type CourseReview = Database["public"]["Tables"]["course_reviews"]["Row"];
export type MockTest = Database["public"]["Tables"]["mock_tests"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
export type NotificationInsert = Database["public"]["Tables"]["notifications"]["Insert"];
export type MockQuestion = Database["public"]["Tables"]["mock_questions"]["Row"];
export type MockAttempt = Database["public"]["Tables"]["mock_attempts"]["Row"];
export type MockAttemptDetail = Database["public"]["Tables"]["mock_attempt_details"]["Row"];
