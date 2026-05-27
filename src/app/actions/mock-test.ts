"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MockAttempt, MockQuestion } from "@/types/database";

// ── Shared: get authenticated userId or redirect ──────────────────────────────
async function requireUserId(): Promise<string> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.id) redirect("/login");
  return user.id as string;
}

// ── Start a new attempt ────────────────────────────────────────────────────────
export async function startAttempt(testId: string): Promise<{ attemptId: string }> {
  const userId  = await requireUserId();
  const supabase = await createClient();

  // Check for existing in_progress attempt — resume it
  const { data: existingRaw } = await supabase
    .from("mock_attempts")
    .select("id")
    .eq("student_id", userId)
    .eq("test_id", testId)
    .eq("status", "in_progress")
    .maybeSingle();

  const existing = existingRaw as { id: string } | null;
  if (existing) return { attemptId: existing.id };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: insertedRaw, error } = await (supabase.from("mock_attempts") as any)
    .insert({ student_id: userId, test_id: testId, status: "in_progress" })
    .select("id")
    .single();

  const inserted = insertedRaw as { id: string } | null;
  if (error || !inserted) throw new Error((error as { message: string } | null)?.message ?? "Could not start attempt");
  return { attemptId: inserted.id };
}

// ── Save a single answer (upsert) ─────────────────────────────────────────────
export async function saveAnswer(
  attemptId: string,
  questionId: string,
  selectedOption: "A" | "B" | "C" | "D" | null,
  timeSpentSecs: number
) {
  const userId  = await requireUserId();
  const supabase = await createClient();

  // Verify the attempt belongs to the user and is in_progress
  const { data: attemptRaw } = await supabase
    .from("mock_attempts")
    .select("id, status")
    .eq("id", attemptId)
    .eq("student_id", userId)
    .single();

  const attempt = attemptRaw as { id: string; status: string } | null;
  if (!attempt || attempt.status !== "in_progress") {
    throw new Error("Attempt not found or already submitted");
  }

  // Get correct answer to compute is_correct
  const { data: questionRaw } = await supabase
    .from("mock_questions")
    .select("correct_option")
    .eq("id", questionId)
    .single();

  const question = questionRaw as { correct_option: string } | null;
  const isCorrect = selectedOption != null && question
    ? selectedOption === question.correct_option
    : null;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("mock_attempt_details") as any)
    .upsert(
      {
        attempt_id: attemptId,
        question_id: questionId,
        selected_option: selectedOption,
        is_correct: isCorrect,
        time_spent_secs: timeSpentSecs,
      },
      { onConflict: "attempt_id,question_id" }
    );

  if (error) throw new Error((error as { message: string }).message);
}

// ── Submit the attempt ─────────────────────────────────────────────────────────
export async function submitAttempt(attemptId: string, timeTakenSecs: number) {
  const userId  = await requireUserId();
  const supabase = await createClient();

  // Get all answers for this attempt
  const { data: detailsRaw, error: detailsError } = await supabase
    .from("mock_attempt_details")
    .select("is_correct")
    .eq("attempt_id", attemptId);

  if (detailsError) throw new Error(detailsError.message);

  const details = (detailsRaw ?? []) as { is_correct: boolean | null }[];
  const totalAnswered = details.length;
  const correctCount  = details.filter((d) => d.is_correct).length;

  // Get total question count from the attempt's test
  const { data: attemptRaw } = await supabase
    .from("mock_attempts")
    .select("test_id")
    .eq("id", attemptId)
    .eq("student_id", userId)
    .single();

  const attemptData = attemptRaw as { test_id: string } | null;
  if (!attemptData) throw new Error("Attempt not found");

  const { data: testRaw } = await supabase
    .from("mock_tests")
    .select("question_count")
    .eq("id", attemptData.test_id)
    .single();

  const testData = testRaw as { question_count: number } | null;
  const totalQuestions = testData?.question_count ?? totalAnswered;
  const score = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 100)
    : 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("mock_attempts") as any)
    .update({
      status: "submitted",
      submitted_at: new Date().toISOString(),
      score,
      correct_count: correctCount,
      total_questions: totalQuestions,
      time_taken_secs: timeTakenSecs,
    })
    .eq("id", attemptId)
    .eq("student_id", userId);

  if (error) throw new Error((error as { message: string }).message);

  revalidatePath(`/student/results/${attemptId}`);
  redirect(`/student/results/${attemptId}`);
}

