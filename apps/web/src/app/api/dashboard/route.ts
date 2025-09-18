import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client.server';
import { fetchPrices } from '@/lib/coingecko/fetch';

export async function GET() {
  const admin = supabaseAdmin();
  const { data: assets } = await admin.from('assets').select('ativo,total_usd,quantidade,tipo');
  const prices = await fetchPrices();
  const by: Record<string,{ invest:number; qty:number }> = {};
  for (const a of assets||[]) {
    const key = a.ativo as string; if(!by[key]) by[key] = { invest:0, qty:0 };
    const sign = a.tipo === 'venda' ? -1 : 1;
    by[key].invest += Number(a.total_usd) * (a.tipo==='venda'?-1:1);
    by[key].qty += Number(a.quantidade) * sign;
  }
  let totalInvest = 0, current = 0;
  for (const [asset,v] of Object.entries(by)){
    totalInvest += v.invest;
    const p = asset==='BTC'? prices.BTC : asset==='ETH'? prices.ETH : undefined;
    current += p? v.qty*p : Math.max(v.invest,0);
  }
  return NextResponse.json({ totalInvest, current, breakdown: by });
}
