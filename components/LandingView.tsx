
import React from 'react';
import { translations } from '../translations';
import Hero from './Hero';
import ProblemSection from './ProblemSection';
import BenefitsSection from './BenefitsSection';
import PillarsSection from './PillarsSection';
import ComparisonSection from './ComparisonSection';
import TestimonialsSection from './TestimonialsSection';
import StartSection from './StartSection';
import ContactSection from './ContactSection';
import Footer from './Footer';

interface LandingViewProps {
  onStartClick: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStartClick }) => {
  const t = translations['pt-BR'];

  return (
    <div className="w-full">
      <section id="home">
        <Hero t={t.hero} onCtaClick={onStartClick} />
      </section>
      
      <section id="problema" className="py-24 bg-slate-50/50">
        <ProblemSection t={t.problem} />
      </section>

      <section id="beneficios" className="py-24">
        <BenefitsSection t={t.benefits} />
      </section>

      <section className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-deepAqua/20 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-display font-bold mb-8 leading-tight">
            {t.bridge.title}
          </h2>
          <p className="text-xl md:text-2xl text-slate-400 font-light italic">
            {t.bridge.phrase}
          </p>
        </div>
      </section>

      <section id="pilares" className="py-32">
        <PillarsSection t={t.pillars} />
      </section>

      <section id="comparativo" className="py-24 bg-slate-50">
        <ComparisonSection t={t.comparison} />
      </section>

      <section id="depoimentos" className="py-24">
        <TestimonialsSection t={t.testimonials} />
      </section>

      <section id="comecar" className="py-24 bg-slate-50">
        <StartSection t={t.start} />
      </section>

      <section id="contato" className="py-32 bg-slate-900 text-white">
        <ContactSection t={t.contact} lang="pt-BR" />
      </section>

      <Footer t={t.footer} />
    </div>
  );
};

export default LandingView;
