"use client";

import * as React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { deleteQuestion } from "./actions";

export function DeleteQuestionButton({
  questionId,
  testId,
}: {
  questionId: string;
  testId: string;
}) {
  const [pending, setPending] = React.useState(false);
  const [confirming, setConfirming] = React.useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }
    setPending(true);
    try {
      await deleteQuestion(questionId, testId);
    } catch {
      setPending(false);
      setConfirming(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      title={confirming ? "Click again to confirm delete" : "Delete question"}
      className={`shrink-0 flex size-7 items-center justify-center rounded-lg transition-colors ${
        confirming
          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
          : "text-muted-foreground hover:bg-secondary hover:text-destructive"
      } disabled:opacity-50`}
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Trash2 className="size-3.5" />
      )}
    </button>
  );
}
