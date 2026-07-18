import Link from "next/link";
import type { RelatedPhilosopher } from "@/lib/data";

interface Props {
  related: RelatedPhilosopher[];
}

export function RelatedPhilosopherRow({ related }: Props) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
      {related.map((r) => (
        <Link
          key={r.id}
          href={`/philo/sophy/${r.slug}`}
          className="scholar-card shrink-0 w-52 hover:border-primary/30 transition-all duration-200"
        >
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="font-serif text-sm font-bold text-primary">
                {r.name[0]}
              </span>
            </div>
            <div className="min-w-0">
              <h4 className="font-serif text-sm font-semibold truncate">
                {r.name}
              </h4>
              <p className="text-xs text-muted-foreground">
                {r.relationType}
              </p>
              {r.tradition && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {r.tradition}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
