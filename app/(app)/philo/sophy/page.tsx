import Link from "next/link";
import { ArrowLeft, Search, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPhilosophers } from "@/lib/data";
import { PhilosopherCard } from "@/components/study/philosopher-card";
import { FilterBar } from "@/components/study/filter-bar";

export const metadata = {
  title: "Philosophers — Sophy",
  description: "Browse and search the complete library of philosophers in the Philo corpus.",
};

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SophyPage({ searchParams }: Props) {
  const sp = await searchParams;

  const search = typeof sp.q === "string" ? sp.q : undefined;
  const sort = typeof sp.sort === "string" ? sp.sort : undefined;
  const traditions = typeof sp.tradition === "string"
    ? sp.tradition.split(",").filter(Boolean)
    : undefined;
  const categories = typeof sp.category === "string"
    ? sp.category.split(",").filter(Boolean)
    : undefined;
  const birthFrom = typeof sp.from === "string" ? parseInt(sp.from, 10) : undefined;
  const birthTo = typeof sp.to === "string" ? parseInt(sp.to, 10) : undefined;
  const page = typeof sp.page === "string" ? parseInt(sp.page, 10) || 1 : 1;

  const limit = 24;
  const offset = (page - 1) * limit;

  const { philosophers, total } = await getPhilosophers({
    search,
    traditions,
    categories,
    birthFrom: isNaN(birthFrom as number) ? undefined : birthFrom,
    birthTo: isNaN(birthTo as number) ? undefined : birthTo,
    sort: sort as any,
    limit,
    offset,
  });

  const totalPages = Math.ceil(total / limit);
  const hasActiveFilters = !!(search || traditions?.length || categories?.length || birthFrom || birthTo);

  return (
    <div className="container py-6 md:py-10 max-w-5xl animate-fade-in">
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
            {total > 0 && (
              <span className="ml-2 text-xs">
                &middot; {total} philosopher{total !== 1 ? "s" : ""} in the corpus
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Search */}
      <form className="relative mb-4" method="GET">
        {/* Preserve existing filters as comma-separated hidden inputs */}
        {sort && <input type="hidden" name="sort" value={sort} />}
        {traditions && traditions.length > 0 && (
          <input type="hidden" name="tradition" value={traditions.join(",")} />
        )}
        {categories && categories.length > 0 && (
          <input type="hidden" name="category" value={categories.join(",")} />
        )}
        {birthFrom !== undefined && <input type="hidden" name="from" value={birthFrom} />}
        {birthTo !== undefined && <input type="hidden" name="to" value={birthTo} />}

        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          name="q"
          placeholder="Search philosophers by name..."
          className="pl-10"
          defaultValue={search ?? ""}
        />
      </form>

      {/* Filter bar */}
      <FilterBar
        selectedTraditions={traditions}
        selectedCategories={categories}
        birthFrom={birthFrom}
        birthTo={birthTo}
        sort={sort}
        hasActiveFilters={hasActiveFilters}
        currentSearch={search}
      />

      {/* Results */}
      {philosophers.length === 0 ? (
        <div className="mt-12 p-12 rounded-lg border bg-card/30 text-center">
          <BookOpen className="h-10 w-10 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-serif text-lg font-semibold mb-1">No philosophers found</h3>
          <p className="text-sm text-muted-foreground">
            {hasActiveFilters
              ? "Try adjusting your filters or search query."
              : "The corpus is empty. Ingest content via the admin panel to get started."}
          </p>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" className="mt-4" asChild>
              <Link href="/philo/sophy">Clear all filters</Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {philosophers.map((phil) => (
              <PhilosopherCard key={phil.id} philosopher={phil} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {page > 1 && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/philo/sophy?${buildPaginationQuery(sp, page - 1)}`}
                  >
                    Previous
                  </Link>
                </Button>
              )}
              <span className="text-sm text-muted-foreground px-4">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={`/philo/sophy?${buildPaginationQuery(sp, page + 1)}`}
                  >
                    Next
                  </Link>
                </Button>
              )}
            </div>
          )}

          {/* Premium teaser */}
          <div className="mt-12 p-8 rounded-lg border bg-card/30 text-center">
            <p className="text-sm text-muted-foreground">
              More philosophers are added to the corpus regularly. Subscribe to
              premium for early access to new additions and unlimited AI tutor queries.
            </p>
          </div>
        </>
      )}
    </div>
  );
}

/** Build query string for pagination, preserving all current params except page */
function buildPaginationQuery(
  sp: { [key: string]: string | string[] | undefined },
  newPage: number
): string {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(sp)) {
    if (key === "page") continue;
    if (Array.isArray(val)) {
      val.forEach((v) => params.append(key, v));
    } else if (val !== undefined) {
      params.set(key, val);
    }
  }
  params.set("page", String(newPage));
  return params.toString();
}
