
import React, { useState, useEffect } from 'react';
import { User, AppView, Notification } from './types';
import AuthView from './components/AuthView';
import DashboardContainer from './components/DashboardContainer';
import Header from './components/Header';
import NotificationPanel from './components/NotificationPanel';
import LandingView from './components/LandingView';
import { auth, getUserProfile } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('LANDING');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser && fbUser.emailVerified) {
        const profile = await getUserProfile(fbUser.uid);
        if (profile) {
          setUser(profile);
          // Se for a primeira vez carregando e não estiver no site, vai pro dashboard
          if (view === 'AUTH') setView('DASHBOARD');
        }
      } else {
        setUser(null);
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

  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="loader !w-12 !h-12 !border-4"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-aqua selection:text-deepAqua">
      <Header 
        user={user} 
        onLogout={handleLogout} 
        onViewChange={setView}
        onToggleNotifs={() => setShowNotifications(!showNotifications)}
        unreadCount={notifications.filter(n => !n.read).length}
        view={view}
      />

      <main className="transition-all duration-500">
        {view === 'LANDING' ? (
          <LandingView onStartClick={() => setView('AUTH')} />
        ) : view === 'AUTH' ? (
          <AuthView onAuthSuccess={() => setView('DASHBOARD')} onBack={() => setView('LANDING')} />
        ) : (
          <DashboardContainer 
            user={user!} 
            view={view} 
            setView={setView}
            addNotification={addNotification}
          />
        )}
      </main>

      {showNotifications && (
        <NotificationPanel 
          notifications={notifications} 
          onClose={() => setShowNotifications(false)}
          onMarkRead={markNotificationAsRead}
        />
      )}
    </div>
  );
};

export default App;
