"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

// ── Add a question ────────────────────────────────────────────────────────────
export async function addQuestion(formData: FormData) {
  const supabase = await createClient(true); // service-role — admin only

  const testId       = formData.get("testId") as string;
  const topic        = (formData.get("topic") as string).trim();
  const subtopic     = (formData.get("subtopic") as string | null)?.trim() || null;
  const questionText = (formData.get("questionText") as string).trim();
  const optionA      = (formData.get("optionA") as string).trim();
  const optionB      = (formData.get("optionB") as string).trim();
  const optionC      = (formData.get("optionC") as string).trim();
  const optionD      = (formData.get("optionD") as string).trim();
  const correctOption = formData.get("correctOption") as "A" | "B" | "C" | "D";
  const explanation  = (formData.get("explanation") as string | null)?.trim() || null;
  const difficulty   = parseInt(formData.get("difficulty") as string, 10) || 2;
  const sortOrder    = parseInt(formData.get("sortOrder") as string, 10) || 1;

  if (!testId || !topic || !questionText || !optionA || !optionB || !optionC || !optionD || !correctOption) {
    throw new Error("All required fields must be filled in.");
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("mock_questions") as any).insert({
    test_id:         testId,
    topic,
    subtopic,
    question_text:   questionText,
    option_a:        optionA,
    option_b:        optionB,
    option_c:        optionC,
    option_d:        optionD,
    correct_option:  correctOption,
    explanation,
    difficulty,
    sort_order:      sortOrder,
  });

  if (error) throw new Error((error as { message: string }).message);

  revalidatePath(`/admin/mock-tests/${testId}`);
}

// ── Delete a question ─────────────────────────────────────────────────────────
export async function deleteQuestion(questionId: string, testId: string) {
  const supabase = await createClient(true);

  const { error } = await supabase
    .from("mock_questions")
    .delete()
    .eq("id", questionId);

  if (error) throw new Error(error.message);

  revalidatePath(`/admin/mock-tests/${testId}`);
}

// ── Toggle test active/inactive ───────────────────────────────────────────────
export async function toggleTestActive(testId: string, isActive: boolean) {
  const supabase = await createClient(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from("mock_tests") as any)
    .update({ is_active: isActive })
    .eq("id", testId);

  if (error) throw new Error((error as { message: string }).message);

  revalidatePath(`/admin/mock-tests`);
  revalidatePath(`/admin/mock-tests/${testId}`);
}
