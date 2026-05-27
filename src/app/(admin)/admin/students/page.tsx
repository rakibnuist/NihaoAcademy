import type { Metadata } from "next";
import Link from "next/link";
import { Search, UserPlus } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import type { Student } from "@/types/database";

export const metadata: Metadata = { title: "Students · Admin" };

const STATUS_STYLES: Record<Student["status"], string> = {
  active:    "bg-emerald-500/10 text-emerald-600",
  inactive:  "bg-secondary text-muted-foreground",
  suspended: "bg-brand-red/10 text-brand-red",
};

export default async function StudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q, status } = await searchParams;
  const supabase = await createClient(true);

  let query = supabase
    .from("students")
    .select("id, full_name, phone, email, status, marketing_source, created_at")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`full_name.ilike.%${q}%,phone.ilike.%${q}%,email.ilike.%${q}%`);
  }
  if (status && status !== "all") {
    query = query.eq("status", status as Student["status"]);
  }

  const { data: rawStudents, error } = await query.limit(100);
  type StudentRow = Pick<Student, "id"|"full_name"|"phone"|"email"|"status"|"marketing_source"|"created_at">;
  const students = rawStudents as StudentRow[] | null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
            Passenger manifest
          </p>
          <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
            Students
          </h1>
        </div>
        <Link
          href="/admin/students/new"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <UserPlus className="size-4" />
          Add student
        </Link>
      </div>

      {/* Search + filter */}
      <form className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name, phone or email…"
            className="h-10 w-full rounded-lg border border-input bg-card pl-9 pr-3 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </div>
        <select
          name="status"
          defaultValue={status ?? "all"}
          className="h-10 rounded-lg border border-input bg-card px-3 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="all">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
        <button
          type="submit"
          className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Search
        </button>
      </form>

      {/* Table */}
      <div className="overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10">
        {error ? (
          <div className="px-5 py-12 text-center text-sm text-destructive">
            Error loading students: {error.message}
          </div>
        ) : !students || students.length === 0 ? (
          <div className="px-5 py-16 text-center">
            <p className="text-sm text-muted-foreground">
              {q ? `No students matching "${q}".` : "No students yet."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-4 py-3 text-left font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Phone
                  </th>
                  <th className="hidden px-4 py-3 text-left font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase md:table-cell">
                    Email
                  </th>
                  <th className="hidden px-4 py-3 text-left font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase sm:table-cell">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="hidden px-4 py-3 text-left font-mono text-[10px] font-semibold tracking-[0.14em] text-muted-foreground uppercase lg:table-cell">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => (
                  <tr
                    key={s.id}
                    className="transition-colors hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3 font-medium">{s.full_name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      {s.phone ?? "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {s.email ?? "—"}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {s.marketing_source ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${STATUS_STYLES[s.status]}`}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                      {new Date(s.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {students && students.length === 100 && (
          <div className="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
            Showing first 100 results — use search to narrow down.
          </div>
        )}
      </div>
    </div>
  );
}
