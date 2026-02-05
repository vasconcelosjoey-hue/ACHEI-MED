
import React, { useEffect } from 'react';
import { translations } from '../translations';
import { CONSTANTS } from '../types';
import Hero from './Hero';
import ProblemSection from './ProblemSection';
import BenefitsSection from './BenefitsSection';
import PillarsSection from './PillarsSection';
import ComparisonSection from './ComparisonSection';
import TestimonialsSection from './TestimonialsSection';
import StartSection from './StartSection';
import ContactSection from './ContactSection';
import Footer from './Footer';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LandingViewProps {
  onStartClick: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStartClick }) => {
  const t = translations['pt-BR'];

  useEffect(() => {
    // Reveal Bridge Text on Scroll
    gsap.from(".bridge-text", {
      y: 100,
      opacity: 0,
      duration: 1.5,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ".bridge-section",
        start: "top 80%",
      }
    });

    // Parallax on bridge background video
    gsap.to(".bridge-video", {
      yPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: ".bridge-section",
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }, []);

  return (
    <div className="w-full">
      <section id="home">
        <Hero t={t.hero} onCtaClick={onStartClick} />
      </section>
      
      <section id="problema" className="py-32 bg-slate-50/50">
        <ProblemSection t={t.problem} />
      </section>

      <section id="beneficios" className="py-32">
        <BenefitsSection t={t.benefits} />
      </section>

      <section className="bridge-section py-40 bg-slate-900 text-white overflow-hidden relative min-h-[60vh] flex items-center">
        {/* Bridge Background Video */}
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="bridge-video absolute inset-0 w-full h-full object-cover opacity-30 scale-125 pointer-events-none"
        >
          <source src={CONSTANTS.VIDEO_BRIDGE} type="video/mp4" />
        </video>
        
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10 bridge-content w-full">
          <div className="bridge-text">
            <h2 className="text-5xl md:text-8xl font-display font-bold mb-10 leading-tight tracking-tighter">
              {t.bridge.title}
            </h2>
            <p className="text-2xl md:text-4xl text-slate-400 font-light italic max-w-4xl mx-auto border-t border-white/10 pt-10">
              "{t.bridge.phrase}"
            </p>
          </div>
        </div>
      </section>

      <section id="pilares" className="py-40">
        <PillarsSection t={t.pillars} />
      </section>

      <section id="comparativo" className="py-32 bg-slate-50">
        <ComparisonSection t={t.comparison} />
      </section>

      <section id="depoimentos" className="py-32">
        <TestimonialsSection t={t.testimonials} />
      </section>

      <section id="comecar" className="py-32 bg-slate-50">
        <StartSection t={t.start} />
      </section>

      <section id="contato" className="py-40 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-aqua to-transparent opacity-30"></div>
        <ContactSection t={t.contact} lang="pt-BR" />
      </section>

      <Footer t={t.footer} />
    </div>
  );
};

export default LandingView;
