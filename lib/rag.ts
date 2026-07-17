/**
 * RAG pipeline: embedding → vector search → GPT generation with refusal gate.
 */

import { getOpenAI, EMBEDDING_MODEL, CHAT_MODEL } from "@/lib/openai";
import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import { PHILO_REFUSAL_COSINE_THRESHOLD } from "@/lib/config";
import { z } from "zod";

const AIResponseSchema = z.object({
  answer: z.string(),
  citations: z.array(
    z.object({
      work: z.string(),
      chapter: z.string(),
      offset: z.number(),
      text: z.string(),
    })
  ),
  related: z.array(
    z.object({
      philosopher: z.string(),
      work: z.string(),
      reason: z.string(),
    })
  ),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

export async function embedText(text: string): Promise<number[]> {
  const openai = getOpenAI();
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
  });
  return response.data[0].embedding;
}

interface RAGResult {
  id: string;
  content: string;
  workTitle: string;
  chapterTitle: string;
  passageOffset: number;
  similarity: number;
}

export async function retrievePassages(
  query: string,
  philosopherId: string,
  limit: number = 8
): Promise<RAGResult[]> {
  const supabase = await createSupabaseServer();
  const embedding = await embedText(query);

  const { data, error } = await supabase.rpc("match_passages", {
    query_embedding: embedding,
    match_count: limit,
    filter_philosopher_id: philosopherId,
  });

  if (error) throw new Error(`Vector search failed: ${error.message}`);

  return ((data ?? []) as unknown[]).map((row: unknown) => {
    const r = row as Record<string, unknown>;
    return {
      id: r.id as string,
      content: r.content as string,
      workTitle: r.work_title as string,
      chapterTitle: r.chapter_title as string,
      passageOffset: r.passage_offset as number,
      similarity: r.similarity as number,
    };
  });
}

export function buildContextString(passages: RAGResult[]): string {
  return passages
    .map(
      (p, i) =>
        `[Passage ${i + 1}] ${p.workTitle}, ${p.chapterTitle}, §${p.passageOffset}\n${p.content}`
    )
    .join("\n\n");
}

export async function askPhilosopher(
  question: string,
  philosopherName: string,
  systemPrompt: string,
  passages: RAGResult[]
): Promise<AIResponse> {
  const maxSimilarity = Math.max(...passages.map((p) => p.similarity), 0);

  if (maxSimilarity < PHILO_REFUSAL_COSINE_THRESHOLD) {
    return {
      answer:
        "I have not written on this topic in the works available to me. Please consult related passages or ask about another subject within my corpus.",
      citations: [],
      related: [],
    };
  }

  const context = buildContextString(passages);
  const openai = getOpenAI();

  const response = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content: `${systemPrompt}\n\nAvailable passages from the corpus:\n${context}`,
      },
      { role: "user", content: question },
    ],
    response_format: { type: "json_object" },
    temperature: 0.3,
    max_tokens: 2000,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("No response from AI");

  try {
    const parsed = JSON.parse(raw);
    return AIResponseSchema.parse(parsed);
  } catch {
    return {
      answer: raw,
      citations: [],
      related: [],
    };
  }
}
