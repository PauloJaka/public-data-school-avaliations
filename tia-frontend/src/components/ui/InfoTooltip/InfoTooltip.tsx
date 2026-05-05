import './style.css';

interface InfoTooltipProps {
  text: string;
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  return (
    <span className="info-tooltip-wrap" aria-label={text}>
      <span className="info-icon" aria-hidden="true">?</span>
      <span className="info-tip" role="tooltip">{text}</span>
    </span>
  );
}
