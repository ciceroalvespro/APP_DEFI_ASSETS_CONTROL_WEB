import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/client.server';

export async function GET() {
  const admin = supabaseAdmin();
  const { data, error } = await admin.from('assets').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const admin = supabaseAdmin();
  const { data, error } = await admin.from('assets').insert(body).select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
