/**
 * Supabase admin client — uses service role key directly.
 * Bypasses RLS. ONLY use in server-side code (API routes, server actions).
 * Loosely typed to avoid conflicts with dynamic upsert/insert patterns.
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export function createAdminClient(): SupabaseClient<any, "public", any> {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
