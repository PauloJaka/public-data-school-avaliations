export default function Loading() {
  return (
    <div className="flex min-h-[100dvh] w-full flex-col items-center justify-center bg-bg">
      <div className="flex flex-col items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg">
          <svg className="h-6 w-6 animate-pulse text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 3l9 4-9 4-9-4 9-4z"/>
            <path d="M3 12l9 4 9-4"/>
            <path d="M3 17l9 4 9-4"/>
          </svg>
        </div>
        <div className="h-2 w-24 overflow-hidden rounded-full bg-soft">
          <div className="h-full w-full animate-[shimmer_1.5s_infinite] bg-primary/40" />
        </div>
      </div>
    </div>
  );
}
