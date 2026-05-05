import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const upstream = process.env.TIA_RAG_URL;
  if (!upstream) {
    return NextResponse.json({ status: 'no_url' }, { status: 503 });
  }

  const r = await fetch(`${upstream}/health`).catch(() => null);
  if (!r?.ok) {
    return NextResponse.json({ status: 'offline' }, { status: 502 });
  }

  return NextResponse.json({ status: 'ok' });
}
