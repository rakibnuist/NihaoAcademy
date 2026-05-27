import Link from "next/link";
import { BookOpen, Clock, Layers, Lock, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/server";
import { StartTestButton } from "@/components/public/start-test-button";
import { cn } from "@/lib/utils";
import type { MockTest } from "@/types/database";

// ── Metadata ──────────────────────────────────────────────────────────────────
export const metadata = {
  title: "CSCA Mock Tests — NiHao Academy",
  description:
    "Practice with full-length CSCA mock tests. Timer, question navigation, and AI-powered topic-by-topic result review.",
};

// ── Subject config ─────────────────────────────────────────────────────────────
const SUBJECT_META: Record<
  string,
  { label: string; color: string; bg: string; icon: string }
> = {
  math:      { label: "Mathematics",     color: "text-blue-600",   bg: "bg-blue-50",   icon: "∑" },
  physics:   { label: "Physics",         color: "text-violet-600", bg: "bg-violet-50", icon: "⚡" },
  chemistry: { label: "Chemistry",       color: "text-emerald-600",bg: "bg-emerald-50",icon: "⚗" },
  chinese:   { label: "Chinese (Prof.)", color: "text-brand-red",  bg: "bg-red-50",    icon: "中" },
};

const DIFFICULTY_LABEL: Record<string, string> = {
  beginner:     "Beginner",
  intermediate: "Intermediate",
  advanced:     "Advanced",
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function MockTestsPage() {
  const supabase = await createClient();
  const user = await getUser();

  const { data: testsRaw } = await supabase
    .from("mock_tests")
    .select("*")
    .eq("is_active", true)
    .order("subject")
    .order("sort_order");

  const tests = (testsRaw ?? []) as MockTest[];

  // Group by subject
  const grouped = tests.reduce<Record<string, MockTest[]>>((acc, t) => {
    (acc[t.subject] ??= []).push(t);
    return acc;
  }, {});

  const subjects = ["math", "physics", "chemistry", "chinese"].filter(
    (s) => grouped[s]?.length
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="border-b border-border bg-primary py-14 text-primary-foreground">
        <div className="mx-auto max-w-5xl px-4">
          <p className="font-mono text-xs font-semibold tracking-[0.2em] text-primary-foreground/60 uppercase">
            AI-Powered Practice
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            CSCA Mock Tests
          </h1>
          <p className="mt-3 max-w-xl text-base text-primary-foreground/75">
            Full-length timed exams — identical format to the real CSCA. After
            you submit, our AI breaks down your results topic by topic so you
            know exactly where to improve.
          </p>

          {/* Stats row */}
          <div className="mt-8 flex flex-wrap gap-6 text-sm">
            {[
              { label: "Questions per test", value: "48 MCQ" },
              { label: "Exam duration",      value: "60 min" },
              { label: "AI topic review",    value: "Instant" },
              { label: "Retakes",            value: "Unlimited" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <span className="text-lg font-bold">{s.value}</span>
                <span className="text-primary-foreground/60 text-xs">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tests by subject */}
      <section className="mx-auto max-w-5xl px-4 py-12 space-y-14">
        {subjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-16 text-center">
            <BookOpen className="mx-auto size-10 text-muted-foreground/40" />
            <p className="mt-3 text-muted-foreground">
              Mock tests are being prepared — check back soon!
            </p>
          </div>
        ) : (
          subjects.map((subject) => {
            const meta = SUBJECT_META[subject];
            const subjectTests = grouped[subject];
            return (
              <div key={subject}>
                {/* Subject header */}
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className={cn(
                      "flex size-10 items-center justify-center rounded-xl text-xl font-bold",
                      meta.bg,
                      meta.color
                    )}
                  >
                    {meta.icon}
                  </span>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{meta.label}</h2>
                    <p className="text-xs text-muted-foreground">
                      {subjectTests.length} mock test{subjectTests.length !== 1 ? "s" : ""} available
                    </p>
                  </div>
                </div>

                {/* Test cards */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {subjectTests.map((test) => (
                    <div
                      key={test.id}
                      className="group rounded-2xl border border-border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground leading-snug">
                            {test.title}
                          </h3>
                          {test.description && (
                            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                              {test.description}
                            </p>
                          )}
                        </div>
                        <span
                          className={cn(
                            "shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            test.difficulty === "advanced"
                              ? "bg-brand-red/10 text-brand-red"
                              : test.difficulty === "beginner"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-amber-100 text-amber-700"
                          )}
                        >
                          {DIFFICULTY_LABEL[test.difficulty]}
                        </span>
                      </div>

                      {/* Meta row */}
                      <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Layers className="size-3.5" />
                          {test.question_count} questions
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          {test.duration_minutes} min
                        </span>
                      </div>

                      {/* Action */}
                      <div className="mt-4">
                        {user ? (
                          <StartTestButton testId={test.id} />
                        ) : (
                          <Link
                            href="/login?redirect=/mock-tests"
                            className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
                          >
                            <Lock className="size-3.5" />
                            Log in to start
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* Bottom CTA for non-logged-in */}
      {!user && (
        <section className="border-t border-border bg-secondary/40 py-12">
          <div className="mx-auto max-w-2xl px-4 text-center">
            <h2 className="text-xl font-bold">Ready to practise?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your free account to start any mock test and unlock
              AI-powered result reviews.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Zap className="size-4" />
              Get started for free
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
