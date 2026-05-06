import './style.css';
import { getTranslations } from 'next-intl/server';

const ITEM_KEYS = ['ideb', 'saeb', 'qedu', 'pnad', 'atlas', 'equityIndex', 'mlRisk'] as const;

const SOURCE_URLS: Partial<Record<typeof ITEM_KEYS[number], string>> = {
  ideb:  'https://qedu.org.br/uf/15-para/baixar-dados',
  saeb:  'https://basedosdados.org/dataset/e083c9a2-1cee-4342-bedc-535cbad6f3cd?table=d429a79a-eca1-461c-9c1f-ce65d61048a1',
  qedu:  'https://qedu.org.br/',
  pnad:  'https://www.ibge.gov.br/estatisticas/sociais/saude/9127-pesquisa-nacional-por-amostra-de-domicilios.html?=&t=resultados',
  atlas: 'https://basedosdados.org/dataset/cbfc7253-089b-44e2-8825-755e1419efc8?table=2b704f11-2b3a-485d-a492-71f86c7ea21a',
};

export async function AboutSection() {
  const t = await getTranslations('about');

  return (
    <section className="about-section" id="about">
      <header className="text-center">
        <p className="font-mono text-xs uppercase tracking-widest text-muted mb-2">{t('subtitle')}</p>
        <h2 className="text-2xl font-semibold text-text">{t('title')}</h2>
      </header>

      <div className="about-grid">
        {ITEM_KEYS.map(key => {
          const url = SOURCE_URLS[key];
          const sourceLabel = t(`items.${key}.source`);
          return (
            <div key={key} className="about-card">
              <div className="about-card-header">
                <span className="about-card-name">{t(`items.${key}.name`)}</span>
                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="about-card-source about-card-source-link"
                  >
                    {sourceLabel} ↗
                  </a>
                ) : (
                  <span className="about-card-source">{sourceLabel}</span>
                )}
              </div>
              <p className="about-card-desc">{t(`items.${key}.desc`)}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
