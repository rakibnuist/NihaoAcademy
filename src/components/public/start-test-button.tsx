"use client";

import * as React from "react";
import { Loader2, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { startAttempt } from "@/app/actions/mock-test";

export function StartTestButton({ testId }: { testId: string }) {
  const router = useRouter();
  const [pending, setPending] = React.useState(false);

  async function handleClick() {
    setPending(true);
    try {
      const { attemptId } = await startAttempt(testId);
      router.push(`/student/exam/${attemptId}`);
    } catch {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-70 transition-colors"
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : (
        <Zap className="size-3.5" />
      )}
      {pending ? "Starting…" : "Start test"}
    </button>
  );
}
