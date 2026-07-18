"use client";

import type { Chapter } from "@/lib/data";

interface Props {
  chapters: Chapter[];
  currentChapterId: string;
  currentPassageOffset: number;
  philosopherSlug: string;
  workId: string;
}

export function ChapterNav({
  chapters,
  currentChapterId,
}: Props) {
  if (chapters.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        No chapters available yet.
      </p>
    );
  }

  return (
    <div className="space-y-0.5">
      {chapters.map((ch) => {
        const isActive = ch.id === currentChapterId;
        return (
          <div
            key={ch.id}
            className={`w-full flex flex-col items-start text-xs py-2 px-3 rounded-md transition-colors ${
              isActive
                ? "bg-secondary text-secondary-foreground"
                : "text-muted-foreground"
            }`}
          >
            <span className="font-medium">
              Ch. {ch.chapterNumber}
            </span>
            <span className="text-[10px] opacity-70 line-clamp-1">
              {ch.title}
            </span>
            <span className="text-[10px] opacity-70">
              {ch.passageCount} passage{ch.passageCount !== 1 ? "s" : ""}
            </span>
          </div>
        );
      })}
    </div>
  );
}
