
import React, { useEffect, useRef } from 'react';
import { CONSTANTS } from '../types';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PillarsSection: React.FC<{ t: any }> = ({ t }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const rows = gsap.utils.toArray(".pillar-row");
      
      rows.forEach((row: any) => {
        const img = row.querySelector(".pillar-image");
        const content = row.querySelector(".pillar-content");
        
        // Image Mask Reveal
        gsap.fromTo(img, 
          { clipPath: "inset(0 100% 0 0)", scale: 1.3 },
          { 
            clipPath: "inset(0 0% 0 0)", 
            scale: 1,
            duration: 1.5,
            ease: "power4.inOut",
            scrollTrigger: {
              trigger: row,
              start: "top 70%",
              toggleActions: "play none none reverse"
            }
          }
        );

        // Content Stagger
        gsap.from(content.children, {
          y: 50,
          opacity: 0,
          stagger: 0.15,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 60%",
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const pillars = [
    { data: t.p1, img: CONSTANTS.P1_IMAGE, reverse: false },
    { data: t.p2, img: CONSTANTS.P2_IMAGE, reverse: true },
    { data: t.p3, img: CONSTANTS.P3_IMAGE, reverse: false },
  ];

  return (
    <div ref={sectionRef} className="max-w-7xl mx-auto px-6 space-y-40 pb-40">
      {pillars.map((p, idx) => (
        <div key={idx} className={`pillar-row flex flex-col ${p.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-16 lg:gap-32 items-center`}>
          <div className="flex-1 w-full overflow-hidden rounded-[3.5rem] bg-slate-100 aspect-[16/10]">
            <img src={p.img} alt={p.data.t} className="pillar-image w-full h-full object-cover will-change-transform" />
          </div>
          <div className="flex-1 pillar-content">
            <div className="inline-block bg-aqua/20 text-deepAqua font-black px-6 py-2 rounded-full mb-8 text-[11px] uppercase tracking-[0.2em]">
              Pilar Tecnológico {idx + 1}
            </div>
            <h3 className="text-4xl md:text-6xl font-display font-bold text-slate-900 mb-10 leading-[1.1] tracking-tight">{p.data.t}</h3>
            <div className="space-y-6 mb-12">
              {[p.data.i1, p.data.i2, p.data.i3].map((item, iidx) => (
                <div key={iidx} className="flex items-center gap-5">
                  <div className="w-10 h-[1px] bg-slate-200"></div>
                  <span className="text-xl text-slate-500 font-medium">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl border border-white/10 group hover:bg-deepAqua transition-colors duration-500">
               <p className="text-aqua font-bold flex items-center gap-4 group-hover:text-white">
                 <span className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl group-hover:bg-white/20 transition-colors">⚡</span>
                 {p.data.res}
               </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PillarsSection;
