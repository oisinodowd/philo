/**
 * Study data-fetching layer.
 * All functions are server-only — use in async Server Components
 * and Route Handlers. Returns typed objects from the database.
 */

import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Database } from "@/types/database";

// ─── Derived types ────────────────────────────────────────────────

type PhilosopherRow = Database["public"]["Tables"]["philosophers"]["Row"];
type WorkRow = Database["public"]["Tables"]["works"]["Row"];
type ChapterRow = Database["public"]["Tables"]["chapters"]["Row"];
type PassageRow = Database["public"]["Tables"]["passages"]["Row"];
type PhilosopherRelationRow = Database["public"]["Tables"]["philosopher_relations"]["Row"];

export interface Philosopher {
  id: string;
  slug: string;
  name: string;
  nameNative: string | null;
  birthYear: number | null;
  deathYear: number | null;
  tradition: string | null;
  category: string | null;
  bioShort: string | null;
  bioFull: string | null;
  avatarUrl: string | null;
  published: boolean;
  worksCount: number;
}

export interface Work {
  id: string;
  philosopherId: string;
  title: string;
  titleOriginal: string | null;
  yearWritten: number | null;
  language: string | null;
  sourceUrl: string | null;
  published: boolean;
  chapterCount: number;
}

export interface Chapter {
  id: string;
  workId: string;
  workTitle: string;
  philosopherSlug: string;
  chapterNumber: number;
  title: string;
  passageCount: number;
}

export interface PassageWithContext {
  id: string;
  workId: string;
  chapterId: string;
  workTitle: string;
  chapterTitle: string;
  philosopherSlug: string;
  philosopherName: string;
  passageOffset: number;
  content: string;
  contentHash: string;
  published: boolean;
  anchor: string;
}

export interface RelatedPhilosopher {
  id: string;
  slug: string;
  name: string;
  relationType: string;
  tradition: string | null;
  category: string | null;
}

export interface PhilosopherDetail extends Philosopher {
  nameNative: string | null;
  bioFull: string | null;
  systemPrompt: string | null;
  works: Work[];
  related: RelatedPhilosopher[];
}

// ─── Shape helpers ────────────────────────────────────────────────

function shapePhilosopher(row: PhilosopherRow, worksCount: number): Philosopher {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    nameNative: row.name_native,
    birthYear: row.birth_year,
    deathYear: row.death_year,
    tradition: row.tradition,
    category: row.category,
    bioShort: row.bio_short,
    bioFull: row.bio_full,
    avatarUrl: row.avatar_url,
    published: row.published,
    worksCount,
  };
}

function shapeWork(row: WorkRow, chapterCount: number): Work {
  return {
    id: row.id,
    philosopherId: row.philosopher_id,
    title: row.title,
    titleOriginal: row.title_original,
    yearWritten: row.year_written,
    language: row.language,
    sourceUrl: row.source_url,
    published: row.published,
    chapterCount,
  };
}

// ─── Core queries ─────────────────────────────────────────────────

/**
 * List all published philosophers, with optional filters and sorting.
 */
export async function getPhilosophers(opts?: {
  search?: string;
  traditions?: string[];
  categories?: string[];
  birthFrom?: number;
  birthTo?: number;
  sort?: "name_asc" | "name_desc" | "birth_asc" | "birth_desc" | "works_desc";
  limit?: number;
  offset?: number;
}): Promise<{ philosophers: Philosopher[]; total: number }> {
  const supabase = await createClient();

  let query = supabase
    .from("philosophers")
    .select("*", { count: "exact", head: false })
    .eq("published", true);

  // Fuzzy name search (pg_trgm)
  if (opts?.search) {
    query = query.ilike("name", `%${opts.search}%`);
  }

  // Filter: traditions (OR within, AND against other filter types)
  if (opts?.traditions && opts.traditions.length > 0) {
    query = query.in("tradition", opts.traditions);
  }

  // Filter: categories
  if (opts?.categories && opts.categories.length > 0) {
    query = query.in("category", opts.categories);
  }

  // Filter: birth year range
  if (opts?.birthFrom !== undefined) {
    query = query.gte("birth_year", opts.birthFrom);
  }
  if (opts?.birthTo !== undefined) {
    query = query.lte("birth_year", opts.birthTo);
  }

  // Sorting
  switch (opts?.sort) {
    case "name_desc":
      query = query.order("name", { ascending: false });
      break;
    case "birth_asc":
      query = query.order("birth_year", { ascending: true });
      break;
    case "birth_desc":
      query = query.order("birth_year", { ascending: false });
      break;
    case "works_desc":
      // Sort by works count handled post-query
      query = query.order("name", { ascending: true });
      break;
    default:
      query = query.order("name", { ascending: true });
  }

  // Pagination
  const finalLimit = opts?.limit ?? 24;
  const finalOffset = opts?.offset ?? 0;
  query = query.range(finalOffset, finalOffset + finalLimit - 1);

  const { data, count, error } = await query;
  if (error) throw new Error(`Failed to fetch philosophers: ${error.message}`);

  const rows = (data ?? []) as PhilosopherRow[];

  // Fetch works counts for each philosopher
  const philosopherIds = rows.map((r) => r.id);
  const { data: workCounts } = await supabase
    .from("works")
    .select("philosopher_id")
    .in("philosopher_id", philosopherIds)
    .eq("published", true);

  const countMap = new Map<string, number>();
  (workCounts ?? []).forEach((w) => {
    const pid = w.philosopher_id;
    countMap.set(pid, (countMap.get(pid) ?? 0) + 1);
  });

  let philosophers = rows.map((r) =>
    shapePhilosopher(r, countMap.get(r.id) ?? 0)
  );

  // If sorting by works count, sort post-query
  if (opts?.sort === "works_desc") {
    philosophers.sort((a, b) => b.worksCount - a.worksCount);
  }

  return { philosophers, total: count ?? 0 };
}

