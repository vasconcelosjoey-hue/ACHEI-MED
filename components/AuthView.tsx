
import React, { useState } from 'react';
import { UserRole, User, MOCK_DATA } from '../types';
import { auth, saveUserProfile } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onBack }) => {
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '',
    crm: '', whatsapp: '', specialty: ''
  });

  const isPatient = role === 'PATIENT';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        if (!cred.user.emailVerified) {
          setError('Por favor, verifique seu e-mail antes de acessar.');
          setIsLoading(false);
          return;
        }
        // Perfil será carregado pelo App.tsx via onAuthStateChanged
      } else {
        const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await sendEmailVerification(cred.user);
        
        const profile: Partial<User> = {
          id: cred.user.uid,
          name: formData.name,
          email: formData.email,
          role: role,
          crm: formData.crm,
          whatsapp: formData.whatsapp,
          specialty: formData.specialty
        };
        
        await saveUserProfile(cred.user.uid, profile);
        setVerificationSent(true);
      }
    } catch (err: any) {
      setError(err.message === 'Firebase: Error (auth/invalid-credential).' ? 'E-mail ou senha incorretos.' : err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-12 text-center shadow-2xl animate-in zoom-in-95 duration-500">
           <div className="w-24 h-24 bg-aqua/20 text-deepAqua rounded-full flex items-center justify-center text-4xl mx-auto mb-8">✉️</div>
           <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Verifique seu E-mail</h2>
           <p className="text-slate-500 mb-8">Enviamos um link de ativação para <strong>{formData.email}</strong>. Clique no link para liberar seu acesso.</p>
           <button onClick={() => setIsLogin(true)} className="w-full py-4 neo-gradient text-white rounded-2xl font-bold shadow-xl">Ir para Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col items-center justify-center p-4 transition-colors duration-700 ${isPatient ? 'bg-slate-50' : 'bg-slate-100'}`}>
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative z-10 flex flex-col max-h-[95vh]">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-all">Voltar ao Site</button>
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button onClick={() => setRole('PATIENT')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${isPatient ? 'bg-white text-deepAqua shadow-sm' : 'text-slate-400'}`}>Paciente</button>
            <button onClick={() => setRole('PHYSICIAN')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${!isPatient ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Médico</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2 scrollbar-hide">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900">{isLogin ? 'Agenda Med' : 'Criar Hub Saúde'}</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">{isLogin ? 'Acesse seu painel' : 'Junte-se ao ecossistema'}</p>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100">{error}</div>}

          <div className="grid md:grid-cols-2 gap-4">
            {!isLogin && (
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Nome Completo</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border rounded-xl p-4 text-sm outline-none border-slate-100" />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">E-mail</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Senha</label>
              <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm" />
            </div>

            {!isLogin && !isPatient && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">CRM</label>
                  <input required type="text" placeholder="00000-AM" value={formData.crm} onChange={e => setFormData({...formData, crm: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">WhatsApp</label>
                  <input required type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none" />
                </div>
                <div className="md:col-span-2 space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Especialidade</label>
                  <select required value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm outline-none">
                    <option value="">Selecione...</option>
                    {MOCK_DATA.SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </>
            )}
          </div>

          <button type="submit" disabled={isLoading} className={`w-full py-5 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center transition-all ${isPatient ? 'neo-gradient' : 'bg-slate-900'}`}>
            {isLoading ? <div className="loader !border-white !border-t-transparent"></div> : (isLogin ? 'Acessar Conta' : 'Enviar E-mail de Verificação')}
          </button>
          
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-deepAqua transition-colors">
            {isLogin ? 'Não tem conta? Criar Nova' : 'Já tem conta? Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
