'use client';
import { useState } from 'react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const onSignup = async () => {
    setLoading(true);
    const res = await fetch('/api/auth/signup-invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, invite_code: code })
    });
    const j = await res.json();
    if (!res.ok) alert(j.error || 'Erro no cadastro');
    else window.location.href = '/dashboard';
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Criar conta com convite</h1>
      <input className="w-full bg-card/60 border border-white/10 rounded-xl p-3" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full bg-card/60 border border-white/10 rounded-xl p-3" placeholder="senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <input className="w-full bg-card/60 border border-white/10 rounded-xl p-3" placeholder="código de convite" value={code} onChange={e=>setCode(e.target.value)} />
      <button onClick={onSignup} disabled={loading} className="w-full rounded-xl bg-accent text-black py-3 font-semibold hover:shadow-glow">{loading? 'Criando...':'Criar conta'}</button>
      <p className="text-sm text-white/60">Já tem conta? <a className="text-accent" href="/login">Entrar</a></p>
    </div>
  );
}
