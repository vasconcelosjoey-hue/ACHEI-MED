
import React, { useState } from 'react';
import { User, Notification, MOCK_PHYSICIANS } from '../types';

interface AttendantDashboardProps {
  user: User;
  addNotification: (n: Notification) => void;
}

const AttendantDashboard: React.FC<AttendantDashboardProps> = ({ user, addNotification }) => {
  const [selectedPhysician, setSelectedPhysician] = useState(MOCK_PHYSICIANS[0].id);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in duration-500 overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900">Gestão de Recepção</h1>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Controle de Múltiplas Agendas</p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <select 
            value={selectedPhysician} 
            onChange={e => setSelectedPhysician(e.target.value)}
            className="flex-1 md:w-64 bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-aqua/20"
          >
            {MOCK_PHYSICIANS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.specialty})</option>)}
          </select>
          <button className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg">Novo Agendamento</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 flex flex-col">
           <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-display font-bold text-slate-900">Agenda Selecionada</h2>
              <div className="flex gap-2">
                 <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[9px] font-black uppercase tracking-widest">6 Confirmados</span>
                 <span className="px-3 py-1 bg-yellow-50 text-yellow-600 rounded-full text-[9px] font-black uppercase tracking-widest">2 Pendentes</span>
              </div>
           </div>
           
           <div className="flex-1 overflow-y-auto scrollbar-hide space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="p-5 bg-slate-50/50 border border-slate-100 rounded-[2rem] flex justify-between items-center hover:border-aqua transition-all">
                   <div className="flex gap-6 items-center">
                      <span className="text-xl font-display font-bold text-slate-900">1{i}:00</span>
                      <div>
                         <p className="font-bold text-slate-800">Paciente Demonstrativo {i}</p>
                         <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Convênio Padrão</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                      <button className="p-2 text-slate-300 hover:text-deepAqua"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg></button>
                      <button className="p-2 text-slate-300 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg></button>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="space-y-6 flex flex-col overflow-hidden">
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex-1 flex flex-col">
              <h3 className="text-lg font-display font-bold mb-6 text-slate-900">Atividades Pendentes</h3>
              <div className="space-y-4 flex-1 overflow-y-auto scrollbar-hide">
                 {[1, 2, 3].map(i => (
                   <div key={i} className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-2xl">
                      <p className="text-[10px] font-black uppercase text-yellow-700 mb-1">Aguardando Confirmação</p>
                      <p className="text-sm font-bold text-slate-800">Consulta de Emergência - 16h</p>
                      <div className="mt-3 flex gap-2">
                         <button className="px-3 py-1 bg-yellow-600 text-white rounded-lg text-[8px] font-black uppercase">Notificar WhatsApp</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AttendantDashboard;
