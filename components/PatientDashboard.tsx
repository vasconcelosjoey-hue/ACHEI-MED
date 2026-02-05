
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
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[calc(100vh-120px)] flex flex-col">
        {/* Header Search Area */}
        <div className="flex flex-col md:flex-row gap-6 items-end mb-8">
          <div className="flex-1 space-y-2">
            <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">{t.map.nearbyDoctors}</h1>
            <div className="relative group">
               <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t.map.searchPlaceholder}
                className="w-full h-14 pl-12 pr-6 bg-white rounded-2xl shadow-lg shadow-slate-200/50 border border-slate-100 outline-none focus:ring-2 focus:ring-babyBlue/30 text-slate-700 transition-all font-medium"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-deepAqua transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setSearchMode('MAP')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${searchMode === 'MAP' ? 'bg-white text-deepAqua shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t.map.viewMap}
            </button>
            <button 
              onClick={() => setSearchMode('LIST')}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${searchMode === 'LIST' ? 'bg-white text-deepAqua shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {t.map.viewList}
            </button>
          </div>
        </div>

        <div className="flex-1 grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <aside className="space-y-6 hidden lg:block">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-24">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-2">Refinar Busca</h3>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Especialidade</label>
                  <select 
                    value={filters.specialty}
                    onChange={(e) => setFilters({...filters, specialty: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-aqua/20 outline-none transition-all"
                  >
                    <option value="">Todas</option>
                    {MOCK_DATA.SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Plano de Saúde</label>
                  <select 
                    value={filters.plan}
                    onChange={(e) => setFilters({...filters, plan: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-aqua/20 outline-none transition-all"
                  >
                    <option value="">Todos (incl. Particular)</option>
                    {MOCK_DATA.PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={() => setFilters({specialty: '', city: 'Manaus', plan: ''})}
                className="w-full mt-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          </aside>

          {/* Search Content */}
          <section className="lg:col-span-3 h-full min-h-[500px]">
            {searchMode === 'LIST' ? (
              <div className="grid md:grid-cols-2 gap-6 pb-12">
                {filteredDoctors.map(doc => (
                  <div key={doc.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                    <div className="flex items-start gap-6">
                      <img src={doc.avatar} className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white" alt={doc.name} />
                      <div>
                        <h4 className="text-xl font-display font-bold text-slate-900 group-hover:text-deepAqua transition-colors">{doc.name}</h4>
                        <p className="text-sm font-semibold text-slate-500">{doc.specialty}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 font-medium">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          {doc.address}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-50">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Planos:</p>
                      <div className="flex flex-wrap gap-2">
                        {doc.plans.map(p => <span key={p} className="px-2 py-1 rounded-md bg-babyBlue/10 text-deepAqua text-[10px] font-bold">{p}</span>)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-6">
                       <button 
                        onClick={() => handleBookingStart(doc)}
                        className="py-3 neo-gradient rounded-xl font-bold text-white text-[10px] uppercase tracking-widest shadow-lg shadow-babyBlue/30 hover:scale-[1.02] active:scale-95 transition-all"
                      >
                        Ver Agenda
                      </button>
                      <button 
                        onClick={() => handleWhatsappBooking(doc)}
                        className="py-3 bg-white border border-slate-100 rounded-xl font-bold text-slate-600 text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        WhatsApp
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative w-full h-full rounded-[3rem] overflow-hidden border border-slate-100 shadow-2xl bg-slate-200">
                {/* Real Google Maps Embed with Manaus focus */}
                <iframe 
                  className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31868.94825656187!2d-60.015!3d-3.105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1716200000000!5m2!1spt-BR!2sbr"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                {/* Markers overlay - Adjusted for the iframe zoom level */}
                {filteredDoctors.map((doc) => (
                  <button 
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    style={{
                      left: `${50 + (doc.lng + 60.0150) * 1200}%`,
                      top: `${50 + (doc.lat + 3.1050) * -1200}%`
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-full p-1 rounded-full border-2 transition-all hover:scale-125 z-10 ${selectedDoc?.id === doc.id ? 'bg-deepAqua border-white scale-125 shadow-2xl ring-4 ring-deepAqua/20' : 'bg-white border-deepAqua shadow-md'}`}
                  >
                    <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-full border border-slate-100" />
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-deepAqua"></div>
                  </button>
                ))}

                {/* Floating Navigation Controls */}
                <div className="absolute top-6 right-6 flex flex-col gap-3">
                   <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-600 hover:text-deepAqua transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></button>
                   <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-slate-600 hover:text-deepAqua transition-all"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg></button>
                </div>

                {/* Map Doctor Card Overlay - Premium Redesign */}
                {selectedDoc && (
                  <div className="absolute bottom-10 left-6 right-6 lg:left-1/2 lg:-translate-x-1/2 lg:w-full lg:max-w-xl animate-in slide-in-from-bottom-10 duration-500">
                    <div className="bg-white p-8 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] flex flex-col md:flex-row gap-8 items-center relative overflow-hidden group border border-slate-100/50 backdrop-blur-md bg-white/95">
                      <button 
                        onClick={() => setSelectedDoc(null)}
                        className="absolute top-6 right-6 p-2 bg-slate-50 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                      >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                      
                      <div className="relative">
                        <img src={selectedDoc.avatar} className="w-32 h-32 md:w-40 md:h-40 rounded-[2.5rem] object-cover shadow-2xl border-4 border-white" alt={selectedDoc.name} />
                        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-full flex items-center justify-center text-white shadow-lg">
                           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                      </div>

                      <div className="flex-1 w-full">
                        <h4 className="text-2xl md:text-3xl font-display font-bold text-slate-900 leading-tight mb-1">{selectedDoc.name}</h4>
                        <p className="text-lg font-semibold text-deepAqua mb-2">{selectedDoc.specialty}</p>
                        
                        <div className="space-y-2 mb-6">
                            <p className="text-xs text-slate-500 font-medium flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {selectedDoc.address}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {selectedDoc.plans.slice(0, 3).map(p => <span key={p} className="px-2 py-0.5 rounded-lg bg-slate-50 text-slate-400 text-[9px] font-black uppercase tracking-widest border border-slate-100">{p}</span>)}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <button 
                                onClick={() => handleWhatsappBooking(selectedDoc)}
                                className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-200"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                {t.map.bookWhatsapp}
                            </button>
                            <button 
                                onClick={() => openInGoogleMaps(selectedDoc)}
                                className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                Abrir no Maps
                            </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Booking Selection Modal */}
        {bookingStep === 'SELECTING_TIME' && selectedDoc && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setBookingStep('IDLE')}></div>
                <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
                    <h2 className="text-2xl font-display font-bold text-slate-900 mb-2">{t.modals.booking}</h2>
                    <p className="text-slate-500 text-sm mb-8">Com {selectedDoc.name}</p>
                    
                    <div className="grid grid-cols-3 gap-3 mb-8">
                        {['08:00', '09:30', '11:00', '14:30', '16:00', '17:30'].map(time => (
                            <button 
                                key={time} 
                                onClick={() => handleBookingConfirm(time)}
                                className="py-3 rounded-xl border border-slate-100 hover:border-babyBlue hover:bg-babyBlue/10 transition-all font-bold text-slate-700 text-xs"
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                    
                    <button onClick={() => setBookingStep('IDLE')} className="w-full py-4 text-slate-400 font-bold">{t.modals.close}</button>
                </div>
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight mb-2">Bem-vindo, {user.name}</h1>
          <p className="text-slate-500 font-medium italic">"Cuidando da sua saúde no Norte com tecnologia."</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setView('SEARCH')}
            className="flex items-center gap-3 px-8 py-4 neo-gradient rounded-2xl text-white font-bold shadow-xl shadow-babyBlue/40 transform hover:-translate-y-1 transition-all"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
            Agendar Consulta
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 pb-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2 text-slate-900">
              <span className="w-1.5 h-6 bg-aqua rounded-full"></span>
              Próximos Passos
            </h3>
            <div className="space-y-4">
              {[
                { doc: 'Dr. Arlindo Jr.', specialty: 'Cardiologia', time: 'Aguardando Reencaixe', status: 'FILA DE ESPERA' },
              ].map((app, i) => (
                <div key={i} className="group bg-slate-50 hover:bg-white p-6 rounded-2xl border border-transparent hover:border-babyBlue/30 hover:shadow-xl transition-all flex justify-between items-center">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-2xl">📅</div>
                    <div>
                      <p className="font-bold text-slate-900">{app.doc}</p>
                      <p className="text-xs text-slate-500">{app.specialty} • {app.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-babyBlue/20 text-blue-700 animate-pulse">
                      {app.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-40 h-40 bg-aqua/20 rounded-full blur-3xl"></div>
             <h3 className="text-lg font-display font-bold mb-4">Saúde Norte</h3>
             <p className="text-sm text-white/70 leading-relaxed mb-6">Mantenha-se hidratado. O clima úmido da região exige atenção redobrada com a reposição de eletrólitos.</p>
             <button onClick={() => setShowTips(true)} className="text-[10px] font-black uppercase tracking-widest text-aqua hover:underline">Ver orientações</button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-display font-bold mb-6 text-slate-900">Histórico</h3>
            <div className="space-y-4 text-center py-10">
               <div className="text-3xl mb-2 opacity-20">📂</div>
               <p className="text-slate-400 italic text-sm">Nenhum registro anterior encontrado na região.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Health Tips Modal */}
      {showTips && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowTips(false)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold text-slate-900">{t.modals.healthTips}</h2>
                <button onClick={() => setShowTips(false)} className="text-slate-400 hover:text-slate-900 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             <div className="space-y-4">
                {[
                    { t: 'Hidratação Constante', d: 'Beba 2L de água/dia. O calor da Amazônia acelera a desidratação.' },
                    { t: 'Prevenção de Fungos', d: 'A umidade alta favorece micose. Mantenha a pele seca após o banho.' },
                    { t: 'Repelente Noturno', d: 'Essencial em áreas próximas a rios e igarapés para evitar arboviroses.' }
                ].map((tip, i) => (
                    <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <h4 className="font-bold text-slate-900 mb-1">{tip.t}</h4>
                        <p className="text-xs text-slate-500 leading-relaxed">{tip.d}</p>
                    </div>
                ))}
             </div>
             <button onClick={() => setShowTips(false)} className="w-full mt-8 py-4 neo-gradient text-white rounded-2xl font-bold shadow-xl">{t.modals.close}</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
