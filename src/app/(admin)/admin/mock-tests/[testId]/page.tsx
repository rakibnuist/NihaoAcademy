import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, CheckCircle2, Layers, PenSquare, Plus, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { AddQuestionForm } from "./add-question-form";
import { DeleteQuestionButton } from "./delete-question-button";
import { ToggleActiveButton } from "./toggle-active-button";
import type { MockTest, MockQuestion } from "@/types/database";

export const metadata = { title: "Edit Mock Test · Admin" };

interface Props {
  params: Promise<{ testId: string }>;
}

const DIFFICULTY_LABELS = ["", "Easy", "Medium", "Hard"];

export default async function AdminTestDetailPage({ params }: Props) {
  const { testId } = await params;
  const supabase = await createClient(true);

  const { data: testRaw } = await supabase
    .from("mock_tests")
    .select("*")
    .eq("id", testId)
    .single();

  if (!testRaw) redirect("/admin/mock-tests");
  const test = testRaw as MockTest;

  const { data: questionsRaw } = await supabase
    .from("mock_questions")
    .select("*")
    .eq("test_id", testId)
    .order("sort_order");

  const questions = (questionsRaw ?? []) as MockQuestion[];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin/mock-tests"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        All mock tests
      </Link>

      {/* Test header card */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold">{test.title}</h1>
            {test.description && (
              <p className="mt-1 text-sm text-muted-foreground">{test.description}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1 capitalize">
                <Layers className="size-3.5" />
                {test.subject}
              </span>
              <span>{test.question_count} questions target</span>
              <span>{test.duration_minutes} min</span>
              <span className={cn(
                "font-semibold",
                test.difficulty === "advanced" ? "text-brand-red"
                : test.difficulty === "beginner" ? "text-emerald-600"
                : "text-amber-600"
              )}>
                {test.difficulty}
              </span>
            </div>
          </div>
          <ToggleActiveButton testId={test.id} isActive={test.is_active} />
        </div>

        {/* Fill progress */}
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-muted-foreground">
            <span>Question bank</span>
            <span className="font-mono">{questions.length} / {test.question_count}</span>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                questions.length >= test.question_count
                  ? "bg-emerald-500"
                  : questions.length > 0
                  ? "bg-amber-400"
                  : "bg-border"
              )}
              style={{ width: `${Math.min(100, Math.round((questions.length / test.question_count) * 100))}%` }}
            />
          </div>
          {questions.length >= test.question_count && (
            <p className="mt-1.5 flex items-center gap-1 text-xs text-emerald-600 font-medium">
              <CheckCircle2 className="size-3.5" />
              Question bank complete — ready for students
            </p>
          )}
        </div>
      </div>

      {/* Add question form */}
      <div className="rounded-2xl border border-border bg-card p-5">
        <h2 className="mb-4 font-semibold flex items-center gap-2">
          <Plus className="size-4 text-primary" />
          Add Question
        </h2>
        <AddQuestionForm testId={testId} nextSortOrder={questions.length + 1} />
      </div>

      {/* Question list */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-5 py-3">
          <h2 className="font-semibold">Questions ({questions.length})</h2>
          {questions.length === 0 && (
            <span className="text-xs text-muted-foreground">No questions yet</span>
          )}
        </div>

        {questions.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            Add your first question using the form above.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-5">
                <div className="flex items-start gap-3">
                  {/* Number */}
                  <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary font-mono text-xs font-bold text-muted-foreground">
                    {idx + 1}
                  </span>

                  <div className="flex-1 min-w-0">
                    {/* Meta */}
                    <div className="mb-1.5 flex flex-wrap items-center gap-2 text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                      <span>{q.topic}</span>
                      {q.subtopic && <><span>·</span><span>{q.subtopic}</span></>}
                      <span className={cn(
                        "rounded px-1.5 py-0.5",
                        q.difficulty === 3 ? "bg-red-100 text-red-700"
                        : q.difficulty === 1 ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                      )}>
                        {DIFFICULTY_LABELS[q.difficulty] ?? "Medium"}
                      </span>
                    </div>

                    {/* Question text */}
                    <p className="text-sm font-medium text-foreground">{q.question_text}</p>

                    {/* Options */}
                    <div className="mt-2.5 grid grid-cols-1 gap-1 sm:grid-cols-2">
                      {(["A", "B", "C", "D"] as const).map((key) => {
                        const text = {
                          A: q.option_a,
                          B: q.option_b,
                          C: q.option_c,
                          D: q.option_d,
                        }[key];
                        const isCorrect = q.correct_option === key;
                        return (
                          <div
                            key={key}
                            className={cn(
                              "flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs",
                              isCorrect
                                ? "border-emerald-400/60 bg-emerald-50 font-semibold text-emerald-800"
                                : "border-border text-muted-foreground"
                            )}
                          >
                            <span className={cn(
                              "flex size-4 shrink-0 items-center justify-center rounded-full border text-[9px] font-bold",
                              isCorrect
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : "border-border"
                            )}>
                              {key}
                            </span>
                            {text}
                            {isCorrect && <CheckCircle2 className="ml-auto size-3 text-emerald-500 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <p className="mt-2 text-xs text-muted-foreground bg-secondary/50 rounded-lg px-3 py-2">
                        <span className="font-semibold text-foreground/80">Explanation: </span>
                        {q.explanation}
                      </p>
                    )}
                  </div>

                  {/* Delete */}
                  <DeleteQuestionButton questionId={q.id} testId={testId} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
