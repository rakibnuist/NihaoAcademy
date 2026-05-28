"use client";

import * as React from "react";
import { updateWatchProgress } from "@/app/(student)/actions";

/**
 * Player that automatically tracks watch progress for a lesson and updates
 * `lesson_progress` on the server every ~10 seconds while playing.
 *
 *  - Bunny.net iframe: speaks the Player.js postMessage protocol
 *    (https://github.com/embedly/player.js).
 *  - Direct video file (mp4/m3u8): uses the native <video> timeupdate event.
 *
 * The server action upserts and never decreases the saved percentage, so it's
 * safe to call frequently from any tab.
 */
interface LessonPlayerProps {
  lessonId: string;
  videoUrl: string;
  isBunny: boolean;
  /** Lesson duration in minutes; used as a fallback when the iframe hasn't
   *  reported its duration yet. */
  fallbackDurationMin?: number | null;
}

const UPDATE_INTERVAL_MS = 10_000;

export function LessonPlayer({
  lessonId,
  videoUrl,
  isBunny,
  fallbackDurationMin,
}: LessonPlayerProps) {
  const iframeRef = React.useRef<HTMLIFrameElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);

  // Latest known progress (kept in refs to avoid re-renders during playback).
  const lastSentPctRef = React.useRef<number>(0);
  const currentPctRef = React.useRef<number>(0);
  const lastSendAtRef = React.useRef<number>(0);

  const send = React.useCallback(
    async (pct: number, force = false) => {
      const rounded = Math.max(0, Math.min(100, Math.round(pct)));
      const now = Date.now();
      const dueByTime = now - lastSendAtRef.current >= UPDATE_INTERVAL_MS;
      const dueByJump = rounded - lastSentPctRef.current >= 5;
      if (!force && !dueByTime && !dueByJump) return;
      if (rounded <= lastSentPctRef.current && !force) return;
      lastSendAtRef.current = now;
      lastSentPctRef.current = rounded;
      try {
        await updateWatchProgress(lessonId, rounded);
      } catch {
        // Network blip — next tick will retry; never break playback for this.
      }
    },
    [lessonId]
  );

  // ── Bunny.net iframe: Player.js subscription ────────────────────────────
  React.useEffect(() => {
    if (!isBunny) return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const listenerId = `nh-${Math.random().toString(36).slice(2, 10)}`;
    let durationS =
      fallbackDurationMin && fallbackDurationMin > 0 ? fallbackDurationMin * 60 : 0;

    function post(method: string, value?: string) {
      iframe!.contentWindow?.postMessage(
        {
          context: "player.js",
          version: "0.0.12",
          method,
          value,
          listener: `${listenerId}-${method}-${value ?? ""}`,
        },
        "*"
      );
    }

    function handleMessage(e: MessageEvent) {
      if (e.source !== iframe!.contentWindow) return;
      const data = e.data as
        | { context?: string; event?: string; method?: string; value?: unknown }
        | string
        | null;
      if (!data || typeof data === "string") return;
      if (data.context !== "player.js") return;

      // 1) On ready, subscribe to timeupdate + ended, and ask for duration.
      if (data.event === "ready") {
        post("addEventListener", "timeupdate");
        post("addEventListener", "ended");
        post("getDuration");
        return;
      }

      // 2) timeupdate emits { seconds, duration }.
      if (data.event === "timeupdate" && data.value && typeof data.value === "object") {
        const v = data.value as { seconds?: number; duration?: number };
        const s = v.seconds ?? 0;
        const d = v.duration && v.duration > 0 ? v.duration : durationS;
        if (d > 0) {
          const pct = (s / d) * 100;
          currentPctRef.current = Math.max(currentPctRef.current, pct);
          void send(currentPctRef.current);
        }
        return;
      }

      // 3) ended → mark 100% immediately.
      if (data.event === "ended") {
        currentPctRef.current = 100;
        void send(100, true);
        return;
      }

      // 4) Reply to getDuration().
      if (data.method === "getDuration" && typeof data.value === "number") {
        durationS = data.value;
      }
    }

    window.addEventListener("message", handleMessage);

    // Probe periodically — some iframes don't emit `ready` until we ping them.
    const probe = window.setInterval(() => post("addEventListener", "timeupdate"), 4000);
    const probeStop = window.setTimeout(() => window.clearInterval(probe), 20_000);

    // Flush on unload so a near-complete watch isn't lost.
    function onBeforeUnload() {
      if (currentPctRef.current > lastSentPctRef.current) {
        void send(currentPctRef.current, true);
      }
    }
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.clearInterval(probe);
      window.clearTimeout(probeStop);
    };
  }, [isBunny, fallbackDurationMin, send]);

  // ── Native <video>: timeupdate + ended ─────────────────────────────────
  React.useEffect(() => {
    if (isBunny) return;
    const video = videoRef.current;
    if (!video) return;

    const onTime = () => {
      if (!video.duration || isNaN(video.duration)) return;
      const pct = (video.currentTime / video.duration) * 100;
      currentPctRef.current = Math.max(currentPctRef.current, pct);
      void send(currentPctRef.current);
    };
    const onEnded = () => {
      currentPctRef.current = 100;
      void send(100, true);
    };

    video.addEventListener("timeupdate", onTime);
    video.addEventListener("ended", onEnded);
    return () => {
      video.removeEventListener("timeupdate", onTime);
      video.removeEventListener("ended", onEnded);
    };
  }, [isBunny, send]);

  return (
    <div className="overflow-hidden rounded-xl bg-black ring-1 ring-foreground/10">
      <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
        {isBunny ? (
          <iframe
            ref={iframeRef}
            src={videoUrl}
            className="absolute inset-0 h-full w-full"
            allowFullScreen
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          />
        ) : (
          <video
            ref={videoRef}
            src={videoUrl}
            controls
            className="absolute inset-0 h-full w-full"
          />
        )}
      </div>
    </div>
  );
}