/**
 * Get a single philosopher by slug, including works and related philosophers.
 * Throws notFound() if missing.
 */
export async function getPhilosopherBySlug(
  slug: string
): Promise<PhilosopherDetail> {
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("philosophers")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!row) notFound();

  const r = row as PhilosopherRow;

  // Works with chapter counts
  const { data: workRows } = await supabase
    .from("works")
    .select("*")
    .eq("philosopher_id", r.id)
    .eq("published", true)
    .order("year_written", { ascending: true });

  const works: Work[] = [];
  if (workRows) {
    for (const wr of workRows as WorkRow[]) {
      const { count: cc } = await supabase
        .from("chapters")
        .select("*", { count: "exact", head: true })
        .eq("work_id", wr.id);
      works.push(shapeWork(wr, cc ?? 0));
    }
  }

  // Related philosophers — two-query approach to avoid FK name guessing
  const { data: relRows } = await supabase
    .from("philosopher_relations")
    .select("relation_type, related_philosopher_id")
    .eq("philosopher_id", r.id);

  const relatedIds = (relRows ?? []).map((rel) => rel.related_philosopher_id);
  const { data: relatedPhilos } = await supabase
    .from("philosophers")
    .select("id, slug, name, tradition, category")
    .in("id", relatedIds);

  const relatedMap = new Map(
    (relatedPhilos ?? []).map((p) => [p.id, p])
  );

  const related: RelatedPhilosopher[] = (relRows ?? [])
    .map((rel) => {
      const rp = relatedMap.get(rel.related_philosopher_id);
      if (!rp) return null;
      return {
        id: rp.id,
        slug: rp.slug,
        name: rp.name,
        relationType: rel.relation_type,
        tradition: rp.tradition,
        category: rp.category,
      };
    })
    .filter(Boolean) as RelatedPhilosopher[];

  return {
    ...shapePhilosopher(r, works.length),
    nameNative: r.name_native,
    bioFull: r.bio_full,
    systemPrompt: r.system_prompt,
    works,
    related,
  };
}

/**
 * Get a single philosopher by ID (not slug).
 */
export async function getPhilosopherById(id: string): Promise<Philosopher> {
  const supabase = await createClient();

  const { data: row } = await supabase
    .from("philosophers")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) notFound();

  const r = row as PhilosopherRow;

  const { count: wc } = await supabase
    .from("works")
    .select("*", { count: "exact", head: true })
    .eq("philosopher_id", r.id)
    .eq("published", true);

  return shapePhilosopher(r, wc ?? 0);
}

// ─── Works & chapters ─────────────────────────────────────────────

/**
 * Get all published works for a philosopher (by ID).
 */
export async function getWorks(philosopherId: string): Promise<Work[]> {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("works")
    .select("*")
    .eq("philosopher_id", philosopherId)
    .eq("published", true)
    .order("year_written", { ascending: true });

  if (!rows) return [];

  const works: Work[] = [];
  for (const wr of rows as WorkRow[]) {
    const { count: cc } = await supabase
      .from("chapters")
      .select("*", { count: "exact", head: true })
      .eq("work_id", wr.id);
    works.push(shapeWork(wr, cc ?? 0));
  }
  return works;
}

/**
 * Get all chapters for a work, ordered by chapter number.
 */
