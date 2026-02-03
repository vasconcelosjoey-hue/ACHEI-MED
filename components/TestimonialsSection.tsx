
import React from 'react';
import { CONSTANTS } from '../types';

const TestimonialsSection: React.FC<{ t: any }> = ({ t }) => {
  const testimonials = [
    { text: t.t1, author: t.a1, img: CONSTANTS.TEST1_IMAGE },
    { text: t.t2, author: t.a2, img: CONSTANTS.TEST2_IMAGE },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 text-center mb-16 tracking-tight">{t.title}</h2>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {testimonials.map((test, idx) => (
          <div key={idx} className="bg-surface p-10 rounded-[2.5rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border border-slate-100">
            <div className="absolute top-0 right-0 p-8 text-primary opacity-[0.03] transform rotate-12 text-9xl font-serif">"</div>
            <p className="text-xl md:text-2xl text-slate-700 font-serif italic mb-10 leading-relaxed relative z-10 font-medium">
              {test.text}
            </p>
            <div className="flex items-center gap-4">
              <img src={test.img} alt={test.author} className="w-14 h-14 rounded-full border-2 border-white shadow-xl object-cover" />
              <div>
                <p className="font-bold text-slate-900 font-serif">{test.author}</p>
                <div className="flex text-yellow-400 text-[10px]">
                  {[...Array(5)].map((_, i) => <span key={i}>★</span>)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="text-center text-slate-400 text-[10px] uppercase font-bold tracking-widest">{t.disclaimer}</p>
    </div>
  );
};

export default TestimonialsSection;
