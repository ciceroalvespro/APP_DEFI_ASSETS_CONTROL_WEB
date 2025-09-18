import KPICard from "@/components/KPICard";
import { supabaseServer } from "@/lib/supabase/client.server";
import { fetchPrices } from "@/lib/coingecko/fetch";
import { fmtUSD } from "@/lib/formatting/money";

export default async function DashboardPage() {
  const supa = supabaseServer();
  // Exemplo simples: somatórios por ativo (user precisa estar logado; em MVP assume user único/dev)
  const { data: assets } = await supa.from("assets").select("ativo,total_usd,quantidade,tipo");
  const byAsset = new Map<string, { invest: number; qty: number }>();
  for (const a of assets || []) {
    const key = a.ativo as string;
    const cur = byAsset.get(key) || { invest: 0, qty: 0 };
    const sign = a.tipo === 'venda' ? -1 : 1;
    cur.invest += (a.total_usd as number) * (a.tipo === 'venda' ? -1 : 1);
    cur.qty += (a.quantidade as number) * sign;
    byAsset.set(key, cur);
  }
  const prices = await fetchPrices();
  // Valor atual com fallback
  const currentValue = Array.from(byAsset.entries()).reduce((acc, [asset, v]) => {
    const p = asset === 'BTC' ? prices.BTC : asset === 'ETH' ? prices.ETH : undefined;
    if (p) return acc + v.qty * p;
    return acc + Math.max(v.invest, 0); // fallback: depósito/investimento
  }, 0);

  const totalInvest = Array.from(byAsset.values()).reduce((acc, v) => acc + v.invest, 0);

  // distribuição
  const dist = Array.from(byAsset.entries()).map(([asset, v]) => {
    const p = asset === 'BTC' ? prices.BTC : asset === 'ETH' ? prices.ETH : undefined;
    const val = p ? v.qty * p : Math.max(v.invest, 0);
    return { asset, value: val };
  });
  const sum = dist.reduce((a, b) => a + b.value, 0) || 1;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KPICard title="Total investido" value={fmtUSD(totalInvest)} />
        <KPICard title="Valor atual" value={fmtUSD(currentValue)} />
        <KPICard title="Ativos rastreados" value={byAsset.size} />
      </div>

      <div className="rounded-2xl bg-card/60 border border-white/10 p-4">
        <h2 className="text-lg font-semibold mb-3">Distribuição por ativo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {dist.map((d) => (
            <div key={d.asset} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-sm text-white/60">{d.asset}</div>
              <div className="text-xl">{fmtUSD(d.value)}</div>
              <div className="text-xs text-white/50">{((d.value / sum) * 100).toFixed(1)}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
