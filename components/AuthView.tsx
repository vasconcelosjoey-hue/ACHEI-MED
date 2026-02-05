
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
    name: '', email: '', password: '',
    crm: '', whatsapp: '', specialty: '',
    plans: [] as string[]
  });

  const isPatient = role === 'PATIENT';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const mockUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name || (isPatient ? 'Paciente' : 'Dr(a). Profissional'),
        email: formData.email,
        role: role,
        whatsapp: formData.whatsapp,
        specialty: formData.specialty,
        crm: formData.crm,
        plans: formData.plans
      };
      onAuthSuccess(mockUser);
    }, 1500);
  };

  return (
    <div className={`h-screen flex flex-col items-center justify-center p-4 transition-colors duration-700 ${isPatient ? 'bg-slate-50' : 'bg-slate-100'}`}>
      {/* Dynamic Aura Background */}
      <div className={`absolute top-0 right-0 w-full h-full opacity-30 transition-all duration-1000 blur-[120px] -z-10 ${isPatient ? 'bg-babyBlue' : 'bg-deepAqua'}`}></div>
      
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative z-10 flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
            Sair
          </button>
          
          <div className="flex p-1.5 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setRole('PATIENT')}
              className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${isPatient ? 'bg-white text-deepAqua shadow-sm' : 'text-slate-400'}`}
            >
              Paciente
            </button>
            <button
              onClick={() => setRole('PHYSICIAN')}
              className={`px-8 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${!isPatient ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}
            >
              Médico
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2 scrollbar-hide">
          <div className="text-center mb-6">
            <h1 className={`text-4xl font-display font-bold tracking-tight transition-colors duration-500 ${isPatient ? 'text-slate-900' : 'text-deepAqua'}`}>
              {isLogin ? 'Agenda Med' : 'Nova Conta'}
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
              {isPatient ? 'Portal do Bem-estar' : 'Portal Profissional de Saúde'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {!isLogin && (
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Nome Completo</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full bg-slate-50 border rounded-xl p-3 text-sm outline-none transition-all ${isPatient ? 'border-slate-100 focus:ring-aqua/20' : 'border-slate-200 focus:ring-deepAqua/10'}`} />
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

            {!isLogin && !isPatient && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">CRM</label>
                  <input required type="text" placeholder="00000-UF" value={formData.crm} onChange={e => setFormData({...formData, crm: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">WhatsApp</label>
                  <input required type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Especialidade</label>
                  <select required value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none">
                    <option value="">Selecione...</option>
                    {MOCK_DATA.SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className={`w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center transition-all transform hover:scale-[1.01] active:scale-95 ${isPatient ? 'neo-gradient' : 'bg-slate-900'}`}
          >
            {isLoading ? <div className="loader !border-white !border-t-transparent"></div> : (isLogin ? 'Entrar no Sistema' : 'Finalizar Cadastro')}
          </button>
          
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-deepAqua transition-colors">
            {isLogin ? 'Não tem conta? Criar Agora' : 'Já tem conta? Login'}
          </button>
        </form>

        <footer className="mt-8 pt-4 border-t border-slate-50 text-center text-[9px] font-black uppercase tracking-widest text-slate-300">
           Powered By Agenda Med | Todos os direitos reservados 2026
        </footer>
      </div>
    </div>
  );
};

export default AuthView;
