export function QuestionChip({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-border bg-soft px-3 py-1.5 font-mono text-xs text-muted hover:bg-white hover:text-text transition"
    >
      {label}
    </button>
  );
}
