
import React, { useState, useEffect } from 'react';
import { User, AppView, Notification, MOCK_PHYSICIANS, Physician, Appointment } from '../types';
import { saveAppointment, getMyAppointments } from '../firebase';

interface PatientDashboardProps {
  user: User;
  view: AppView;
  setView: (v: AppView) => void;
  addNotification: (n: Notification) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, view, setView, addNotification }) => {
  const [search, setSearch] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<Physician | null>(null);
  const [bookingTime, setBookingTime] = useState('09:00');
  const [isBooking, setIsBooking] = useState(false);
  const [myApps, setMyApps] = useState<Appointment[]>([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    const apps = await getMyAppointments(user.id, 'PATIENT');
    setMyApps(apps);
  };

  const filteredDoctors = MOCK_PHYSICIANS.filter(d => 
    search === '' || 
    d.name.toLowerCase().includes(search.toLowerCase()) || 
    d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  const handleBook = async () => {
    if (!selectedDoc) return;
    setIsBooking(true);

    const newApp: Omit<Appointment, 'id' | 'createdAt'> = {
      physicianId: selectedDoc.id,
      physicianName: selectedDoc.name,
      patientId: user.id,
      patientName: user.name,
      time: bookingTime,
      date: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      plan: 'Particular',
      whatsapp: user.whatsapp || '5592988880000'
    };

    const result = await saveAppointment(newApp);
    if (result) {
      addNotification({
        id: Math.random().toString(),
        userId: user.id,
        title: 'Solicitação Enviada!',
        message: `Seu agendamento com ${selectedDoc.name} foi salvo na nuvem.`,
        type: 'SUCCESS',
        read: false,
        createdAt: Date.now()
      });
      setSelectedDoc(null);
      loadAppointments();
    }
    setIsBooking(false);
  };

  if (view === 'SEARCH') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full flex flex-col h-full overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
          <div className="w-full md:flex-1 relative">
             <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Busque entre 50 especialistas em Manaus..."
              className="w-full h-14 pl-12 pr-6 bg-slate-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-aqua transition-all text-sm font-medium"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">
             {filteredDoctors.length} Médicos Encontrados
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 scrollbar-hide pb-20">
          {filteredDoctors.map(doc => (
            <div key={doc.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group cursor-pointer" onClick={() => setSelectedDoc(doc)}>
              <div className="flex gap-4 items-center mb-6">
                <div className="relative">
                   <img src={doc.avatar} className="w-14 h-14 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" alt={doc.name} />
                   <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-sm font-display font-bold text-slate-900 truncate">{doc.name}</h4>
                  <p className="text-[10px] font-bold text-deepAqua uppercase tracking-widest">{doc.specialty}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-6">
                 {doc.plans.slice(0, 2).map(p => <span key={p} className="text-[8px] font-black uppercase bg-slate-50 px-2 py-1 rounded-md text-slate-400">{p}</span>)}
              </div>
              <button className="w-full py-3 bg-slate-50 text-slate-900 group-hover:bg-deepAqua group-hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Ver Horários</button>
            </div>
          ))}
        </div>

        {/* Modal de Agendamento */}
        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl relative animate-in zoom-in-95 duration-300">
              <button onClick={() => setSelectedDoc(null)} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900 transition-colors">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="text-center mb-8">
                <img src={selectedDoc.avatar} className="w-20 h-20 rounded-3xl mx-auto mb-4 border-4 border-white shadow-xl" />
                <h3 className="text-2xl font-display font-bold text-slate-900">{selectedDoc.name}</h3>
                <p className="text-xs font-bold text-deepAqua uppercase tracking-[0.2em]">{selectedDoc.specialty}</p>
                <p className="text-[10px] text-slate-400 mt-1 uppercase font-black">CRM {selectedDoc.crm}</p>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2 mb-2 block">Escolha o Horário (Hoje)</label>
                    <div className="grid grid-cols-3 gap-2">
                       {['08:00', '09:00', '10:00', '14:00', '15:00', '16:00'].map(t => (
                         <button key={t} onClick={() => setBookingTime(t)} className={`py-2 rounded-xl text-xs font-bold transition-all border ${bookingTime === t ? 'bg-deepAqua text-white border-deepAqua' : 'bg-slate-50 text-slate-400 border-transparent hover:border-aqua'}`}>
                            {t}
                         </button>
                       ))}
                    </div>
                 </div>

                 <button 
                  onClick={handleBook}
                  disabled={isBooking}
                  className="w-full py-4 neo-gradient text-white rounded-2xl font-bold shadow-xl shadow-aqua/20 flex items-center justify-center gap-2 transform active:scale-95 transition-all"
                >
                   {isBooking ? <div className="loader !border-white !border-t-transparent"></div> : 'Confirmar Agendamento Real'}
                 </button>
                 <p className="text-[9px] text-center text-slate-400 font-bold uppercase tracking-widest">Sua confirmação será salva na sua conta cloud.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 w-full flex flex-col h-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Painel do Paciente</h1>
          <p className="text-slate-400 font-medium">Olá, {user.name}. Seus dados estão sincronizados na nuvem.</p>
        </div>
        <button 
          onClick={() => setView('SEARCH')}
          className="px-10 py-5 neo-gradient rounded-[2rem] text-white font-bold shadow-2xl shadow-babyBlue/40 transform active:scale-95 transition-all text-sm"
        >
          Explorar Especialistas
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-8">
             <h3 className="text-2xl font-display font-bold text-slate-900">Histórico de Consultas</h3>
             <button onClick={loadAppointments} className="p-2 text-slate-400 hover:text-deepAqua transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
            {myApps.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                  <span className="text-6xl mb-4">📅</span>
                  <p className="text-xs font-black uppercase tracking-widest">Nenhuma consulta agendada ainda</p>
               </div>
            ) : (
              myApps.map(app => (
                <div key={app.id} className="p-6 bg-slate-50/50 rounded-[2rem] border border-transparent flex justify-between items-center group hover:bg-white hover:border-aqua transition-all">
                  <div className="flex gap-6 items-center">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-xl shadow-sm">🩺</div>
                    <div>
                      <p className="font-bold text-slate-900 text-base">{app.physicianName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.time}h • {new Date(app.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {app.status === 'CONFIRMED' ? 'Confirmado' : 'Pendente Cloud'}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-6 flex flex-col overflow-hidden">
           <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-aqua/20 rounded-full blur-3xl"></div>
              <p className="text-aqua text-[10px] font-black uppercase tracking-[0.3em] mb-4">Sincronização Ativa</p>
              <h3 className="text-xl font-display font-bold mb-4 leading-tight">Acesso Multi-Dispositivo</h3>
              <p className="text-xs text-white/50 leading-relaxed italic">Seus dados agora são salvos via Agenda Med Cloud (Firestore). Seus agendamentos persistem em qualquer navegador.</p>
           </div>
           
           <div className="flex-1 bg-babyBlue/10 p-10 rounded-[3rem] border border-babyBlue/20 flex flex-col justify-center items-center text-center">
              <div className="w-16 h-16 neo-gradient rounded-full flex items-center justify-center text-2xl text-white shadow-xl shadow-aqua/20 mb-6">🔒</div>
              <h4 className="font-display font-bold text-slate-900 mb-2">Sigilo Médico</h4>
              <p className="text-[10px] text-slate-500 max-w-[200px] font-bold uppercase tracking-widest">Protocolos de segurança LGPD ativos no banco de dados.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
