"use client";

import * as React from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toggleTestActive } from "./actions";

export function ToggleActiveButton({
  testId,
  isActive,
}: {
  testId: string;
  isActive: boolean;
}) {
  const [pending, setPending] = React.useState(false);
  const [active, setActive] = React.useState(isActive);

  async function handleToggle() {
    setPending(true);
    try {
      await toggleTestActive(testId, !active);
      setActive((v) => !v);
    } catch {
      // silent
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={pending}
      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors disabled:opacity-60 ${
        active
          ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
          : "bg-secondary text-muted-foreground hover:bg-secondary/80"
      }`}
    >
      {pending ? (
        <Loader2 className="size-3.5 animate-spin" />
      ) : active ? (
        <Eye className="size-3.5" />
      ) : (
        <EyeOff className="size-3.5" />
      )}
      {active ? "Active" : "Hidden"}
    </button>
  );
}
