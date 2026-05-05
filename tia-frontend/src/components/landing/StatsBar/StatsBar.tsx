import './style.css';
import { StatItem } from '../StatItem/StatItem';
import { useTranslations } from 'next-intl';

export function StatsBar() {
  const t = useTranslations('landing.stats');
  return (
    <section className="mx-auto grid max-w-[1280px] grid-cols-1 md:grid-cols-3 gap-4 px-8 pb-16">
      <StatItem value="27" label={t('states')} progress={1.0} />
      <StatItem value="5.570" label={t('cities')} progress={1.0} />
      <StatItem value="4.8" label={t('ideb')} progress={0.65} />
    </section>
  );
}
