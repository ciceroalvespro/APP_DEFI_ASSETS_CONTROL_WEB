'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { fmtUSD } from '@/lib/formatting/money';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

type Row = {
  id: string;
  data: string;
  ativo: string;
  tipo: 'compra'|'venda'|'pool'|'compound';
  preco_compra_usd: number;
  quantidade: number;
  taxas_usd: number;
  total_usd: number;
};

export default function AssetsPage(){
  const [rows, setRows] = useState<Row[]>([]);
  const [sel, setSel] = useState<Row|null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase.from('assets').select('*').order('data',{ascending:false});
    setRows((data||[]) as any);
    setSel(null);
    setLoading(false);
  };
  useEffect(()=>{ load(); },[]);

  const openNew = () => setSel({
    id: '', data: new Date().toISOString().slice(0,10), ativo: 'BTC', tipo: 'compra', preco_compra_usd: 0, quantidade: 0, taxas_usd: 0, total_usd: 0
  });

  const recalc = (r: Row) => ({ ...r, total_usd: r.preco_compra_usd * r.quantidade - r.taxas_usd });

  const save = async () => {
    if(!sel) return;
    const body = recalc(sel);
    if(!sel.id){
      await supabase.from('assets').insert({ ...body, id: undefined });
    } else {
      await supabase.from('assets').update(body).eq('id', sel.id);
    }
    await load();
  };
  const del = async () => { if(sel?.id){ await supabase.from('assets').delete().eq('id', sel.id); await load(); } };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={openNew} className="px-4 py-2 rounded-xl bg-accent text-black font-semibold">Novo</button>
        <button onClick={save} disabled={!sel} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10">{sel?.id? 'Atualizar':'Inserir'}</button>
        <button onClick={del} disabled={!sel?.id} className="px-4 py-2 rounded-xl bg-white/10 border border-white/10">Excluir</button>
      </div>

      <div className="overflow-auto rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/5">
            <tr>
              {['ID','Data','Ativo','Tipo','Preço (USD)','Quantidade','Taxas (USD)','Total (USD)'].map(h=> <th key={h} className="text-left p-2">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {loading? (
              <tr><td colSpan={8} className="p-4 text-center text-white/60">Carregando...</td></tr>
            ) : rows.map(r=> (
              <tr key={r.id} onClick={()=>setSel(r)} className={`hover:bg-white/5 cursor-pointer ${sel?.id===r.id? 'bg-white/10':''}`}>
                <td className="p-2 text-white/60">{r.id.slice(0,8)}…</td>
                <td className="p-2">{r.data}</td>
                <td className="p-2">{r.ativo}</td>
                <td className="p-2 uppercase">{r.tipo}</td>
                <td className="p-2">{fmtUSD(r.preco_compra_usd)}</td>
                <td className="p-2">{r.quantidade}</td>
                <td className="p-2">{fmtUSD(r.taxas_usd)}</td>
                <td className="p-2">{fmtUSD(r.total_usd)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sel && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 rounded-xl border border-white/10 bg-white/5">
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" value={sel.data} onChange={e=>setSel({...sel, data:e.target.value})} />
          <select className="bg-card/60 border border-white/10 rounded-xl p-3" value={sel.ativo} onChange={e=>setSel({...sel, ativo:e.target.value})}>
            <option>BTC</option><option>ETH</option><option>WETH/USDC</option>
          </select>
          <select className="bg-card/60 border border-white/10 rounded-xl p-3" value={sel.tipo} onChange={e=>setSel({...sel, tipo:e.target.value as any})}>
            <option>compra</option><option>venda</option><option>pool</option><option>compound</option>
          </select>
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Preço (USD)" type="number" value={sel.preco_compra_usd} onChange={e=>setSel(recalc({...sel, preco_compra_usd:Number(e.target.value)}))} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Quantidade" type="number" value={sel.quantidade} onChange={e=>setSel(recalc({...sel, quantidade:Number(e.target.value)}))} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Taxas (USD)" type="number" value={sel.taxas_usd} onChange={e=>setSel(recalc({...sel, taxas_usd:Number(e.target.value)}))} />
          <input className="bg-card/60 border border-white/10 rounded-xl p-3" placeholder="Total (USD)" value={sel.total_usd} readOnly />
        </div>
      )}
    </div>
  );
}
