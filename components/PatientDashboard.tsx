
import React, { useState } from 'react';
import { User, AppView, Notification, MOCK_PHYSICIANS_MANAUS, Physician } from '../types';

interface PatientDashboardProps {
  user: User;
  view: AppView;
  setView: (v: AppView) => void;
  addNotification: (n: Notification) => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, view, setView, addNotification }) => {
  const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState<'LIST' | 'MAP'>('MAP');

  const filteredDoctors = MOCK_PHYSICIANS_MANAUS.filter(d => 
    search === '' || d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase())
  );

  if (view === 'SEARCH') {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 w-full flex flex-col h-full overflow-hidden">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-white p-6 rounded-[2rem] border border-slate-50 shadow-sm">
          <div className="w-full md:flex-1 relative">
             <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por médico ou especialidade..."
              className="w-full h-14 pl-12 pr-6 bg-slate-50 rounded-2xl border border-transparent outline-none focus:bg-white focus:border-aqua transition-all text-sm font-medium"
            />
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          
          <div className="flex bg-slate-50 p-1.5 rounded-2xl">
            <button 
              onClick={() => setSearchMode('MAP')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${searchMode === 'MAP' ? 'bg-white text-deepAqua shadow-md' : 'text-slate-400'}`}
            >
              Mapa
            </button>
            <button 
              onClick={() => setSearchMode('LIST')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${searchMode === 'LIST' ? 'bg-white text-deepAqua shadow-md' : 'text-slate-400'}`}
            >
              Lista
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative rounded-[3rem] border border-slate-100 shadow-2xl bg-white">
          {searchMode === 'LIST' ? (
            <div className="h-full overflow-y-auto p-8 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 scrollbar-hide">
              {filteredDoctors.map(doc => (
                <div key={doc.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group">
                  <div className="flex gap-4 items-center mb-6">
                    <img src={doc.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-lg group-hover:scale-105 transition-transform" alt={doc.name} />
                    <div className="overflow-hidden">
                      <h4 className="text-lg font-display font-bold text-slate-900 truncate">{doc.name}</h4>
                      <p className="text-xs font-bold text-deepAqua uppercase tracking-widest">{doc.specialty}</p>
                    </div>
                  </div>
                  <button onClick={() => window.open(`https://wa.me/${doc.whatsapp}`, '_blank')} className="w-full py-4 neo-gradient text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-aqua/20">Agendar Consulta</button>
                </div>
              ))}
            </div>
          ) : (
            <iframe 
              className="absolute inset-0 w-full h-full border-0 pointer-events-auto"
              src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d31868.94825656187!2d-60.015!3d-3.105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1spt-BR!2sbr!4v1716200000000!5m2!1spt-BR!2sbr"
              loading="lazy"
            ></iframe>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-700 w-full flex flex-col h-full overflow-hidden">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-display font-bold text-slate-900 tracking-tight">Bem-vindo, {user.name}</h1>
          <p className="text-slate-400 font-medium">Encontre o melhor cuidado para você hoje.</p>
        </div>
        <button 
          onClick={() => setView('SEARCH')}
          className="px-10 py-5 neo-gradient rounded-[2rem] text-white font-bold shadow-2xl shadow-babyBlue/40 transform active:scale-95 transition-all text-sm"
        >
          Encontrar Médico Agora
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-slate-50 shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-2xl font-display font-bold mb-8 text-slate-900">Suas Próximas Consultas</h3>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4 scrollbar-hide">
            <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-transparent flex justify-between items-center group hover:bg-white hover:border-aqua transition-all">
              <div className="flex gap-6 items-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm">🩺</div>
                <div>
                  <p className="font-bold text-slate-900 text-lg">Dr. Arlindo Jr.</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Aguardando Confirmação • 08:00h</p>
                </div>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-deepAqua bg-aqua/20 px-4 py-2 rounded-full">Pendente</button>
            </div>
          </div>
        </div>

        <div className="space-y-6 flex flex-col overflow-hidden">
           <div className="bg-slate-900 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col justify-center">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-aqua/20 rounded-full blur-3xl"></div>
              <p className="text-aqua text-[10px] font-black uppercase tracking-[0.3em] mb-4">Saúde em Foco</p>
              <h3 className="text-xl font-display font-bold mb-4 leading-tight">Mantenha seu histórico em dia.</h3>
              <p className="text-sm text-white/50 leading-relaxed italic">"Suas realocações são prioritárias quando seu perfil está 100% preenchido."</p>
           </div>
           
           <div className="flex-1 bg-babyBlue/10 p-10 rounded-[3rem] border border-babyBlue/20 flex flex-col justify-center items-center text-center">
              <div className="w-20 h-20 neo-gradient rounded-full flex items-center justify-center text-3xl text-white shadow-xl shadow-aqua/20 mb-6">✨</div>
              <h4 className="font-display font-bold text-slate-900 mb-2">Plano de Saúde</h4>
              <p className="text-xs text-slate-500 max-w-[200px]">Você possui convênio ativo com <strong>Unimed Manaus</strong>.</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