// ── Fetch exam data (questions for an in-progress attempt) ────────────────────
export async function getExamData(attemptId: string): Promise<{
  attempt: {
    id: string;
    test_id: string;
    started_at: string;
    status: string;
  };
  test: {
    id: string;
    title: string;
    subject: string;
    duration_minutes: number;
    question_count: number;
  };
  questions: MockQuestion[];
  savedAnswers: Record<string, "A" | "B" | "C" | "D" | null>;
}> {
  const userId  = await requireUserId();
  const supabase = await createClient();

  // Fetch attempt
  const { data: attemptRaw, error: attemptError } = await supabase
    .from("mock_attempts")
    .select("id, test_id, started_at, status")
    .eq("id", attemptId)
    .eq("student_id", userId)
    .single();

  if (attemptError || !attemptRaw) redirect("/student/dashboard");
  const attempt = attemptRaw as { id: string; test_id: string; started_at: string; status: string };

  if (attempt.status === "submitted" || attempt.status === "reviewed") {
    redirect(`/student/results/${attemptId}`);
  }

  // Fetch test metadata
  const { data: testRaw } = await supabase
    .from("mock_tests")
    .select("id, title, subject, duration_minutes, question_count")
    .eq("id", attempt.test_id)
    .single();

  if (!testRaw) redirect("/student/dashboard");
  const test = testRaw as { id: string; title: string; subject: string; duration_minutes: number; question_count: number };

  // Fetch questions (RLS allows because attempt is in_progress)
  const { data: questionsRaw } = await supabase
    .from("mock_questions")
    .select("*")
    .eq("test_id", attempt.test_id)
    .order("sort_order");

  const questions = (questionsRaw ?? []) as MockQuestion[];

  // Fetch saved answers
  const { data: detailsRaw } = await supabase
    .from("mock_attempt_details")
    .select("question_id, selected_option")
    .eq("attempt_id", attemptId);

  const savedAnswers: Record<string, "A" | "B" | "C" | "D" | null> = {};
  const detailsList = (detailsRaw ?? []) as { question_id: string; selected_option: string | null }[];
  for (const d of detailsList) {
    savedAnswers[d.question_id] = d.selected_option as "A" | "B" | "C" | "D" | null;
  }

  return {
    attempt: {
      id: attempt.id,
      test_id: attempt.test_id,
      started_at: attempt.started_at,
      status: attempt.status,
    },
    test: {
      id: test.id,
      title: test.title,
      subject: test.subject,
      duration_minutes: test.duration_minutes,
      question_count: test.question_count,
    },
    questions,
    savedAnswers,
  };
}

// ── Fetch results data ─────────────────────────────────────────────────────────
export async function getResultsData(attemptId: string): Promise<{
  attempt: MockAttempt;
  test: {
    id: string;
    title: string;
    subject: string;
    question_count: number;
    duration_minutes: number;
  } | null;
  details: {
    question_id: string;
    selected_option: string | null;
    is_correct: boolean | null;
    time_spent_secs: number | null;
    mock_questions: {
      topic: string;
      subtopic: string | null;
      question_text: string;
      option_a: string;
      option_b: string;
      option_c: string;
      option_d: string;
      correct_option: string;
      explanation: string | null;
      difficulty: number;
      sort_order: number;
    } | null;
  }[];
  topicBreakdown: { topic: string; total: number; correct: number; pct: number }[];
}> {
  const userId  = await requireUserId();
  const supabase = await createClient();

  const { data: attemptRaw } = await supabase
    .from("mock_attempts")
    .select("*")
    .eq("id", attemptId)
    .eq("student_id", userId)
    .single();

  if (!attemptRaw) redirect("/student/dashboard");
  const attempt = attemptRaw as MockAttempt;

  const { data: testRaw } = await supabase
    .from("mock_tests")
    .select("id, title, subject, question_count, duration_minutes")
    .eq("id", attempt.test_id)
    .single();

  const test = testRaw as {
    id: string;
    title: string;
    subject: string;
    question_count: number;
    duration_minutes: number;
  } | null;

  // Get per-question detail with question info
  const { data: detailsRaw } = await supabase
    .from("mock_attempt_details")
    .select(`
      question_id,
      selected_option,
      is_correct,
      time_spent_secs,
      mock_questions (
        topic,
        subtopic,
        question_text,
        option_a,
        option_b,
        option_c,
        option_d,
        correct_option,
        explanation,
        difficulty,
        sort_order
      )
    `)
    .eq("attempt_id", attemptId);

  type DetailWithQuestion = {
    question_id: string;
    selected_option: string | null;
    is_correct: boolean | null;
    time_spent_secs: number | null;
    mock_questions: {
      topic: string;
      subtopic: string | null;
      question_text: string;
      option_a: string;
      option_b: string;
      option_c: string;
      option_d: string;
      correct_option: string;
      explanation: string | null;
      difficulty: number;
      sort_order: number;
    } | null;
  };

  const details = (detailsRaw ?? []) as DetailWithQuestion[];

  // Compute topic-level breakdown
  const topicMap = new Map<string, { total: number; correct: number }>();
  for (const d of details) {
    const topic = d.mock_questions?.topic ?? "Unknown";
    const cur = topicMap.get(topic) ?? { total: 0, correct: 0 };
    cur.total++;
    if (d.is_correct) cur.correct++;
    topicMap.set(topic, cur);
  }

  const topicBreakdown = Array.from(topicMap.entries()).map(([topic, stats]) => ({
    topic,
    total: stats.total,
    correct: stats.correct,
    pct: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
  }));

  return {
    attempt,
    test,
    details,
    topicBreakdown,
  };
}
