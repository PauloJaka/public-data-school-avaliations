import './style.css';

export function CosmosBackground() {
  return (
    <div aria-hidden className="cosmos pointer-events-none fixed inset-0 -z-10">
      {Array.from({ length: 24 }).map((_, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${(i * 37) % 100}%`,
            animationDelay: `${(i * 0.6) % 14}s`,
            animationDuration: `${9 + (i % 6)}s`,
          }}
        />
      ))}
    </div>
  );
}
