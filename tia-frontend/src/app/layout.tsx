import { ThemeProvider } from '@/contexts/ThemeContext';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getLocale } from 'next-intl/server';
import { Fira_Sans, Fira_Code } from 'next/font/google';
import '@/styles/globals.css';
import type { Metadata } from 'next';

const firaSans = Fira_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fira-sans',
  display: 'swap',
});
const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-fira-code',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'T.I.A — Tecnologia para Inteligência em Aprendizagem',
  description: 'Plataforma de dados e IA para análise de indicadores educacionais do Brasil.',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${firaSans.variable} ${firaCode.variable}`}>
      <body className="bg-bg text-text antialiased">
        <ThemeProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
