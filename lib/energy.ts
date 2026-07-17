/**
 * Energy economy: charges, streaks, rate limiting.
 */

import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import {
  ENERGY_BASE_CHARGES,
  ENERGY_STREAK_BONUS,
  ENERGY_DECAY_DAYS,
  ENERGY_SOFT_CAP,
  PHILO_DAILY_AI_QUERIES_FREE,
  PHILO_DAILY_AI_QUERIES_PREMIUM,
  AI_QUERY_RATE_LIMIT_WINDOW_SECONDS,
} from "@/lib/config";

export interface EnergyStatus {
  balance: number;
  streakLength: number;
  isPremium: boolean;
  dailyQueriesRemaining: number;
  lastResetAt: string;
}

export async function getEnergyStatus(userId: string): Promise<EnergyStatus> {
  const supabase = await createSupabaseServer();

  const { data: energy } = await supabase
    .from("energy_charges")
    .select("*")
    .eq("user_id", userId)
    .single();

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .single();

  const isPremium = sub && typeof sub === "object" && "status" in sub
    ? sub.status === "active"
    : false;

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count } = await supabase
    .from("usage_events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("event_type", "ai_query")
    .gte("created_at", todayStart.toISOString());

  const dailyLimit = isPremium
    ? PHILO_DAILY_AI_QUERIES_PREMIUM
    : PHILO_DAILY_AI_QUERIES_FREE;

  return {
    balance: (energy && typeof energy === "object" && "balance" in energy ? (energy as Record<string, unknown>).balance as number : 0),
    streakLength: (energy && typeof energy === "object" && "streak_length" in energy ? (energy as Record<string, unknown>).streak_length as number : 0),
    isPremium,
    dailyQueriesRemaining: Math.max(0, dailyLimit - (count ?? 0)),
    lastResetAt: (energy && typeof energy === "object" && "last_reset_at" in energy
      ? (energy as Record<string, unknown>).last_reset_at as string
      : new Date().toISOString()),
  };
}

export async function initializeEnergyIfNeeded(userId: string): Promise<void> {
  const supabase = await createSupabaseServer();

  const { data } = await supabase
    .from("energy_charges")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!data) {
    await supabase.from("energy_charges").insert({
      user_id: userId,
      balance: ENERGY_BASE_CHARGES,
      streak_length: 0,
      last_reset_at: new Date().toISOString(),
    } as any);
  }
}

export async function applyDailyCheckin(userId: string): Promise<EnergyStatus> {
  const supabase = await createSupabaseServer();
  await initializeEnergyIfNeeded(userId);

  const { data: energy } = await supabase
    .from("energy_charges")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!energy) throw new Error("Energy charges not found");

  const raw = energy as Record<string, unknown>;
  const now = new Date();
  const lastReset = new Date(raw.last_reset_at as string);
  const daysSinceReset = Math.floor(
    (now.getTime() - lastReset.getTime()) / (1000 * 60 * 60 * 24)
  );

  let newBalance = raw.balance as number;
  let newStreak = raw.streak_length as number;

  if (daysSinceReset >= ENERGY_DECAY_DAYS) {
    newStreak = daysSinceReset === ENERGY_DECAY_DAYS ? newStreak + 1 : 1;
    newBalance = Math.min(
      ENERGY_SOFT_CAP,
      newBalance + ENERGY_BASE_CHARGES + newStreak * ENERGY_STREAK_BONUS
    );

    await supabase
      .from("energy_charges")
      .update({
        balance: newBalance,
        streak_length: newStreak,
        last_reset_at: now.toISOString(),
        updated_at: now.toISOString(),
      } as any)
      .eq("user_id", userId);
  }

  return getEnergyStatus(userId);
}

export async function spendCharge(
  userId: string,
  amount: number = 1
): Promise<boolean> {
  const supabase = await createSupabaseServer();

  const { data: energy } = await supabase
    .from("energy_charges")
    .select("balance")
    .eq("user_id", userId)
    .single();

  if (!energy) return false;
  const balance = (energy as Record<string, unknown>).balance as number;
  if (balance < amount) return false;

  await supabase
    .from("energy_charges")
    .update({
      balance: balance - amount,
      updated_at: new Date().toISOString(),
    } as any)
    .eq("user_id", userId);

  return true;
}

export async function recordUsageEvent(
  userId: string,
  eventType: string,
  resourceId?: string
): Promise<void> {
  const supabase = await createSupabaseServer();
  await supabase.from("usage_events").insert({
    user_id: userId,
    event_type: eventType,
    resource_id: resourceId ?? null,
  } as any);
}

export async function checkRateLimit(
  userId: string,
  eventType: string,
  windowSeconds: number = AI_QUERY_RATE_LIMIT_WINDOW_SECONDS,
  maxEvents: number = 5
): Promise<boolean> {
  const supabase = await createSupabaseServer();
  const windowStart = new Date(
    Date.now() - windowSeconds * 1000
  ).toISOString();

  const { count } = await supabase
    .from("usage_events")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("event_type", eventType)
    .gte("created_at", windowStart);

  return (count ?? 0) < maxEvents;
}
