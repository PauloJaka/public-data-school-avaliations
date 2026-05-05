import { NextRequest, NextResponse } from 'next/server';
import { AskRequestSchema } from '@/lib/api/types';
import { z } from 'zod';

// Node.js runtime — edge runtime blocks calls to http://localhost
export const runtime = 'nodejs';

const UpstreamSchema = z.object({
  request_id: z.string(),
  answer:     z.string(),
});

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const parsed = AskRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const upstream = process.env.TIA_RAG_URL;
  if (!upstream) {
    return NextResponse.json({ error: 'upstream_not_configured' }, { status: 503 });
  }

  const r = await fetch(`${upstream}/ask/state`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      uf:       parsed.data.uf,
      question: parsed.data.question,
      language: parsed.data.locale,
    }),
  }).catch((err: Error) => {
    console.error('[ask/route] fetch error:', err.message);
    return null;
  });

  if (!r) {
    return NextResponse.json(
      { error: 'backend_unreachable', detail: `Cannot connect to ${upstream}` },
      { status: 502 },
    );
  }

  if (!r.ok) {
    const body = await r.text().catch(() => '');
    console.error(`[ask/route] upstream ${r.status}:`, body);
    return NextResponse.json(
      { error: 'upstream_error', status: r.status, detail: body },
      { status: 502 },
    );
  }

  const raw = await r.json();
  const safe = UpstreamSchema.safeParse(raw);
  if (!safe.success) {
    return NextResponse.json({ error: 'bad_upstream_shape' }, { status: 502 });
  }

  return NextResponse.json({
    id:      safe.data.request_id,
    answer:  safe.data.answer,
    sources: [],
  });
}
