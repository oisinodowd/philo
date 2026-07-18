"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRADITIONS = [
  "Analytic", "Continental", "Scholastic", "Islamic",
  "Indian", "Chinese", "African",
];

const CATEGORIES = [
  "Epistemology", "Metaphysics", "Theology", "Ethics",
  "Logic", "Aesthetics", "Political", "Natural Philosophy",
];

const SORTS: { value: string; label: string }[] = [
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "birth_asc", label: "Oldest first" },
  { value: "birth_desc", label: "Newest first" },
  { value: "works_desc", label: "Most works" },
];

interface Props {
  selectedTraditions?: string[];
  selectedCategories?: string[];
  birthFrom?: number;
  birthTo?: number;
  sort?: string;
  hasActiveFilters: boolean;
  currentSearch?: string;
}

export function FilterBar({
  selectedTraditions = [],
  selectedCategories = [],
  birthFrom,
  birthTo,
  sort,
  hasActiveFilters,
  currentSearch,
}: Props) {
  const router = useRouter();

  const toggleParam = (
    key: string,
    value: string,
    current: string[]
  ): string => {
    const params = new URLSearchParams();
    // Preserve search
    if (currentSearch) params.set("q", currentSearch);
    // Preserve sort
    if (sort) params.set("sort", sort);
    // Preserve from/to
    if (birthFrom !== undefined) params.set("from", String(birthFrom));
    if (birthTo !== undefined) params.set("to", String(birthTo));

    const existing = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];

    existing.forEach((v) => params.append(key, v));

    // Preserve the other filter type
    if (key === "tradition") {
      selectedCategories.forEach((c) => params.append("category", c));
    } else {
      selectedTraditions.forEach((t) => params.append("tradition", t));
    }

    return params.toString();
  };

  const setSort = (newSort: string): string => {
    const params = new URLSearchParams();
    if (currentSearch) params.set("q", currentSearch);
    params.set("sort", newSort);
    selectedTraditions.forEach((t) => params.append("tradition", t));
    selectedCategories.forEach((c) => params.append("category", c));
    if (birthFrom !== undefined) params.set("from", String(birthFrom));
    if (birthTo !== undefined) params.set("to", String(birthTo));
    return params.toString();
  };

  return (
    <div className="space-y-3 mb-6">
      {/* Sort + clear */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Sort:
        </span>
        <select
          className="text-xs border rounded-md px-2 py-1.5 bg-background"
          value={sort ?? "name_asc"}
          onChange={(e) => {
            router.push(`/philo/sophy?${setSort(e.target.value)}`);
          }}
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <Button variant="ghost" size="sm" className="text-xs h-7" asChild>
            <Link href="/philo/sophy">
              <X className="h-3 w-3 mr-1" />
              Clear filters
            </Link>
          </Button>
        )}
      </div>

      {/* Tradition checkboxes */}
      <div>
        <span className="text-xs text-muted-foreground block mb-1.5">Tradition:</span>
        <div className="flex flex-wrap gap-1.5">
          {TRADITIONS.map((t) => {
            const active = selectedTraditions.includes(t);
            return (
              <Link
                key={t}
                href={`/philo/sophy?${toggleParam("tradition", t, selectedTraditions)}`}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-muted"
                }`}
              >
                {t}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Category checkboxes */}
      <div>
        <span className="text-xs text-muted-foreground block mb-1.5">Category:</span>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => {
            const active = selectedCategories.includes(c);
            return (
              <Link
                key={c}
                href={`/philo/sophy?${toggleParam("category", c, selectedCategories)}`}
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs transition-colors ${
                  active
                    ? "bg-primary text-primary-foreground border-primary"
                    : "hover:bg-muted"
                }`}
              >
                {c}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
