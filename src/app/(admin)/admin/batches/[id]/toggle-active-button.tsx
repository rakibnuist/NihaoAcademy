"use client";

import { useState } from "react";
import { toggleBatchActive } from "@/app/(admin)/admin/batches/actions";

export function ToggleBatchActiveButton({
  batchId,
  isActive,
}: {
  batchId: string;
  isActive: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await toggleBatchActive(batchId, !isActive);
    setLoading(false);
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
        isActive
          ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
          : "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
      }`}
    >
      {loading ? "…" : isActive ? "Deactivate" : "Activate"}
    </button>
  );
}
