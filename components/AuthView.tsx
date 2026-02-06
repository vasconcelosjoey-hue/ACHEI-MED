
import React, { useState, useEffect } from 'react';
import { UserRole, User } from '../types';
import { auth, saveUserProfile, googleProvider, getUserProfile } from '../firebase';
import { sendEmailViaResend, getWelcomeTemplate } from '../services/EmailService';
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
  const [successMessage, setSuccessMessage] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '',
    crm: '', whatsapp: '', specialty: ''
  });

  const checkPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length > 6) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    setPasswordStrength(score);
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
          verified: true
        };
        await saveUserProfile(fbUser.uid, profile);
        await sendEmailViaResend(profile.email, 'Bem-vindo ao Agenda Med', getWelcomeTemplate(profile.name));
      }
      onAuthSuccess(profile);
    } catch (err: any) {
      setError(`Erro ao processar perfil: ${err.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleAuthResult(result.user);
    } catch (err: any) {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError('Falha na autenticação com Google.');
      }
    } finally {
      setIsLoading(false);
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
          setError('E-mail não verificado. Verifique sua caixa de entrada.');
          await signOut(auth);
          setIsLoading(false);
          return;
        }
        await handleAuthResult(cred.user);
      } else {
        if (passwordStrength < 2) {
          setError('Sua senha é muito fraca. Use letras e números.');
          setIsLoading(false);
          return;
        }
        const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await sendEmailVerification(cred.user);
        
        const profile: Partial<User> = {
          id: cred.user.uid,
          name: formData.name,
          email: formData.email,
          role: role,
          crm: formData.crm,
          whatsapp: formData.whatsapp,
          verified: false
        };
        await saveUserProfile(cred.user.uid, profile);
        setVerificationSent(true);
      }
    } catch (err: any) {
      const messages: any = {
        'auth/email-already-in-use': 'Este e-mail já está em uso.',
        'auth/wrong-password': 'Senha incorreta.',
        'auth/user-not-found': 'Usuário não encontrado.',
        'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.'
      };
      setError(messages[err.code] || 'Ocorreu um erro na autenticação.');
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 pt-20">
        <div className="max-w-md w-full bg-white rounded-[3rem] p-10 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-8 animate-bounce">✉️</div>
           <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 tracking-tight">Quase lá!</h2>
           <p className="text-slate-500 mb-10 leading-relaxed">
             Enviamos um link de confirmação para <strong>{formData.email}</strong>.<br/>
             Acesse seu e-mail para ativar sua conta.
           </p>
           <button 
             onClick={() => { setVerificationSent(false); setIsLogin(true); }} 
             className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl active:scale-95 transition-all"
           >
             Ir para Login
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 pt-24 transition-colors duration-1000 ${role === 'PATIENT' ? 'bg-slate-50' : 'bg-slate-100'}`}>
      <div className="w-full max-w-lg bg-white rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative border border-slate-100">
        <div className="flex justify-between items-center mb-10">
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-colors">Voltar</button>
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button onClick={() => setRole('PATIENT')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${role === 'PATIENT' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400'}`}>Paciente</button>
            <button onClick={() => setRole('PHYSICIAN')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${role === 'PHYSICIAN' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Médico</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight leading-none">
              {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-3">Health OS v2.0</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-xs font-bold border border-red-100 animate-in slide-in-from-top-2">
              ⚠️ {error}
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-2">Nome Completo</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm outline-none focus:border-teal-400 transition-colors" placeholder="Ex: Dr. Silva" />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-2">E-mail Corporativo</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm outline-none focus:border-teal-400 transition-colors" placeholder="seu@email.com" />
            </div>
            <div className="space-y-1 relative">
              <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-2">Senha</label>
              <input 
                required 
                type="password" 
                value={formData.password} 
                onChange={e => {
                  setFormData({...formData, password: e.target.value});
                  checkPasswordStrength(e.target.value);
                }} 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm outline-none focus:border-teal-400 transition-colors" 
                placeholder="••••••••"
              />
              {!isLogin && formData.password && (
                <div className="flex gap-1 mt-2 px-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${passwordStrength >= i ? 'bg-teal-500' : 'bg-slate-100'}`}></div>
                  ))}
                </div>
              )}
            </div>

            {!isLogin && role === 'PHYSICIAN' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-2">CRM</label>
                  <input required type="text" value={formData.crm} onChange={e => setFormData({...formData, crm: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm" placeholder="00000-UF" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest px-2">WhatsApp</label>
                  <input required type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm" placeholder="92 9..." />
                </div>
              </div>
            )}
          </div>

          <div className="pt-4 space-y-4">
            <button 
              type="submit" 
              disabled={isLoading} 
              className={`w-full py-5 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95 ${role === 'PATIENT' ? 'neo-gradient' : 'bg-slate-900'}`}
            >
              {isLoading ? <div className="loader !border-white !border-t-transparent"></div> : (isLogin ? 'Entrar no Sistema' : 'Finalizar Cadastro')}
            </button>

            <div className="relative py-4">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
               <div className="relative flex justify-center text-[9px] uppercase font-black tracking-widest"><span className="bg-white px-4 text-slate-300">ou continue com</span></div>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleLogin} 
              disabled={isLoading} 
              className="w-full py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-50 transition-all active:scale-95"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-sm font-bold text-slate-700">Conta Google</span>
            </button>
          </div>
          
          <button 
            type="button" 
            onClick={() => { setIsLogin(!isLogin); setError(''); }} 
            className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-teal-600 transition-colors"
          >
            {isLogin ? 'Não tem conta? Crie agora' : 'Já possui conta? Entre aqui'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
