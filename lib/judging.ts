/**
 * Judging pipeline: 5-persona AI panel for debate scoring.
 */

import { getOpenAI, CHAT_MODEL } from "@/lib/openai";
import { PHILO_JUDGE_PRIMARY_WEIGHT } from "@/lib/config";
import { z } from "zod";

const JudgeScoreSchema = z.object({
  section_id: z.string(),
  score_a: z.number().min(0).max(10),
  score_b: z.number().min(0).max(10),
  reasoning_short: z.string(),
  reasoning_full: z.string().optional(),
});

export type JudgeScore = z.infer<typeof JudgeScoreSchema>;

export const JUDGE_PERSONAS = [
  {
    id: "formal_logician",
    name: "Formal Logician",
    prompt:
      "You are a formal logician. Score debates purely on logical validity, soundness, and absence of fallacies. Be rigorous and precise.",
  },
  {
    id: "thomist",
    name: "Thomist",
    prompt:
      "You are a Thomist philosopher. Score debates based on scholastic rigor, appeal to first principles, and alignment with natural law reasoning.",
  },
  {
    id: "utilitarian",
    name: "Utilitarian",
    prompt:
      "You are a utilitarian ethicist. Score debates based on consequence analysis, maximization of well-being, and pragmatic argumentation.",
  },
  {
    id: "analytic_skeptic",
    name: "Analytic Skeptic",
    prompt:
      "You are an analytic skeptic. Score debates based on clarity of definitions, burden of proof, and resistance to unwarranted assumptions.",
  },
  {
    id: "dialectical_rhetorician",
    name: "Dialectical Rhetorician",
    prompt:
      "You are a dialectical rhetorician. Score debates based on persuasive structure, rhetorical effectiveness, and dialectical progression.",
  },
];

interface DebateSection {
  id: string;
  title: string;
  textA: string;
  textB: string;
  primaryPersona: string;
}

export async function judgeSection(
  section: DebateSection,
  topic: string
): Promise<JudgeScore[]> {
  const openai = getOpenAI();

  const results = await Promise.all(
    JUDGE_PERSONAS.map(async (persona) => {
      const response = await openai.chat.completions.create({
        model: CHAT_MODEL,
        messages: [
          { role: "system", content: persona.prompt },
          {
            role: "user",
            content: `Topic: ${topic}\n\nDebater A (${section.title}):\n${section.textA}\n\nDebater B (${section.title}):\n${section.textB}\n\nScore both debaters 0–10. Return JSON: { "section_id": "${section.id}", "score_a": number, "score_b": number, "reasoning_short": "brief", "reasoning_full": "detailed analysis" }`,
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 800,
      });

      const raw = response.choices[0]?.message?.content;
      if (!raw) {
        return {
          section_id: section.id,
          score_a: 5,
          score_b: 5,
          reasoning_short: `${persona.name} failed to respond.`,
        } as JudgeScore;
      }

      try {
        const parsed = JSON.parse(raw);
        return { ...JudgeScoreSchema.parse(parsed), persona: persona.id };
      } catch {
        return {
          section_id: section.id,
          score_a: 5,
          score_b: 5,
          reasoning_short: `${persona.name}: parse error`,
        } as JudgeScore & { persona: string };
      }
    })
  );

  return results;
}

export interface AggregatedScore {
  totalA: number;
  totalB: number;
  sections: {
    sectionId: string;
    scoreA: number;
    scoreB: number;
    winner: "a" | "b" | "tie";
    breakdowns: JudgeScore[];
  }[];
}

export function aggregateScores(
  scores: (JudgeScore & { persona?: string })[],
  sections: DebateSection[]
): AggregatedScore {
  const sectionMap = new Map<string, (JudgeScore & { persona?: string })[]>();

  for (const s of scores) {
    const list = sectionMap.get(s.section_id) ?? [];
    list.push(s);
    sectionMap.set(s.section_id, list);
  }

  const sectionResults: AggregatedScore["sections"] = [];

  for (const section of sections) {
    const sectionScores = sectionMap.get(section.id) ?? [];
    let weightedA = 0;
    let weightedB = 0;
    let totalWeight = 0;

    for (const s of sectionScores) {
      const personaWeight =
        s.persona === section.primaryPersona
          ? PHILO_JUDGE_PRIMARY_WEIGHT
          : 1.0;
      weightedA += s.score_a * personaWeight;
      weightedB += s.score_b * personaWeight;
      totalWeight += personaWeight;
    }

    const scoreA = totalWeight > 0 ? weightedA / totalWeight : 0;
    const scoreB = totalWeight > 0 ? weightedB / totalWeight : 0;
    const winner =
      scoreA > scoreB + 0.5 ? "a" : scoreB > scoreA + 0.5 ? "b" : "tie";

    sectionResults.push({
      sectionId: section.id,
      scoreA: Math.round(scoreA * 100) / 100,
      scoreB: Math.round(scoreB * 100) / 100,
      winner,
      breakdowns: sectionScores as JudgeScore[],
    });
  }

  return {
    totalA: sectionResults.reduce((s, r) => s + r.scoreA, 0),
    totalB: sectionResults.reduce((s, r) => s + r.scoreB, 0),
    sections: sectionResults,
  };
}
