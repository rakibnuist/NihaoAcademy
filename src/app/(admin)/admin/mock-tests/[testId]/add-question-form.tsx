"use client";

import * as React from "react";
import { Loader2, Plus } from "lucide-react";
import { addQuestion } from "./actions";

interface Props {
  testId: string;
  nextSortOrder: number;
}

export function AddQuestionForm({ testId, nextSortOrder }: Props) {
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const formRef = React.useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    try {
      await addQuestion(fd);
      formRef.current?.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <input type="hidden" name="testId" value={testId} />
      <input type="hidden" name="sortOrder" value={nextSortOrder} />

      {/* Topic + Subtopic */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Topic <span className="text-brand-red">*</span>
          </label>
          <input
            name="topic"
            required
            placeholder="e.g. Calculus"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Subtopic
          </label>
          <input
            name="subtopic"
            placeholder="e.g. Integration"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      {/* Question text */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          Question <span className="text-brand-red">*</span>
        </label>
        <textarea
          name="questionText"
          required
          rows={3}
          placeholder="Write the question. LaTeX: use \\( \\) for inline, \\[ \\] for display."
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {/* Options A–D */}
      <div className="grid gap-3 sm:grid-cols-2">
        {(["A", "B", "C", "D"] as const).map((key) => (
          <div key={key}>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Option {key} <span className="text-brand-red">*</span>
            </label>
            <input
              name={`option${key}`}
              required
              placeholder={`Option ${key}`}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        ))}
      </div>

      {/* Correct option + Difficulty */}
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Correct Answer <span className="text-brand-red">*</span>
          </label>
          <select
            name="correctOption"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="">Select…</option>
            {(["A", "B", "C", "D"] as const).map((k) => (
              <option key={k} value={k}>Option {k}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">
            Difficulty
          </label>
          <select
            name="difficulty"
            defaultValue="2"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
        </div>
      </div>

      {/* Explanation */}
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">
          Explanation (optional — shown after submission)
        </label>
        <textarea
          name="explanation"
          rows={2}
          placeholder="Step-by-step solution or key insight…"
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
      </div>

      {error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-colors"
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Plus className="size-4" />
        )}
        {pending ? "Adding…" : "Add Question"}
      </button>
    </form>
  );
}
