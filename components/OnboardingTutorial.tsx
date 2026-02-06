
import React, { useState, useEffect, useRef } from 'react';
import { UserRole } from '../types';
import { translations } from '../translations';
import gsap from 'gsap';

interface OnboardingTutorialProps {
  role: UserRole;
  onClose: () => void;
}

const OnboardingTutorial: React.FC<OnboardingTutorialProps> = ({ role, onClose }) => {
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const t = translations['pt-BR'].tutorial;
  const steps = role === 'PHYSICIAN' ? t.physician : t.patient;

  useEffect(() => {
    // Animação de entrada do passo com GSAP
    gsap.fromTo(contentRef.current, 
      { opacity: 0, scale: 0.95, y: 10 }, 
      { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
    );
  }, [step]);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div ref={containerRef} className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-lg bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
        {/* Barra de Progresso Superior */}
        <div className="flex h-1.5 w-full bg-slate-100">
           {steps.map((_, i) => (
             <div key={i} className={`flex-1 transition-all duration-700 ${i <= step ? 'bg-deepAqua' : 'bg-transparent'}`}></div>
           ))}
        </div>

        <div className="p-12 text-center">
           {/* Ícone Animado */}
           <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-10 shadow-inner border border-slate-100 transform -rotate-3 hover:rotate-0 transition-transform duration-500">
             {role === 'PHYSICIAN' 
               ? ['🩺', '📅', '🤖', '📋'][step] 
               : ['☁️', '🔍', '✉️', '📅'][step]}
           </div>

           <div ref={contentRef} className="min-h-[160px]">
             <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 tracking-tight leading-tight">
               {steps[step].t}
             </h2>
             <p className="text-slate-500 leading-relaxed text-lg font-medium">
               {steps[step].d}
             </p>
           </div>

           <div className="flex gap-4 mt-12">
             {step > 0 && (
               <button 
                 onClick={handlePrev}
                 className="flex-1 py-4 border border-slate-200 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-all active:scale-95"
               >
                 {t.prev}
               </button>
             )}
             <button 
               onClick={handleNext}
               className="flex-[2] py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-2xl shadow-slate-900/20 transform active:scale-95 transition-all hover:bg-slate-800"
             >
               {step === steps.length - 1 ? t.finish : t.next}
             </button>
           </div>
           
           <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
             Passo {step + 1} de {steps.length} • Health OS v2
           </p>
        </div>

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-2 text-slate-300 hover:text-slate-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
      </div>
    </div>
  );
};

export default OnboardingTutorial;
