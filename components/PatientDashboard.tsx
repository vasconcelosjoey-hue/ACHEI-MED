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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookingTime, setBookingTime] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [myApps, setMyApps] = useState<Appointment[]>([]);

  useEffect(() => { loadAppointments(); }, []);

  const loadAppointments = async () => {
    const apps = await getMyAppointments(user.id, 'PATIENT');
    setMyApps(apps);
  };

  const generateSlots = (rules?: any) => {
    if (!rules) return ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'];
    const slots = [];
    let current = rules.start;
    const end = rules.end;
    while (current < end) {
      slots.push(current);
      const [h, m] = current.split(':').map(Number);
      const nextM = m + rules.slotDuration;
      const nextH = h + Math.floor(nextM / 60);
      current = `${String(nextH).padStart(2, '0')}:${String(nextM % 60).padStart(2, '0')}`;
    }
    return slots;
  };

  const handleBook = async () => {
    if (!selectedDoc || !bookingTime) return;
    setIsBooking(true);
    const dateStr = selectedDate.toISOString().split('T')[0];
    const newApp: Omit<Appointment, 'id' | 'createdAt'> = {
      physicianId: selectedDoc.id,
      physicianName: selectedDoc.name,
      patientId: user.id,
      patientName: user.name,
      time: bookingTime,
      date: dateStr,
      status: 'PENDING',
      plan: 'Particular',
      whatsapp: user.whatsapp || ''
    };
    const result = await saveAppointment(newApp);
    if (result) {
      addNotification({
        id: Math.random().toString(),
        userId: user.id,
        title: 'Agendamento em Análise',
        message: `Sua consulta com ${selectedDoc.name} para ${dateStr} às ${bookingTime} foi enviada.`,
        type: 'SUCCESS',
        read: false,
        createdAt: Date.now()
      });
      setSelectedDoc(null);
      setBookingTime(null);
      loadAppointments();
    }
    setIsBooking(false);
  };

  const Calendar = () => {
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const startOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const endOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0);
    const monthDays = [];
    for (let i = 0; i < startOfMonth.getDay(); i++) monthDays.push(null);
    for (let i = 1; i <= endOfMonth.getDate(); i++) monthDays.push(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), i));

    return (
      <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
        <div className="flex justify-between items-center mb-4 px-2">
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() - 1)))} className="text-slate-400 hover:text-slate-900">←</button>
          <span className="text-sm font-bold text-slate-900">{selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setSelectedDate(new Date(selectedDate.setMonth(selectedDate.getMonth() + 1)))} className="text-slate-400 hover:text-slate-900">→</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {days.map(d => <span key={d} className="text-[9px] font-black uppercase text-slate-300">{d}</span>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {monthDays.map((date, i) => (
            <button 
              key={i} 
              disabled={!date || date < new Date(new Date().setHours(0,0,0,0))}
              onClick={() => date && setSelectedDate(date)}
              className={`h-10 text-xs font-bold rounded-xl flex items-center justify-center transition-all ${
                !date ? 'opacity-0' : 
                date.toDateString() === selectedDate.toDateString() ? 'bg-deepAqua text-white shadow-lg' :
                'bg-white text-slate-600 hover:bg-aqua/20'
              } ${date && date < new Date(new Date().setHours(0,0,0,0)) ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              {date?.getDate()}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (view === 'SEARCH') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full flex flex-col h-full overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
          <div className="w-full relative">
             <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Busque por médico ou especialidade..." className="w-full h-14 pl-12 pr-20 bg-slate-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-aqua transition-all text-sm font-medium" />
             <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 scrollbar-hide pb-20">
          {MOCK_PHYSICIANS.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())).map(doc => (
            <div key={doc.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer" onClick={() => setSelectedDoc(doc)}>
              <div className="flex gap-4 items-center mb-6">
                <div className="relative">
                   <img src={doc.avatar} className="w-14 h-14 rounded-2xl object-cover" alt={doc.name} />
                   <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                </div>
                <div>
                  <h4 className="text-sm font-display font-bold text-slate-900">{doc.name}</h4>
                  <p className="text-[10px] font-bold text-deepAqua uppercase tracking-widest">{doc.specialty}</p>
                </div>
              </div>
              <button className="w-full py-3 bg-slate-50 text-slate-900 group-hover:bg-deepAqua group-hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Ver Disponibilidade</button>
            </div>
          ))}
        </div>

        {selectedDoc && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-2xl rounded-[3rem] p-8 md:p-12 shadow-2xl relative flex flex-col md:flex-row gap-10">
              <button onClick={() => { setSelectedDoc(null); setBookingTime(null); }} className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-900">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
              
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-8">
                  <img src={selectedDoc.avatar} className="w-16 h-16 rounded-2xl border-4 border-white shadow-xl" />
                  <div>
                    <h3 className="text-xl font-display font-bold text-slate-900">{selectedDoc.name}</h3>
                    <p className="text-xs font-bold text-deepAqua uppercase tracking-widest">{selectedDoc.specialty}</p>
                  </div>
                </div>
                <Calendar />
              </div>

              <div className="flex-1 flex flex-col">
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Horários para {selectedDate.toLocaleDateString('pt-BR')}</h4>
                <div className="grid grid-cols-2 gap-3 flex-1 overflow-y-auto pr-2 scrollbar-hide max-h-[300px]">
                  {generateSlots(selectedDoc.availabilityRules).map(t => (
                    <button 
                      key={t} 
                      onClick={() => setBookingTime(t)} 
                      className={`py-3 rounded-2xl text-xs font-bold transition-all border ${bookingTime === t ? 'bg-slate-900 text-white border-slate-900 shadow-xl' : 'bg-slate-50 text-slate-500 border-transparent hover:border-aqua'}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={handleBook}
                  disabled={!bookingTime || isBooking}
                  className={`mt-8 w-full py-5 rounded-2xl font-bold text-white shadow-2xl transition-all transform active:scale-95 ${bookingTime && !isBooking ? 'neo-gradient' : 'bg-slate-200 cursor-not-allowed text-slate-400'}`}
                >
                   {isBooking ? 'Finalizando...' : bookingTime ? `Confirmar para ${bookingTime}` : 'Escolha um Horário'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 w-full flex flex-col h-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900">Olá, {user.name}</h1>
          <p className="text-slate-400">Gerencie sua saúde de forma inteligente.</p>
        </div>
        <button onClick={() => setView('SEARCH')} className="px-10 py-5 neo-gradient rounded-[2rem] text-white font-bold shadow-2xl transition-all active:scale-95">Explorar Médicos</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm flex flex-col overflow-hidden">
          <h3 className="text-2xl font-display font-bold text-slate-900 mb-8">Seus Agendamentos</h3>
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-hide">
            {myApps.length === 0 ? (
               <div className="h-full flex flex-col items-center justify-center opacity-20 text-center">
                  <span className="text-6xl mb-4">📅</span>
                  <p className="text-xs font-black uppercase tracking-widest">Nenhuma consulta</p>
               </div>
            ) : (
              myApps.map(app => (
                <div key={app.id} className="p-6 bg-slate-50/50 rounded-[2rem] flex justify-between items-center hover:bg-white hover:border-aqua transition-all">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">🩺</div>
                    <div>
                      <p className="font-bold text-slate-900">{app.physicianName}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{app.time}h • {new Date(app.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${app.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
            <h3 className="text-xl font-display font-bold mb-4">Google Calendar Sync</h3>
            <p className="text-xs text-white/50 leading-relaxed">Você receberá convites de calendário automaticamente para as consultas confirmadas.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;