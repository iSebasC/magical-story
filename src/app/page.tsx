import React from 'react';
import { Navbar, Footer } from '@/components/layout';
import {
  HeroSection,
  TrustBar,
  HowItWorksSection,
  FeaturesSection,
  SchoolsSection,
  TestimonialsSection,
  PricingSection,
  CTASection,
} from '@/components/sections';

/**
 * Página principal de Magical Story
 * Landing page completo con todas las secciones
 */
export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-x-hidden">
        <HeroSection />
        <TrustBar />
        <HowItWorksSection />
        <FeaturesSection />
        <SchoolsSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}

