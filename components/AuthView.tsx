
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
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    address: '',
    specialty: '',
    plans: [] as string[]
  });

  const demoAccounts = {
    PHYSICIAN: {
      name: 'Dr. Arlindo Jr.',
      email: 'arlindo@agendamed.com.br',
      role: 'PHYSICIAN' as UserRole,
      avatar: 'https://i.pravatar.cc/150?u=arlindo',
      address: 'Av. Djalma Batista, 1661 - Chapada, Manaus',
      lat: -3.1019,
      lng: -60.0250
    },
    PATIENT: {
      name: 'Thiago Amazon',
      email: 'thiago@paciente.com.br',
      role: 'PATIENT' as UserRole,
      avatar: 'https://i.pravatar.cc/150?u=thiago',
      lat: -3.1100,
      lng: -60.0300
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
    
    setTimeout(() => {
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || (role === 'PHYSICIAN' ? 'Dr. Arlindo Jr.' : 'Thiago Amazon'),
        email: formData.email,
        role: role,
        avatar: undefined,
        address: formData.address || (role === 'PHYSICIAN' ? 'Av. Djalma Batista, 1661' : undefined),
        lat: role === 'PHYSICIAN' ? -3.1019 : -3.1100,
        lng: role === 'PHYSICIAN' ? -60.0250 : -60.0300
      };
      setIsLoading(false);
      onAuthSuccess(mockUser);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-50 pt-24 pb-12">
      <div className="absolute top-[-10%] left-[-10%] w-1/2 h-1/2 bg-babyBlue/30 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-1/2 h-1/2 bg-aqua/30 rounded-full blur-[120px] animate-pulse"></div>

      <div className="w-full max-w-xl glass-card rounded-[3rem] p-8 md:p-12 shadow-2xl relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <button 
          onClick={onBack}
          className="absolute top-8 left-8 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-deepAqua transition-colors flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
          Voltar ao site
        </button>

        <div className="text-center mb-8 mt-4">
          <div className="inline-flex w-16 h-16 neo-gradient rounded-2xl items-center justify-center text-white text-3xl font-bold shadow-xl shadow-babyBlue/40 mb-4">
            AM
          </div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">AGENDA MED</h1>
          <p className="text-slate-500 font-medium mt-2">Manaus: Gestão Inteligente em Saúde</p>
        </div>

        <div className="flex p-1.5 bg-slate-100 rounded-2xl mb-8">
          {(['PATIENT', 'PHYSICIAN', 'ATTENDANT'] as UserRole[]).map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setIsLogin(true); }}
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
                placeholder="Ex: Dra. Carolina Lima"
                className="w-full bg-white/50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-aqua/20 transition-all outline-none"
              />
            </div>
          )}

          {role === 'PHYSICIAN' && !isLogin && (
            <>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Especialidade Principal</label>
                <select 
                  required
                  value={formData.specialty}
                  onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                  className="w-full bg-white/50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-aqua/20 outline-none"
                >
                  <option value="">Selecione...</option>
                  {MOCK_DATA.SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Endereço da Clínica (Manaus)</label>
                <input 
                  required
                  type="text" 
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  placeholder="Rua, Número, Bairro"
                  className="w-full bg-white/50 border border-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-aqua/20 transition-all outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Planos Atendidos</label>
                <div className="grid grid-cols-2 gap-2">
                  {MOCK_DATA.PLANS.map(plan => (
                    <button
                      key={plan}
                      type="button"
                      onClick={() => handlePlanToggle(plan)}
                      className={`py-2 px-3 rounded-xl text-[10px] font-bold border transition-all ${formData.plans.includes(plan) ? 'bg-deepAqua/10 border-deepAqua text-deepAqua' : 'bg-white/30 border-slate-100 text-slate-400'}`}
                    >
                      {plan}
                    </button>
                  ))}
                </div>
              </div>
            </>
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
            {isLoading ? <div className="loader !border-white !border-t-transparent"></div> : (isLogin ? 'Entrar no Hub' : 'Finalizar Cadastro')}
          </button>
          
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-deepAqua transition-colors mt-2"
          >
            {isLogin ? 'Ainda não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-100">
          <p className="text-center text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Acesso Rápido (Ambiente de Piloto)</p>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => handleDemoLogin('PHYSICIAN')}
              className="py-3 px-4 rounded-xl bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
            >
              Piloto: Sou Médico
            </button>
            <button 
              onClick={() => handleDemoLogin('PATIENT')}
              className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all"
            >
              Piloto: Sou Paciente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthView;
