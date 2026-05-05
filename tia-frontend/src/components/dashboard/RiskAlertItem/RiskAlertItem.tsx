import './style.css';

export interface RiskAlertItemProps { city: string; uf: string; risk: number }

export function RiskAlertItem({ city, uf, risk }: RiskAlertItemProps) {
  return (
    <li className="flex items-center justify-between py-3 transition hover:bg-soft rounded-xl px-2 -mx-2">
      <div>
        <div className="text-sm text-text">{city}</div>
        <div className="font-mono text-[11px] text-muted">{uf}</div>
      </div>
      <span className="font-mono text-sm rounded-full px-2.5 py-1 bg-rose-50 text-rose-700">
        {risk.toFixed(2)}
      </span>
    </li>
  );
}
