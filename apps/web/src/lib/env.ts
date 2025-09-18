export const env = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  anon: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  service: process.env.SUPABASE_SERVICE_ROLE_KEY,
  coingecko: process.env.NEXT_PUBLIC_COINGECKO_BASE || "https://api.coingecko.com",
  cacheTtl: Number(process.env.DASHBOARD_CACHE_TTL_SECONDS || 60)
};
