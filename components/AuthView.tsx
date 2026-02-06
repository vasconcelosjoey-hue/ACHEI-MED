import React, { useState } from 'react';
import { UserRole, User } from '../types';
import { auth, saveUserProfile, googleProvider, getUserProfile } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  signOut,
  signInWithPopup,
  sendPasswordResetEmail
} from 'firebase/auth';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  onBack: () => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthSuccess, onBack }) => {
  const [role, setRole] = useState<UserRole>('PATIENT');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '',
    crm: '', whatsapp: '', specialty: ''
  });

  const formatWhatsApp = (val: string) => {
    const digits = val.replace(/\D/g, '');
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  };

  const handleAuthResult = async (fbUser: any) => {
    try {
      let profile = await getUserProfile(fbUser.uid);
      if (!profile) {
        profile = {
          id: fbUser.uid,
          name: fbUser.displayName || formData.name || 'Usuário',
          email: fbUser.email || formData.email,
          role: role,
          avatar: fbUser.photoURL || undefined,
          verified: true,
          whatsapp: formData.whatsapp,
          crm: formData.crm,
          availabilityRules: { start: "08:00", end: "18:00", slotDuration: 30 }
        };
        await saveUserProfile(fbUser.uid, profile);
      }
      onAuthSuccess(profile);
    } catch (err: any) {
      setError(`Erro: ${err.message}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      if (isLogin) {
        const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        if (!cred.user.emailVerified) {
          setError('E-mail não verificado.');
          await signOut(auth);
          setIsLoading(false);
          return;
        }
        await handleAuthResult(cred.user);
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
          verified: false,
          availabilityRules: { start: "09:00", end: "17:00", slotDuration: 30 }
        };
        await saveUserProfile(cred.user.uid, profile);
        setVerificationSent(true);
      }
    } catch (err: any) {
      setError('Falha na autenticação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError('Digite seu e-mail primeiro.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert('E-mail de recuperação enviado!');
    } catch (err) {
      setError('Erro ao enviar recuperação.');
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 pt-20">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">✉️</div>
           <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 tracking-tight">Verifique seu E-mail</h2>
           <p className="text-slate-500 mb-10 leading-relaxed">Enviamos um link para <strong>{formData.email}</strong>. Ative sua conta para entrar.</p>
           <button onClick={() => { setVerificationSent(false); setIsLogin(true); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold">Ir para Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pt-24 bg-slate-50">
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <button onClick={onBack} className="text-[10px] font-black uppercase text-slate-300 hover:text-slate-900">Voltar</button>
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button onClick={() => setRole('PATIENT')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${role === 'PATIENT' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400'}`}>Paciente</button>
            <button onClick={() => setRole('PHYSICIAN')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${role === 'PHYSICIAN' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Médico</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">{isLogin ? 'Agenda Med' : 'Criar Conta'}</h1>
          </div>

          {error && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-in slide-in-from-top-2">⚠️ {error}</div>}

          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-2">Nome Completo</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm" placeholder="Nome Sobrenome" />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-2">E-mail</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm" placeholder="seu@email.com" />
            </div>
            
            <div className="space-y-1 relative">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-2">Senha</label>
              <div className="relative">
                <input 
                  required 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password} 
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 pr-12 text-sm" 
                  placeholder="••••••••"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  )}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-2">WhatsApp</label>
                <input 
                  required 
                  type="tel" 
                  value={formData.whatsapp} 
                  onChange={e => setFormData({...formData, whatsapp: formatWhatsApp(e.target.value)})} 
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm" 
                  placeholder="(92) 99999-9999" 
                />
              </div>
            )}
          </div>

          <div className="pt-4 space-y-4">
            <button 
              type="submit" 
              disabled={isLoading} 
              className={`w-full py-5 rounded-2xl font-bold text-white shadow-xl transition-all active:scale-95 ${role === 'PATIENT' ? 'neo-gradient' : 'bg-slate-900'}`}
            >
              {isLoading ? 'Aguarde...' : (isLogin ? 'Entrar' : 'Cadastrar')}
            </button>
            
            {isLogin && (
              <button 
                type="button" 
                onClick={handleForgotPassword}
                className="w-full text-[10px] font-black uppercase text-slate-400 hover:text-teal-600 tracking-widest text-center"
              >
                Esqueci minha senha
              </button>
            )}
          </div>
          
          <button 
            type="button" 
            onClick={() => setIsLogin(!isLogin)} 
            className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest text-center"
          >
            {isLogin ? 'Criar nova conta' : 'Já tenho conta'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;