import type { Metadata } from "next";
import { Search } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { EnrollmentActions } from "@/components/admin/enrollment-actions";
import { cn } from "@/lib/utils";
import type { Enrollment } from "@/types/database";

type EnrollmentRow = Pick<
  Enrollment,
  "id" | "status" | "fee_status" | "enrolled_at" | "notes" | "batch_id"
> & {
  students: { id: string; full_name: string; phone: string; email: string | null } | null;
  batches:  { id: string; name: string; course_slug: string; division: string } | null;
};

type BatchRow = { id: string; name: string; course_slug: string; division: string };

export const metadata: Metadata = { title: "Enrollments · Admin" };

const STATUS_STYLES: Record<string, string> = {
  pending:   "bg-amber-100 text-amber-700",
  active:    "bg-emerald-100 text-emerald-700",
  completed: "bg-primary/10 text-primary",
  cancelled: "bg-secondary text-muted-foreground",
};

export default async function EnrollmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; fee?: string }>;
}) {
  const { q, status, fee } = await searchParams;
  const supabase = await createClient(true);

  // Load enrollments with student + batch info
  let query = supabase
    .from("enrollments")
    .select(`
      id, status, fee_status, enrolled_at, notes, batch_id,
      students(id, full_name, phone, email),
      batches(id, name, course_slug, division)
    `)
    .order("enrolled_at", { ascending: false })
    .limit(200);

  if (status && status !== "all") query = query.eq("status", status as Enrollment["status"]);
  if (fee && fee !== "all")    query = query.eq("fee_status", fee as Enrollment["fee_status"]);

  const { data: rawEnrollments, error } = await query;
  const enrollments = rawEnrollments as EnrollmentRow[] | null;

  // Load all active batches for assignment dropdowns
  const { data: batchesRaw } = await supabase
    .from("batches")
    .select("id, name, course_slug, division")
    .eq("is_active", true)
    .order("course_slug")
    .order("name");
  const allBatches = (batchesRaw ?? []) as BatchRow[];

  // Filter by search
  const filtered = q
    ? enrollments?.filter((e) => {
        const s = e.students;
        return (
          s?.full_name.toLowerCase().includes(q.toLowerCase()) ||
          s?.phone.includes(q) ||
          s?.email?.toLowerCase().includes(q.toLowerCase())
        );
      })
    : enrollments;

  // Stats
  const total     = enrollments?.length ?? 0;
  const pending   = enrollments?.filter((e) => e.status === "pending").length ?? 0;
  const active    = enrollments?.filter((e) => e.status === "active").length ?? 0;
  const unpaid    = enrollments?.filter((e) => e.fee_status === "unpaid" && e.status === "active").length ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Enrollments</h1>
        <p className="text-sm text-muted-foreground">
          Approve reservations, assign batches, track payments.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total",         value: total,   color: "" },
          { label: "Pending",       value: pending, color: "text-amber-600" },
          { label: "Active",        value: active,  color: "text-emerald-600" },
          { label: "Active Unpaid", value: unpaid,  color: "text-brand-red" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <p className={cn("text-2xl font-bold tabular-nums", s.color)}>{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <form className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name, phone or email…"
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring"
          />
        </div>
        <select
          name="status"
          defaultValue={status ?? "all"}
          className="h-10 rounded-lg border border-input bg-card px-3 text-sm shadow-sm outline-none focus-visible:border-ring"
        >
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          name="fee"
          defaultValue={fee ?? "all"}
          className="h-10 rounded-lg border border-input bg-card px-3 text-sm shadow-sm outline-none focus-visible:border-ring"
        >
          <option value="all">All fees</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
        <button
          type="submit"
          className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Filter
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {error ? (
          <div className="px-5 py-12 text-center text-sm text-destructive">
            Error: {error.message}
          </div>
        ) : !filtered || filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-sm text-muted-foreground">
            No enrollments found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  {["Student", "Course / Batch", "Date", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((e) => {
                  const student = e.students;
                  const batch   = e.batches;

                  // Infer course from batch or notes
                  const courseSlug = batch?.course_slug
                    ?? e.notes?.match(/Course: ([^\s·]+)/)?.[1]
                    ?? null;

                  const relevantBatches = courseSlug
                    ? allBatches.filter((b) => b.course_slug === courseSlug)
                    : allBatches;

                  return (
                    <tr key={e.id} className="hover:bg-secondary/20 transition-colors">
                      {/* Student */}
                      <td className="px-4 py-3">
                        <div className="font-medium">{student?.full_name ?? "—"}</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {student?.phone ?? ""}
                        </div>
                        {student?.email && (
                          <div className="text-xs text-muted-foreground">{student.email}</div>
                        )}
                      </td>

                      {/* Batch */}
                      <td className="px-4 py-3">
                        {batch ? (
                          <>
                            <div className="font-medium text-xs">{batch.name}</div>
                            <div className="text-xs capitalize text-muted-foreground">
                              {batch.course_slug} · {batch.division}
                            </div>
                          </>
                        ) : courseSlug ? (
                          <div className="text-xs text-muted-foreground">
                            {courseSlug}
                            <span className="ml-1 text-amber-600">(no batch)</span>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>

                      {/* Date */}
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(e.enrolled_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status badge */}
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase",
                            STATUS_STYLES[e.status] ?? "bg-secondary text-muted-foreground"
                          )}
                        >
                          {e.status}
                        </span>
                        {e.notes && (
                          <p className="mt-1 text-[10px] text-muted-foreground line-clamp-1 max-w-[160px]">
                            {e.notes.split("\n")[0]}
                          </p>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <EnrollmentActions
                          enrollmentId={e.id}
                          status={e.status}
                          feeStatus={e.fee_status}
                          batchId={e.batch_id}
                          batches={relevantBatches}
                          courseSlug={courseSlug ?? undefined}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
