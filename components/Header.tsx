
import React, { useEffect, useState } from 'react';
import { User, AppView } from '../types';
import { translations } from '../translations';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onViewChange: (view: AppView) => void;
  onToggleNotifs: () => void;
  unreadCount: number;
  view: AppView;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onViewChange, onToggleNotifs, unreadCount, view }) => {
  const [scrolled, setScrolled] = useState(false);
  const t = translations['pt-BR'].nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    if (view !== 'LANDING') {
      onViewChange('LANDING');
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'h-20 bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'h-24 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-12">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => onViewChange('LANDING')}
          >
            <div className="w-10 h-10 neo-gradient rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-babyBlue/40 transform group-hover:rotate-12 transition-transform">
              AM
            </div>
            <span className="font-display font-bold text-2xl tracking-tighter bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
              Achei Med
            </span>
          </div>

          {view === 'LANDING' && (
            <nav className="hidden lg:flex items-center gap-1">
              {[
                { label: t.problem, id: 'problema' },
                { label: t.pillars, id: 'pilares' },
                { label: t.comparison, id: 'comparativo' },
                { label: t.testimonials, id: 'depoimentos' },
                { label: t.contact, id: 'contato' },
              ].map((link) => (
                <button 
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-500 hover:text-deepAqua transition-all"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          )}

          {view !== 'LANDING' && user && (
            <nav className="hidden md:flex items-center gap-1">
              <button 
                onClick={() => onViewChange('DASHBOARD')}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-babyBlue/10 transition-all"
              >
                Dashboard
              </button>
              {user.role === 'PATIENT' && (
                <button 
                  onClick={() => onViewChange('SEARCH')}
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-slate-600 hover:bg-babyBlue/10 transition-all"
                >
                  Buscar Médicos
                </button>
              )}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <button 
                onClick={onToggleNotifs}
                className="relative p-2.5 rounded-xl bg-slate-50 text-slate-500 hover:bg-babyBlue/20 transition-all border border-slate-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full font-bold border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none">{user.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-deepAqua mt-1">{user.role}</p>
                </div>
                <div 
                  className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-md overflow-hidden cursor-pointer"
                  onClick={() => onViewChange('DASHBOARD')}
                >
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=B9E6FE&color=0D9488`} alt={user.name} />
                </div>
                <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => onViewChange('AUTH')}
              className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-xl transition-all transform hover:-translate-y-0.5 active:scale-95"
            >
              {t.cta}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
