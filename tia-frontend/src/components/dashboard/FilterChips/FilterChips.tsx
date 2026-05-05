'use client';

import './style.css';
import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

export function FilterChips({ items, activeItem, onChange }: { items: string[]; activeItem: string; onChange?: (v: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(it => (
        <button
          key={it}
          onClick={() => { onChange?.(it); }}
          className={cn(
            'filter-chip rounded-full border px-3 py-1.5 font-mono text-xs transition',
            activeItem === it
              ? 'border-primary bg-primary text-white'
              : 'border-border bg-surface text-muted hover:text-text'
          )}
        >
          {it}
        </button>
      ))}
    </div>
  );
}
