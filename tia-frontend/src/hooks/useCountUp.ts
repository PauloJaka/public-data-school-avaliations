'use client';
import { useEffect, useState } from 'react';

export function useCountUp(target: number, durationMs = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf = 0;
    const tick = (t: number) => {
      if (start == null) start = t;
      const p = Math.min(1, (t - start) / durationMs);
      setV(target * (1 - Math.pow(1 - p, 3))); // easeOutCubic
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return v;
}
