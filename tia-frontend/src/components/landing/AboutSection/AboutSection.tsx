import './style.css';
import { getTranslations } from 'next-intl/server';

const ITEM_KEYS = ['ideb', 'saeb', 'qedu', 'pnad', 'atlas', 'equityIndex', 'mlRisk'] as const;

export async function AboutSection() {
  const t = await getTranslations('about');

  return (
    <section className="about-section" id="about">
      <header className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">{t('subtitle')}</p>
        <h2 className="text-2xl font-semibold text-text">{t('title')}</h2>
      </header>

      <div className="about-grid">
        {ITEM_KEYS.map(key => (
          <div key={key} className="about-card">
            <div className="about-card-header">
              <span className="about-card-name">{t(`items.${key}.name`)}</span>
              <span className="about-card-source">{t(`items.${key}.source`)}</span>
            </div>
            <p className="about-card-desc">{t(`items.${key}.desc`)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
