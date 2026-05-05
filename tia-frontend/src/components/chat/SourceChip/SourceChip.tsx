export function SourceChip({ id, label }: { id: number; label: string }) {
  return (
    <span className="source inline-flex items-center gap-1 rounded-full border border-border bg-soft px-2.5 py-1 font-mono text-[10px] text-muted">
      <span className="text-primary">[{id}]</span>{label}
    </span>
  );
}
