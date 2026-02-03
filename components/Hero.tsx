
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
    <div className="relative pt-32 pb-20 md:pt-56 md:pb-40 overflow-hidden bg-white">
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-babyBlue/20 rounded-full blur-[120px] opacity-40 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-center lg:text-left animate-in fade-in slide-in-from-left duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-babyBlue/20 text-deepAqua font-bold text-[10px] uppercase tracking-widest mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-deepAqua opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-deepAqua"></span>
            </span>
            Gestão Inteligente 24h
          </div>
          <h1 className="text-5xl md:text-8xl font-display font-bold text-slate-900 leading-[1.05] mb-8 tracking-tighter">
            {t.h1}
          </h1>
          <p className="text-xl md:text-2xl font-sans text-slate-500 mb-10 leading-relaxed max-w-xl font-medium">
            {t.sub}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button 
              onClick={onCtaClick}
              className="neo-gradient hover:shadow-2xl text-white px-10 py-5 rounded-2xl text-lg font-bold shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 text-center font-sans"
            >
              {t.ctaPrimary}
            </button>
            <button 
              onClick={handlePlansClick}
              className="bg-white border-2 border-slate-100 text-slate-500 px-10 py-5 rounded-2xl text-lg font-bold transition-all hover:bg-slate-50 hover:border-slate-200 text-center font-sans shadow-sm"
            >
              {t.ctaSecondary}
            </button>
          </div>
        </div>

        <div className="relative group animate-in fade-in slide-in-from-right duration-1000">
          <div className="relative overflow-hidden rounded-[3rem] shadow-2xl border-[16px] border-white ring-1 ring-slate-100">
            <img 
              src={CONSTANTS.HERO_IMAGE} 
              alt="Achei Med Healthcare Management" 
              className="w-full h-full object-cover aspect-[4/3] transition-all duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          
          {/* Floating Element */}
          <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-2xl border border-slate-50 animate-float hidden md:block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400">Status da Clínica</p>
                <p className="text-lg font-bold text-slate-900">100% Otimizada</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
