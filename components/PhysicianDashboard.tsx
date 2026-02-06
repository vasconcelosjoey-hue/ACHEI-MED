import React, { useState, useEffect } from 'react';
import { User, Notification, Appointment } from '../types';
import { subscribeToAppointments, saveUserProfile } from '../firebase';

interface PhysicianDashboardProps {
  user: User;
  addNotification: (n: Notification) => void;
}

const PhysicianDashboard: React.FC<PhysicianDashboardProps> = ({ user, addNotification }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [rules, setRules] = useState(user.availabilityRules || { start: "08:00", end: "18:00", slotDuration: 30 });

  useEffect(() => {
    const unsub = subscribeToAppointments(user.id, 'PHYSICIAN', (apps) => {
      setAppointments(apps);
    });
    return () => unsub();
  }, [user.id]);

  const handleSaveRules = async () => {
    setIsSyncing(true);
    await saveUserProfile(user.id, { availabilityRules: rules });
    addNotification({
      id: Math.random().toString(),
      userId: user.id,
      title: 'Configurações Salvas',
      message: 'Sua disponibilidade foi atualizada para os pacientes.',
      type: 'SUCCESS',
      read: false,
      createdAt: Date.now()
    });
    setIsSyncing(false);
    setShowConfig(false);
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
        <div className="flex items-center gap-6">
           <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0D9488&color=fff`} className="w-16 h-16 rounded-2xl border-2 border-white/10" />
           <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-aqua mb-1">CRM {user.crm}</p>
              <h1 className="text-3xl font-display font-bold">Dr(a). {user.name}</h1>
           </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => setShowConfig(true)}
            className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-2xl text-xs font-bold border border-white/10 flex items-center gap-2"
          >
            ⚙️ Regras de Agendamento
          </button>
          <button className="px-6 py-3 bg-aqua text-slate-900 rounded-2xl text-xs font-bold shadow-xl shadow-aqua/20">
            📅 Sincronizar Google
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
           <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-xl font-display font-bold text-slate-900">Agenda Atual</h2>
           </div>
           
           <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {appointments.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                  <span className="text-6xl mb-4">🩺</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">Nenhuma consulta hoje</p>
                </div>
              ) : (
                appointments.map(app => (
                  <div key={app.id} className="p-5 rounded-2xl flex items-center justify-between border bg-white border-slate-100 shadow-sm">
                    <div className="flex items-center gap-8">
                       <span className="font-display font-bold text-xl w-16 text-slate-900">{app.time}</span>
                       <div>
                          <p className="font-bold text-slate-800">{app.patientName}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{app.plan}</p>
                       </div>
                    </div>
                  </div>
                ))
              )}
           </div>
        </div>

        <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
           <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6">Resumo da Grade</h3>
           <div className="p-4 bg-white rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Início:</span>
                <span className="text-xs font-bold">{rules.start}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Fim:</span>
                <span className="text-xs font-bold">{rules.end}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-slate-400">Duração:</span>
                <span className="text-xs font-bold">{rules.slotDuration} min</span>
              </div>
           </div>
        </div>
      </div>

      {showConfig && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
              <h2 className="text-2xl font-display font-bold mb-6">Configurar Disponibilidade</h2>
              <div className="space-y-6">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Início do Dia</label>
                       <input type="time" value={rules.start} onChange={e=>setRules({...rules, start: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Fim do Dia</label>
                       <input type="time" value={rules.end} onChange={e=>setRules({...rules, end: e.target.value})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Tempo por Consulta (Minutos)</label>
                    <select value={rules.slotDuration} onChange={e=>setRules({...rules, slotDuration: parseInt(e.target.value)})} className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm">
                       <option value={15}>15 minutos</option>
                       <option value={30}>30 minutos</option>
                       <option value={45}>45 minutos</option>
                       <option value={60}>1 hora</option>
                    </select>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={()=>setShowConfig(false)} className="flex-1 py-4 border border-slate-200 rounded-2xl text-slate-400 font-bold">Cancelar</button>
                    <button onClick={handleSaveRules} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-bold">Salvar Regras</button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default PhysicianDashboard;