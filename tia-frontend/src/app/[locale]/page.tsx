import { Navbar } from '@/components/nav/Navbar/Navbar';
import { CosmosBackground } from '@/components/landing/CosmosBackground/CosmosBackground';
import { HeroSection } from '@/components/landing/HeroSection/HeroSection';
import { StatsBar } from '@/components/landing/StatsBar/StatsBar';
import { AboutSection } from '@/components/landing/AboutSection/AboutSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'T.I.A — Inteligência para a Educação Brasileira',
  description: 'Plataforma de dados e IA para entender, comparar e agir sobre indicadores educacionais do Brasil.',
};

export default function LandingPage() {
  return (
    <main className="relative min-h-[100dvh]">
      <CosmosBackground />
      <Navbar />
      <HeroSection />
      <StatsBar />
      <AboutSection />
    </main>
  );
}
