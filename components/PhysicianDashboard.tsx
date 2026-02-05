
import React, { useEffect, useRef, useState } from 'react';
import { User, Notification } from '../types';
import { translations } from '../translations';

interface PhysicianDashboardProps {
  user: User;
  addNotification: (n: Notification) => void;
}

const PhysicianDashboard: React.FC<PhysicianDashboardProps> = ({ user, addNotification }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const t = translations['pt-BR'];
  const [isSyncing, setIsSyncing] = useState(false);
  const [isGoogleConnected, setIsGoogleConnected] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeModal, setActiveModal] = useState<'SETTINGS' | 'NEW_SLOT' | null>(null);
  
  const [waitingList, setWaitingList] = useState([
    { name: 'Daniela Lima', time: 'Urgente', delay: '1 dia' },
    { name: 'Enzo Ferrari', time: 'Manhã', delay: '4 dias' }
  ]);

  const [appointments, setAppointments] = useState([
    { id: '1', patient: 'Ana Silva', time: '09:00', type: 'Consulta', status: 'WAITING_CONFIRMATION', plan: 'Unimed' },
    { id: '2', patient: 'Bruno Costa', time: '10:30', type: 'Retorno', status: 'CONFIRMED', plan: 'Particular' },
    { id: '3', patient: 'Carlos Duarte', time: '14:00', type: 'Exame', status: 'REALLOCATED', plan: 'Bradesco' },
  ]);

  useEffect(() => {
    if (chartRef.current && (window as any).echarts) {
      const chart = (window as any).echarts.init(chartRef.current);
      chart.setOption({
        animationDuration: 1500,
        grid: { top: 20, right: 20, bottom: 40, left: 40 },
        tooltip: { trigger: 'axis' },
        xAxis: { 
          type: 'category', 
          data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'],
          axisLine: { lineStyle: { color: '#E2E8F0' } }
        },
        yAxis: { 
          type: 'value',
          splitLine: { lineStyle: { type: 'dashed', color: '#F1F5F9' } }
        },
        series: [{
          name: 'Consultas Realizadas',
          data: [12, 19, 15, 22, 18, 10],
          type: 'line',
          smooth: true,
          symbolSize: 8,
          color: '#0D9488',
          lineStyle: { width: 3 },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{ offset: 0, color: 'rgba(153, 246, 228, 0.4)' }, { offset: 1, color: 'rgba(255, 255, 255, 0)' }]
            }
          }
        }]
      });

      const handleResize = () => chart.resize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const handleGoogleAuth = () => {
    setShowAuthModal(false);
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setIsGoogleConnected(true);
      addNotification({
        id: Math.random().toString(),
        userId: user.id,
        title: 'Google Agenda Conectado',
        message: 'Sincronização bidirecional ativada com sucesso.',
        type: 'SUCCESS',
        read: false,
        createdAt: Date.now()
      });
    }, 2500);
  };

  const triggerReallocation = (id: string) => {
    const nextInLine = waitingList[0];
    if (!nextInLine) {
        addNotification({
            id: Math.random().toString(),
            userId: user.id,
            title: 'Erro na Realocação',
            message: 'Não há pacientes na fila de espera para este horário.',
            type: 'ALERT',
            read: false,
            createdAt: Date.now()
        });
        return;
    }

    setAppointments(prev => prev.map(a => a.id === id ? { 
        ...a, 
        patient: nextInLine.name, 
        status: 'CONFIRMED', 
        plan: 'Fila de Espera' 
    } : a));

    setWaitingList(prev => prev.slice(1));

    addNotification({
      id: Math.random().toString(),
      userId: user.id,
      title: 'Realocação Concluída',
      message: `${nextInLine.name} foi movido(a) da fila para o horário das 09:00.`,
      type: 'SUCCESS',
      read: false,
      createdAt: Date.now()
    });
  };

  const handleForceFit = (index: number) => {
    const patient = waitingList[index];
    const newSlot = {
        id: Math.random().toString(),
        patient: patient.name,
        time: '17:30', 
        type: 'Encaixe Urgente',
        status: 'CONFIRMED',
        plan: 'Urgência'
    };
    setAppointments(prev => [...prev, newSlot].sort((a, b) => a.time.localeCompare(b.time)));
    setWaitingList(prev => prev.filter((_, i) => i !== index));
    addNotification({
        id: Math.random().toString(),
        userId: user.id,
        title: 'Encaixe Realizado',
        message: `${patient.name} foi adicionado(a) ao fim da agenda de hoje.`,
        type: 'INFO',
        read: false,
        createdAt: Date.now()
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Agenda Ativa - Dr(a). {user.name}</h1>
          <p className="text-slate-500 font-medium">Gestão inteligente para sua clínica individual.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveModal('SETTINGS')}
            className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            {t.modals.settings}
          </button>
          <button 
            onClick={() => setActiveModal('NEW_SLOT')}
            className="px-6 py-3 rounded-2xl neo-gradient text-sm font-bold text-white shadow-lg shadow-babyBlue/40 transition-all hover:-translate-y-1"
          >
            {t.modals.newSlot}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t.app.stats.occupied, val: appointments.length.toString(), icon: '👤', color: 'bg-babyBlue' },
              { label: t.app.stats.free, val: (15 - appointments.length).toString(), icon: '⌛', color: 'bg-aqua' },
              { label: t.app.stats.canceled, val: waitingList.length.toString(), icon: '🔄', color: 'bg-green-100' },
              { label: 'Previsão', val: `R$ ${(appointments.length * 250).toLocaleString()}`, icon: '📈', color: 'bg-slate-100' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                <p className="text-2xl font-display font-bold text-slate-900">{s.val}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <h3 className="text-lg font-display font-bold mb-6 text-slate-900">Produtividade Semanal (AGENDA MED)</h3>
            <div ref={chartRef} className="h-64 w-full"></div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group">
            <h3 className="text-lg font-display font-bold mb-2 text-slate-900">{t.integrations.title}</h3>
            <p className="text-xs text-slate-500 mb-6">{t.integrations.googleDesc}</p>
            
            <button 
              onClick={() => isGoogleConnected ? setIsGoogleConnected(false) : setShowAuthModal(true)}
              disabled={isSyncing}
              className={`w-full py-4 rounded-2xl border-2 flex items-center justify-center gap-3 font-bold transition-all ${isGoogleConnected ? 'bg-green-50 border-green-100 text-green-700' : 'bg-white border-slate-100 hover:border-babyBlue text-slate-700'}`}
            >
              {isSyncing ? (
                <div className="loader !border-deepAqua !border-t-transparent"></div>
              ) : isGoogleConnected ? (
                <>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  {t.integrations.connected}
                </>
              ) : (
                <>
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                  {t.integrations.connect}
                </>
              )}
            </button>
            
            {isGoogleConnected && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                <p className="text-[10px] text-green-600 font-black uppercase tracking-widest text-center">{t.integrations.syncing}</p>
                <p className="text-[9px] text-slate-400 mt-1 text-center">{t.integrations.lastSync}</p>
              </div>
            )}
          </div>

          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-aqua/20 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-aqua rounded-full animate-ping"></span>
              Lista de Espera Ativa
            </h3>
            <div className="space-y-4">
              {waitingList.map((w, i) => (
                <div key={i} className="bg-white/10 p-4 rounded-2xl flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-sm">{w.name}</p>
                    <p className="text-[10px] text-white/60 uppercase font-black tracking-widest">{w.time}</p>
                  </div>
                  <button 
                    onClick={() => handleForceFit(i)}
                    className="text-[10px] font-black uppercase text-aqua bg-aqua/10 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    Forçar Encaixe
                  </button>
                </div>
              ))}
              {waitingList.length === 0 && (
                <p className="text-center text-xs text-white/40 italic py-4">Nenhum paciente na fila no momento.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-xl font-display font-bold text-slate-900">Gerenciamento de Consultas</h2>
          <div className="flex gap-2">
             <span className="px-3 py-1 rounded-full bg-aqua/10 text-deepAqua text-[10px] font-black uppercase tracking-widest">Confirmadas: {appointments.filter(a => a.status === 'CONFIRMED').length}</span>
             <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase tracking-widest">Aguardando: {appointments.filter(a => a.status === 'WAITING_CONFIRMATION').length}</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                <th className="px-8 py-5">Horário</th>
                <th className="px-8 py-5">Paciente</th>
                <th className="px-8 py-5">Status do Sistema</th>
                <th className="px-8 py-5 text-right">Ações de Realocação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments.map((app) => (
                <tr key={app.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6 font-display font-bold text-lg text-slate-900">{app.time}</td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-800">{app.patient}</p>
                    <p className="text-xs text-slate-400">{app.plan}</p>
                  </td>
                  <td className="px-8 py-6">
                    {app.status === 'CONFIRMED' ? (
                      <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">Confirmado</span>
                    ) : app.status === 'REALLOCATED' ? (
                      <span className="px-3 py-1.5 rounded-full bg-babyBlue/20 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-babyBlue/30">Vaga Realocada</span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-600 text-[10px] font-black uppercase tracking-widest border border-yellow-100">Aguardando Resposta</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    {app.status === 'WAITING_CONFIRMATION' && (
                      <button 
                        onClick={() => triggerReallocation(app.id)}
                        className="text-[10px] font-black uppercase text-red-400 hover:text-red-600 tracking-widest border border-red-100 px-4 py-2 rounded-xl transition-all"
                      >
                        Chamar Próximo (Fila)
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setShowAuthModal(false)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
             <div className="text-center mb-8">
                <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_Calendar_icon_%282020%29.svg" className="w-16 h-16 mx-auto mb-6" alt="Google" />
                <h2 className="text-2xl font-display font-bold text-slate-900">{t.integrations.authTitle}</h2>
                <p className="text-slate-500 mt-2 text-sm">{t.integrations.authDesc}</p>
             </div>
             <div className="space-y-4 mb-8">
                {t.integrations.permissions.map((p: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">
                        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" /></svg>
                        {p}
                    </div>
                ))}
             </div>
             <div className="flex flex-col gap-3">
                <button onClick={handleGoogleAuth} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all">{t.integrations.allow}</button>
                <button onClick={() => setShowAuthModal(false)} className="w-full py-4 text-slate-400 font-bold hover:text-slate-600">{t.integrations.deny}</button>
             </div>
          </div>
        </div>
      )}

      {activeModal === 'SETTINGS' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveModal(null)}></div>
          <div className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold text-slate-900">{t.modals.settings}</h2>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Nome de Exibição</label>
                    <input type="text" defaultValue={user.name} className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-babyBlue/20" />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Notificações</label>
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <span className="text-sm font-bold text-slate-700">WhatsApp Ativo</span>
                        <div className="w-12 h-6 bg-deepAqua rounded-full relative">
                            <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>
                <button onClick={() => { setActiveModal(null); addNotification({ id: 's1', userId: user.id, title: 'Perfil Atualizado', message: 'Suas alterações foram salvas.', type: 'SUCCESS', read: false, createdAt: Date.now() }); }} className="w-full py-5 neo-gradient text-white rounded-2xl font-bold shadow-xl">{t.modals.save}</button>
             </div>
          </div>
        </div>
      )}

      {activeModal === 'NEW_SLOT' && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in" onClick={() => setActiveModal(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-display font-bold text-slate-900">{t.modals.newSlot}</h2>
                <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-900 transition-colors">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
             </div>
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Data</label>
                        <input type="date" defaultValue="2024-05-20" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-2">Hora</label>
                        <input type="time" defaultValue="08:00" className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm" />
                    </div>
                </div>
                <button onClick={() => { setActiveModal(null); addNotification({ id: 'ns1', userId: user.id, title: 'Grade Aberta', message: 'Novo horário disponível para agendamento.', type: 'SUCCESS', read: false, createdAt: Date.now() }); }} className="w-full py-5 neo-gradient text-white rounded-2xl font-bold shadow-xl">Criar Slot Disponível</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhysicianDashboard;
