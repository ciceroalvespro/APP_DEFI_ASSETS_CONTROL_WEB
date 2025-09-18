'use client';
import { useState } from 'react';

export default function SimulatorPage(){
  const [pa,setPa]=useState(4256.56); const [pb,setPb]=useState(1);
  const [r1,setR1]=useState(4); const [a1,setA1]=useState(30);
  const [r2,setR2]=useState(7); const [a2,setA2]=useState(70);
  const [cap,setCap]=useState(1500);

  const lines = [pa*(1-r2/100), pa*(1-r1/100), pa, pa*(1+r1/100), pa*(1+r2/100)];
  const v1 = cap*(a1/100); const v2 = cap*(a2/100);
  const qtyA1 = v1/pa; const qtyA2 = v2/pa;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Simulador LP</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input className="bg-card/60 border border-white/10 rounded-xl p-3" type="number" value={pa} onChange={e=>setPa(Number(e.target.value))} placeholder="Preço A (ETH)" />
        <input className="bg-card/60 border border-white/10 rounded-xl p-3" type="number" value={pb} onChange={e=>setPb(Number(e.target.value))} placeholder="Preço B (USDC)" />
        <input className="bg-card/60 border border-white/10 rounded-xl p-3" type="number" value={cap} onChange={e=>setCap(Number(e.target.value))} placeholder="Capital" />
        <input className="bg-card/60 border border-white/10 rounded-xl p-3" type="number" value={r1} onChange={e=>setR1(Number(e.target.value))} placeholder="Range 1 %" />
        <input className="bg-card/60 border border-white/10 rounded-xl p-3" type="number" value={a1} onChange={e=>setA1(Number(e.target.value))} placeholder="Alocação 1 %" />
        <input className="bg-card/60 border border-white/10 rounded-xl p-3" type="number" value={r2} onChange={e=>setR2(Number(e.target.value))} placeholder="Range 2 %" />
        <input className="bg-card/60 border border-white/10 rounded-xl p-3" type="number" value={a2} onChange={e=>setA2(Number(e.target.value))} placeholder="Alocação 2 %" />
      </div>

      <div className="rounded-2xl bg-card/60 border border-white/10 p-4">
        <h2 className="font-semibold mb-2">Linhas de preço</h2>
        <div className="grid grid-cols-5 gap-2 text-center text-sm">
          {lines.map((v,i)=> <div key={i} className="p-2 rounded-xl bg-white/5">{v.toFixed(2)}</div>)}
        </div>
        <div className="mt-3 text-sm text-white/60">Faixas: -{r2}% | -{r1}% | atual | +{r1}% | +{r2}%</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="font-semibold mb-2">Range 1</div>
          <div>Alocação: {a1}% — Valor: ${v1.toFixed(2)} — Tokens A: {qtyA1.toFixed(6)}</div>
        </div>
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
          <div className="font-semibold mb-2">Range 2</div>
          <div>Alocação: {a2}% — Valor: ${v2.toFixed(2)} — Tokens A: {qtyA2.toFixed(6)}</div>
        </div>
      </div>
    </div>
  );
}
