import { Bell, Megaphone } from "lucide-react";
import type { Announcement } from "@/types/database";

interface AnnouncementsListProps {
  announcements: Pick<Announcement, "id" | "title" | "body" | "created_at">[];
}

export function AnnouncementsList({ announcements }: AnnouncementsListProps) {
  if (announcements.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-xl bg-card px-5 py-8 text-center ring-1 ring-foreground/10">
        <Bell className="size-8 text-muted-foreground/40" />
        <p className="mt-3 text-sm font-medium">No announcements</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Updates from your instructors will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl bg-card ring-1 ring-foreground/10">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-5 py-3">
        <Megaphone className="size-3.5 text-muted-foreground" />
        <span className="font-mono text-[10px] font-semibold tracking-[0.14em] uppercase">
          Announcements
        </span>
        <span className="ml-auto flex size-5 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white">
          {announcements.length}
        </span>
      </div>

      {/* Items */}
      <div className="flex-1 divide-y divide-border overflow-y-auto">
        {announcements.map((a) => (
          <div key={a.id} className="px-5 py-4">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-semibold leading-snug">{a.title}</p>
              <time className="shrink-0 font-mono text-[10px] text-muted-foreground">
                {new Date(a.created_at).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                })}
              </time>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
