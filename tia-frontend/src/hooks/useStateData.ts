'use client';
import useSWR from 'swr';
import { getStateIdeb } from '@/lib/api/tia';

export function useStateData(year = 2024) {
  return useSWR(['state-ideb', year], () => getStateIdeb(year), { revalidateOnFocus: false });
}
