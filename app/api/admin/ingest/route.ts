/**
 * Admin ingest route — service-role gated.
 */

import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { embedText } from "@/lib/rag";
import { z } from "zod";
import { createHash } from "node:crypto";

const IngestManifestSchema = z.object({
  philosopher_slug: z.string(),
  works: z.array(
    z.object({
      title: z.string(),
      title_original: z.string().optional(),
      year_written: z.number().optional(),
      language: z.string().default("en"),
      source_url: z.string().optional(),
      chapters: z.array(
        z.object({
          chapter_number: z.number(),
          title: z.string(),
          passages: z.array(
            z.object({
              passage_offset: z.number(),
              content: z.string().min(1),
            })
          ),
        })
      ),
    })
  ),
});

// Helper to read a row's id safely
function rowId(row: unknown): string | null {
  if (!row || typeof row !== "object") return null;
  const r = row as Record<string, unknown>;
  return (r.id as string) ?? null;
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const manifest = IngestManifestSchema.parse(body);

    const supabase = createAdminClient();

    const { data: philosopher } = await supabase
      .from("philosophers")
      .select("id")
      .eq("slug", manifest.philosopher_slug)
      .single();

    const philId = rowId(philosopher);
    if (!philId) {
      return NextResponse.json(
        { error: `Philosopher not found: ${manifest.philosopher_slug}` },
        { status: 404 }
      );
    }

    const results = {
      worksCreated: 0,
      chaptersCreated: 0,
      passagesCreated: 0,
      embeddingsGenerated: 0,
      duplicatesSkipped: 0,
    };

    for (const work of manifest.works) {
      // Upsert work
      const { data: workRow } = await supabase
        .from("works")
        .upsert(
          {
            philosopher_id: philId,
            title: work.title,
            title_original: work.title_original ?? null,
            year_written: work.year_written ?? null,
            language: work.language,
            source_url: work.source_url ?? null,
            published: false,
          } as any,
          { onConflict: "philosopher_id,title" }
        )
        .select("id")
        .single();

      const wid = rowId(workRow) ??
        rowId(
          (
            await supabase
              .from("works")
              .select("id")
              .eq("philosopher_id", philId)
              .eq("title", work.title)
              .single()
          ).data
        );

      if (!wid) continue;
      results.worksCreated++;

      for (const chapter of work.chapters) {
        const { data: chapterRow } = await supabase
          .from("chapters")
          .upsert(
            {
              work_id: wid,
              chapter_number: chapter.chapter_number,
              title: chapter.title,
            } as any,
            { onConflict: "work_id,chapter_number" }
          )
          .select("id")
          .single();

        const cid = rowId(chapterRow) ??
          rowId(
            (
              await supabase
                .from("chapters")
                .select("id")
                .eq("work_id", wid)
                .eq("chapter_number", chapter.chapter_number)
                .single()
            ).data
          );

        if (!cid) continue;
        results.chaptersCreated++;

        for (const passage of chapter.passages) {
          const contentHash = createHash("sha256")
            .update(passage.content)
            .digest("hex");

          // Dedupe
          const { data: duplicate } = await supabase
            .from("passages")
            .select("id")
            .eq("work_id", wid)
            .eq("passage_offset", passage.passage_offset)
            .eq("content_hash", contentHash)
            .maybeSingle();

          if (duplicate) {
            results.duplicatesSkipped++;
            continue;
          }

          const { data: passageRow } = await supabase
            .from("passages")
            .insert({
              work_id: wid,
              chapter_id: cid,
              passage_offset: passage.passage_offset,
              content: passage.content,
              content_hash: contentHash,
              published: false,
            } as any)
            .select("id")
            .single();

          const pid = rowId(passageRow);
          if (!pid) continue;
          results.passagesCreated++;

          try {
            const embedding = await embedText(passage.content);
            await supabase
              .from("passages")
              .update({ embedding } as any)
              .eq("id", pid);
            results.embeddingsGenerated++;
          } catch {
            // Retry later
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Ingest complete. Awaiting human review before publish.",
      results,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid manifest", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Ingest failed", details: String(error) },
      { status: 500 }
    );
  }
}
