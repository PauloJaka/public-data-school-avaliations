'use client';

import './style.css';
import { useEffect, useState } from 'react';

const STEPS_PT = [
  'Buscando contexto do estado…',
  'Consultando o modelo Gemini…',
  'Elaborando resposta…',
];

const STEPS_EN = [
  'Fetching state context…',
  'Consulting Gemini model…',
  'Generating response…',
];

export function ChatTypingIndicator({ locale = 'pt-BR' }: { locale?: string }) {
  const steps = locale === 'en' ? STEPS_EN : STEPS_PT;
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
    const id = setInterval(() => setStep(s => Math.min(s + 1, steps.length - 1)), 2200);
    return () => clearInterval(id);
  }, [steps.length]);

  return (
    <div className="msg ai flex gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary font-mono text-xs text-white">IA</span>
      <div className="thinking-wrap flex flex-col gap-2 rounded-2xl border border-border bg-surface px-4 py-3">
        <div className="typing flex items-center gap-1">
          <span className="dot h-1.5 w-1.5 rounded-full bg-muted" />
          <span className="dot h-1.5 w-1.5 rounded-full bg-muted" />
          <span className="dot h-1.5 w-1.5 rounded-full bg-muted" />
        </div>
        <p key={step} className="thinking-step font-mono text-[11px] text-muted">
          {steps[step]}
        </p>
      </div>
    </div>
  );
}