export async function getChapters(workId: string): Promise<Chapter[]> {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("chapters")
    .select(
      "*, works!inner(id, title, philosopher_id, philosophers!inner(slug))"
    )
    .eq("work_id", workId)
    .eq("works.published", true)
    .order("chapter_number", { ascending: true });

  if (!rows) return [];

  const chapters: Chapter[] = [];
  for (const ch of rows) {
    const work = (ch as any).works as { title: string; philosophers: { slug: string } } | null;
    const { count: pc } = await supabase
      .from("passages")
      .select("*", { count: "exact", head: true })
      .eq("chapter_id", ch.id)
      .eq("published", true);

    chapters.push({
      id: ch.id,
      workId: ch.work_id,
      workTitle: work?.title ?? "Unknown",
      philosopherSlug: work?.philosophers?.slug ?? "",
      chapterNumber: ch.chapter_number,
      title: ch.title,
      passageCount: pc ?? 0,
    });
  }
  return chapters;
}

// ─── Passages ─────────────────────────────────────────────────────

/**
 * Get a single passage by ID with full context (work, chapter, philosopher).
 */
export async function getPassage(passageId: string): Promise<PassageWithContext | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("passages")
    .select(
      "*, chapters!inner(id, title, works!inner(id, title, philosopher_id, philosophers!inner(id, slug, name)))"
    )
    .eq("id", passageId)
    .eq("published", true)
    .single();

  if (error || !data) return null;

  const ch = (data as any).chapters as {
    id: string;
    title: string;
    works: {
      id: string;
      title: string;
      philosopher_id: string;
      philosophers: { id: string; slug: string; name: string };
    };
  };

  const p = data as PassageRow;

  return {
    id: p.id,
    workId: p.work_id,
    chapterId: p.chapter_id,
    workTitle: ch.works.title,
    chapterTitle: ch.title,
    philosopherSlug: ch.works.philosophers.slug,
    philosopherName: ch.works.philosophers.name,
    passageOffset: p.passage_offset,
    content: p.content,
    contentHash: p.content_hash,
    published: p.published,
    anchor: `${ch.works.philosophers.slug}:${p.work_id}:${p.chapter_id}:${p.passage_offset}`,
  };
}

/**
 * Get all published passages in a chapter, ordered by offset.
 */
export async function getPassagesByChapter(
  chapterId: string
): Promise<PassageWithContext[]> {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("passages")
    .select(
      "*, chapters!inner(id, title, works!inner(id, title, philosopher_id, philosophers!inner(id, slug, name)))"
    )
    .eq("chapter_id", chapterId)
    .eq("published", true)
    .order("passage_offset", { ascending: true });

  if (!rows) return [];

  return rows.map((data) => {
    const ch = (data as any).chapters as {
      id: string;
      title: string;
      works: {
        id: string;
        title: string;
        philosopher_id: string;
        philosophers: { id: string; slug: string; name: string };
      };
    };
    const p = data as PassageRow;

    return {
      id: p.id,
      workId: p.work_id,
      chapterId: p.chapter_id,
      workTitle: ch.works.title,
      chapterTitle: ch.title,
      philosopherSlug: ch.works.philosophers.slug,
      philosopherName: ch.works.philosophers.name,
      passageOffset: p.passage_offset,
      content: p.content,
      contentHash: p.content_hash,
      published: p.published,
      anchor: `${ch.works.philosophers.slug}:${p.work_id}:${p.chapter_id}:${p.passage_offset}`,
    };
  });
}

/**
 * Get the first passage of the first chapter of a work.
 * Used for "Read" links from the work list.
 */
export async function getFirstPassageOfWork(
  workId: string
): Promise<PassageWithContext | null> {
  const supabase = await createClient();

  // Find the first chapter
  const { data: firstChapter } = await supabase
    .from("chapters")
    .select("id")
    .eq("work_id", workId)
    .order("chapter_number", { ascending: true })
    .limit(1)
    .single();

  if (!firstChapter) return null;

  // Find the first passage in that chapter
  const { data: firstPassage } = await supabase
    .from("passages")
    .select("id")
    .eq("chapter_id", firstChapter.id)
    .eq("published", true)
    .order("passage_offset", { ascending: true })
    .limit(1)
    .single();

  if (!firstPassage) return null;

  return getPassage(firstPassage.id);
}

// ─── Navigation helpers ───────────────────────────────────────────

/**
 * Get the previous passage in reading order (within same work).
 */
