import Link from "next/link";
import { ChevronRight, ClipboardList, Eye, EyeOff, Layers, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import type { MockTest } from "@/types/database";

export const metadata = { title: "Mock Tests · Admin" };

const SUBJECT_LABELS: Record<string, string> = {
  math:      "Mathematics",
  physics:   "Physics",
  chemistry: "Chemistry",
  chinese:   "Chinese",
};

const SUBJECT_ICONS: Record<string, string> = {
  math:      "∑",
  physics:   "⚡",
  chemistry: "⚗",
  chinese:   "中",
};

export default async function AdminMockTestsPage() {
  const supabase = await createClient(true);

  const { data: testsRaw } = await supabase
    .from("mock_tests")
    .select("*")
    .order("subject")
    .order("sort_order");

  const tests = (testsRaw ?? []) as MockTest[];

  // Count questions per test
  const { data: qcountRaw } = await supabase
    .from("mock_questions")
    .select("test_id");

  const qcountMap: Record<string, number> = {};
  for (const q of qcountRaw ?? []) {
    qcountMap[(q as { test_id: string }).test_id] =
      (qcountMap[(q as { test_id: string }).test_id] ?? 0) + 1;
  }

  // Group by subject
  const grouped = tests.reduce<Record<string, MockTest[]>>((acc, t) => {
    (acc[t.subject] ??= []).push(t);
    return acc;
  }, {});

  const subjects = Object.keys(grouped).sort();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Mock Tests</h1>
          <p className="text-sm text-muted-foreground">
            Manage test templates and question banks.
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total tests",     value: tests.length },
          { label: "Active tests",    value: tests.filter((t) => t.is_active).length },
          { label: "Total questions", value: Object.values(qcountMap).reduce((s, v) => s + v, 0) },
          { label: "Subjects",        value: subjects.length },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4">
            <p className="text-2xl font-bold tabular-nums">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tests by subject */}
      {subjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border p-16 text-center">
          <ClipboardList className="mx-auto size-10 text-muted-foreground/40" />
          <p className="mt-3 text-muted-foreground">
            No mock tests yet. Run the Phase 3 migration to create the
            seed templates.
          </p>
        </div>
      ) : (
        subjects.map((subject) => (
          <div key={subject} className="rounded-2xl border border-border bg-card overflow-hidden">
            <div className="flex items-center gap-3 border-b border-border bg-secondary/30 px-5 py-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
                {SUBJECT_ICONS[subject] ?? "?"}
              </span>
              <h2 className="font-semibold">
                {SUBJECT_LABELS[subject] ?? subject}
              </h2>
              <span className="ml-auto text-xs text-muted-foreground">
                {grouped[subject].length} test{grouped[subject].length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="divide-y divide-border">
              {grouped[subject].map((test) => {
                const qCount = qcountMap[test.id] ?? 0;
                const pct = test.question_count > 0
                  ? Math.round((qCount / test.question_count) * 100)
                  : 0;
                return (
                  <Link
                    key={test.id}
                    href={`/admin/mock-tests/${test.id}`}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors"
                  >
                    {/* Active badge */}
                    <span
                      className={cn(
                        "shrink-0 flex size-7 items-center justify-center rounded-full",
                        test.is_active
                          ? "bg-emerald-100 text-emerald-600"
                          : "bg-secondary text-muted-foreground"
                      )}
                      title={test.is_active ? "Active" : "Hidden"}
                    >
                      {test.is_active ? (
                        <Eye className="size-3.5" />
                      ) : (
                        <EyeOff className="size-3.5" />
                      )}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{test.title}</p>
                      {test.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {test.description}
                        </p>
                      )}
                    </div>

                    {/* Question fill bar */}
                    <div className="hidden sm:flex items-center gap-2 min-w-[120px]">
                      <div className="flex-1 h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            pct === 100 ? "bg-emerald-500" : pct > 0 ? "bg-amber-400" : "bg-border"
                          )}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
                        {qCount}/{test.question_count}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Layers className="size-3.5" />
                      {test.duration_minutes}m
                    </div>

                    <ChevronRight className="size-4 text-muted-foreground/40 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
