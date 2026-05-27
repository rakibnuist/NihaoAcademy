import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { updateBatch } from "@/app/(admin)/admin/batches/actions";

export const metadata: Metadata = { title: "Edit Batch · Admin" };

export default async function EditBatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient(true);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: batch } = await (supabase.from("batches") as any)
    .select("id, name, start_date, schedule, capacity, is_active, instructor_id")
    .eq("id", id)
    .single();

  if (!batch) notFound();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: instructors } = await (supabase.from("instructors") as any)
    .select("id, full_name")
    .order("full_name");

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateBatch(id, formData);
  }

  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href={`/admin/batches/${id}`}
          className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> Back to batch
        </Link>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight">
          Edit batch
        </h1>
      </div>

      <form
        action={handleUpdate}
        className="space-y-5 rounded-xl bg-card p-6 ring-1 ring-foreground/10"
      >
        {/* Batch name */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold" htmlFor="name">
            Batch name *
          </label>
          <input
            id="name"
            name="name"
            required
            defaultValue={batch.name}
            className={inputCls}
          />
        </div>

        {/* Capacity */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold" htmlFor="capacity">
            Capacity
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            min="1"
            defaultValue={batch.capacity}
            className={inputCls}
          />
        </div>

        {/* Start date + Schedule */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold" htmlFor="start_date">
              Start date
            </label>
            <input
              id="start_date"
              name="start_date"
              type="date"
              defaultValue={batch.start_date ?? ""}
              className={inputCls}
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold" htmlFor="schedule">
              Schedule
            </label>
            <input
              id="schedule"
              name="schedule"
              placeholder="e.g. Fri & Sat 8–10 PM"
              defaultValue={batch.schedule ?? ""}
              className={inputCls}
            />
          </div>
        </div>

        {/* Instructor */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold" htmlFor="instructor_id">
            Instructor
          </label>
          <select
            id="instructor_id"
            name="instructor_id"
            defaultValue={batch.instructor_id ?? ""}
            className={inputCls}
          >
            <option value="">Assign later</option>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(instructors as any[] | null)?.map(
              (i: { id: string; full_name: string }) => (
                <option key={i.id} value={i.id}>
                  {i.full_name}
                </option>
              )
            )}
          </select>
        </div>

        {/* Is active */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold" htmlFor="is_active">
            Status
          </label>
          <select
            id="is_active"
            name="is_active"
            defaultValue={batch.is_active ? "true" : "false"}
            className={inputCls}
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Link
            href={`/admin/batches/${id}`}
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  );
}
