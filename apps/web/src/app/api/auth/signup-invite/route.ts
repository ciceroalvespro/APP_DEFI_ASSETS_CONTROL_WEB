import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/client.server";

export async function POST(req: NextRequest) {
  try {
    const { email, password, invite_code } = await req.json();
    if (!email || !password || !invite_code) return NextResponse.json({ error: "Campos obrigatórios" }, { status: 400 });

    const admin = supabaseAdmin();
    // valida convite
    const { data: invite, error: invErr } = await admin
      .from("invites")
      .select("id, used")
      .eq("email", email)
      .eq("invite_code", invite_code)
      .single();
    if (invErr || !invite) return NextResponse.json({ error: "Convite inválido" }, { status: 400 });
    if (invite.used) return NextResponse.json({ error: "Convite já utilizado" }, { status: 400 });

    // cria usuário
    const { data: auth, error: signErr } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    if (signErr || !auth.user) return NextResponse.json({ error: signErr?.message || "Falha ao criar usuário" }, { status: 500 });

    // marca invite como usado
    await admin.from("invites").update({ used: true, used_at: new Date().toISOString() }).eq("id", invite.id);

    // cria sessão automática (opcional): não expomos service role ao cliente; redireciono para login
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Erro inesperado" }, { status: 500 });
  }
}
