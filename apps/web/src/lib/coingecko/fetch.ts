import { env } from "@/lib/env";

// Busca preços de BTC e ETH com cache leve
let cache: { ts: number; data: Record<string, number> } | null = null;
export async function fetchPrices(): Promise<Record<string, number>> {
  const now = Date.now();
  if (cache && now - cache.ts < env.cacheTtl * 1000) return cache.data;
  const ids = ["bitcoin", "ethereum"];
  const url = `${env.coingecko}/api/v3/simple/price?ids=${ids.join(",")}&vs_currencies=usd`;
  const res = await fetch(url, { next: { revalidate: env.cacheTtl } });
  if (!res.ok) return cache?.data || {};
  const j = (await res.json()) as any;
  const data: Record<string, number> = {
    BTC: j.bitcoin?.usd ?? undefined,
    ETH: j.ethereum?.usd ?? undefined
  } as any;
  cache = { ts: now, data };
  return data;
}
