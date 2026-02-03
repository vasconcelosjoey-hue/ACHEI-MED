
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

  const handleGoogleConnect = () => {
    setIsSyncing(true);
    // Simulação do OAuth2 e Sincronização
    setTimeout(() => {
      setIsSyncing(false);
      setIsGoogleConnected(true);
      addNotification({
        id: Math.random().toString(),
        userId: user.id,
        title: 'Google Agenda Conectado',
        message: 'Seus eventos externos foram sincronizados com sucesso.',
        type: 'SUCCESS',
        read: false,
        createdAt: Date.now()
      });
    }, 2000);
  };

  const triggerReallocation = (id: string) => {
    addNotification({
      id: Math.random().toString(),
      userId: user.id,
      title: 'Sistema de Realocação Ativado',
      message: 'Paciente não confirmou. Notificando próximo da fila de espera...',
      type: 'ALERT',
      read: false,
      createdAt: Date.now()
    });
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status: 'CANCELED' } : a));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Agenda Ativa - Dr(a). {user.name}</h1>
          <p className="text-slate-500 font-medium">Gestão inteligente para sua clínica individual.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
            Configurações
          </button>
          <button className="px-6 py-3 rounded-2xl neo-gradient text-sm font-bold text-white shadow-lg shadow-babyBlue/40 transition-all hover:-translate-y-1">
            Novo Slot Livre
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Ocupados', val: '12', icon: '👤', color: 'bg-babyBlue' },
              { label: 'Esperando', val: '5', icon: '⌛', color: 'bg-aqua' },
              { label: 'Realocados', val: '3', icon: '🔄', color: 'bg-green-100' },
              { label: 'Previsão', val: 'R$ 3.8k', icon: '📈', color: 'bg-slate-100' },
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
          {/* Central de Integração */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm group">
            <h3 className="text-lg font-display font-bold mb-2 text-slate-900">{t.integrations.title}</h3>
            <p className="text-xs text-slate-500 mb-6">{t.integrations.googleDesc}</p>
            
            <button 
              onClick={handleGoogleConnect}
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
              {[
                { name: 'Daniela Lima', time: 'Urgente', delay: '1 dia' },
                { name: 'Enzo Ferrari', time: 'Manhã', delay: '4 dias' }
              ].map((w, i) => (
                <div key={i} className="bg-white/10 p-4 rounded-2xl flex justify-between items-center group">
                  <div>
                    <p className="font-bold text-sm">{w.name}</p>
                    <p className="text-[10px] text-white/60 uppercase font-black tracking-widest">{w.time}</p>
                  </div>
                  <button className="text-[10px] font-black uppercase text-aqua bg-aqua/10 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">Forçar Encaixe</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-xl font-display font-bold text-slate-900">Gerenciamento de Consultas</h2>
          <div className="flex gap-2">
             <span className="px-3 py-1 rounded-full bg-aqua/10 text-deepAqua text-[10px] font-black uppercase tracking-widest">Confirmadas: 8</span>
             <span className="px-3 py-1 rounded-full bg-yellow-50 text-yellow-700 text-[10px] font-black uppercase tracking-widest">Aguardando: 4</span>
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
                    ) : app.status === 'CANCELED' ? (
                       <span className="px-3 py-1.5 rounded-full bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-widest border border-red-100">Cancelado / Vaga Aberta</span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-600 text-[10px] font-black uppercase tracking-widest border border-yellow-100">Aguardando Resposta (Token)</span>
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
    </div>
  );
};

export default PhysicianDashboard;
