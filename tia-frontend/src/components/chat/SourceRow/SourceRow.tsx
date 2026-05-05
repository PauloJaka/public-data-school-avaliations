import './style.css';
import { SourceChip } from '../SourceChip/SourceChip';

export interface SourceRowProps {
  sources: { id: number; label: string }[];
}

export function SourceRow({ sources }: SourceRowProps) {
  return (
    <div className="source-row mt-3 flex flex-wrap gap-2 border-t border-dashed border-border pt-3">
      {sources.map(s => <SourceChip key={s.id} {...s} />)}
    </div>
  );
}
