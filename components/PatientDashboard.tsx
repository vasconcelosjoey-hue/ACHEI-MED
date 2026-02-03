
import React, { useState } from 'react';
import { User, AppView, Notification, MOCK_DATA, MOCK_PHYSICIANS_MANAUS } from '../types';

interface PatientDashboardProps {
  user: User;
  view: AppView;
  setView: (v: AppView) => void;
  addNotification: (n: Notification) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, view, setView, addNotification }) => {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ specialty: '', city: 'Manaus', plan: '' });
  const [isBooking, setIsBooking] = useState<string | null>(null);

  const filteredDoctors = MOCK_PHYSICIANS_MANAUS.filter(d => 
    (search === '' || d.name.toLowerCase().includes(search.toLowerCase())) &&
    (filters.specialty === '' || d.specialty === filters.specialty) &&
    (filters.city === '' || d.city === filters.city) &&
    (filters.plan === '' || d.plans.includes(filters.plan))
  );

  const handleBooking = (docId: string) => {
    setIsBooking(docId);
    setTimeout(() => {
      setIsBooking(null);
      addNotification({
        id: Math.random().toString(),
        userId: user.id,
        title: 'Reserva em Manaus Solicitada',
        message: 'A clínica local em Manaus recebeu seu pedido. Você será notificado via WhatsApp.',
        type: 'SUCCESS',
        read: false,
        createdAt: Date.now()
      });
    }, 1500);
  };

  if (view === 'SEARCH') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-12">
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight mb-2">Especialistas em {filters.city}</h1>
          <p className="text-slate-500 font-medium">Buscando o melhor cuidado na região amazônica.</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm sticky top-24">
              <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6 px-2">Filtros Ativos</h3>
              
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
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Cidade</label>
                  <select 
                    value={filters.city}
                    onChange={(e) => setFilters({...filters, city: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-aqua/20 outline-none transition-all"
                  >
                    {MOCK_DATA.CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Plano</label>
                  <select 
                    value={filters.plan}
                    onChange={(e) => setFilters({...filters, plan: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-aqua/20 outline-none transition-all"
                  >
                    <option value="">Todos</option>
                    {MOCK_DATA.PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              <button 
                onClick={() => setFilters({specialty: '', city: 'Manaus', plan: ''})}
                className="w-full mt-6 py-3 text-[10px] font-black uppercase tracking-widest text-red-400 hover:text-red-500 transition-colors"
              >
                Resetar Filtros
              </button>
            </div>
          </aside>

          <section className="lg:col-span-3 space-y-8">
            <div className="relative">
              <input 
                type="text" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Pesquisar por Dr. Arlindo, Dra. Samara..."
                className="w-full h-16 pl-14 pr-6 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 outline-none focus:ring-2 focus:ring-babyBlue/30 text-slate-700 transition-all font-medium"
              />
              <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredDoctors.map(doc => (
                <div key={doc.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all group overflow-hidden relative">
                  <div className="flex items-start gap-6">
                    <img src={doc.avatar} className="w-20 h-20 rounded-2xl object-cover shadow-lg border-2 border-white" alt={doc.name} />
                    <div>
                      <h4 className="text-xl font-display font-bold text-slate-900 group-hover:text-deepAqua transition-colors">{doc.name}</h4>
                      <p className="text-sm font-semibold text-slate-500">{doc.specialty}</p>
                      <div className="flex items-center gap-1 mt-2 text-xs text-slate-400 font-medium">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {doc.city}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-50">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Planos Aceitos:</p>
                    <div className="flex flex-wrap gap-2">
                      {doc.plans.map(p => <span key={p} className="px-2 py-1 rounded-md bg-babyBlue/10 text-deepAqua text-[10px] font-bold">{p}</span>)}
                    </div>
                  </div>
                  <button 
                    disabled={isBooking === doc.id}
                    onClick={() => handleBooking(doc.id)}
                    className="w-full mt-6 py-4 neo-gradient rounded-xl font-bold text-white text-sm shadow-lg shadow-babyBlue/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    {isBooking === doc.id ? <div className="loader !border-white !border-t-transparent"></div> : 'Consultar Agenda'}
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight mb-2">Bem-vindo, {user.name}</h1>
          <p className="text-slate-500 font-medium italic">"Cuidando da sua saúde em Manaus com tecnologia."</p>
        </div>
        <button 
          onClick={() => setView('SEARCH')}
          className="flex items-center gap-3 px-8 py-4 neo-gradient rounded-2xl text-white font-bold shadow-xl shadow-babyBlue/40 transform hover:-translate-y-1 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
          Agendar em Manaus
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
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
             <h3 className="text-lg font-display font-bold mb-4">Saúde Manaus</h3>
             <p className="text-sm text-white/70 leading-relaxed mb-6">Mantenha-se hidratado. O clima úmido de Manaus exige atenção redobrada com a reposição de eletrólitos.</p>
             <button className="text-[10px] font-black uppercase tracking-widest text-aqua hover:underline">Ver orientações</button>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-display font-bold mb-6 text-slate-900">Histórico</h3>
            <div className="space-y-4 text-center py-10">
               <div className="text-3xl mb-2 opacity-20">📂</div>
               <p className="text-slate-400 italic text-sm">Nenhum registro anterior encontrado em Manaus.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
