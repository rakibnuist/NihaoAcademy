import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { getResultsData } from "@/app/actions/mock-test";
import { cn } from "@/lib/utils";

export const metadata = { title: "Exam Results — NiHao Academy" };

interface Props {
  params: Promise<{ attemptId: string }>;
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

const OPTION_KEYS = ["A", "B", "C", "D"] as const;
type OptionKey = (typeof OPTION_KEYS)[number];

function getOptionText(
  q: {
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
  },
  key: OptionKey
) {
  return { A: q.option_a, B: q.option_b, C: q.option_c, D: q.option_d }[key];
}

export default async function ResultsPage({ params }: Props) {
  const { attemptId } = await params;

  const data = await getResultsData(attemptId).catch(() => {
    redirect("/student/dashboard");
  });

  if (!data) redirect("/student/dashboard");

  const { attempt, test, details, topicBreakdown } = data;

  const score = attempt.score ?? 0;
  const correctCount = attempt.correct_count ?? 0;
  const totalQuestions = attempt.total_questions ?? 0;
  const timeTaken = attempt.time_taken_secs ?? 0;

  // Grade label
  const grade =
    score >= 80 ? { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50" }
    : score >= 65 ? { label: "Good", color: "text-blue-600", bg: "bg-blue-50" }
    : score >= 50 ? { label: "Pass", color: "text-amber-600", bg: "bg-amber-50" }
    : { label: "Needs work", color: "text-brand-red", bg: "bg-red-50" };

  // Sort topics worst first for focused improvement
  const sortedTopics = [...topicBreakdown].sort((a, b) => a.pct - b.pct);

  // Wrong answers for review
  const wrongAnswers = details
    .filter((d) => d.is_correct === false && d.mock_questions)
    .sort((a, b) =>
      (a.mock_questions?.sort_order ?? 0) - (b.mock_questions?.sort_order ?? 0)
    );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-8">
      {/* Back */}
      <Link
        href="/student/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Back to dashboard
      </Link>

      {/* Score hero card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Score ring */}
          <div className="flex flex-col items-center justify-center rounded-full border-4 border-primary/20 bg-primary/5 size-28 shrink-0 text-center">
            <span className="text-3xl font-extrabold text-primary tabular-nums">
              {score}
            </span>
            <span className="text-xs text-muted-foreground font-medium">/ 100</span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-extrabold tracking-tight">
                {test?.title ?? "Results"}
              </h1>
              <span
                className={cn(
                  "rounded-full px-3 py-0.5 text-xs font-semibold",
                  grade.bg,
                  grade.color
                )}
              >
                {grade.label}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-5 text-sm">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <span>
                  <strong className="text-foreground">{correctCount}</strong> correct
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <XCircle className="size-4 text-brand-red" />
                <span>
                  <strong className="text-foreground">
                    {totalQuestions - correctCount}
                  </strong>{" "}
                  wrong
                </span>
              </div>
              {timeTaken > 0 && (
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="size-4" />
                  <span>
                    <strong className="text-foreground">{formatTime(timeTaken)}</strong> taken
                  </span>
                </div>
              )}
            </div>

            {/* Score bar */}
            <div className="mt-4 h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all",
                  score >= 65 ? "bg-primary" : "bg-brand-red"
                )}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Two-col grid: topic breakdown + AI recommendation */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Topic breakdown — 3 cols */}
        <section className="lg:col-span-3 rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Target className="size-4 text-primary" />
            <h2 className="font-semibold">Topic Breakdown</h2>
          </div>

          {topicBreakdown.length === 0 ? (
            <p className="text-sm text-muted-foreground">No topic data available.</p>
          ) : (
            <div className="space-y-3">
              {sortedTopics.map((t) => (
                <div key={t.topic}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">{t.topic}</span>
                    <span
                      className={cn(
                        "font-mono text-xs font-semibold",
                        t.pct >= 70
                          ? "text-emerald-600"
                          : t.pct >= 50
                          ? "text-amber-600"
                          : "text-brand-red"
                      )}
                    >
                      {t.correct}/{t.total} · {t.pct}%
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        t.pct >= 70
                          ? "bg-emerald-500"
                          : t.pct >= 50
                          ? "bg-amber-400"
                          : "bg-brand-red"
                      )}
                      style={{ width: `${t.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* AI Recommendation — 2 cols */}
        <section className="lg:col-span-2 rounded-2xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <h2 className="font-semibold">AI Study Plan</h2>
          </div>

          {attempt.ai_review ? (
            <div className="prose prose-sm max-w-none text-sm text-foreground">
              <p>{attempt.ai_review}</p>
            </div>
          ) : (
            <div className="space-y-3 text-sm text-muted-foreground">
              {sortedTopics.length > 0 ? (
                <>
                  <p className="font-medium text-foreground">
                    Based on your results:
                  </p>
                  {sortedTopics.slice(0, 3).map((t) => (
                    <div key={t.topic} className="flex gap-2">
                      <span className="mt-0.5 shrink-0 size-1.5 rounded-full bg-brand-red mt-[7px]" />
                      <p>
                        Focus on{" "}
                        <strong className="text-foreground">{t.topic}</strong> —
                        you got {t.pct}% correct. Review the fundamentals and
                        practice more problems.
                      </p>
                    </div>
                  ))}
                  {score >= 65 && (
                    <div className="flex gap-2">
                      <span className="mt-0.5 shrink-0 size-1.5 rounded-full bg-emerald-500 mt-[7px]" />
                      <p>
                        Good overall performance! Keep practicing to push your
                        score above 80.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <p>
                  Complete more questions to unlock personalised study
                  recommendations.
                </p>
              )}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-[11px] text-muted-foreground">
              AI-powered recommendations update as you complete more tests.
            </p>
          </div>
        </section>
      </div>

      {/* Wrong answers review */}
      {wrongAnswers.length > 0 && (
        <section className="rounded-2xl border border-border bg-card p-5">
          <div className="mb-5 flex items-center gap-2">
            <BookOpen className="size-4 text-brand-red" />
            <h2 className="font-semibold">
              Review Wrong Answers ({wrongAnswers.length})
            </h2>
          </div>

          <div className="space-y-5">
            {wrongAnswers.map((d, i) => {
              const q = d.mock_questions!;
              return (
                <div
                  key={d.question_id}
                  className="rounded-xl border border-border bg-secondary/20 p-4"
                >
                  <div className="mb-1 flex items-start justify-between gap-3">
                    <span className="font-mono text-[10px] font-semibold tracking-widest text-muted-foreground uppercase">
                      {q.topic}{q.subtopic ? ` · ${q.subtopic}` : ""}
                    </span>
                    <span className="shrink-0 rounded bg-brand-red/10 px-2 py-0.5 text-[10px] font-semibold text-brand-red uppercase">
                      Wrong
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-medium text-foreground">
                    {q.question_text}
                  </p>

                  <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {OPTION_KEYS.map((key) => {
                      const isCorrect = key === q.correct_option;
                      const isSelected = key === d.selected_option;
                      return (
                        <div
                          key={key}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg border px-3 py-2 text-xs",
                            isCorrect
                              ? "border-emerald-400/60 bg-emerald-50 text-emerald-800 font-semibold"
                              : isSelected
                              ? "border-brand-red/40 bg-red-50 text-red-800"
                              : "border-border bg-card text-muted-foreground"
                          )}
                        >
                          <span
                            className={cn(
                              "flex size-5 shrink-0 items-center justify-center rounded-full border text-[10px] font-bold",
                              isCorrect
                                ? "border-emerald-500 bg-emerald-500 text-white"
                                : isSelected
                                ? "border-brand-red bg-brand-red/10 text-brand-red"
                                : "border-border"
                            )}
                          >
                            {key}
                          </span>
                          {getOptionText(q, key)}
                          {isCorrect && (
                            <CheckCircle2 className="ml-auto size-3.5 text-emerald-500 shrink-0" />
                          )}
                          {isSelected && !isCorrect && (
                            <XCircle className="ml-auto size-3.5 text-brand-red shrink-0" />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <div className="mt-3 rounded-lg bg-primary/5 border border-primary/15 px-3 py-2.5">
                      <p className="text-xs text-foreground/80">
                        <span className="font-semibold text-primary">Explanation: </span>
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Bottom actions */}
      <div className="flex flex-wrap gap-3 pb-8">
        <Link
          href="/mock-tests"
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Award className="size-4" />
          Take another test
        </Link>
        <Link
          href="/student/dashboard"
          className="flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-medium hover:bg-secondary transition-colors"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
