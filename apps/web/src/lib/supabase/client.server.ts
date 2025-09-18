import { createClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

export const supabaseServer = () =>
  createClient(env.url, env.anon, {
    auth: { persistSession: false }
  });

export const supabaseAdmin = () => {
  if (!env.service) throw new Error("Service role ausente (server-only)");
  return createClient(env.url, env.service);
};
