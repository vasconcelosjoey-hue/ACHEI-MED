
import React from 'react';

const BenefitsSection: React.FC<{ t: any }> = ({ t }) => {
  const benefits = [t.b1, t.b2, t.b3, t.b4];
  
  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {t.title}
          </h2>
          <p className="text-xl text-slate-600 mb-10">
            {t.subtitle}
          </p>
          <ul className="space-y-6">
            {benefits.map((benefit, idx) => (
              <li key={idx} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-lg font-semibold text-slate-800">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 translate-y-8">
             <div className="w-12 h-12 bg-primary rounded-xl mb-4 flex items-center justify-center text-white font-bold">1</div>
             <p className="font-bold text-slate-900">IA de Agendamento</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
             <div className="w-12 h-12 bg-primary rounded-xl mb-4 flex items-center justify-center text-white font-bold">2</div>
             <p className="font-bold text-slate-900">Checkout Rápido</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 translate-y-8">
             <div className="w-12 h-12 bg-primary rounded-xl mb-4 flex items-center justify-center text-white font-bold">3</div>
             <p className="font-bold text-slate-900">Multi-Plataforma</p>
          </div>
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100">
             <div className="w-12 h-12 bg-primary rounded-xl mb-4 flex items-center justify-center text-white font-bold">4</div>
             <p className="font-bold text-slate-900">CRM Dedicado</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
