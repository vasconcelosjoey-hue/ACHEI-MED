
import React, { useState } from 'react';
import { UserRole, User, MOCK_DATA } from '../types';
import { translations } from '../translations';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onBack }) => {
  const t = translations['pt-BR'].login;
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '',
    crm: '',
    whatsapp: '',
    specialty: '',
    street: '',
    number: '',
    neighborhood: '',
    zip: '',
    plans: [] as string[]
  });

  const togglePlan = (plan: string) => {
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
      setIsLoading(false);
      if (!isLogin) {
        setIsVerificationSent(true);
      } else {
        const mockUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: formData.name || 'Usuário',
          email: formData.email,
          role: role,
          verified: true,
          whatsapp: formData.whatsapp,
          specialty: formData.specialty,
          plans: formData.plans
        };
        onAuthSuccess(mockUser);
      }
    }, 1500);
  };

  if (isVerificationSent) {
    return (
      <div className="h-screen flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl text-center">
          <div className="w-20 h-20 bg-aqua/20 text-deepAqua rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✉️</div>
          <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">Verifique seu E-mail</h2>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">Enviamos um link para <strong>{formData.email}</strong> para confirmar seu acesso profissional.</p>
          <button onClick={() => setIsVerificationSent(false)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">Voltar ao Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-babyBlue/20 via-transparent to-transparent"></div>
      
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-6">
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-deepAqua transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            Voltar
          </button>
          <div className="flex p-1 bg-slate-100 rounded-xl">
            {(['PATIENT', 'PHYSICIAN', 'ATTENDANT'] as UserRole[]).map((r) => (
              <button
                key={r}
                onClick={() => { setRole(r); setIsLogin(true); }}
                className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${role === r ? 'bg-white text-deepAqua shadow-sm' : 'text-slate-400'}`}
              >
                {r === 'PATIENT' ? 'Paciente' : r === 'PHYSICIAN' ? 'Médico' : 'Atendente'}
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2 scrollbar-hide">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-display font-bold text-slate-900">{isLogin ? 'Bem-vindo de volta' : 'Crie sua Conta'}</h1>
            <p className="text-slate-500 text-sm">{role === 'PHYSICIAN' ? 'Portal do Especialista' : 'Portal do Paciente'}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {!isLogin && (
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Nome Completo</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none focus:ring-2 focus:ring-aqua/20" />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">E-mail</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none" />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Senha</label>
              <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none" />
            </div>

            {!isLogin && role === 'PHYSICIAN' && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">CRM</label>
                  <input required type="text" placeholder="00000-UF" value={formData.crm} onChange={e => setFormData({...formData, crm: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">WhatsApp Profissional</label>
                  <input required type="tel" placeholder="(00) 00000-0000" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Especialidade</label>
                  <select required value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none">
                    <option value="">Selecione...</option>
                    {MOCK_DATA.SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                
                <div className="md:col-span-2 grid grid-cols-3 gap-3">
                   <div className="col-span-2 space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Rua / Av</label>
                      <input required type="text" value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none" />
                   </div>
                   <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Número</label>
                      <input required type="text" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm outline-none" />
                   </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Convênios Atendidos</label>
                   <div className="flex flex-wrap gap-2">
                      {MOCK_DATA.PLANS.map(p => (
                        <button key={p} type="button" onClick={() => togglePlan(p)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${formData.plans.includes(p) ? 'bg-deepAqua text-white border-deepAqua' : 'bg-slate-50 text-slate-400 border-slate-100 hover:border-aqua'}`}>
                          {p}
                        </button>
                      ))}
                   </div>
                </div>
              </>
            )}
          </div>

          <button type="submit" disabled={isLoading} className="w-full neo-gradient py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center">
            {isLoading ? <div className="loader !border-white !border-t-transparent"></div> : (isLogin ? 'Entrar' : 'Finalizar Cadastro Profissional')}
          </button>
          
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-deepAqua transition-colors">
            {isLogin ? 'Não tem conta? Começar Agora' : 'Já tem conta? Fazer Login'}
          </button>
        </form>

        <footer className="mt-6 pt-4 border-t border-slate-50 text-center text-[9px] font-black uppercase tracking-widest text-slate-300">
           Powered By Agenda Med | Todos os direitos reservados 2026
        </footer>
      </div>
    </div>
  );
};

export default AuthView;
