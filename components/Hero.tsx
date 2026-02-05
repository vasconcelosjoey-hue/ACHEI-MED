
import React, { useEffect, useRef } from 'react';
import { CONSTANTS } from '../types';
import gsap from 'gsap';

interface HeroProps {
  t: any;
  onCtaClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ t, onCtaClick }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const blob1Ref = useRef<HTMLDivElement>(null);
  const blob2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro animations
      gsap.from(".hero-content > *", {
        y: 60,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: "power4.out"
      });

      gsap.from(imageRef.current, {
        scale: 1.2,
        opacity: 0,
        duration: 1.8,
        ease: "expo.out",
        delay: 0.4
      });

      // Parallax effect on mouse move
      const handleMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const xPos = (clientX / window.innerWidth - 0.5) * 40;
        const yPos = (clientY / window.innerHeight - 0.5) * 40;

        gsap.to(blob1Ref.current, { x: xPos, y: yPos, duration: 1, ease: "power2.out" });
        gsap.to(blob2Ref.current, { x: -xPos, y: -yPos, duration: 1, ease: "power2.out" });
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={heroRef} className="relative pt-32 pb-20 md:pt-56 md:pb-40 overflow-hidden bg-white">
      {/* Background Video Layer */}
      <video 
        autoPlay 
        muted 
        loop 
        playsInline 
        className="absolute top-0 left-0 w-full h-full object-cover opacity-[0.05] -z-10 pointer-events-none"
      >
        <source src={CONSTANTS.VIDEO_HERO_BG} type="video/mp4" />
      </video>

      {/* Animated Parallax Blobs */}
      <div ref={blob1Ref} className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[800px] h-[800px] bg-babyBlue/30 rounded-full blur-[120px] opacity-40 -z-10 animate-pulse-slow"></div>
      <div ref={blob2Ref} className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[600px] h-[600px] bg-aqua/20 rounded-full blur-[100px] opacity-30 -z-10"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
        <div className="text-center lg:text-left hero-content">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 text-white font-bold text-[10px] uppercase tracking-[0.2em] mb-10 shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-aqua opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-aqua"></span>
            </span>
            Healthcare OS 2.0
          </div>
          <h1 className="text-6xl md:text-8xl font-display font-bold text-slate-900 leading-[0.95] mb-10 tracking-tightest">
            {t.h1}
          </h1>
          <p className="text-xl md:text-2xl font-sans text-slate-500 mb-12 leading-relaxed max-w-xl font-medium border-l-4 border-aqua pl-8">
            {t.sub}
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
            <button 
              onClick={onCtaClick}
              className="neo-gradient hover:shadow-2xl text-slate-900 px-12 py-6 rounded-2xl text-lg font-bold shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 text-center font-sans"
            >
              {t.ctaPrimary}
            </button>
            <button 
              onClick={() => alert(t.comingSoon)}
              className="bg-white border border-slate-200 text-slate-500 px-12 py-6 rounded-2xl text-lg font-bold transition-all hover:bg-slate-50 hover:border-slate-300 text-center font-sans"
            >
              {t.ctaSecondary}
            </button>
          </div>
        </div>

        <div ref={imageRef} className="relative group perspective-1000">
          <div className="relative overflow-hidden rounded-[4rem] shadow-[-40px_40px_80px_rgba(0,0,0,0.1)] border-[1px] border-white ring-1 ring-slate-100 transform rotate-2 hover:rotate-0 transition-all duration-1000">
            <img 
              src={CONSTANTS.HERO_IMAGE} 
              alt="AGENDA MED" 
              className="w-full h-full object-cover aspect-[4/5] transition-all duration-1000 scale-110 group-hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/60 via-transparent to-transparent opacity-60"></div>
            
            {/* Live Badge */}
            <div className="absolute bottom-12 left-12 bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl">
               <div className="flex items-center gap-4">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <p className="text-white font-display font-bold text-2xl tracking-tighter">98.4% Ocupação</p>
               </div>
               <p className="text-white/50 text-[10px] font-black uppercase tracking-widest mt-2">Média Global do Sistema</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
