"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { Philosopher } from "@/lib/data";

interface Props {
  philosopher: Philosopher;
}

export function PhilosopherCard({ philosopher }: Props) {
  return (
    <Link
      href={`/philo/sophy/${philosopher.slug}`}
      className="scholar-card block group hover:border-primary/30 transition-all duration-200 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
          <span className="font-serif text-lg font-bold text-primary">
            {philosopher.name[0]}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-serif text-base font-semibold group-hover:text-primary transition-colors line-clamp-1">
            {philosopher.name}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
            {philosopher.bioShort}
          </p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {philosopher.tradition && (
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                {philosopher.tradition}
              </span>
            )}
            {philosopher.category && (
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                {philosopher.category}
              </span>
            )}
            {(philosopher.birthYear || philosopher.deathYear) && (
              <span className="text-xs text-muted-foreground">
                {philosopher.birthYear}
                {philosopher.deathYear ? `–${philosopher.deathYear}` : "–present"}
              </span>
            )}
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {philosopher.worksCount} work{philosopher.worksCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
