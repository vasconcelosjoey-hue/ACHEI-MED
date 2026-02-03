
import React from 'react';
import { CONSTANTS } from '../types';

const PillarsSection: React.FC<{ t: any }> = ({ t }) => {
  const pillars = [
    { data: t.p1, img: CONSTANTS.P1_IMAGE, reverse: false },
    { data: t.p2, img: CONSTANTS.P2_IMAGE, reverse: true },
    { data: t.p3, img: CONSTANTS.P3_IMAGE, reverse: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 space-y-24">
      {pillars.map((p, idx) => (
        <div key={idx} className={`flex flex-col ${p.reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-12 lg:gap-24 items-center`}>
          <div className="flex-1 w-full">
            <img src={p.img} alt={p.data.t} className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/3]" />
          </div>
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-block bg-blue-50 text-primary font-bold px-4 py-1.5 rounded-full mb-6 text-sm uppercase tracking-wider">
              Pilar {idx + 1}
            </div>
            <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-8 leading-tight">{p.data.t}</h3>
            <ul className="space-y-4 mb-8 inline-block lg:block text-left">
              {[p.data.i1, p.data.i2, p.data.i3].map((item, iidx) => (
                <li key={iidx} className="flex items-center gap-3 text-lg text-slate-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
               <p className="text-green-700 font-bold flex items-center gap-2">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
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
