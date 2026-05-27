"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { courses } from "@/lib/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  fullName: z.string().trim().min(2, "Please enter your full name"),
  phone: z
    .string()
    .trim()
    .min(6, "Please enter a valid phone number")
    .regex(/^[0-9+\-\s()]+$/, "Please enter a valid phone number"),
  email: z
    .string()
    .trim()
    .optional()
    .refine(
      (v) => !v || /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v),
      "Please enter a valid email"
    ),
  course: z.string().min(1, "Please choose a course"),
  division: z.enum(["live", "recorded"]),
  message: z.string().trim().optional(),
});

type Values = z.infer<typeof schema>;

const fieldBase =
  "h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50";

export function EnrollForm({ defaultCourse = "" }: { defaultCourse?: string }) {
  const resolvedSlug = courses.some((c) => c.slug === defaultCourse) ? defaultCourse : "";
  const initialCourse = courses.find((c) => c.slug === resolvedSlug);
  const initialDivision = initialCourse?.divisions[0] ?? "live";

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      course: resolvedSlug,
      division: initialDivision,
      message: "",
    },
  });

  // Watch the selected course to update division options dynamically
  const selectedSlug = useWatch({ control, name: "course" });
  const selectedCourse = courses.find((c) => c.slug === selectedSlug);
  const availableDivisions = selectedCourse?.divisions ?? ["live", "recorded"];

  // When course changes, reset division to the first available for that course
  React.useEffect(() => {
    if (selectedCourse) {
      setValue("division", selectedCourse.divisions[0]);
    }
  }, [selectedSlug, selectedCourse, setValue]);

  async function onSubmit(values: Values) {
    // No backend yet — simulate a successful reservation.
    await new Promise((r) => setTimeout(r, 700));
    const chosen = courses.find((c) => c.slug === values.course);
    toast.success("Seat reserved!", {
      description: `We'll call you within 24 hours to confirm your ${
        chosen?.shortName ?? "course"
      } enrollment (${values.division === "live" ? "Live" : "Recorded"} division).`,
    });
    reset({
      fullName: "",
      phone: "",
      email: "",
      course: values.course,
      division: values.division,
      message: "",
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            className="h-9"
            placeholder="e.g. Tahmina Akter"
            aria-invalid={!!errors.fullName}
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (WhatsApp)</Label>
          <Input
            id="phone"
            type="tel"
            className="h-9"
            placeholder="+880 1XXX-XXXXXX"
            aria-invalid={!!errors.phone}
            {...register("phone")}
          />
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">
          Email <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Input
          id="email"
          type="email"
          className="h-9"
          placeholder="you@example.com"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="course">Course</Label>
          <select
            id="course"
            className={cn(fieldBase, errors.course && "border-destructive")}
            aria-invalid={!!errors.course}
            {...register("course")}
          >
            <option value="">Choose a route…</option>
            {courses.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.shortName}
              </option>
            ))}
          </select>
          {errors.course && (
            <p className="text-sm text-destructive">{errors.course.message}</p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="division">Division</Label>
          <select
            id="division"
            className={fieldBase}
            aria-label="Select division"
            {...register("division")}
          >
            {availableDivisions.map((d) => (
              <option key={d} value={d}>
                {d === "live" ? "Live classes (Zoom)" : "Recorded (self-paced)"}
              </option>
            ))}
          </select>
          {selectedCourse && availableDivisions.length === 1 && (
            <p className="text-xs text-muted-foreground">
              {availableDivisions[0] === "recorded"
                ? "This course is recorded-only — start any time."
                : "This course is live-only via Zoom."}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">
          Anything we should know?{" "}
          <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="message"
          rows={3}
          placeholder="Your current level, goals, preferred batch timing…"
          {...register("message")}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="h-11 w-full bg-brand-red text-brand-red-foreground hover:bg-brand-red/90"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="animate-spin" />
            Reserving your seat…
          </>
        ) : (
          <>
            Reserve my seat
            <ArrowRight />
          </>
        )}
      </Button>

      <p className="text-center text-xs text-muted-foreground">
        By reserving, you agree to be contacted by NiHao Academy about your
        enrollment. No payment is taken now.
      </p>
    </form>
  );
}
