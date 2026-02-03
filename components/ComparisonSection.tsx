
import React from 'react';

const ComparisonSection: React.FC<{ t: any }> = ({ t }) => {
  const rows = [t.row1, t.row2, t.row3, t.row4, t.row5];

  return (
    <div className="max-w-5xl mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">{t.title}</h2>
      </div>

      <div className="overflow-hidden rounded-3xl shadow-2xl bg-white border border-slate-100">
        {/* Mobile stacking view */}
        <div className="md:hidden">
          {rows.map((row, idx) => (
            <div key={idx} className="p-6 border-b border-slate-100 last:border-0">
               <div className="mb-4">
                 <span className="text-xs font-bold text-red-400 uppercase tracking-tighter block mb-1">{t.current}</span>
                 <p className="text-slate-500 font-medium">{row[0]}</p>
               </div>
               <div>
                 <span className="text-xs font-bold text-green-500 uppercase tracking-tighter block mb-1">{t.withUs}</span>
                 <p className="text-slate-900 font-bold">{row[1]}</p>
               </div>
            </div>
          ))}
        </div>

        {/* Desktop table view */}
        <table className="hidden md:table w-full text-left border-collapse">
          <thead className="bg-primary text-white">
            <tr>
              <th className="p-8 text-xl font-bold">{t.current}</th>
              <th className="p-8 text-xl font-bold bg-primary/90">{t.withUs}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, idx) => (
              <tr key={idx} className="hover:bg-slate-50 transition-colors">
                <td className="p-8 text-slate-500 font-medium border-r border-slate-100">{row[0]}</td>
                <td className="p-8 text-slate-900 font-bold">{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComparisonSection;
