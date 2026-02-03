
import React from 'react';

const StartSection: React.FC<{ t: any }> = ({ t }) => {
  const steps = [
    { ...t.s1, icon: '🚀' },
    { ...t.s2, icon: '🤝' },
    { ...t.s3, icon: '📈' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">{t.title}</h2>
        <p className="text-xl text-slate-600">{t.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((step, idx) => (
          <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 text-center relative group">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-bold text-xl border-4 border-surface shadow-lg">
              {idx + 1}
            </div>
            <div className="text-5xl mt-6 mb-8 transform transition-transform group-hover:rotate-12">{step.icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-4">{step.t}</h3>
            <p className="text-slate-600 leading-relaxed">{step.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StartSection;
