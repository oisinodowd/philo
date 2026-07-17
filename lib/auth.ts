/**
 * Auth helpers: sign in, sign up, sign out, session management.
 */

import { createClient as createSupabaseServer } from "@/lib/supabase/server";
import { createClient as createSupabaseBrowser } from "@/lib/supabase/client";

export type AuthUser = {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
};

export async function getSessionUser(): Promise<AuthUser | null> {
  const supabase = await createSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("user_id", user.id)
    .single();

  const p = profile as Record<string, unknown> | null;

  return {
    id: user.id,
    email: user.email ?? "",
    displayName: (p?.display_name as string) ?? null,
    avatarUrl: (p?.avatar_url as string) ?? null,
  };
}

/**
 * Server-side sign out. Must be called from a server action or API route.
 * For client-side, use getBrowserSupabase().auth.signOut()
 */
export async function signOut() {
  const supabase = await createSupabaseServer();
  await supabase.auth.signOut();
}

export function getBrowserSupabase() {
  return createSupabaseBrowser();
}
