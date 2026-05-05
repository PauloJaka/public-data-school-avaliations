import type { Metadata } from 'next';

// Locale-specific metadata can be added here per page
// The html/body shell + providers are in the root layout (../layout.tsx)

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: 'T.I.A — Tecnologia para Inteligência em Aprendizagem',
    description: locale === 'en'
      ? 'AI and data platform for Brazilian educational indicators.'
      : 'Plataforma de dados e IA para análise de indicadores educacionais do Brasil.',
  };
}

export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // html/body provided by root layout
  return <>{children}</>;
}
