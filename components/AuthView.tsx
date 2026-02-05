
import React, { useState } from 'react';
import { UserRole, User, MOCK_DATA } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onBack }) => {
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    address: '',
    specialty: '',
    plans: [] as string[]
  });

  const handlePlanToggle = (plan: string) => {
    setFormData(prev => ({
      ...prev,
      plans: prev.plans.includes(plan) 
        ? prev.plans.filter(p => p !== plan) 
        : [...prev.plans, plan]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulação de Integração Firebase Auth
    setTimeout(() => {
      setIsLoading(false);
      if (!isLogin) {
        setIsVerificationSent(true);
      } else {
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name || 'Usuário AGENDA MED',
          email: formData.email,
          role: role,
          verified: true
        };
        onAuthSuccess(mockUser);
      }
    }, 1500);
  };

  if (isVerificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl text-center animate-in zoom-in-95">
          <div className="w-20 h-20 bg-aqua/20 text-deepAqua rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✉️</div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">Verifique seu E-mail</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            Enviamos um link de confirmação para <strong>{formData.email}</strong>. Por favor, verifique sua caixa de entrada e spam para ativar sua conta.
          </p>
          <button 
            onClick={() => setIsVerificationSent(false)} 
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all"
          >
            Voltar ao Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-slate-50">
      <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-babyBlue/20 rounded-full blur-[120px]"></div>
      
      <div className="w-full max-w-xl bg-white rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-700 overflow-y-auto max-h-[90vh] scrollbar-hide">
        <button 
          onClick={onBack}
          className="absolute top-6 left-6 md:top-8 md:left-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-deepAqua transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          Sair
        </button>

        <div className="text-center mb-6 mt-4">
          <div className="inline-flex w-12 h-12 md:w-16 md:h-16 neo-gradient rounded-2xl items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-xl mb-4">AM</div>
          <h1 className="text-3xl md:text-4xl font-display font-bold text-slate-900 tracking-tight">AGENDA MED</h1>
        </div>

        <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
          {(['PATIENT', 'PHYSICIAN'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setIsLogin(true); }}
              className={`flex-1 py-2.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${role === r ? 'bg-white text-deepAqua shadow-sm' : 'text-slate-400'}`}
            >
              {r === 'PATIENT' ? 'Paciente' : 'Médico'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Nome Completo</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Ex: Dra. Carolina Lima"
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-aqua/20 transition-all"
              />
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">E-mail</label>
            <input 
              required
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="seu@email.com"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-aqua/20 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Senha</label>
            <input 
              required
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-aqua/20 transition-all"
            />
          </div>

          {role === 'PHYSICIAN' && !isLogin && (
            <div className="space-y-1 animate-in slide-in-from-top-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Especialidade</label>
              <select 
                required
                value={formData.specialty}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none"
              >
                <option value="">Selecione...</option>
                {MOCK_DATA.SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          )}

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full neo-gradient py-4 rounded-xl font-bold text-white shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center"
          >
            {isLoading ? <div className="loader !border-white !border-t-transparent"></div> : (isLogin ? 'Entrar' : 'Criar Conta')}
          </button>
          
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-deepAqua transition-colors"
          >
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
