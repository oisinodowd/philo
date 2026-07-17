import Link from "next/link";
import { ArrowLeft, Search, Filter, SlidersHorizontal, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const metadata = {
  title: "Philosophers — Sophy",
};

// Static philosopher data for scaffold
const PHILOSOPHERS = [
  {
    slug: "thomas-aquinas",
    name: "Saint Thomas Aquinas",
    tradition: "Scholastic",
    category: "Theology",
    birthYear: 1225,
    deathYear: 1274,
    worksCount: 3,
    bioShort:
      "Doctor Angelicus — Dominican friar, philosopher, and theologian whose synthesis of Aristotelian philosophy with Christian doctrine defined scholasticism.",
  },
];

export default function SophyPage() {
  return (
    <div className="container py-6 md:py-10 max-w-4xl animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/philo">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="font-serif text-2xl md:text-3xl font-bold">
            Philosophers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sophy &mdash; Love of Wisdom
          </p>
        </div>
      </div>

      {/* Search and filters */}
      <div className="space-y-4 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search philosophers by name..."
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Time Period
          </Button>
          <Button variant="outline" size="sm">
            Tradition
          </Button>
          <Button variant="outline" size="sm">
            Category
          </Button>
        </div>
      </div>

      {/* Philosopher list */}
      <div className="space-y-4">
        {PHILOSOPHERS.map((phil) => (
          <Link
            key={phil.slug}
            href={`/philo/sophy/${phil.slug}`}
            className="scholar-card block group hover:border-primary/30 transition-all duration-200"
          >
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="font-serif text-lg font-bold text-primary">
                  {phil.name[0]}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif text-lg font-semibold group-hover:text-primary transition-colors">
                  {phil.name}
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
                  {phil.bioShort}
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                    {phil.tradition}
                  </span>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium">
                    {phil.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {phil.birthYear}&ndash;{phil.deathYear}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {phil.worksCount} works
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Empty state for future philosophers */}
      <div className="mt-12 p-8 rounded-lg border bg-card/30 text-center">
        <p className="text-sm text-muted-foreground">
          More philosophers will be added to the corpus soon. Subscribe to
          premium for early access to new additions.
        </p>
      </div>
    </div>
  );
}
