
import React, { useState } from 'react';

interface LoginViewProps {
  t: any;
  onLogin: () => void;
}

const LoginView: React.FC<LoginViewProps> = ({ t, onLogin }) => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulação de login
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-6 pt-32">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-10">
          <div className="inline-flex w-16 h-16 bg-primary rounded-2xl items-center justify-center text-white text-3xl font-serif font-bold shadow-xl shadow-primary/20 mb-6">
            AM
          </div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{t.title}</h2>
          <p className="text-slate-500 font-medium text-sm mt-2">{t.subtitle}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">{t.email}</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="clinica@exemplo.com"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">{t.password}</label>
               <button type="button" className="text-[10px] font-black uppercase text-primary/60 hover:text-primary tracking-widest">{t.forgot}</button>
            </div>
            <input 
              required
              type="password" 
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-primary/10 transition-all outline-none"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-bold text-white shadow-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] ${loading ? 'bg-slate-300' : 'bg-primary hover:bg-slate-800'}`}
          >
            {loading ? '...' : t.button}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-50 text-center">
           <button 
            onClick={onLogin}
            className="text-[11px] font-black uppercase text-slate-400 hover:text-primary tracking-[0.2em] transition-colors"
           >
             {t.demo}
           </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
