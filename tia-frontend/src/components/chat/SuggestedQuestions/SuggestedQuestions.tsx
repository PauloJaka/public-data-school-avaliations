'use client';
import { useTranslations } from 'next-intl';
import { QuestionChip } from '../QuestionChip/QuestionChip';

const KEYS = [
  'compareNE',
  'ideb10y',
  'risk',
  'equity',
  'vsJapan',
  'methodology',
  'literacy',
  'dropoutCause',
] as const;

export function SuggestedQuestions({ onPick }: { onPick: (q: string) => void }) {
  const t = useTranslations('chat.suggestions');
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {KEYS.map(k => (
        <QuestionChip key={k} label={t(k)} onClick={() => onPick(t(k))} />
      ))}
    </div>
  );
}
