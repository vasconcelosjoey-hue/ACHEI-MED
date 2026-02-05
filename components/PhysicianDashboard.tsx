
import React, { useState } from 'react';
import { User, Notification, Appointment } from '../types';

interface PhysicianDashboardProps {
  user: User;
  addNotification: (n: Notification) => void;
}

const PhysicianDashboard: React.FC<PhysicianDashboardProps> = ({ user, addNotification }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', physicianId: user.id, patientName: 'Ricardo Santos', time: '08:00', date: '2024-05-20', status: 'CONFIRMED', plan: 'Unimed' },
    { id: '2', physicianId: user.id, patientName: 'Letícia Mayer', time: '09:00', date: '2024-05-20', status: 'PENDING', plan: 'Particular' },
    { id: '3', physicianId: user.id, patientName: 'Marcos Braz', time: '10:00', date: '2024-05-20', status: 'CONFIRMED', plan: 'Amil' },
  ]);

  const [blockedSlots, setBlockedSlots] = useState<string[]>(['12:00', '12:30']);

  const toggleBlock = (time: string) => {
    if (blockedSlots.includes(time)) {
      setBlockedSlots(prev => prev.filter(t => t !== time));
      addNotification({ id: Math.random().toString(), userId: user.id, title: 'Horário Liberado', message: `O horário das ${time} está pronto para agendamentos.`, type: 'SUCCESS', read: false, createdAt: Date.now() });
    } else {
      setBlockedSlots(prev => [...prev, time]);
      addNotification({ id: Math.random().toString(), userId: user.id, title: 'Horário Travado', message: `O horário das ${time} foi bloqueado para sua agenda.`, type: 'WARNING', read: false, createdAt: Date.now() });
    }
  };

  const handleCancel = (id: string) => {
    const app = appointments.find(a => a.id === id);
    setAppointments(prev => prev.filter(a => a.id !== id));
    addNotification({
      id: Math.random().toString(),
      userId: user.id,
      title: 'Consulta Desmarcada',
      message: `A consulta de ${app?.patientName} foi removida. A fila de espera foi notificada automaticamente.`,
      type: 'ALERT',
      read: false,
      createdAt: Date.now()
    });
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
      {/* Header do Painel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
           <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=B9E6FE&color=0D9488`} className="w-14 h-14 rounded-2xl shadow-md border-2 border-white" />
           <div>
              <h1 className="text-2xl font-display font-bold text-slate-900 leading-tight">Painel Profissional</h1>
              <p className="text-sm font-semibold text-deepAqua">{user.specialty} • CRM {user.crm || '00000-UF'}</p>
           </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
           <a href={`https://wa.me/${user.whatsapp?.replace(/\D/g, '')}`} target="_blank" className="flex-1 md:flex-none px-4 py-2 bg-[#25D366]/10 text-[#25D366] rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#25D366]/20 flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp
           </a>
           <button className="flex-1 md:flex-none px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Configurar Agenda</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6 flex-1 overflow-hidden">
        {/* Lado Esquerdo: Agenda de Hoje */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
           <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h2 className="text-lg font-display font-bold text-slate-900">Agenda de Hoje</h2>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total: {appointments.length} Consultas</span>
           </div>
           
           <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide p-4 space-y-3">
              {['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '13:00', '13:30'].map(time => {
                const app = appointments.find(a => a.time === time);
                const isBlocked = blockedSlots.includes(time);
                
                return (
                  <div key={time} className={`p-4 rounded-2xl flex items-center justify-between transition-all border ${isBlocked ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-50 hover:border-aqua shadow-sm'}`}>
                    <div className="flex items-center gap-6">
                       <span className={`font-display font-bold text-lg ${isBlocked ? 'text-slate-300' : 'text-slate-900'}`}>{time}</span>
                       <div>
                          {isBlocked ? (
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Horário Bloqueado</span>
                          ) : app ? (
                            <>
                              <p className="font-bold text-slate-900">{app.patientName}</p>
                              <p className="text-[10px] text-slate-500 font-semibold">{app.plan}</p>
                            </>
                          ) : (
                            <span className="text-[10px] font-black uppercase tracking-widest text-deepAqua">Vaga Disponível</span>
                          )}
                       </div>
                    </div>
                    
                    <div className="flex gap-2">
                       {app ? (
                         <button onClick={() => handleCancel(app.id)} className="p-2 text-slate-300 hover:text-red-500 transition-colors" title="Desmarcar">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                         </button>
                       ) : (
                         <button onClick={() => toggleBlock(time)} className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${isBlocked ? 'bg-deepAqua text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                            {isBlocked ? 'Destravar' : 'Travar'}
                         </button>
                       )}
                    </div>
                  </div>
                );
              })}
           </div>
        </div>

        {/* Lado Direito: Resumo e Fila */}
        <div className="space-y-6 flex flex-col overflow-hidden">
           <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-aqua/20 rounded-full blur-2xl"></div>
              <h3 className="text-sm font-display font-bold mb-4 flex items-center gap-2">
                 <span className="w-2 h-2 bg-aqua rounded-full animate-pulse"></span>
                 Fila de Espera Ativa
              </h3>
              <div className="space-y-3">
                 {[
                   { name: 'Carlos Lima', specialty: 'Encaixe Urgente' },
                   { name: 'Ana Duarte', specialty: 'Checkup' }
                 ].map((w, i) => (
                   <div key={i} className="bg-white/10 p-3 rounded-xl border border-white/5 flex justify-between items-center group">
                      <span className="text-xs font-bold">{w.name}</span>
                      <button className="text-[8px] font-black uppercase tracking-widest bg-aqua text-slate-900 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-all">Puxar</button>
                   </div>
                 ))}
              </div>
           </div>

           <div className="flex-1 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <h3 className="text-sm font-display font-bold mb-4 text-slate-900">Endereço de Atendimento</h3>
              <div className="space-y-4 text-[11px] text-slate-500">
                 <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="font-bold text-slate-900 mb-1">Unidade Clínica Norte</p>
                    <p>{user.address?.street || 'Av. Constantino Nery, 1200'}</p>
                    <p>Bairro: {user.address?.neighborhood || 'Adrianópolis'}</p>
                    <p>Manaus - AM</p>
                 </div>
                 <button className="w-full py-3 border-2 border-slate-50 text-slate-400 rounded-xl font-black uppercase tracking-widest hover:border-aqua hover:text-deepAqua transition-all">Alterar Endereço</button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicianDashboard;
