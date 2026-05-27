import type { Metadata } from "next";
import {
  BookOpen,
  GraduationCap,
  TrendingUp,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/admin/stats-card";
import { courses } from "@/lib/courses";
import type { Enrollment, Student } from "@/types/database";

type StudentRow = Pick<Student, "id" | "full_name" | "phone" | "status" | "created_at">;
type EnrollmentRow = Pick<Enrollment, "id" | "status" | "fee_status" | "enrolled_at"> & {
  students: { full_name: string } | null;
  batches: { name: string; course_slug: string } | null;
};

export const metadata: Metadata = { title: "Dashboard · Admin" };

export default async function AdminDashboardPage() {
  const supabase = await createClient(true); // service-role

  // Parallel data fetches
  const [
    { count: totalStudents },
    { count: activeBatches },
    { count: pendingEnrollments },
    { count: paidThisMonth },
    { data: rawStudents },
    { data: rawEnrollments },
  ] = await Promise.all([
    supabase.from("students").select("*", { count: "exact", head: true }),
    supabase.from("batches").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("enrollments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase
      .from("payments")
      .select("*", { count: "exact", head: true })
      .eq("status", "success")
      .gte("paid_at", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase
      .from("students")
      .select("id, full_name, phone, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("enrollments")
      .select("id, status, fee_status, enrolled_at, students(full_name), batches(name, course_slug)")
      .order("enrolled_at", { ascending: false })
      .limit(5),
  ]);

  const recentStudents = rawStudents as StudentRow[] | null;
  const recentEnrollments = rawEnrollments as EnrollmentRow[] | null;

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <p className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-red uppercase">
          Control tower
        </p>
        <h1 className="mt-1 font-heading text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          label="Total students"
          value={totalStudents ?? 0}
          sub="all time"
          icon={Users}
          accent="blue"
        />
        <StatsCard
          label="Active batches"
          value={activeBatches ?? 0}
          sub={`across ${courses.length} courses`}
          icon={BookOpen}
          accent="gold"
        />
        <StatsCard
          label="Pending enrollments"
          value={pendingEnrollments ?? 0}
          sub="awaiting confirmation"
          icon={GraduationCap}
          accent="red"
        />
        <StatsCard
          label="Payments this month"
          value={paidThisMonth ?? 0}
          sub="successful transactions"
          icon={TrendingUp}
          accent="green"
        />
      </div>

      {/* Two-column tables */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent students */}
        <div className="rounded-xl bg-card ring-1 ring-foreground/10">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-heading text-base font-semibold">
              Recent students
            </h2>
            <a
              href="/admin/students"
              className="text-xs font-semibold text-brand-red hover:underline"
            >
              View all
            </a>
          </div>
          <div className="divide-y divide-border">
            {recentStudents && recentStudents.length > 0 ? (
              recentStudents.map((s) => (
                <div key={s.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <div className="text-sm font-medium">{s.full_name}</div>
                    <div className="text-xs text-muted-foreground">{s.phone}</div>
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      s.status === "active"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {s.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No students yet — enrollments will appear here.
              </div>
            )}
          </div>
        </div>

        {/* Recent enrollments */}
        <div className="rounded-xl bg-card ring-1 ring-foreground/10">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="font-heading text-base font-semibold">
              Recent enrollments
            </h2>
            <a
              href="/admin/enrollments"
              className="text-xs font-semibold text-brand-red hover:underline"
            >
              View all
            </a>
          </div>
          <div className="divide-y divide-border">
            {recentEnrollments && recentEnrollments.length > 0 ? (
              recentEnrollments.map((e) => {
                const student = e.students as { full_name: string } | null;
                const batch = e.batches as { name: string; course_slug: string } | null;
                return (
                  <div key={e.id} className="flex items-center justify-between gap-2 px-5 py-3">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {student?.full_name ?? "—"}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        {batch?.name ?? "—"}
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          e.status === "active"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : e.status === "pending"
                            ? "bg-brand-gold/20 text-[oklch(0.45_0.11_70)]"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {e.status}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          e.fee_status === "paid"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : e.fee_status === "partial"
                            ? "bg-primary/10 text-primary"
                            : "bg-brand-red/10 text-brand-red"
                        }`}
                      >
                        {e.fee_status}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="px-5 py-8 text-center text-sm text-muted-foreground">
                No enrollments yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