export async function getPreviousPassage(
  currentPassageId: string,
  workId: string
): Promise<{ id: string } | null> {
  const supabase = await createClient();

  const current = await getPassage(currentPassageId);
  if (!current) return null;

  // Get ordered list of all passage IDs in this work
  const { data: chapters } = await supabase
    .from("chapters")
    .select("id")
    .eq("work_id", workId)
    .order("chapter_number", { ascending: true });

  if (!chapters) return null;

  const chapterIds = chapters.map((c) => c.id);

  const { data: allPassages } = await supabase
    .from("passages")
    .select("id, chapter_id, passage_offset")
    .in("chapter_id", chapterIds)
    .eq("published", true)
    .order("passage_offset", { ascending: true });

  if (!allPassages) return null;

  // Sort by chapter order then passage offset
  const sorted = allPassages.sort((a, b) => {
    const aIdx = chapterIds.indexOf(a.chapter_id);
    const bIdx = chapterIds.indexOf(b.chapter_id);
    if (aIdx !== bIdx) return aIdx - bIdx;
    return a.passage_offset - b.passage_offset;
  });

  const idx = sorted.findIndex((p) => p.id === currentPassageId);
  if (idx <= 0) return null;
  return { id: sorted[idx - 1].id };
}

/**
 * Get the next passage in reading order (within same work).
 */
export async function getNextPassage(
  currentPassageId: string,
  workId: string
): Promise<{ id: string } | null> {
  const supabase = await createClient();

  const current = await getPassage(currentPassageId);
  if (!current) return null;

  const { data: chapters } = await supabase
    .from("chapters")
    .select("id")
    .eq("work_id", workId)
    .order("chapter_number", { ascending: true });

  if (!chapters) return null;

  const chapterIds = chapters.map((c) => c.id);

  const { data: allPassages } = await supabase
    .from("passages")
    .select("id, chapter_id, passage_offset")
    .in("chapter_id", chapterIds)
    .eq("published", true)
    .order("passage_offset", { ascending: true });

  if (!allPassages) return null;

  const sorted = allPassages.sort((a, b) => {
    const aIdx = chapterIds.indexOf(a.chapter_id);
    const bIdx = chapterIds.indexOf(b.chapter_id);
    if (aIdx !== bIdx) return aIdx - bIdx;
    return a.passage_offset - b.passage_offset;
  });

  const idx = sorted.findIndex((p) => p.id === currentPassageId);
  if (idx === -1 || idx >= sorted.length - 1) return null;
  return { id: sorted[idx + 1].id };
}

// ─── Search ───────────────────────────────────────────────────────

/**
 * Fuzzy search philosophers by name using ilike with pg_trgm support.
 */
export async function searchPhilosophers(
  query: string
): Promise<Philosopher[]> {
  if (!query || query.trim().length < 2) return [];

  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("philosophers")
    .select("*")
    .eq("published", true)
    .ilike("name", `%${query.trim()}%`)
    .limit(12);

  if (!rows) return [];

  const philosopherRows = rows as PhilosopherRow[];
  const ids = philosopherRows.map((r) => r.id);

  // Get works counts
  const { data: workCounts } = await supabase
    .from("works")
    .select("philosopher_id")
    .in("philosopher_id", ids)
    .eq("published", true);

  const countMap = new Map<string, number>();
  (workCounts ?? []).forEach((w) => {
    countMap.set(w.philosopher_id, (countMap.get(w.philosopher_id) ?? 0) + 1);
  });

  return philosopherRows.map((r) => shapePhilosopher(r, countMap.get(r.id) ?? 0));
}

// ─── Related philosophers ─────────────────────────────────────────

export async function getRelatedPhilosophers(
  philosopherId: string
): Promise<RelatedPhilosopher[]> {
  const supabase = await createClient();

  const { data: relRows } = await supabase
    .from("philosopher_relations")
    .select("relation_type, related_philosopher_id")
    .eq("philosopher_id", philosopherId);

  const relatedIds = (relRows ?? []).map((rel) => rel.related_philosopher_id);
  if (relatedIds.length === 0) return [];

  const { data: relatedPhilos } = await supabase
    .from("philosophers")
    .select("id, slug, name, tradition, category")
    .in("id", relatedIds);

  const relatedMap = new Map(
    (relatedPhilos ?? []).map((p) => [p.id, p])
  );

  return (relRows ?? [])
    .map((rel) => {
      const rp = relatedMap.get(rel.related_philosopher_id);
      if (!rp) return null;
      return {
        id: rp.id,
        slug: rp.slug,
        name: rp.name,
        relationType: rel.relation_type,
        tradition: rp.tradition,
        category: rp.category,
      };
    })
    .filter(Boolean) as RelatedPhilosopher[];
}
