/**
 * AI tutor chat endpoint with RAG pipeline.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import { retrievePassages, askPhilosopher } from "@/lib/rag";
import {
  getEnergyStatus,
  spendCharge,
  recordUsageEvent,
  checkRateLimit,
} from "@/lib/energy";
import { z } from "zod";

const TutorRequestSchema = z.object({
  philosopher_id: z.string().uuid(),
  question: z.string().min(1).max(2000),
});

export async function POST(request: NextRequest) {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const withinLimit = await checkRateLimit(user.id, "ai_query");
  if (!withinLimit) {
    return NextResponse.json(
      { error: "Rate limit exceeded." },
      { status: 429 }
    );
  }

  const energy = await getEnergyStatus(user.id);
  if (energy.dailyQueriesRemaining <= 0) {
    return NextResponse.json(
      { error: "Daily query limit reached.", energy },
      { status: 429 }
    );
  }

  try {
    const body = await request.json();
    const { philosopher_id, question } = TutorRequestSchema.parse(body);

    const { data: philosopher } = await supabase
      .from("philosophers")
      .select("name, system_prompt")
      .eq("id", philosopher_id)
      .single();

    const phil = philosopher as Record<string, unknown> | null;
    if (!phil || !phil.system_prompt) {
      return NextResponse.json(
        { error: "Philosopher not found or not configured" },
        { status: 404 }
      );
    }

    const passages = await retrievePassages(question, philosopher_id);
    const response = await askPhilosopher(
      question,
      phil.name as string,
      phil.system_prompt as string,
      passages
    );

    await recordUsageEvent(user.id, "ai_query");
    await spendCharge(user.id, 1);

    return NextResponse.json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request", details: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Tutor query failed", details: String(error) },
      { status: 500 }
    );
  }
}
