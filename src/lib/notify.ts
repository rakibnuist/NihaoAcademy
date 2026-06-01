/**
 * Multi-channel notification dispatcher.
 *
 *   • WhatsApp via Meta Cloud API   (free tier: 1,000 utility convos/month)
 *   • Email via Resend              (free tier: ~3,000 emails/month)
 *   • In-app via Supabase           (always free, always-on baseline)
 *
 * Each adapter is env-gated — if credentials are missing it logs and returns a
 * soft success, so dev/preview deploys keep working without configuration.
 *
 * Server-only (imports the Supabase server client). Call from server actions,
 * route handlers, or cron endpoints.
 *
 * Env vars (set in Hostinger hPanel → Node.js → Environment):
 *   WHATSAPP_PHONE_NUMBER_ID  · WHATSAPP_ACCESS_TOKEN  · WHATSAPP_API_VERSION (optional, default v20.0)
 *   RESEND_API_KEY            · RESEND_FROM_EMAIL (optional, default noreply@eduexpress.info)
 */

import { createClient } from "@/lib/supabase/server";

export type NotifyChannel = "whatsapp" | "email" | "inapp";

export interface NotifyRecipient {
  /** Required for in-app delivery. */
  studentId?: string;
  /** E.164 (or 01XXX… — auto-normalised). Required for WhatsApp. */
  phone?: string | null;
  /** Required for email. */
  email?: string | null;
}

export interface NotifyMessage {
  /** Stable category, e.g. "missed_class", "payment_received". Used for filtering. */
  kind: string;
  title: string;
  body: string;
  /** Optional deep link, e.g. /student/courses/all-star-csca/lessons/<id> */
  link?: string;
}

export interface NotifyResult {
  delivered: NotifyChannel[];
  skipped: NotifyChannel[];
  failed: { channel: NotifyChannel; error: string }[];
}

const DEFAULT_CHANNELS: NotifyChannel[] = ["whatsapp", "email", "inapp"];

/** Normalise "01xxxxxxxxx" / "8801xxxxxxxxx" / "+8801xxxxxxxxx" → "8801xxxxxxxxx". */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("01") && digits.length === 11) return `880${digits.slice(1)}`;
  if (digits.startsWith("880")) return digits;
  return digits;
}

/* ── Adapters ──────────────────────────────────────────────────────────── */

async function sendWhatsApp(phone: string, m: NotifyMessage): Promise<true | string> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const apiVersion = process.env.WHATSAPP_API_VERSION ?? "v20.0";
  if (!token || !phoneId) {
    console.info(`[notify/whatsapp] (skipped — no creds) → ${phone}: ${m.title}`);
    return true; // soft success in dev
  }

  const text = `*${m.title}*\n\n${m.body}${m.link ? `\n\n${m.link}` : ""}`;

  try {
    const res = await fetch(`https://graph.facebook.com/${apiVersion}/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to: normalisePhone(phone),
        type: "text",
        text: { body: text },
      }),
    });
    if (res.ok) return true;
    const err = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    return err.error?.message ?? `WhatsApp HTTP ${res.status}`;
  } catch (e) {
    return e instanceof Error ? e.message : "WhatsApp network error";
  }
}

async function sendEmail(to: string, m: NotifyMessage): Promise<true | string> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "NiHao Academy <noreply@eduexpress.info>";
  if (!key) {
    console.info(`[notify/email] (skipped — no creds) → ${to}: ${m.title}`);
    return true; // soft success in dev
  }

  const safeBody = m.body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");

  const html = `<!doctype html><html><body style="font-family:-apple-system,Segoe UI,sans-serif;line-height:1.5;padding:24px;max-width:560px;margin:0 auto;color:#111">
<h2 style="margin:0 0 12px">${m.title}</h2>
<p>${safeBody}</p>
${m.link ? `<p><a href="${m.link}" style="display:inline-block;padding:10px 18px;background:#c8332a;color:#fff;text-decoration:none;border-radius:8px;font-weight:600">Open</a></p>` : ""}
<p style="margin-top:32px;color:#888;font-size:12px">NiHao Academy · 你好学院</p>
</body></html>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject: m.title, html }),
    });
    if (res.ok) return true;
    const err = (await res.json().catch(() => ({}))) as { message?: string };
    return err.message ?? `Resend HTTP ${res.status}`;
  } catch (e) {
    return e instanceof Error ? e.message : "Email network error";
  }
}

async function createInApp(studentId: string, m: NotifyMessage): Promise<true | string> {
  try {
    const supabase = await createClient(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase.from("notifications") as any).insert({
      student_id: studentId,
      kind:       m.kind,
      title:      m.title,
      body:       m.body,
      link:       m.link ?? null,
    });
    return error ? error.message : true;
  } catch (e) {
    return e instanceof Error ? e.message : "DB error";
  }
}

/* ── Public API ────────────────────────────────────────────────────────── */

/**
 * Send a notification across one or more channels. Never throws — returns a
 * per-channel breakdown so callers can log / retry selectively.
 */
export async function notify(
  recipient: NotifyRecipient,
  message: NotifyMessage,
  channels: NotifyChannel[] = DEFAULT_CHANNELS
): Promise<NotifyResult> {
  const result: NotifyResult = { delivered: [], skipped: [], failed: [] };

  for (const channel of channels) {
    if (channel === "whatsapp") {
      if (!recipient.phone) { result.skipped.push(channel); continue; }
      const r = await sendWhatsApp(recipient.phone, message);
      r === true ? result.delivered.push(channel) : result.failed.push({ channel, error: r });
    } else if (channel === "email") {
      if (!recipient.email) { result.skipped.push(channel); continue; }
      const r = await sendEmail(recipient.email, message);
      r === true ? result.delivered.push(channel) : result.failed.push({ channel, error: r });
    } else if (channel === "inapp") {
      if (!recipient.studentId) { result.skipped.push(channel); continue; }
      const r = await createInApp(recipient.studentId, message);
      r === true ? result.delivered.push(channel) : result.failed.push({ channel, error: r });
    }
  }

  return result;
}

/**
 * Send the same message to a student and (optionally) their guardian.
 * - Student: in-app + WhatsApp + email
 * - Guardian: WhatsApp only (we don't have guardian email, and they're unlikely
 *   to have a student account for in-app)
 */
export async function notifyStudentAndGuardian(
  student: {
    id: string;
    phone: string | null;
    email: string | null;
    guardian_phone: string | null;
    notify_guardian: boolean;
  },
  message: NotifyMessage
): Promise<{ student: NotifyResult; guardian: NotifyResult | null }> {
  const studentResult = await notify(
    { studentId: student.id, phone: student.phone, email: student.email },
    message
  );

  let guardianResult: NotifyResult | null = null;
  if (student.notify_guardian && student.guardian_phone) {
    guardianResult = await notify(
      { phone: student.guardian_phone },
      message,
      ["whatsapp"]
    );
  }

  return { student: studentResult, guardian: guardianResult };
}
