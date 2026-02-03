
import React from 'react';

const ProblemSection: React.FC<{ t: any }> = ({ t }) => {
  const cards = [
    { title: t.card1.t, desc: t.card1.d, icon: '🗓️' },
    { title: t.card2.t, desc: t.card2.d, icon: '📉' },
    { title: t.card3.t, desc: t.card3.d, icon: '🔍' },
    { title: t.card4.t, desc: t.card4.d, icon: '⚙️' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-6">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-3xl md:text-5xl font-serif font-bold text-slate-900 mb-6 tracking-tight">{t.title}</h2>
        <p className="text-xl text-slate-600 font-sans font-light">{t.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {cards.map((card, idx) => (
          <div key={idx} className="bg-surface p-8 rounded-3xl border border-slate-100 transition-all hover:shadow-xl group">
            <div className="text-4xl mb-6 transform transition-transform group-hover:scale-110 duration-300">{card.icon}</div>
            <h3 className="text-xl font-serif font-bold text-slate-900 mb-4">{card.title}</h3>
            <p className="text-slate-600 leading-relaxed font-sans text-sm">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProblemSection;
