"use client";

import * as React from "react";
import { CheckCircle2, ChevronDown, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  approveEnrollment,
  cancelEnrollment,
  updateFeeStatus,
  assignBatch,
} from "@/app/actions/admin-enrollment";

interface Batch {
  id: string;
  name: string;
  course_slug: string;
  division: string;
}

interface EnrollmentActionsProps {
  enrollmentId: string;
  status: string;
  feeStatus: string;
  batchId: string | null;
  batches: Batch[];       // all active batches for the relevant course
  courseSlug?: string;    // from notes or batch
}

const FEE_CYCLE: Record<string, string> = {
  unpaid: "partial",
  partial: "paid",
  paid: "unpaid",
};

const FEE_LABEL: Record<string, string> = {
  unpaid:  "Unpaid",
  partial: "Partial",
  paid:    "Paid",
};

const FEE_STYLES: Record<string, string> = {
  unpaid:  "bg-brand-red/10 text-brand-red border-brand-red/20",
  partial: "bg-amber-100 text-amber-700 border-amber-200",
  paid:    "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export function EnrollmentActions({
  enrollmentId,
  status,
  feeStatus,
  batchId,
  batches,
}: EnrollmentActionsProps) {
  const [currentStatus, setCurrentStatus] = React.useState(status);
  const [currentFee, setCurrentFee] = React.useState(feeStatus);
  const [currentBatch, setCurrentBatch] = React.useState(batchId);
  const [loading, setLoading] = React.useState<string | null>(null);
  const [batchOpen, setBatchOpen] = React.useState(false);

  async function handleApprove() {
    setLoading("approve");
    try {
      await approveEnrollment(enrollmentId, currentBatch);
      setCurrentStatus("active");
      toast.success("Enrollment approved");
    } catch (e) {
      toast.error("Failed", { description: (e as Error).message });
    } finally {
      setLoading(null);
    }
  }

  async function handleCancel() {
    if (!confirm("Cancel this enrollment?")) return;
    setLoading("cancel");
    try {
      await cancelEnrollment(enrollmentId);
      setCurrentStatus("cancelled");
      toast.success("Enrollment cancelled");
    } catch (e) {
      toast.error("Failed", { description: (e as Error).message });
    } finally {
      setLoading(null);
    }
  }

  async function handleFeeClick() {
    const next = FEE_CYCLE[currentFee] ?? "unpaid";
    setLoading("fee");
    try {
      await updateFeeStatus(enrollmentId, next as "unpaid" | "partial" | "paid");
      setCurrentFee(next);
      toast.success(`Fee updated to ${FEE_LABEL[next]}`);
    } catch (e) {
      toast.error("Failed", { description: (e as Error).message });
    } finally {
      setLoading(null);
    }
  }

  async function handleBatchAssign(bid: string) {
    setBatchOpen(false);
    setLoading("batch");
    try {
      await assignBatch(enrollmentId, bid);
      setCurrentBatch(bid);
      toast.success("Batch assigned");
    } catch (e) {
      toast.error("Failed", { description: (e as Error).message });
    } finally {
      setLoading(null);
    }
  }

  const currentBatchName = batches.find((b) => b.id === currentBatch)?.name;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Fee status pill — click to cycle */}
      <button
        onClick={handleFeeClick}
        disabled={!!loading}
        title="Click to cycle fee status"
        className={cn(
          "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase transition-opacity hover:opacity-80 disabled:opacity-50",
          FEE_STYLES[currentFee] ?? FEE_STYLES.unpaid
        )}
      >
        {loading === "fee" ? (
          <Loader2 className="size-3 animate-spin" />
        ) : (
          FEE_LABEL[currentFee] ?? currentFee
        )}
      </button>

      {/* Batch selector */}
      {batches.length > 0 && currentStatus !== "cancelled" && (
        <div className="relative">
          <button
            onClick={() => setBatchOpen((v) => !v)}
            disabled={!!loading}
            className="flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:bg-secondary disabled:opacity-50 transition-colors"
          >
            {loading === "batch" ? (
              <Loader2 className="size-3 animate-spin" />
            ) : (
              <>
                {currentBatchName ?? "Assign batch"}
                <ChevronDown className="size-3" />
              </>
            )}
          </button>
          {batchOpen && (
            <div className="absolute right-0 top-full z-20 mt-1 min-w-[160px] rounded-xl border border-border bg-card shadow-lg">
              {batches.map((b) => (
                <button
                  key={b.id}
                  onClick={() => handleBatchAssign(b.id)}
                  className="flex w-full items-start gap-2 px-3 py-2.5 text-left text-xs hover:bg-secondary transition-colors first:rounded-t-xl last:rounded-b-xl"
                >
                  <span className="font-medium">{b.name}</span>
                  <span className="ml-auto capitalize text-muted-foreground">{b.division}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Approve button — only for pending */}
      {currentStatus === "pending" && (
        <button
          onClick={handleApprove}
          disabled={!!loading}
          className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-[10px] font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {loading === "approve" ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <CheckCircle2 className="size-3" />
          )}
          Approve
        </button>
      )}

      {/* Cancel — for pending/active */}
      {(currentStatus === "pending" || currentStatus === "active") && (
        <button
          onClick={handleCancel}
          disabled={!!loading}
          title="Cancel enrollment"
          className="flex size-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive disabled:opacity-50 transition-colors"
        >
          {loading === "cancel" ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <XCircle className="size-3.5" />
          )}
        </button>
      )}
    </div>
  );
}
