'use client';
import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const onLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = '/dashboard';
    setLoading(false);
  };
  return (
    <div className="max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Entrar</h1>
      <input className="w-full bg-card/60 border border-white/10 rounded-xl p-3" placeholder="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="w-full bg-card/60 border border-white/10 rounded-xl p-3" placeholder="senha" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button onClick={onLogin} disabled={loading} className="w-full rounded-xl bg-accent text-black py-3 font-semibold hover:shadow-glow">{loading? 'Entrando...':'Entrar'}</button>
      <p className="text-sm text-white/60">Não tem conta? <a className="text-accent" href="/signup">Criar com convite</a></p>
    </div>
  );
}
