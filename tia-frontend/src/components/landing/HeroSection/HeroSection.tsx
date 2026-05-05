'use client';

import './style.css';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { EyebrowBadge } from '../EyebrowBadge/EyebrowBadge';
import { CTAButton } from '../CTAButton/CTAButton';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { KnowledgeSphere } from '../KnowledgeSphere/KnowledgeSphere';

export function HeroSection() {
  const t = useTranslations('landing.hero');
  const locale = useLocale();

  return (
    <section className="relative mx-auto grid max-w-[1280px] grid-cols-1 lg:grid-cols-[1.05fr_1fr]
                        items-center gap-12 px-8 py-16 lg:py-24">
      <div className="hero-text relative z-10">
        <EyebrowBadge label={t('eyebrow')} />
        <h1 className="mt-6 font-semibold leading-[1.05] tracking-tight
                       text-[clamp(2.4rem,5vw,4.4rem)] text-text">
          {t('headlineLine1')}
          <br />
          {t('headlineLine2')}{' '}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t('headlineAccent')}
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-base text-muted">{t('subhead')}</p>
        <p className="mt-4 font-mono text-xs text-muted/80">PT-BR / EN · RAG · LLM · 3D</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/${locale}/dashboard`}>
            <CTAButton variant="primary">{t('ctaPrimary')} →</CTAButton>
          </Link>
          <CTAButton variant="ghost">▶ {t('ctaSecondary')}</CTAButton>
        </div>
      </div>

      <div className="scene relative h-[520px] w-full">
        <KnowledgeSphere />
      </div>
    </section>
  );
}
