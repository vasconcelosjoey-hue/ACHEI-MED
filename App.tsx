
import React, { useState, useEffect } from 'react';
import { User, AppView, Notification } from './types';
import AuthView from './components/AuthView';
import DashboardContainer from './components/DashboardContainer';
import Header from './components/Header';
import NotificationPanel from './components/NotificationPanel';
import LandingView from './components/LandingView';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<AppView>('LANDING');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('achei_med_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      // Mantemos LANDING como padrão mesmo se houver usuário, 
      // para o usuário ver o site. O Header terá o botão de Dashboard.
    }
  }, []);

  const handleLogin = (loggedUser: User) => {
    setUser(loggedUser);
    localStorage.setItem('achei_med_user', JSON.stringify(loggedUser));
    setView('DASHBOARD');
    addNotification({
      id: Math.random().toString(),
      userId: loggedUser.id,
      title: 'Bem-vindo de volta!',
      message: `Olá ${loggedUser.name}, sua central de saúde está pronta.`,
      type: 'SUCCESS',
      read: false,
      createdAt: Date.now()
    });
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('achei_med_user');
    setView('LANDING');
  };

  const addNotification = (notif: Notification) => {
    setNotifications(prev => [notif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

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
          <AuthView onAuthSuccess={handleLogin} onBack={() => setView('LANDING')} />
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
