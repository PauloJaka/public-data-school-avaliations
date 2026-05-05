import './style.css';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';
import { BrandLogo } from '@/components/nav/BrandLogo/BrandLogo';
import { LangToggle } from '@/components/nav/LangToggle/LangToggle';
import { ThemeToggle } from '@/components/nav/ThemeToggle/ThemeToggle';
import { MiniKpiCard } from '../MiniKpiCard/MiniKpiCard';
import { RecentSessions } from '../RecentSessions/RecentSessions';
import { useChatContext } from '../ChatContext';
import { STATE_DATA } from '@/lib/data/neo4j-snapshot';
import { useBackendStatus } from '@/hooks/useBackendStatus';

export function ChatSidebar() {
  const locale = useLocale();
  const tChat = useTranslations('chat');
  const { uf, setUf } = useChatContext();
  const backendStatus = useBackendStatus();

  const dotColor = {
    checking: 'bg-yellow-400',
    online:   'bg-green-400',
    offline:  'bg-red-400',
  }[backendStatus];

  const st = STATE_DATA[uf] ?? STATE_DATA['SE'];
  const stateList = Object.values(STATE_DATA).sort((a, b) => a.nome.localeCompare(b.nome));

  return (
    <aside className="sidebar flex w-72 flex-col gap-6 overflow-y-auto border-r border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border p-5">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-text font-semibold tracking-wide">
          <BrandLogo />
          <span>T.I.A</span>
        </Link>
        <div className="flex items-center gap-2">
          <LangToggle />
          <ThemeToggle />
        </div>
      </div>

      <div className="px-5">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${dotColor}`} />
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
            {backendStatus === 'offline' ? 'IA offline' : tChat('sidebar.contextLabel')}
          </span>
        </div>
        <div className="mt-2 space-y-1">
          <select
            value={uf}
            onChange={e => setUf(e.target.value)}
            className="w-full rounded-xl border border-border bg-soft px-3 py-1.5 font-mono text-xs text-text focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {stateList.map(s => (
              <option key={s.sigla} value={s.sigla}>{s.sigla} — {s.nome}</option>
            ))}
          </select>
          <div className="font-mono text-xs text-muted">📅 IDEB {st.ideb_af.toFixed(1)} · QEDU/PNAD</div>
          <div className="font-mono text-xs text-muted">🔎 {tChat('sidebar.sources')}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 px-5">
        <MiniKpiCard label={tChat('sidebar.kpiIdeb')}     value={st.ideb_af.toFixed(1)}                                    delta="—" dir="up"   />
        <MiniKpiCard label={tChat('sidebar.kpiDropout')}  value={`${st.taxa_abandono.toFixed(1)}%`}                        delta="—" dir="down" />
        <MiniKpiCard label={tChat('sidebar.kpiRisk')}     value={st.pub_media_score_evasao != null ? st.pub_media_score_evasao.toFixed(2) : '—'} delta="—" dir="down" />
        <MiniKpiCard label={tChat('sidebar.kpiStudents')} value={`${(st.total_matriculas / 1000).toFixed(0)}k`}             delta="—" dir="up"   />
      </div>

      <div className="flex-1 px-5 pb-5">
        <RecentSessions />
      </div>
    </aside>
  );
}
