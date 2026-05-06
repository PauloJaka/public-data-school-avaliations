import './style.css';

interface SourceLinkProps {
  label: string;
  href: string;
}

export function SourceLink({ label, href }: SourceLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="source-link"
      aria-label={`Fonte: ${label}`}
    >
      {label}
      <svg
        width="9"
        height="9"
        viewBox="0 0 12 12"
        fill="none"
        aria-hidden="true"
        className="source-link-icon"
      >
        <path
          d="M3.5 2H2a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V8.5M7 1h4m0 0v4m0-4L5.5 6.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
