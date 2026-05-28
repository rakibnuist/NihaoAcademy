/**
 * SMS dispatch (provider-agnostic).
 *
 * Currently supports SSL Wireless (the standard Bangladeshi gateway, the one
 * the dev guide names for M11). If credentials are absent the dispatcher
 * gracefully no-ops with a console log, so the rest of the app keeps working
 * in local dev / preview deploys.
 *
 * Required env vars (set in Hostinger hPanel → Node.js → Environment):
 *   SSL_WIRELESS_API_TOKEN   issued by SSL Wireless after onboarding
 *   SSL_WIRELESS_SID         your approved sender ID
 *   SSL_WIRELESS_ENDPOINT    optional; defaults to v3 send-sms endpoint
 */

const ENDPOINT =
  process.env.SSL_WIRELESS_ENDPOINT ??
  "https://smsplus.sslwireless.com/api/v3/send-sms";

export interface SmsRequest {
  /** E.164 (e.g. +8801XXXXXXXXX). The dispatcher normalises non-E.164 forms. */
  to: string;
  body: string;
  /** Optional client-supplied dedupe id (csms_id). Auto-generated if absent. */
  ref?: string;
}

export interface SmsResult {
  ok: boolean;
  /** "sent" | "skipped" | "failed" — useful for logging without throwing. */
  status: "sent" | "skipped" | "failed";
  /** Provider message id when available. */
  providerId?: string;
  error?: string;
}

function isConfigured(): boolean {
  return Boolean(process.env.SSL_WIRELESS_API_TOKEN && process.env.SSL_WIRELESS_SID);
}

/** Convert "01xxxxxxxxx" / "8801xxxxxxxxx" to "+8801xxxxxxxxx". */
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (raw.startsWith("+")) return `+${digits}`;
  if (digits.startsWith("01") && digits.length === 11) return `+880${digits.slice(1)}`;
  if (digits.startsWith("880") && digits.length === 13) return `+${digits}`;
  return `+${digits}`;
}

/**
 * Send a single SMS. Never throws on provider failure — returns a result so
 * the caller can decide whether to retry or just log.
 */
export async function sendSms(req: SmsRequest): Promise<SmsResult> {
  if (!req.to || !req.body) {
    return { ok: false, status: "failed", error: "Missing recipient or body" };
  }

  const msisdn = normalisePhone(req.to);

  if (!isConfigured()) {
    // Soft fail in dev / preview — log what we would have sent.
    console.info(
      `[sms] (skipped — no SSL Wireless creds) → ${msisdn}: ${req.body}`
    );
    return { ok: true, status: "skipped" };
  }

  const csms_id = req.ref ?? `nh-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_token: process.env.SSL_WIRELESS_API_TOKEN,
        sid: process.env.SSL_WIRELESS_SID,
        msisdn,
        sms: req.body,
        csms_id,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      status?: string;
      status_code?: number;
      smsinfo?: { sms_status?: string; reference_id?: string }[];
      error_message?: string;
    };

    const okStatus =
      res.ok &&
      (data.status === "SUCCESS" ||
        data.status_code === 200 ||
        data.smsinfo?.[0]?.sms_status === "DELIVRD");

    if (okStatus) {
      return {
        ok: true,
        status: "sent",
        providerId: data.smsinfo?.[0]?.reference_id ?? csms_id,
      };
    }

    return {
      ok: false,
      status: "failed",
      error: data.error_message ?? `SSL Wireless HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      ok: false,
      status: "failed",
      error: err instanceof Error ? err.message : "Network error",
    };
  }
}

/**
 * Send the same message to multiple recipients. Returns a result per recipient.
 * Use this for student + guardian notifications.
 */
export async function sendSmsBatch(
  recipients: string[],
  body: string,
  refPrefix?: string
): Promise<SmsResult[]> {
  const unique = Array.from(new Set(recipients.filter(Boolean)));
  return Promise.all(
    unique.map((to, i) =>
      sendSms({ to, body, ref: refPrefix ? `${refPrefix}-${i}` : undefined })
    )
  );
}
