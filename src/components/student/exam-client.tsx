"use client";

import * as React from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Flag,
  Loader2,
  Timer,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { saveAnswer, submitAttempt } from "@/app/actions/mock-test";
import type { MockQuestion } from "@/types/database";

// ── Types ──────────────────────────────────────────────────────────────────────
interface ExamClientProps {
  attemptId: string;
  test: {
    title: string;
    subject: string;
    duration_minutes: number;
    question_count: number;
  };
  questions: MockQuestion[];
  savedAnswers: Record<string, "A" | "B" | "C" | "D" | null>;
  startedAt: string;
}

type Answer = "A" | "B" | "C" | "D" | null;

const SUBJECT_LABELS: Record<string, string> = {
  math:      "Math",
  physics:   "Physics",
  chemistry: "Chemistry",
  chinese:   "Chinese",
};

// ── Helpers ────────────────────────────────────────────────────────────────────
function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ── Main component ─────────────────────────────────────────────────────────────
export function ExamClient({
  attemptId,
  test,
  questions,
  savedAnswers,
  startedAt,
}: ExamClientProps) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [answers, setAnswers] = React.useState<Record<string, Answer>>(
    () => ({ ...savedAnswers })
  );
  const [flagged, setFlagged] = React.useState<Set<string>>(new Set());
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [secondsLeft, setSecondsLeft] = React.useState(() => {
    const elapsed = Math.floor(
      (Date.now() - new Date(startedAt).getTime()) / 1000
    );
    const total = test.duration_minutes * 60;
    return Math.max(0, total - elapsed);
  });
  const [saving, setSaving] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [showSubmitModal, setShowSubmitModal] = React.useState(false);
  const [showTimeoutModal, setShowTimeoutModal] = React.useState(false);
  const [gridOpen, setGridOpen] = React.useState(false);

  const questionStartTime = React.useRef(Date.now());
  const autoSubmitted = React.useRef(false);

  // ── Timer ──────────────────────────────────────────────────────────────────
  React.useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          if (!autoSubmitted.current) {
            autoSubmitted.current = true;
            setShowTimeoutModal(true);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // ── Derived ────────────────────────────────────────────────────────────────
  const current = questions[currentIdx];
  const answeredCount = Object.values(answers).filter((a) => a != null).length;
  const isLow = secondsLeft < 300;

  // ── Question-level save ────────────────────────────────────────────────────
  async function handleSelect(option: Answer) {
    if (!current) return;
    const timeSpent = Math.floor((Date.now() - questionStartTime.current) / 1000);
    const prev = answers[current.id];
    if (prev === option) return;

    setAnswers((prev) => ({ ...prev, [current.id]: option }));
    setSaving(true);
    try {
      await saveAnswer(attemptId, current.id, option, timeSpent);
    } catch {
      // silent — answers stored locally and retried on next nav
    } finally {
      setSaving(false);
    }
  }

  function navigate(idx: number) {
    questionStartTime.current = Date.now();
    setCurrentIdx(Math.max(0, Math.min(questions.length - 1, idx)));
    setGridOpen(false);
  }

  function toggleFlag() {
    if (!current) return;
    setFlagged((prev) => {
      const next = new Set(prev);
      next.has(current.id) ? next.delete(current.id) : next.add(current.id);
      return next;
    });
  }

  async function handleSubmit() {
    setSubmitting(true);
    const timeTaken = test.duration_minutes * 60 - secondsLeft;
    try {
      await submitAttempt(attemptId, timeTaken);
    } catch {
      setSubmitting(false);
    }
  }

  // ── Grid state helper ──────────────────────────────────────────────────────
  function gridState(q: MockQuestion, idx: number) {
    if (idx === currentIdx) return "active";
    if (flagged.has(q.id)) return "flagged";
    if (answers[q.id] != null) return "done";
    return "empty";
  }

  const options: { label: Answer; text: string }[] = current
    ? [
        { label: "A", text: current.option_a },
        { label: "B", text: current.option_b },
        { label: "C", text: current.option_c },
        { label: "D", text: current.option_d },
      ]
    : [];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-primary px-4 py-2.5 text-primary-foreground">
        <div className="flex items-center gap-3">
          <span className="rounded bg-white/15 px-2 py-0.5 font-mono text-[11px] font-semibold tracking-wider uppercase">
            {SUBJECT_LABELS[test.subject] ?? test.subject}
          </span>
          <span className="hidden sm:block font-medium text-sm text-primary-foreground/80 truncate max-w-xs">
            {test.title}
          </span>
        </div>

        {/* Timer */}
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-mono text-sm font-bold tabular-nums",
            isLow ? "animate-pulse bg-brand-red/25 text-red-300" : "bg-white/10"
          )}
        >
          <Timer className="size-3.5" />
          {formatTime(secondsLeft)}
        </div>

        <div className="flex items-center gap-2">
          {saving && <Loader2 className="size-3.5 animate-spin text-primary-foreground/60" />}
          <button
            onClick={() => setGridOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold hover:bg-white/20 transition-colors sm:hidden"
          >
            Grid
          </button>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center gap-1.5 rounded-lg bg-white/15 px-3 py-1.5 text-xs font-semibold hover:bg-white/25 transition-colors"
          >
            Submit
          </button>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Question pane */}
        <main className="flex flex-1 flex-col overflow-y-auto p-5 lg:p-8">
          {/* Question header */}
          <div className="mb-1 flex items-center gap-2">
            <span className="font-mono text-xs font-semibold tracking-[0.18em] text-brand-red uppercase">
              {current?.topic}
              {current?.subtopic ? ` · ${current.subtopic}` : ""}
            </span>
            <span className="ml-auto font-mono text-xs text-muted-foreground">
              {currentIdx + 1} / {questions.length}
            </span>
          </div>

          {/* Question text */}
          <p className="mt-3 text-base font-medium leading-relaxed text-foreground sm:text-lg">
            {current?.question_text}
          </p>

          {/* Options */}
          <ul className="mt-6 space-y-3 max-w-2xl">
            {options.map((opt) => {
              const isSelected = answers[current?.id ?? ""] === opt.label;
              return (
                <li key={opt.label}>
                  <button
                    onClick={() => handleSelect(opt.label)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-sm text-left transition-all",
                      isSelected
                        ? "border-primary bg-primary/8 font-semibold text-primary shadow-sm"
                        : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-secondary/40"
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary text-muted-foreground"
                      )}
                    >
                      {opt.label}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    {isSelected && <CheckCircle2 className="ml-auto size-4 shrink-0 text-primary" />}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Nav row */}
          <div className="mt-8 flex items-center gap-3 max-w-2xl">
            <button
              onClick={() => navigate(currentIdx - 1)}
              disabled={currentIdx === 0}
              className="flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary disabled:opacity-40 transition-colors"
            >
              <ChevronLeft className="size-4" />
              Prev
            </button>
            <button
              onClick={toggleFlag}
              className={cn(
                "flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                current && flagged.has(current.id)
                  ? "border-brand-gold/60 bg-brand-gold/10 text-[oklch(0.45_0.11_70)]"
                  : "border-border text-muted-foreground hover:bg-secondary"
              )}
            >
              <Flag className="size-4" />
              {current && flagged.has(current.id) ? "Unflag" : "Flag"}
            </button>
            <button
              onClick={() => navigate(currentIdx + 1)}
              disabled={currentIdx === questions.length - 1}
              className="ml-auto flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40 transition-colors"
            >
              Next
              <ChevronRight className="size-4" />
            </button>
          </div>
        </main>

        {/* ── Question grid sidebar (desktop) ─────────────────────────────── */}
        <aside
          className={cn(
            "shrink-0 border-l border-border bg-secondary/20 overflow-y-auto transition-all",
            "hidden lg:block lg:w-52",
            gridOpen && "!block w-full sm:w-64 absolute inset-y-0 right-0 z-20 shadow-2xl bg-card"
          )}
        >
          <div className="p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="font-mono text-[9px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Questions
              </p>
              <button
                onClick={() => setGridOpen(false)}
                className="lg:hidden rounded p-1 text-muted-foreground hover:bg-secondary"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-6 gap-1">
              {questions.map((q, i) => {
                const state = gridState(q, i);
                return (
                  <button
                    key={q.id}
                    onClick={() => navigate(i)}
                    title={`Q${i + 1}`}
                    className={cn(
                      "flex size-7 items-center justify-center rounded text-[10px] font-bold transition-colors",
                      state === "active"
                        ? "bg-primary text-primary-foreground ring-2 ring-primary/40"
                        : state === "done"
                        ? "bg-emerald-500/20 text-emerald-700 hover:bg-emerald-500/30"
                        : state === "flagged"
                        ? "bg-brand-gold/30 text-[oklch(0.45_0.11_70)] hover:bg-brand-gold/40"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    )}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-4 space-y-1.5">
              {[
                { color: "bg-emerald-500/20",  label: `Answered (${answeredCount})` },
                { color: "bg-primary",          label: "Current" },
                { color: "bg-brand-gold/30",    label: `Flagged (${flagged.size})` },
                { color: "bg-secondary",        label: "Unanswered" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className={cn("size-3 rounded", l.color)} />
                  {l.label}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                <span>Progress</span>
                <span>{answeredCount}/{questions.length}</span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <button
              onClick={() => setShowSubmitModal(true)}
              className="mt-5 w-full rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Submit exam
            </button>
          </div>
        </aside>
      </div>

      {/* ── Submit confirmation modal ──────────────────────────────────────── */}
      {showSubmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl">
            <h2 className="text-lg font-bold">Submit exam?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You have answered{" "}
              <span className="font-semibold text-foreground">{answeredCount}</span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">{questions.length}</span>{" "}
              questions.{" "}
              {answeredCount < questions.length && (
                <span className="text-amber-600 font-medium">
                  {questions.length - answeredCount} questions unanswered.
                </span>
              )}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Time remaining:{" "}
              <span className={cn("font-mono font-semibold", isLow ? "text-brand-red" : "text-foreground")}>
                {formatTime(secondsLeft)}
              </span>
            </p>
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                disabled={submitting}
                className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50 transition-colors"
              >
                Continue
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Time's up modal ────────────────────────────────────────────────── */}
      {showTimeoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl text-center">
            <AlertTriangle className="mx-auto size-10 text-brand-red" />
            <h2 className="mt-3 text-lg font-bold">Time&apos;s up!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your time has run out. Your answers have been saved and the exam
              will be submitted now.
            </p>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="mt-5 w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Submitting…
                </>
              ) : (
                "Submit & see results"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
