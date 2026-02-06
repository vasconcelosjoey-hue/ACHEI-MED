
import React, { useState, useEffect } from 'react';
import { User, AppView, Notification } from './types';
import AuthView from './components/AuthView';
import DashboardContainer from './components/DashboardContainer';
import Header from './components/Header';
import NotificationPanel from './components/NotificationPanel';
import LandingView from './components/LandingView';
import OnboardingTutorial from './components/OnboardingTutorial';
import { auth, getUserProfile } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('LANDING');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        // Se o e-mail não estiver verificado, limpamos o usuário e permanecemos em landing/auth
        if (!fbUser.emailVerified) {
          setUser(null);
          setIsInitializing(false);
          return;
        }

        try {
          const profile = await getUserProfile(fbUser.uid);
          if (profile && profile.role) {
            setUser(profile);
            
            // Redirecionamento automático após login bem sucedido
            if (view === 'LANDING' || view === 'AUTH') {
              setView('DASHBOARD');
            }
            
            // Lógica do Tutorial Automático para primeiro acesso
            const hasSeenTutorial = localStorage.getItem(`tutorial_seen_${fbUser.uid}`);
            if (!hasSeenTutorial) {
              setShowTutorial(true);
            }
          } else {
            // Se o perfil não existir ou não tiver role, forçamos o logout ou auth
            setUser(null);
            if (view !== 'LANDING') setView('AUTH');
          }
        } catch (error) {
          console.error("Erro ao carregar perfil do usuário:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        // Proteção de rotas: se deslogar, volta para a landing page
        if (['DASHBOARD', 'SEARCH', 'PROFILE'].includes(view)) {
          setView('LANDING');
        }
      }
      setIsInitializing(false);
    });
    return () => unsub();
  }, [view]);

  const handleLogout = async () => {
    await auth.signOut();
    setUser(null);
    setView('LANDING');
  };

  const addNotification = (notif: Notification) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const closeTutorial = () => {
    if (user) {
      localStorage.setItem(`tutorial_seen_${user.id}`, 'true');
    }
    setShowTutorial(false);
  };

  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="loader !w-12 !h-12 !border-4"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Iniciando Agenda Med...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (view === 'LANDING') {
      return <LandingView onStartClick={() => setView('AUTH')} />;
    }
    
    if (view === 'AUTH') {
      return <AuthView onAuthSuccess={(profile) => {
        setUser(profile);
        setView('DASHBOARD');
      }} onBack={() => setView('LANDING')} />;
    }

    // Só renderiza o dashboard se o usuário e sua role existirem (evita erro de role of null)
    if (user && user.role) {
      return (
        <DashboardContainer 
          user={user} 
          view={view} 
          setView={setView}
          addNotification={addNotification}
        />
      );
    }

    // Fallback padrão caso tente acessar dashboard sem user
    return <AuthView onAuthSuccess={(profile) => {
      setUser(profile);
      setView('DASHBOARD');
    }} onBack={() => setView('LANDING')} />;
  };

  return (
    <div className="min-h-screen bg-white selection:bg-aqua selection:text-deepAqua">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onViewChange={setView}
        onToggleNotifs={() => setShowNotifications(!showNotifications)}
        onOpenTutorial={() => setShowTutorial(true)}
        unreadCount={notifications.filter(n => !n.read).length}
        view={view}
      />

      <main className="transition-all duration-500">
        {renderContent()}
      </main>

      {showNotifications && (
        <NotificationPanel 
          notifications={notifications} 
          onClose={() => setShowNotifications(false)}
          onMarkRead={markNotificationAsRead}
        />
      )}

      {showTutorial && user && user.role && (
        <OnboardingTutorial 
          role={user.role} 
          onClose={closeTutorial} 
        />
      )}
    </div>
  );
};

export default App;
