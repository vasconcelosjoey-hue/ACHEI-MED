
import React, { useState, useEffect } from 'react';
import { UserRole, User, MOCK_DATA } from '../types';
import { auth, saveUserProfile, googleProvider, getUserProfile, db } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  sendEmailVerification,
  signOut,
  deleteUser,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
  const [resendStatus, setResendStatus] = useState('');
  
  const [formData, setFormData] = useState({ 
    name: '', email: '', password: '',
    crm: '', whatsapp: '', specialty: ''
  });

  const isPatient = role === 'PATIENT';

  useEffect(() => {
    getRedirectResult(auth).then(async (result) => {
      if (result) {
        setIsLoading(true);
        await handleAuthResult(result.user);
        setIsLoading(false);
      }
    }).catch((err) => {
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(`Erro no redirecionamento: ${err.code}`);
      }
    });
  }, []);

  useEffect(() => {
    setError('');
    setSuccessMessage('');
  }, [isLogin, role]);

  const handlePasswordChange = (val: string) => {
    const filtered = val.toLowerCase().replace(/[^a-z0-9]/g, '');
    setFormData({ ...formData, password: filtered });
  };

  const handleAuthResult = async (fbUser: any) => {
    try {
      let profile = await getUserProfile(fbUser.uid);
      if (!profile) {
        profile = {
          id: fbUser.uid,
          name: fbUser.displayName || 'Usuário Google',
          email: fbUser.email || '',
          role: role,
          avatar: fbUser.photoURL || undefined,
          verified: true
        };
        await saveUserProfile(fbUser.uid, profile);
      }
    } catch (err: any) {
      setError(`Erro ao salvar perfil: ${err.code || err.message}`);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleAuthResult(result.user);
    } catch (err: any) {
      setError(`Erro: ${err.code}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError('Digite seu e-mail para redefinir a senha.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setSuccessMessage('E-mail de redefinição enviado!');
    } catch (err: any) {
      setError(`Erro: ${err.code}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (auth.currentUser) {
      try {
        setResendStatus('Enviando...');
        await sendEmailVerification(auth.currentUser);
        setResendStatus('E-mail reenviado!');
        setTimeout(() => setResendStatus(''), 3000);
      } catch (err: any) {
        setResendStatus('Erro ao enviar.');
      }
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
          setError('Sua conta ainda não foi verificada. Verifique seu e-mail.');
          await signOut(auth);
          setIsLoading(false);
          return;
        }
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
          verified: false
        };
        await saveUserProfile(cred.user.uid, profile);
        setVerificationSent(true);
        await signOut(auth);
      }
    } catch (err: any) {
      setError(`Erro: ${err.code}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 pt-24">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-8 md:p-10 text-center shadow-2xl border border-slate-100">
           <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-6">✉️</div>
           <h2 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-4 tracking-tight">E-mail de Ativação!</h2>
           <p className="text-slate-500 mb-8 text-sm leading-relaxed">Verifique <strong>{formData.email}</strong>, inclusive no SPAM.</p>
           <button onClick={() => { setVerificationSent(false); setIsLogin(true); }} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl">Fazer Login</button>
           <button onClick={handleResendEmail} disabled={!!resendStatus} className="mt-6 text-[10px] font-black uppercase text-deepAqua tracking-widest">{resendStatus || 'Não recebeu? Reenviar'}</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-4 pt-28 md:pt-32 transition-colors duration-700 ${isPatient ? 'bg-slate-50' : 'bg-slate-100'}`}>
      <div className="w-full max-w-xl bg-white rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative z-10 flex flex-col border border-slate-100">
        <div className="flex justify-between items-center mb-6 md:mb-8">
          <button onClick={onBack} className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900">Voltar</button>
          <div className="flex p-1 bg-slate-100 rounded-xl md:rounded-2xl">
            <button onClick={() => setRole('PATIENT')} className={`px-4 md:px-6 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black uppercase rounded-lg md:rounded-xl transition-all ${isPatient ? 'bg-white text-deepAqua shadow-sm' : 'text-slate-400'}`}>Paciente</button>
            <button onClick={() => setRole('PHYSICIAN')} className={`px-4 md:px-6 py-1.5 md:py-2 text-[9px] md:text-[10px] font-black uppercase rounded-lg md:rounded-xl transition-all ${!isPatient ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Médico</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
          <div className="text-center mb-2">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-slate-900 leading-tight">
              {isLogin ? 'Agenda Med Cloud' : 'Criar Hub Saúde'}
            </h1>
            <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1">{isLogin ? 'Entrar no sistema' : 'Junte-se a nós'}</p>
          </div>

          {(error || successMessage) && (
            <div className={`p-4 rounded-xl text-xs font-bold border animate-in slide-in-from-top-2 duration-300 ${error ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
              {error ? `⚠️ ${error}` : `✅ ${successMessage}`}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!isLogin && (
              <div className="md:col-span-2 space-y-1">
                <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Nome Completo</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border rounded-xl p-3 md:p-4 text-sm outline-none border-slate-100 focus:border-aqua" />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">E-mail</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 md:p-4 text-sm focus:border-aqua outline-none" />
            </div>
            <div className="space-y-1 relative">
              <div className="flex justify-between items-center pr-2">
                <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Senha</label>
                {isLogin && <button type="button" onClick={handleResetPassword} className="text-[8px] md:text-[9px] font-black uppercase text-deepAqua hover:underline tracking-widest">Esqueci</button>}
              </div>
              <input required type="password" value={formData.password} onChange={e => handlePasswordChange(e.target.value)} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 md:p-4 text-sm focus:border-aqua outline-none" />
            </div>

            {!isLogin && !isPatient && (
              <>
                <div className="space-y-1">
                  <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">CRM</label>
                  <input required type="text" value={formData.crm} onChange={e => setFormData({...formData, crm: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 md:p-4 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">WhatsApp</label>
                  <input required type="tel" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 md:p-4 text-sm" />
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <button type="submit" disabled={isLoading} className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-bold text-white shadow-xl flex items-center justify-center transition-all ${isPatient ? 'neo-gradient' : 'bg-slate-900'}`}>
              {isLoading ? <div className="loader !border-white !border-t-transparent"></div> : (isLogin ? 'Entrar agora' : 'Criar Conta')}
            </button>

            <div className="relative py-2">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
               <div className="relative flex justify-center text-[9px] md:text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-4 text-slate-300">ou</span></div>
            </div>

            <button type="button" onClick={handleGoogleLogin} disabled={isLoading} className="w-full py-3.5 border border-slate-200 rounded-xl flex items-center justify-center gap-4 hover:bg-slate-50 active:scale-[0.98]">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-4 h-4 md:w-5 md:h-5" alt="Google" />
              <span className="text-xs md:text-sm font-bold text-slate-700">Google Login</span>
            </button>
          </div>
          
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-[9px] md:text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-deepAqua">
            {isLogin ? 'Não tem conta? Cadastre-se' : 'Já possui conta? Fazer Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
