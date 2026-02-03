
import React, { useState } from 'react';
import { UserRole, User } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess }) => {
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const demoAccounts = {
    PHYSICIAN: {
      name: 'Dr. Arlindo Jr.',
      email: 'arlindo@acheimed.com.br',
      role: 'PHYSICIAN' as UserRole,
      avatar: 'https://i.pravatar.cc/150?u=arlindo'
    },
    PATIENT: {
      name: 'Thiago Amazon',
      email: 'thiago@paciente.com.br',
      role: 'PATIENT' as UserRole,
      avatar: 'https://i.pravatar.cc/150?u=thiago'
    }
  };

  const handleDemoLogin = (type: 'PHYSICIAN' | 'PATIENT') => {
    setIsLoading(true);
    setTimeout(() => {
      const demo = demoAccounts[type];
      onAuthSuccess({
        id: Math.random().toString(36).substr(2, 9),
        ...demo
      });
      setIsLoading(false);
    }, 1000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || (role === 'PHYSICIAN' ? 'Dr. Arlindo Jr.' : 'Thiago Amazon'),
        email: formData.email,
        role: role,
        avatar: undefined
      };
      setIsLoading(false);
      onAuthSuccess(mockUser);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-babyBlue/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-aqua/30 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-xl glass-card rounded-[3rem] p-8 md:p-12 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 neo-gradient rounded-2xl items-center justify-center text-white text-3xl font-bold shadow-xl shadow-babyBlue/40 mb-4">
            AM
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Achei Med</h1>
          <p className="text-slate-500 font-medium mt-2">Manaus: Gestão Inteligente em Saúde</p>
        </div>

        <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
          {(['PATIENT', 'PHYSICIAN', 'ATTENDANT'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-3 text-[10px] font-black uppercase tracking-[0.2em] rounded-xl transition-all ${role === r ? 'bg-white text-deepAqua shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {r === 'PATIENT' ? 'Paciente' : r === 'PHYSICIAN' ? 'Médico' : 'Atendente'}
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
                placeholder="Ex: Maria Solimões"
                className="w-full bg-white/50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-aqua/20 transition-all outline-none"
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
              placeholder="exemplo@manaus.com"
              className="w-full bg-white/50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-aqua/20 transition-all outline-none"
            />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between px-2">
               <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Senha</label>
               {isLogin && <button type="button" className="text-[10px] font-black uppercase text-deepAqua hover:underline tracking-widest">Esqueci a senha</button>}
            </div>
            <input 
              required
              type="password" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
              className="w-full bg-white/50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-aqua/20 transition-all outline-none"
            />
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full neo-gradient py-4 rounded-2xl font-bold text-white shadow-xl shadow-babyBlue/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3"
          >
            {isLoading ? <div className="loader !border-white !border-t-transparent"></div> : (isLogin ? 'Entrar no Hub' : 'Criar Conta')}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <p className="text-center text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Acesso Rápido (Ambiente de Teste)</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleDemoLogin('PHYSICIAN')}
              className="py-3 px-4 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
            >
              Sou Médico (Manaus)
            </button>
            <button 
              onClick={() => handleDemoLogin('PATIENT')}
              className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Sou Paciente (Manaus)
            </button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-[11px] font-black uppercase text-slate-400 hover:text-deepAqua tracking-widest transition-colors"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já possui conta? Faça Login'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
