'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { fmtUSD } from '@/lib/formatting/money';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

type Row = {
  id: string; status: 'Aberto'|'Fechado'; abertura_data: string; fechamento_data: string|null; dias_em_range: number|null;
  par: string; deposito_usd: number; saque_usd: number; rede: string|null; protocolo: string|null; fee_pct: number|null;
  preco_min: number|null; preco_max: number|null; largura_pct: number|null; taxas_geradas_usd: number; retorno_taxas_pct: number|null; custos_usd: number; pnl_usd: number|null; apr_pct: number|null;
};

export default function PoolsPage(){
  const [rows, setRows] = useState<Row[]>([]);
  const [sel, setSel] = useState<Row|null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('liquidity_pools').select('*').order('abertura_data',{ascending:false});
    setRows((data||[]) as any); setSel(null); setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const openNew = () => setSel({
    id:'', status:'Aberto', abertura_data:new Date().toISOString().slice(0,10), fechamento_data:null, dias_em_range:null,
    par:'WETH/USDC', deposito_usd:0, saque_usd:0, rede:'Base', protocolo:'Uniswap', fee_pct:0.05,
    preco_min:null, preco_max:null, largura_pct:null, taxas_geradas_usd:0, retorno_taxas_pct:null, custos_usd:0, pnl_usd:null, apr_pct:null
  });

  const calc = (r: Row, allAssets: any[]) => {
    const dias = r.fechamento_data ? Math.max(0, (new Date(r.fechamento_data).getTime()-new Date(r.abertura_data).getTime())/86400000) : Math.max(0, (Date.now()-new Date(r.abertura_data).getTime())/86400000);
    const largura = r.preco_min && r.preco_max && r.preco_min>0 ? ((r.preco_max - r.preco_min)/r.preco_min)*100 : null;
    const aportes = allAssets.filter(a=>a.ativo===r.par && ['compra','pool','compound'].includes(a.tipo)).reduce((s,a)=>s + Number(a.total_usd), 0);
    const retorno = aportes>0 ? (r.taxas_geradas_usd / aportes) * 100 : null;
    const pnl = r.saque_usd - r.deposito_usd;
    const apr = aportes>0 && dias>0 ? ((r.taxas_geradas_usd / aportes) / dias) * 365 : null;
    return { ...r, dias_em_range: Math.floor(dias), largura_pct: largura, retorno_taxas_pct: retorno, pnl_usd: pnl, apr_pct: apr };
  };

  const save = async () => {
    if(!sel) return;
    const { data: assets } = await supabase.from('assets').select('ativo,total_usd,tipo');
    const body = calc(sel, assets||[]);
    if(!sel.id){ await supabase.from('liquidity_pools').insert({ ...body, id: undefined }); }
    else { await supabase.from('liquidity_pools').update(body).eq('id', sel.id); }
    await load();
  };
  const del = async () => { if(sel?.id){ await supabase.from('liquidity_pools').delete().eq('id', sel.id); await load(); } };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {!sel && <button onClick={openNew} className="px-4 py-2 rounded-xl bg-accent text-black font-semibold">Novo</button>}
        {sel && (
          <>
            <button onClick={save} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10">{sel.id? 'Atualizar':'Inserir'}</button>
            <button onClick={del} disabled={!sel.id} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10">Excluir</button>
          </>
        )}
      </div>

      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {['ID','Status','Abertura','Fechamento','Dias em Range','Par','Depósito','Saque','Rede','Protocolo','Fee (%)','Preço Min','Preço Max','Largura %','Taxas Geradas','Retorno Taxas %','Custos','PnL','APR %'].map(h=> <th key={h} className="text-left p-2">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading? (<tr><td colSpan={19} className="p-4 text-center text-white/60">Carregando...</td></tr>) : rows.map(r=> (
              <tr key={r.id} onClick={()=>setSel(r)} className={`hover:bg-white/5 cursor-pointer ${sel?.id===r.id? 'bg-white/10':''}`}>
                <td className="p-2 text-white/60">{r.id.slice(0,8)}…</td>
                <td className="p-2">{r.status}</td>
                <td className="p-2">{r.abertura_data}</td>
                <td className="p-2">{r.fechamento_data||'-'}</td>
                <td className="p-2">{r.dias_em_range??'-'}</td>
                <td className="p-2">{r.par}</td>
                <td className="p-2">{fmtUSD(r.deposito_usd)}</td>
                <td className="p-2">{fmtUSD(r.saque_usd)}</td>
                <td className="p-2">{r.rede||'-'}</td>
                <td className="p-2">{r.protocolo||'-'}</td>
                <td className="p-2">{r.fee_pct??'-'}</td>
                <td className="p-2">{r.preco_min??'-'}</td>
                <td className="p-2">{r.preco_max??'-'}</td>
                <td className="p-2">{r.largura_pct? r.largura_pct.toFixed(2)+'%':'-'}</td>
                <td className="p-2">{fmtUSD(r.taxas_geradas_usd)}</td>
                <td className="p-2">{r.retorno_taxas_pct? r.retorno_taxas_pct.toFixed(2)+'%':'-'}</td>
                <td className="p-2">{fmtUSD(r.custos_usd)}</td>
                <td className="p-2">{r.pnl_usd? fmtUSD(r.pnl_usd):'-'}</td>
                <td className="p-2">{r.apr_pct? r.apr_pct.toFixed(2):'-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sel && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
          <select className="bg-card/60 border border-white/10 rounded-xl p-3" value={sel.status} onChange={e=>setSel({...sel, status:e.target.value as any})}>
            <option>Aberto</option><option>Fechado</option>
          </select>
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" type="date" value={sel.abertura_data} onChange={e=>setSel({...sel, abertura_data:e.target.value})} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" type="date" value={sel.fechamento_data||''} onChange={e=>setSel({...sel, fechamento_data:e.target.value||null})} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Par" value={sel.par} onChange={e=>setSel({...sel, par:e.target.value})} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Depósito (USD)" type="number" value={sel.deposito_usd} onChange={e=>setSel({...sel, deposito_usd:Number(e.target.value)})} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Saque (USD)" type="number" value={sel.saque_usd} onChange={e=>setSel({...sel, saque_usd:Number(e.target.value)})} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Rede" value={sel.rede||''} onChange={e=>setSel({...sel, rede:e.target.value||null})} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Protocolo" value={sel.protocolo||''} onChange={e=>setSel({...sel, protocolo:e.target.value||null})} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Fee (%)" type="number" value={sel.fee_pct||0} onChange={e=>setSel({...sel, fee_pct:Number(e.target.value)})} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Preço Min" type="number" value={sel.preco_min||0} onChange={e=>setSel({...sel, preco_min:Number(e.target.value)})} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Preço Max" type="number" value={sel.preco_max||0} onChange={e=>setSel({...sel, preco_max:Number(e.target.value)})} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Taxas Geradas (USD)" type="number" value={sel.taxas_geradas_usd} onChange={e=>setSel({...sel, taxas_geradas_usd:Number(e.target.value)})} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Custos (USD)" type="number" value={sel.custos_usd} onChange={e=>setSel({...sel, custos_usd:Number(e.target.value)})} />
        </div>
      )}
    </div>
  );
}
