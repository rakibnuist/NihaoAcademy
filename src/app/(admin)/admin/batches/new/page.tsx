import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { createClient } from "@/lib/supabase/server";
import { courses } from "@/lib/courses";
import { createBatch } from "@/app/(admin)/admin/batches/actions";

export const metadata: Metadata = { title: "New Batch · Admin" };

export default async function NewBatchPage() {
  const supabase = await createClient(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: instructors } = await (supabase.from("instructors") as any)
    .select("id, full_name")
    .order("full_name");

  async function handleCreate(formData: FormData) {
    "use server";
    await createBatch(formData);
    redirect("/admin/batches");
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin/batches"
          className="inline-flex items-center gap-1.5 font-mono text-xs tracking-[0.12em] text-muted-foreground uppercase transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-3.5" /> All batches
        </Link>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight">
          New batch
        </h1>
      </div>

      <form action={handleCreate} className="space-y-5 rounded-xl bg-card p-6 ring-1 ring-foreground/10">
        {/* Course */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold" htmlFor="course_slug">Course *</label>
          <select
            id="course_slug"
            name="course_slug"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Select a course…</option>
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Batch name */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold" htmlFor="name">Batch name *</label>
          <input
            id="name" name="name" required
            placeholder="e.g. CSCA Batch Jan 2026"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        {/* Division + Capacity */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold" htmlFor="division">Division *</label>
            <select
              id="division" name="division" required
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="live">Live classes</option>
              <option value="recorded">Recorded</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold" htmlFor="capacity">Capacity</label>
            <input
              id="capacity" name="capacity" type="number" min="1" defaultValue={30}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Start date + Schedule */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold" htmlFor="start_date">Start date</label>
            <input
              id="start_date" name="start_date" type="date"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold" htmlFor="schedule">Schedule</label>
            <input
              id="schedule" name="schedule" placeholder="e.g. Fri & Sat 8–10 PM"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>

        {/* Instructor */}
        <div className="space-y-1.5">
          <label className="block text-sm font-semibold" htmlFor="instructor_id">Instructor</label>
          <select
            id="instructor_id" name="instructor_id"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="">Assign later</option>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {(instructors as any[] | null)?.map((i: { id: string; full_name: string }) => (
              <option key={i.id} value={i.id}>{i.full_name}</option>
            ))}
          </select>
        </div>

        <div className="flex justify-end gap-3 border-t border-border pt-4">
          <Link
            href="/admin/batches"
            className="rounded-lg border border-border px-4 py-2 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Create batch
          </button>
        </div>
      </form>
    </div>
  );
}
