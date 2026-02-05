
import React, { useState, useEffect } from 'react';
import { User, Notification, Appointment } from '../types';
import { subscribeToAppointments, updateGoogleSync } from '../firebase';

interface PhysicianDashboardProps {
  user: User;
  addNotification: (n: Notification) => void;
}

const PhysicianDashboard: React.FC<PhysicianDashboardProps> = ({ user, addNotification }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isGoogleConnected, setIsGoogleConnected] = useState((user as any).googleCalendarConnected || false);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsub = subscribeToAppointments(user.id, 'PHYSICIAN', (apps) => {
      setAppointments(apps);
    });
    return () => unsub();
  }, [user.id]);

  const handleGoogleConnect = async () => {
    setIsSyncing(true);
    // Simulação de OAuth 
    setTimeout(async () => {
      const newState = !isGoogleConnected;
      await updateGoogleSync(user.id, newState);
      setIsGoogleConnected(newState);
      setIsSyncing(false);
      addNotification({
        id: Math.random().toString(),
        userId: user.id,
        title: newState ? 'Google Agenda Conectada' : 'Agenda Desconectada',
        message: newState ? 'Seus eventos agora são sincronizados automaticamente.' : 'A sincronização foi pausada.',
        type: 'SUCCESS',
        read: false,
        createdAt: Date.now()
      });
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
        <div className="flex items-center gap-6">
           <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0D9488&color=fff`} className="w-16 h-16 rounded-2xl border-2 border-white/10" />
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-aqua mb-1">Painel Médico Pro</p>
              <h1 className="text-3xl font-display font-bold leading-tight">Dr(a). {user.name}</h1>
              <p className="text-sm font-medium text-white/50">{user.specialty} • CRM {user.crm}</p>
           </div>
        </div>
        
        {/* Google Calendar Integration Card */}
        <div className={`p-4 rounded-3xl border transition-all flex items-center gap-4 ${isGoogleConnected ? 'bg-white/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
           <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isGoogleConnected ? 'bg-green-500' : 'bg-slate-700'}`}>
              {isSyncing ? <div className="loader !border-white !border-t-transparent !w-4 !h-4"></div> : '📅'}
           </div>
           <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/50">Google Calendar</p>
              <button onClick={handleGoogleConnect} className="text-xs font-bold text-aqua hover:underline">
                 {isGoogleConnected ? 'Sincronizado (Desconectar)' : 'Conectar Agora'}
              </button>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
           <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-xl font-display font-bold text-slate-900">Agenda Cloud em Tempo Real</h2>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live</span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide p-6 space-y-3">
              {appointments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                  <span className="text-6xl mb-4">🩺</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma consulta confirmada no sistema</p>
                </div>
              ) : (
                appointments.map(app => (
                  <div key={app.id} className="p-5 rounded-2xl flex items-center justify-between transition-all border bg-white border-slate-100 shadow-sm group">
                    <div className="flex items-center gap-8">
                       <span className="font-display font-bold text-xl w-16 text-slate-900">{app.time}</span>
                       <div>
                          <p className="font-bold text-slate-900">{app.patientName}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{app.plan} • {new Date(app.date).toLocaleDateString()}</p>
                       </div>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="px-4 py-2 bg-green-50 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest">Confirmar</button>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex flex-col overflow-hidden">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Lista de Espera IA</h3>
           <div className="space-y-3 overflow-y-auto scrollbar-hide">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center">
                 <div>
                   <p className="text-sm font-bold text-slate-800">Ana Duarte</p>
                   <p className="text-[9px] font-black uppercase text-deepAqua">Aguardando Vaga</p>
                 </div>
                 <button className="text-[9px] font-black uppercase text-white bg-slate-900 px-3 py-1.5 rounded-lg">Chamar</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicianDashboard;
