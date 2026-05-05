import { AskRequest, AskResponse, AskResponseSchema, StateValues, StateValuesSchema } from './types';

const BASE = process.env.NEXT_PUBLIC_TIA_API ?? '';

export async function ask(req: AskRequest, signal?: AbortSignal): Promise<AskResponse> {
  const r = await fetch('/api/ask', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(req),
    signal,
  });
  if (!r.ok) {
    const data = await r.json().catch(() => ({})) as Record<string, unknown>;
    const detail = (data?.error as string) ?? 'unknown';
    throw new Error(`ask:${r.status}:${detail}`);
  }
  return AskResponseSchema.parse(await r.json());
}

export async function getStateIdeb(year = 2024): Promise<StateValues> {
  const r = await fetch(`${BASE}/v1/ideb/states?year=${year}`, { next: { revalidate: 3600 } });
  if (!r.ok) throw new Error(`ideb failed: ${r.status}`);
  return StateValuesSchema.parse(await r.json());
}
