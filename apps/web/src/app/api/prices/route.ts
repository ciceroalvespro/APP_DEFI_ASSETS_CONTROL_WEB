import { NextResponse } from 'next/server';
import { fetchPrices } from '@/lib/coingecko/fetch';

export async function GET() {
  const data = await fetchPrices();
  return NextResponse.json(data);
}
