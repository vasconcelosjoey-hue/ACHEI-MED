
import React, { useState, useEffect, useMemo } from 'react';
import { Appointment, MOCK_APPOINTMENTS, MOCK_PHYSICIANS, Physician, Language } from '../types';

interface DashboardProps {
  t: any;
  lang: Language;
  onLogout?: () => void;
}

const DashboardView: React.FC<DashboardProps> = ({ t, lang, onLogout }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [formData, setFormData] = useState({ patientName: '', email: '', whatsapp: '', time: '09:00', physicianId: 'phy1' });
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [conflict, setConflict] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const ALL_SLOTS = useMemo(() => [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'
  ], []);

  const openRegisterForTime = (slot: string) => {
    setFormData(prev => ({ ...prev, time: slot, patientName: '', email: '', whatsapp: '' }));
    setIsModalOpen(true);
  };

  useEffect(() => {
    const isOccupied = appointments.some(a => a.time === formData.time && a.status !== 'canceled');
    if (isOccupied) {
      const suggest = suggestNextSlot(formData.time);
      setConflict(suggest);
    } else {
      setConflict(null);
    }
  }, [formData.time, appointments]);

  const suggestNextSlot = (currentTime: string) => {
    const freeSlots = ALL_SLOTS.filter(slot => !appointments.some(a => a.time === slot && a.status !== 'canceled'));
    const laterSlots = freeSlots.filter(slot => slot > currentTime);
    return laterSlots.length > 0 ? laterSlots[0] : freeSlots[0] || 'N/A';
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (conflict && conflict !== 'N/A') return;

    const newApp: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData,
      status: 'pending'
    };
    setAppointments(prev => [...prev, newApp].sort((a, b) => a.time.localeCompare(b.time)));
    setFormData({ ...formData, patientName: '', email: '', whatsapp: '' });
    setIsModalOpen(false);
  };

  const cancelApp = (id: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'canceled' } : a));
  };

  const getPhysicianName = (id: string) => MOCK_PHYSICIANS.find(p => p.id === id)?.name || '-';

  const sendWhatsApp = (app: Appointment) => {
    const msg = `Olá ${app.patientName}, confirmamos sua consulta no Achei Med para as ${app.time} com ${getPhysicianName(app.physicianId)}. Podemos confirmar?`;
    window.open(`https://wa.me/55${app.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const onDragOver = (e: React.DragEvent) => e.preventDefault();
  const onDragStart = (id: string) => setDraggedId(id);
  const onDrop = (targetTime: string) => {
    if (!draggedId) return;
    const isOccupied = appointments.some(a => a.time === targetTime && a.id !== draggedId && a.status !== 'canceled');
    if (isOccupied) {
        alert("Este horário já está preenchido!");
        return;
    }
    setAppointments(prev => prev.map(a => a.id === draggedId ? { ...a, time: targetTime } : a).sort((a, b) => a.time.localeCompare(b.time)));
    setDraggedId(null);
  };

  const stats = {
    occupied: appointments.filter(a => a.status !== 'canceled').length,
    free: ALL_SLOTS.length - appointments.filter(a => a.status !== 'canceled').length,
    canceled: appointments.filter(a => a.status === 'canceled').length,
  };

  const freeTimeSlots = ALL_SLOTS.filter(slot => !appointments.some(a => a.time === slot && a.status !== 'canceled'));

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-24 pb-12 px-4 md:px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-serif font-bold text-slate-900 tracking-tight">{t.welcome}</h1>
           <div className="flex items-center gap-4">
              <button 
                onClick={() => openRegisterForTime(ALL_SLOTS[0])}
                className="bg-primary hover:bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                {t.register}
              </button>
              {onLogout && (
                  <button onClick={onLogout} className="text-[10px] text-red-600 font-black uppercase tracking-widest hover:text-red-800 transition-colors">Sair do Sistema</button>
              )}
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center group hover:border-primary/20 transition-all">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t.stats.occupied}</span>
                <span className="text-3xl font-serif font-bold text-primary">{stats.occupied}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-3"></div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center group hover:border-cta/20 transition-all">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t.stats.free}</span>
                <span className="text-3xl font-serif font-bold text-green-700">{stats.free}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-green-700 mt-3"></div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center group hover:border-red-200 transition-all">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t.stats.canceled}</span>
                <span className="text-3xl font-serif font-bold text-red-600">{stats.canceled}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-red-600 mt-3"></div>
            </div>
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center group hover:border-slate-200 transition-all">
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">{t.stats.total}</span>
                <span className="text-3xl font-serif font-bold text-slate-900">{ALL_SLOTS.length}</span>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 mt-3"></div>
            </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-9">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
                <h2 className="text-xl font-serif font-bold text-slate-900">{t.today}</h2>
                <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Clique em um horário livre para agendar</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-slate-600 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                      <th className="px-8 py-5 text-left">Hora</th>
                      <th className="px-8 py-5 text-left">Paciente / Disponibilidade</th>
                      <th className="px-8 py-5 text-left">Status</th>
                      <th className="px-8 py-5 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {ALL_SLOTS.map((slot) => {
                      const app = appointments.find(a => a.time === slot && a.status !== 'canceled');
                      return (
                        <tr 
                          key={slot} 
                          onDragOver={onDragOver}
                          onDrop={() => onDrop(slot)}
                          onClick={() => !app && openRegisterForTime(slot)}
                          className={`group transition-all ${!app ? 'bg-slate-50/20 cursor-pointer hover:bg-slate-100' : 'hover:bg-slate-50/50'}`}
                        >
                          <td className="px-8 py-6">
                            <span className={`font-serif font-bold text-lg ${app ? 'text-slate-900' : 'text-slate-400'}`}>{slot}</span>
                          </td>
                          <td className="px-8 py-6">
                            {app ? (
                              <div 
                                draggable 
                                onDragStart={(e) => { e.stopPropagation(); onDragStart(app.id); }}
                                className="cursor-grab active:cursor-grabbing"
                              >
                                <div className="font-bold text-slate-800">{app.patientName}</div>
                                <div className="text-[10px] text-slate-500 font-medium">{getPhysicianName(app.physicianId)}</div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                 <span className="text-xs italic text-slate-400 font-medium">— Disponível —</span>
                                 <button className="opacity-0 group-hover:opacity-100 bg-primary/10 text-primary p-1 rounded-md transition-opacity">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                 </button>
                              </div>
                            )}
                          </td>
                          <td className="px-8 py-6">
                            {app && (
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${app.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                                {app.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                              </span>
                            )}
                          </td>
                          <td className="px-8 py-6 text-right">
                            {app && (
                              <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                <button onClick={() => sendWhatsApp(app)} className="text-green-700 hover:text-green-900 text-[10px] font-black uppercase tracking-widest transition-colors">WhatsApp</button>
                                <button onClick={() => cancelApp(app.id)} className="text-red-600 hover:text-red-800 text-[10px] font-black uppercase tracking-widest transition-colors">Cancelar</button>
                              </div>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8">
              <h2 className="text-xl font-serif font-bold mb-4 text-slate-900">{t.freeSlots}</h2>
              <div className="grid grid-cols-2 gap-2">
                {freeTimeSlots.map(slot => (
                  <button 
                    key={slot} 
                    onClick={() => openRegisterForTime(slot)}
                    className="px-3 py-2 rounded-xl bg-slate-50 text-slate-700 font-bold text-xs hover:bg-primary hover:text-white transition-all border border-slate-200"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-primary/5 rounded-[2rem] p-6 border border-primary/10">
                <h4 className="text-[10px] font-black uppercase text-primary tracking-widest mb-2">Dica de Gestão</h4>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "Agrupar consultas em blocos reduz o tempo de inatividade entre pacientes e aumenta a produtividade da clínica."
                </p>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" 
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 animate-in zoom-in-95 fade-in duration-300">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-serif font-bold text-slate-900">{t.register}</h2>
                <p className="text-slate-600 text-sm mt-1">Preencha os dados do paciente para o agendamento.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleRegister} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">{t.form.name}</label>
                <input 
                  required 
                  value={formData.patientName} 
                  onChange={e=>setFormData({...formData, patientName: e.target.value})} 
                  placeholder="Ex: Maria Oliveira"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 focus:ring-2 focus:ring-primary/10 transition-all outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">{t.form.whatsapp}</label>
                  <input 
                    required 
                    value={formData.whatsapp} 
                    onChange={e=>setFormData({...formData, whatsapp: e.target.value})} 
                    placeholder="(11) 99999-9999"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 outline-none" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">{t.time}</label>
                  <select 
                    value={formData.time} 
                    onChange={e=>setFormData({...formData, time: e.target.value})} 
                    className={`w-full bg-slate-50 border ${conflict ? 'border-red-600 bg-red-50 text-red-700' : 'border-slate-200'} rounded-2xl p-4 text-sm text-slate-900 outline-none transition-colors`}
                  >
                    {ALL_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {conflict && conflict !== 'N/A' && (
                <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-center justify-between">
                  <p className="text-xs text-red-700 font-bold">{t.conflict}</p>
                  <button type="button" onClick={() => setFormData({...formData, time: conflict})} className="text-[10px] font-black uppercase text-red-900 underline decoration-2 underline-offset-4">
                    Sugestão: {conflict}
                  </button>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">{t.form.email}</label>
                <input 
                  type="email" 
                  required 
                  value={formData.email} 
                  onChange={e=>setFormData({...formData, email: e.target.value})} 
                  placeholder="exemplo@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 outline-none" 
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest block">{t.physician}</label>
                <select 
                  value={formData.physicianId} 
                  onChange={e=>setFormData({...formData, physicianId: e.target.value})} 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm text-slate-900 outline-none cursor-pointer"
                >
                  {MOCK_PHYSICIANS.map(p => <option key={p.id} value={p.id}>{p.name} ({p.specialty})</option>)}
                </select>
              </div>

              <button 
                type="submit" 
                className={`w-full py-5 rounded-2xl font-bold text-white shadow-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98] ${conflict ? 'bg-slate-300 cursor-not-allowed opacity-70' : 'bg-primary hover:bg-slate-800'}`}
              >
                {t.form.submit}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;
