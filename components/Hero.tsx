
import React from 'react';
import { CONSTANTS } from '../types';

interface HeroProps {
  t: any;
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ t, onCtaClick }) => {
  const handlePlansClick = () => {
    alert(t.comingSoon);
  };

  return (
    <div className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-white">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl opacity-60 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Gestão Ativa 24h
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-slate-900 leading-[1] mb-8 tracking-tighter">
            {t.h1}
          </h1>
          <p className="text-xl md:text-2xl font-sans text-slate-600 mb-10 leading-relaxed max-w-xl font-light">
            {t.sub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={onCtaClick}
              className="bg-primary hover:bg-slate-800 text-white px-10 py-5 rounded-full text-lg font-bold shadow-2xl transition-all hover:-translate-y-1 active:scale-95 text-center font-sans"
            >
              {t.ctaPrimary}
            </button>
            <button 
              onClick={handlePlansClick}
              className="border-2 border-slate-200 text-slate-600 px-10 py-5 rounded-full text-lg font-bold transition-all hover:bg-slate-50 text-center font-sans"
            >
              {t.ctaSecondary}
            </button>
          </div>
        </div>

        <div className="relative group">
          <div className="relative overflow-hidden rounded-[3rem] shadow-2xl border-[12px] border-white ring-1 ring-slate-100">
            <img 
              src={CONSTANTS.HERO_IMAGE} 
              alt="Achei Med Healthcare Management" 
              className="w-full h-full object-cover aspect-[4/3] grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
