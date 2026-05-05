// Server component — pure SVG, no interactivity needed
export function BrandLogo() {
  return (
    <span
      aria-hidden
      className="inline-flex h-9 w-9 items-center justify-center rounded-xl
                 bg-gradient-to-br from-primary to-secondary text-white shadow-md"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2 2 7l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
        <path d="M2 17l10 5 10-5" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}
