
import React, { useState, useEffect } from 'react';
import { User, AppView, Notification, MOCK_DATA, MOCK_PHYSICIANS_MANAUS, Physician } from '../types';
import { translations } from '../translations';

interface PatientDashboardProps {
  user: User;
  view: AppView;
  setView: (v: AppView) => void;
  addNotification: (n: Notification) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, view, setView, addNotification }) => {
  const t = translations['pt-BR'];
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ specialty: '', city: 'Manaus', plan: '' });
  const [isBooking, setIsBooking] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [bookingStep, setBookingStep] = useState<'IDLE' | 'SELECTING_TIME'>('IDLE');
  const [selectedDoc, setSelectedDoc] = useState<Physician | null>(null);
  const [searchMode, setSearchMode] = useState<'LIST' | 'MAP'>('MAP');

  const filteredDoctors = MOCK_PHYSICIANS_MANAUS.filter(d => 
    (search === '' || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())) &&
    (filters.specialty === '' || d.specialty === filters.specialty) &&
    (filters.city === '' || d.city === filters.city) &&
    (filters.plan === '' || d.plans.includes(filters.plan))
  );

  const handleBookingStart = (doc: Physician) => {
    setSelectedDoc(doc);
    setBookingStep('SELECTING_TIME');
  };

  const handleBookingConfirm = (time: string) => {
    if (!selectedDoc) return;
    setIsBooking(selectedDoc.id);
    setBookingStep('IDLE');
    setTimeout(() => {
      setIsBooking(null);
      setSelectedDoc(null);
      addNotification({
        id: Math.random().toString(),
        userId: user.id,
        title: 'Consulta Agendada',
        message: `Sua consulta com ${selectedDoc.name} para às ${time} foi pré-confirmada.`,
        type: 'SUCCESS',
        read: false,
        createdAt: Date.now()
      });
    }, 1500);
  };

  const handleWhatsappBooking = (doc: Physician) => {
    const msg = `Olá, gostaria de agendar uma consulta via AGENDA MED.`;
    window.open(`https://wa.me/${doc.whatsapp || '559293022840'}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const openInGoogleMaps = (doc: Physician) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${doc.lat},${doc.lng}`;
    window.open(url, '_blank');
  };

  if (view === 'SEARCH') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full flex flex-col">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
          <div className="w-full md:flex-1">
            <div className="relative group">
               <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.map.searchPlaceholder}
                className="w-full h-12 md:h-14 pl-12 pr-6 bg-white rounded-2xl shadow-sm border border-slate-100 outline-none focus:ring-2 focus:ring-babyBlue/30 text-sm transition-all font-medium"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
            <button 
              onClick={() => setSearchMode('MAP')}
              className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${searchMode === 'MAP' ? 'bg-white text-deepAqua shadow-sm' : 'text-slate-400'}`}
            >
              {t.map.viewMap}
            </button>
            <button 
              onClick={() => setSearchMode('LIST')}
              className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${searchMode === 'LIST' ? 'bg-white text-deepAqua shadow-sm' : 'text-slate-400'}`}
            >
              {t.map.viewList}
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6 w-full">
          <aside className="hidden lg:block space-y-4">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 px-2">Filtros</h3>
              <div className="space-y-3">
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs outline-none">
                  <option>Todas Especialidades</option>
                  {MOCK_DATA.SPECIALTIES.map(s => <option key={s}>{s}</option>)}
                </select>
                <select className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs outline-none">
                  <option>Todos os Planos</option>
                  {MOCK_DATA.PLANS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
          </aside>

          <section className="lg:col-span-3 min-h-[400px] md:min-h-[600px] w-full relative">
            {searchMode === 'LIST' ? (
              <div className="grid sm:grid-cols-2 gap-4 pb-12 w-full">
                {filteredDoctors.map(doc => (
                  <div key={doc.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col">
                    <div className="flex gap-4 items-center mb-4">
                      <img src={doc.avatar} className="w-16 h-16 rounded-xl object-cover shadow-sm" alt={doc.name} />
                      <div className="overflow-hidden">
                        <h4 className="text-lg font-display font-bold text-slate-900 truncate">{doc.name}</h4>
                        <p className="text-xs font-semibold text-deepAqua">{doc.specialty}</p>
                      </div>
                    </div>
                    <div className="mt-auto space-y-2">
                      <button onClick={() => handleWhatsappBooking(doc)} className="w-full py-3 bg-[#25D366] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md">Agendar via WhatsApp</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-[500px] md:h-full rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-xl bg-slate-100 relative">
                <iframe 
                  className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31868.94825656187!2d-60.015!3d-3.105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1716200000000!5m2!1spt-BR!2sbr"
                  loading="lazy"
                ></iframe>
              </div>
            )}
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 w-full max-w-full overflow-hidden px-2 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="w-full">
          <h1 className="text-2xl md:text-4xl font-display font-bold text-slate-900 tracking-tight leading-tight">Olá, {user.name}</h1>
          <p className="text-slate-500 text-sm md:text-base font-medium">Gestão inteligente da sua saúde.</p>
        </div>
        <button 
          onClick={() => setView('SEARCH')}
          className="w-full md:w-auto px-8 py-4 neo-gradient rounded-2xl text-white font-bold shadow-xl shadow-babyBlue/40 transform active:scale-95 transition-all text-sm"
        >
          Nova Consulta
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 pb-12 w-full">
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm w-full">
          <h3 className="text-xl font-display font-bold mb-6 text-slate-900 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-aqua rounded-full"></span>
            Sua Agenda
          </h3>
          <div className="space-y-4">
            <div className="p-5 bg-slate-50 rounded-2xl border border-transparent flex justify-between items-center group">
              <div className="flex gap-4 items-center">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-xl shadow-sm">📅</div>
                <div>
                  <p className="font-bold text-slate-900 text-sm md:text-base">Dr. Arlindo Jr.</p>
                  <p className="text-[10px] md:text-xs text-slate-500">Cardiologia • Fila de Espera</p>
                </div>
              </div>
              <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest bg-babyBlue/30 text-blue-700 px-3 py-1 rounded-full animate-pulse">
                Processando
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 text-white p-8 rounded-[2rem] shadow-2xl relative overflow-hidden flex flex-col justify-between">
           <div className="absolute -top-10 -right-10 w-40 h-40 bg-aqua/20 rounded-full blur-3xl"></div>
           <div>
             <h3 className="text-lg font-display font-bold mb-4">Dica do Dia</h3>
             <p className="text-xs md:text-sm text-white/70 leading-relaxed italic">"Mantenha sua lista de convênios sempre atualizada para facilitar o reencaixe automático."</p>
           </div>
           <div className="mt-8 text-[9px] font-black uppercase tracking-widest text-aqua">AGENDA MED AI • Manaus</div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
