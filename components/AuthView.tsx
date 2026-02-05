
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

  // Filtra a senha para aceitar apenas letras minúsculas e números
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
      if (err.message.includes('permission-denied')) {
        setError('ERRO DE BANCO: As regras do Firestore no seu Firebase Console estão bloqueadas. Vá em Firestore > Rules e libere o acesso.');
      } else {
        setError(`Erro ao salvar perfil: ${err.code || err.message}`);
      }
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleAuthResult(result.user);
    } catch (err: any) {
      const currentDomain = window.location.hostname;
      if (err.code === 'auth/popup-blocked') {
        setError('O navegador bloqueou o pop-up. Tentando via redirecionamento...');
        await signInWithRedirect(auth, googleProvider);
      } else if (err.code === 'auth/unauthorized-domain') {
        setError(`DOMÍNIO NÃO AUTORIZADO! Adicione ${currentDomain} no console do Firebase.`);
      } else {
        setError(`Erro: ${err.code}`);
      }
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
      setSuccessMessage('E-mail de redefinição enviado! Verifique sua caixa de entrada.');
    } catch (err: any) {
      setError(`Erro ao redefinir: ${err.code}`);
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
    setSuccessMessage('');

    try {
      if (isLogin) {
        const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        if (!cred.user.emailVerified) {
          setError('Sua conta ainda não foi verificada. Verifique seu e-mail (inclusive no SPAM).');
          await signOut(auth);
          setIsLoading(false);
          return;
        }
      } else {
        const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        try {
          await sendEmailVerification(cred.user);
          
          const profile: Partial<User> = {
            id: cred.user.uid,
            name: formData.name,
            email: formData.email,
            role: role,
            crm: formData.crm,
            whatsapp: formData.whatsapp,
            specialty: formData.specialty,
            verified: false
          };
          
          await saveUserProfile(cred.user.uid, profile);
          setVerificationSent(true);
          await signOut(auth);
        } catch (dbErr: any) {
          console.error("Error saving user:", dbErr);
          await deleteUser(cred.user);
          setError('Erro ao criar perfil. Verifique as permissões do banco de dados.');
        }
      }
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Este e-mail já está sendo usado.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('E-mail ou senha incorretos.');
      } else if (err.code === 'auth/weak-password') {
        setError('A senha deve ter pelo menos 6 caracteres.');
      } else {
        setError(`Erro: ${err.code}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="h-screen flex items-center justify-center p-6 bg-slate-50">
        <div className="max-w-md w-full bg-white rounded-[3.5rem] p-10 text-center shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-500">
           <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-8 animate-bounce shadow-inner">✉️</div>
           <h2 className="text-3xl font-display font-bold text-slate-900 mb-4 tracking-tight">E-mail de Ativação Enviado!</h2>
           <p className="text-slate-500 mb-6 leading-relaxed">
             Enviamos um link de confirmação para:<br/>
             <strong className="text-slate-900">{formData.email}</strong>
           </p>
           
           <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-8 text-left">
              <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-1">Dica Importante</p>
              <p className="text-xs text-amber-700 leading-relaxed font-medium">
                Caso não encontre na sua Caixa de Entrada em 1 minuto, verifique a pasta de <strong>Lixo Eletrônico ou SPAM</strong>.
              </p>
           </div>

           <button onClick={() => { setVerificationSent(false); setIsLogin(true); }} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all active:scale-95">Ir para o Login</button>
           
           <div className="mt-8 flex flex-col gap-4">
              <button onClick={handleResendEmail} disabled={!!resendStatus} className="text-[10px] font-black uppercase text-deepAqua hover:underline tracking-widest">
                {resendStatus || 'Não recebeu? Reenviar E-mail'}
              </button>
              <button onClick={() => { setVerificationSent(false); setIsLogin(false); }} className="text-[10px] font-black uppercase text-slate-300 hover:text-slate-500 tracking-widest">
                Corrigir E-mail digitado
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col items-center justify-center p-4 transition-colors duration-700 ${isPatient ? 'bg-slate-50' : 'bg-slate-100'}`}>
      <div className="w-full max-w-2xl bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative z-10 flex flex-col max-h-[95vh] border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <button onClick={onBack} className="text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-slate-900 transition-all">Voltar ao Site</button>
          <div className="flex p-1 bg-slate-100 rounded-2xl">
            <button onClick={() => setRole('PATIENT')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${isPatient ? 'bg-white text-deepAqua shadow-sm' : 'text-slate-400'}`}>Paciente</button>
            <button onClick={() => setRole('PHYSICIAN')} className={`px-6 py-2 text-[10px] font-black uppercase rounded-xl transition-all ${!isPatient ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400'}`}>Médico</button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2 scrollbar-hide">
          <div className="text-center">
            <h1 className="text-4xl font-display font-bold tracking-tight text-slate-900">{isLogin ? 'Agenda Med Cloud' : 'Criar Hub Saúde'}</h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">{isLogin ? 'Entrar no sistema' : 'Junte-se a nós'}</p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs font-bold border border-red-100 animate-in shake duration-300">
              ⚠️ {error}
            </div>
          )}

          {successMessage && (
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-bold border border-emerald-100 animate-in fade-in duration-300">
              ✅ {successMessage}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {!isLogin && (
              <div className="md:col-span-2 space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Nome Completo</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border rounded-xl p-4 text-sm outline-none border-slate-100 focus:border-aqua" />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">E-mail</label>
              <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:border-aqua" />
            </div>
            <div className="space-y-1 relative">
              <div className="flex justify-between items-center pr-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Senha</label>
                {isLogin && (
                   <button type="button" onClick={handleResetPassword} className="text-[9px] font-black uppercase text-deepAqua hover:underline tracking-widest">Esqueci minha senha</button>
                )}
              </div>
              <input 
                required 
                type="password" 
                value={formData.password} 
                onChange={e => handlePasswordChange(e.target.value)} 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm focus:border-aqua outline-none transition-all" 
              />
              <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest px-2 mt-1">
                Apenas letras minúsculas e números
              </p>
            </div>

            {!isLogin && !isPatient && (
              <>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">CRM</label>
                  <input required type="text" placeholder="00000-AM" value={formData.crm} onChange={e => setFormData({...formData, crm: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">WhatsApp</label>
                  <input required type="tel" placeholder="(00) 00000-0000" value={formData.whatsapp} onChange={e => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm" />
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
            <button type="submit" disabled={isLoading} className={`w-full py-5 rounded-2xl font-bold text-white shadow-xl flex items-center justify-center transition-all ${isPatient ? 'neo-gradient' : 'bg-slate-900'}`}>
              {isLoading ? <div className="loader !border-white !border-t-transparent"></div> : (isLogin ? 'Entrar agora' : 'Criar Conta')}
            </button>

            <div className="relative py-4">
               <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
               <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest"><span className="bg-white px-4 text-slate-300">ou continue com</span></div>
            </div>

            <button 
              type="button" 
              onClick={handleGoogleLogin} 
              disabled={isLoading}
              className="w-full py-4 border border-slate-200 rounded-2xl flex items-center justify-center gap-4 hover:bg-slate-50 transition-all active:scale-[0.98]"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span className="text-sm font-bold text-slate-700">Entrar com Google</span>
            </button>
          </div>
          
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-[10px] font-black uppercase text-slate-400 tracking-widest hover:text-deepAqua transition-colors">
            {isLogin ? 'Ainda não tem conta? Clique aqui' : 'Já possui conta? Fazer Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthView;
