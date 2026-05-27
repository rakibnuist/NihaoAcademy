"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  KeyRound,
  Loader2,
  User,
} from "lucide-react";
import { toast } from "sonner";

import { completeProfile } from "./actions";
import { courses } from "@/lib/courses";

const DEGREE_OPTIONS = [
  "SSC", "Dakhil", "O Level",
  "HSC", "Alim", "A Level",
  "Bachelor", "Diploma", "Others",
];

const GENDER_OPTIONS = [
  { value: "male",             label: "Male" },
  { value: "female",           label: "Female" },
  { value: "other",            label: "Other" },
  { value: "prefer_not_to_say",label: "Prefer not to say" },
];

type Step = 1 | 2 | 3 | 4;

const STEPS = [
  { id: 1, label: "Personal",  icon: User },
  { id: 2, label: "Password",  icon: KeyRound },
  { id: 3, label: "Courses",   icon: BookOpen },
  { id: 4, label: "Education", icon: GraduationCap },
];

export default function ProfileSetupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);

  // Form state
  const [fullName, setFullName]               = useState("");
  const [gender, setGender]                   = useState("");
  const [password, setPassword]               = useState("");
  const [confirmPw, setConfirmPw]             = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [eduDegree, setEduDegree]             = useState("");
  const [eduYear, setEduYear]                 = useState("");
  const [eduGrade, setEduGrade]               = useState("");
  const [intMajor, setIntMajor]               = useState("");

  function toggleCourse(slug: string) {
    setSelectedCourses((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  }

  function canProceed(): boolean {
    if (step === 1) return fullName.trim().length >= 2 && gender !== "";
    if (step === 2) {
      if (!password) return true; // password is optional
      return password.length >= 8 && password === confirmPw;
    }
    if (step === 3) return selectedCourses.length > 0;
    return true;
  }

  async function handleSubmit() {
    setLoading(true);
    const fd = new FormData();
    fd.append("full_name", fullName);
    fd.append("gender", gender);
    if (password) fd.append("password", password);
    selectedCourses.forEach((c) => fd.append("interested_courses", c));
    if (eduDegree)  fd.append("edu_degree", eduDegree);
    if (eduYear)    fd.append("edu_passing_year", eduYear);
    if (eduGrade)   fd.append("edu_grade", eduGrade);
    if (intMajor)   fd.append("interested_major", intMajor);

    const result = await completeProfile(fd);
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile complete! Welcome to NiHao Academy 🎉");
      router.push("/student/dashboard");
      router.refresh();
    }
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors";
  const labelCls = "block text-sm font-semibold mb-1.5";

  return (
    <div className="min-h-dvh bg-secondary/30 flex items-start justify-center py-12 px-4">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-4">
            Welcome to NiHao Academy
          </div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">
            Complete your profile
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Takes less than 2 minutes · Helps us personalise your experience
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, idx) => {
            const done    = s.id < step;
            const current = s.id === step;
            const Icon = s.icon;
            return (
              <div key={s.id} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 flex-1 ${current ? "opacity-100" : done ? "opacity-100" : "opacity-40"}`}>
                  <div className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                    done    ? "bg-emerald-500 text-white"
                    : current ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                  }`}>
                    {done ? <CheckCircle2 className="size-4" /> : <Icon className="size-3.5" />}
                  </div>
                  <span className={`hidden sm:block text-xs font-semibold ${current ? "text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <ChevronRight className="size-4 text-muted-foreground/40 shrink-0 mx-1" />
                )}
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-card ring-1 ring-foreground/10 shadow-lg overflow-hidden">
          {/* Card header accent */}
          <div className="h-1.5 bg-gradient-to-r from-primary via-brand-red to-brand-gold" />

          <div className="p-6 sm:p-8 space-y-6">

            {/* ── Step 1: Personal ──────────────────────────────────────── */}
            {step === 1 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-heading text-xl font-semibold">Personal information</h2>
                  <p className="mt-1 text-sm text-muted-foreground">Your name and gender — required.</p>
                </div>

                <div>
                  <label className={labelCls}>Full name *</label>
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="e.g. Rakib Abdullah"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoFocus
                  />
                </div>

                <div>
                  <label className={labelCls}>Gender *</label>
                  <div className="grid grid-cols-2 gap-3">
                    {GENDER_OPTIONS.map((g) => (
                      <button
                        key={g.value}
                        type="button"
                        onClick={() => setGender(g.value)}
                        className={`rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all text-left ${
                          gender === g.value
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        {g.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 2: Password ──────────────────────────────────────── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-heading text-xl font-semibold">Set a password</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Optional but recommended — lets you sign in with email + password next time.
                  </p>
                </div>

                <div className="rounded-xl bg-secondary/60 px-4 py-3 text-xs text-muted-foreground">
                  💡 Without a password you can always sign in via magic link sent to your email.
                </div>

                <div>
                  <label className={labelCls}>Password <span className="font-normal text-muted-foreground">(optional)</span></label>
                  <input
                    type="password"
                    className={inputCls}
                    placeholder="Min. 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                  />
                </div>

                {password && (
                  <div>
                    <label className={labelCls}>Confirm password *</label>
                    <input
                      type="password"
                      className={inputCls}
                      placeholder="Repeat your password"
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      autoComplete="new-password"
                    />
                    {confirmPw && password !== confirmPw && (
                      <p className="mt-1.5 text-xs text-destructive">Passwords don&apos;t match</p>
                    )}
                    {confirmPw && password === confirmPw && (
                      <p className="mt-1.5 text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="size-3" /> Passwords match
                      </p>
                    )}
                  </div>
                )}

                {/* Password strength */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      {[1,2,3,4].map((i) => {
                        const strength = password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? 4
                          : password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password) ? 3
                          : password.length >= 8 ? 2 : 1;
                        return (
                          <div key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i <= strength
                              ? strength >= 4 ? "bg-emerald-500"
                                : strength >= 3 ? "bg-primary"
                                : strength >= 2 ? "bg-brand-gold"
                                : "bg-brand-red"
                              : "bg-secondary"
                          }`} />
                        );
                      })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {password.length < 8 ? "Too short"
                        : password.length >= 12 && /[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password) ? "Strong password 💪"
                        : password.length >= 10 ? "Good password"
                        : "Acceptable — add uppercase & numbers for stronger"}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 3: Courses ───────────────────────────────────────── */}
            {step === 3 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-heading text-xl font-semibold">Interested courses</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Select at least one — helps us show you relevant content.
                  </p>
                </div>

                <div className="space-y-3">
                  {courses.map((c) => {
                    const selected = selectedCourses.includes(c.slug);
                    return (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => toggleCourse(c.slug)}
                        className={`w-full rounded-xl border-2 px-4 py-3.5 text-left transition-all ${
                          selected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className={`text-sm font-semibold ${selected ? "text-primary" : ""}`}>
                              {c.name}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                              {c.tagline}
                            </p>
                          </div>
                          <div className={`mt-0.5 size-5 shrink-0 rounded-full border-2 flex items-center justify-center transition-colors ${
                            selected ? "border-primary bg-primary" : "border-border"
                          }`}>
                            {selected && <CheckCircle2 className="size-3 text-white" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {selectedCourses.length > 0 && (
                  <p className="text-xs text-emerald-600 font-medium">
                    ✓ {selectedCourses.length} course{selectedCourses.length > 1 ? "s" : ""} selected
                  </p>
                )}
              </div>
            )}

            {/* ── Step 4: Education ─────────────────────────────────────── */}
            {step === 4 && (
              <div className="space-y-5">
                <div>
                  <h2 className="font-heading text-xl font-semibold">Education background</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    All fields are optional — helps instructors understand your level.
                  </p>
                </div>

                <div>
                  <label className={labelCls}>Last completed degree</label>
                  <div className="grid grid-cols-3 gap-2">
                    {DEGREE_OPTIONS.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setEduDegree(d === eduDegree ? "" : d)}
                        className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                          eduDegree === d
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border hover:border-primary/40 text-muted-foreground"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Passing year</label>
                    <input
                      type="number"
                      className={inputCls}
                      placeholder="e.g. 2023"
                      min={1990}
                      max={new Date().getFullYear()}
                      value={eduYear}
                      onChange={(e) => setEduYear(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Final grade / GPA</label>
                    <input
                      type="text"
                      className={inputCls}
                      placeholder="e.g. 5.00 / A+"
                      value={eduGrade}
                      onChange={(e) => setEduGrade(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Interested major / field of study</label>
                  <input
                    type="text"
                    className={inputCls}
                    placeholder="e.g. Computer Science, Medicine, Business..."
                    value={intMajor}
                    onChange={(e) => setIntMajor(e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* ── Navigation ───────────────────────────────────────────── */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-border">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s - 1) as Step)}
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
                >
                  ← Back
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((s) => (s + 1) as Step)}
                  disabled={!canProceed()}
                  className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continue →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="rounded-xl bg-brand-red px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-red/90 disabled:opacity-60 flex items-center gap-2"
                >
                  {loading ? (
                    <><Loader2 className="size-4 animate-spin" /> Saving…</>
                  ) : (
                    "Complete profile →"
                  )}
                </button>
              )}
            </div>

            {/* Step 4 skip option */}
            {step === 4 && !loading && (
              <p className="text-center text-xs text-muted-foreground -mt-2">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  Skip education details and finish
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          You can update your profile anytime from{" "}
          <span className="font-semibold">Settings → Profile</span>
        </p>
      </div>
    </div>
  );
}
