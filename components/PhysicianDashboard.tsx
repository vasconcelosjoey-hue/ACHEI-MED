
import React, { useState } from 'react';
import { User, Notification, Appointment } from '../types';

interface PhysicianDashboardProps {
  user: User;
  addNotification: (n: Notification) => void;
}

const PhysicianDashboard: React.FC<PhysicianDashboardProps> = ({ user, addNotification }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', physicianId: user.id, patientName: 'Ricardo Santos', time: '08:00', date: '2024-05-20', status: 'CONFIRMED', plan: 'Unimed', whatsapp: '5592988887777' },
    { id: '2', physicianId: user.id, patientName: 'Letícia Mayer', time: '09:00', date: '2024-05-20', status: 'PENDING', plan: 'Particular', whatsapp: '5592988886666' },
    { id: '3', physicianId: user.id, patientName: 'Marcos Braz', time: '10:00', date: '2024-05-20', status: 'CONFIRMED', plan: 'Amil', whatsapp: '5592988885555' },
  ]);

  const [blockedSlots, setBlockedSlots] = useState<string[]>(['12:00', '12:30']);

  const toggleBlock = (time: string) => {
    if (blockedSlots.includes(time)) {
      setBlockedSlots(prev => prev.filter(t => t !== time));
    } else {
      setBlockedSlots(prev => [...prev, time]);
    }
  };

  const handleCancel = (id: string) => {
    setAppointments(prev => prev.filter(a => a.id !== id));
    addNotification({
      id: Math.random().toString(),
      userId: user.id,
      title: 'Vaga Liberada',
      message: 'A fila de espera foi notificada sobre a nova vaga.',
      type: 'INFO',
      read: false,
      createdAt: Date.now()
    });
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Header do Médico - Deep Palette */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl text-white">
        <div className="flex items-center gap-6">
           <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=0D9488&color=fff`} className="w-16 h-16 rounded-2xl shadow-xl border-2 border-white/10" />
           <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-aqua mb-1">Central de Atendimento</p>
              <h1 className="text-3xl font-display font-bold leading-tight">Dr(a). {user.name}</h1>
              <p className="text-sm font-medium text-white/50">{user.specialty} • CRM {user.crm || '00000-UF'}</p>
           </div>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
           <a href={`https://wa.me/${user.whatsapp?.replace(/\D/g, '')}`} target="_blank" className="flex-1 md:flex-none px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/5 flex items-center justify-center gap-2 transition-all">
              WhatsApp Direto
           </a>
           <button className="flex-1 md:flex-none px-6 py-3 bg-aqua text-slate-900 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-aqua/20 hover:scale-105 transition-all">Configurar Agenda</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
           <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-xl font-display font-bold text-slate-900">Agenda Ativa</h2>
              <div className="flex items-center gap-2">
                 <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hoje</span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide p-6 space-y-3">
              {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30'].map(time => {
                const app = appointments.find(a => a.time === time);
                const isBlocked = blockedSlots.includes(time);
                
                return (
                  <div key={time} className={`p-5 rounded-2xl flex items-center justify-between transition-all border ${isBlocked ? 'bg-slate-50 border-slate-100 opacity-50' : app ? 'bg-white border-slate-100 shadow-sm' : 'bg-slate-50/50 border-dashed border-slate-200'}`}>
                    <div className="flex items-center gap-8">
                       <span className={`font-display font-bold text-xl w-16 ${isBlocked ? 'text-slate-300' : 'text-slate-900'}`}>{time}</span>
                       <div>
                          {isBlocked ? (
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pausa / Bloqueado</span>
                          ) : app ? (
                            <>
                              <p className="font-bold text-slate-900">{app.patientName}</p>
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{app.plan}</p>
                            </>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest text-deepAqua/40">Slot Livre</span>
                          )}
                       </div>
                    </div>
                    
                    <div className="flex gap-2">
                       {app ? (
                         <button onClick={() => handleCancel(app.id)} className="p-3 bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-xl transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                       ) : (
                         <button onClick={() => toggleBlock(time)} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isBlocked ? 'bg-deepAqua text-white' : 'bg-white border border-slate-100 text-slate-400 hover:border-aqua hover:text-deepAqua'}`}>
                            {isBlocked ? 'Liberar' : 'Bloquear'}
                         </button>
                       )}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        <div className="space-y-6 flex flex-col overflow-hidden">
           <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100 flex-1 flex flex-col overflow-hidden">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Lista de Espera</h3>
              <div className="space-y-3 overflow-y-auto scrollbar-hide">
                 {[
                   { name: 'Carolina Lima', t: 'Urgência' },
                   { name: 'Ana Duarte', t: 'Retorno' }
                 ].map((w, i) => (
                   <div key={i} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center group">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{w.name}</p>
                        <p className="text-[9px] font-black uppercase text-deepAqua">{w.t}</p>
                      </div>
                      <button className="text-[9px] font-black uppercase text-white bg-slate-900 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">Chamar</button>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicianDashboard;
