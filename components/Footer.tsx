
import React from 'react';
import { CONSTANTS } from '../types';

const Footer: React.FC<{ t: any }> = ({ t }) => {
  return (
    <footer className="bg-white py-16 border-t border-slate-100 font-sans">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 neo-gradient rounded-xl flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm">AM</div>
            <span className="font-serif font-bold text-2xl text-slate-900 tracking-tighter">AGENDA MED</span>
          </div>

          <div className="flex gap-10 text-[11px] font-black uppercase tracking-widest text-slate-400">
            <a href={CONSTANTS.PRIV_URL} target="_blank" className="hover:text-deepAqua transition-colors">{t.privacy}</a>
            <a href={CONSTANTS.TERMS_URL} target="_blank" className="hover:text-deepAqua transition-colors">{t.terms}</a>
          </div>
        </div>

        <div className="mt-12 pt-12 border-t border-slate-50 text-center">
          <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto font-medium">
            {t.lgpd}
          </p>
          <div className="mt-8 space-y-2">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em]">
              Desenvolvido por AGENDA MED
            </p>
            <p className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">
              © {new Date().getFullYear()} Soluções em Saúde Inteligente.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
