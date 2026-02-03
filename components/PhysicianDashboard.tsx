
import React, { useEffect, useRef } from 'react';
import { User, Notification } from '../types';

interface PhysicianDashboardProps {
  user: User;
  addNotification: (n: Notification) => void;
}

const PhysicianDashboard: React.FC<PhysicianDashboardProps> = ({ user, addNotification }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && (window as any).echarts) {
      const chart = (window as any).echarts.init(chartRef.current);
      chart.setOption({
        animationDuration: 1500,
        grid: { top: 20, right: 20, bottom: 40, left: 40 },
        xAxis: { type: 'category', data: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'] },
        yAxis: { type: 'value' },
        series: [{
          data: [12, 19, 15, 22, 18, 10],
          type: 'line',
          smooth: true,
          color: '#0D9488',
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [{ offset: 0, color: '#99F6E4' }, { offset: 1, color: '#FFFFFF' }]
            }
          }
        }]
      });

      window.addEventListener('resize', () => chart.resize());
      return () => window.removeEventListener('resize', () => chart.resize());
    }
  }, []);

  const appointments = [
    { id: '1', patient: 'Ana Silva', time: '09:00', type: 'Consulta', status: 'WAITING_CONFIRMATION', plan: 'Unimed' },
    { id: '2', patient: 'Bruno Costa', time: '10:30', type: 'Retorno', status: 'CONFIRMED', plan: 'Particular' },
    { id: '3', patient: 'Carlos Duarte', time: '14:00', type: 'Exame', status: 'REALLOCATED', plan: 'Bradesco' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">Painel do Especialista</h1>
          <p className="text-slate-500 font-medium">Gestão inteligente da sua agenda e lista de espera.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-6 py-3 rounded-2xl bg-white border border-slate-200 text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2">
            Configurar Agenda
          </button>
          <button className="px-6 py-3 rounded-2xl neo-gradient text-sm font-bold text-white shadow-lg shadow-babyBlue/40 transition-all hover:-translate-y-1">
            Novo Horário
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Hoje', val: '12', icon: '📅', color: 'bg-babyBlue' },
              { label: 'Pendentes', val: '4', icon: '🕒', color: 'bg-aqua' },
              { label: 'Faltas', val: '2', icon: '❌', color: 'bg-red-100' },
              { label: 'Receita', val: 'R$ 2.4k', icon: '💰', color: 'bg-green-100' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-xl mb-3`}>{s.icon}</div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                <p className="text-2xl font-display font-bold text-slate-900">{s.val}</p>
              </div>
            ))}
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-display font-bold mb-6 text-slate-900">Fluxo de Pacientes (Semanal)</h3>
            <div ref={chartRef} className="h-64 w-full"></div>
          </div>
        </div>

        {/* Waitlist/Alerts Column */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-aqua/20 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-aqua rounded-full animate-ping"></span>
              Fila de Espera Inteligente
            </h3>
            <div className="space-y-4">
              {[
                { name: 'Daniela Lima', time: 'Qualquer', delay: '2 dias' },
                { name: 'Enzo Ferrari', time: 'Manhã', delay: '5 dias' }
              ].map((w, i) => (
                <div key={i} className="bg-white/10 p-4 rounded-2xl flex justify-between items-center">
                  <div>
                    <p className="font-bold text-sm">{w.name}</p>
                    <p className="text-[10px] text-white/60 uppercase font-black tracking-widest">{w.time}</p>
                  </div>
                  <button className="text-[10px] font-black uppercase text-aqua bg-aqua/10 px-3 py-1.5 rounded-lg">Encaixar</button>
                </div>
              ))}
            </div>
            <p className="text-[10px] mt-6 text-white/40 leading-relaxed italic">
              * O sistema enviará notificações automáticas 24h antes para confirmação.
            </p>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-display font-bold mb-6 text-slate-900">Ações Rápidas</h3>
            <div className="space-y-2">
              <button className="w-full p-4 text-left rounded-2xl bg-slate-50 hover:bg-babyBlue/10 transition-all border border-slate-100 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">📢</div>
                 <span className="text-sm font-semibold text-slate-700">Notificar todos (Atraso)</span>
              </button>
              <button className="w-full p-4 text-left rounded-2xl bg-slate-50 hover:bg-babyBlue/10 transition-all border border-slate-100 flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">🤝</div>
                 <span className="text-sm font-semibold text-slate-700">Vincular Atendente</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Agenda Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
          <h2 className="text-xl font-display font-bold text-slate-900">Agenda de Hoje</h2>
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
                <th className="px-8 py-5">Tipo / Plano</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {appointments.map((app) => (
                <tr key={app.id} className="group hover:bg-slate-50/50 transition-all">
                  <td className="px-8 py-6 font-display font-bold text-lg text-slate-900">{app.time}</td>
                  <td className="px-8 py-6">
                    <p className="font-bold text-slate-800">{app.patient}</p>
                    <p className="text-xs text-slate-400">ID: #{app.id}992</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs font-semibold text-slate-600 px-3 py-1 rounded-lg bg-slate-100 mr-2">{app.type}</span>
                    <span className="text-xs text-slate-400">{app.plan}</span>
                  </td>
                  <td className="px-8 py-6">
                    {app.status === 'CONFIRMED' ? (
                      <span className="px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-[10px] font-black uppercase tracking-widest border border-green-100">Confirmada</span>
                    ) : app.status === 'REALLOCATED' ? (
                      <span className="px-3 py-1.5 rounded-full bg-babyBlue/20 text-blue-700 text-[10px] font-black uppercase tracking-widest border border-babyBlue/30">Realocado da Espera</span>
                    ) : (
                      <span className="px-3 py-1.5 rounded-full bg-yellow-50 text-yellow-600 text-[10px] font-black uppercase tracking-widest border border-yellow-100">Aguardando Resposta (24h)</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 text-slate-300 hover:text-deepAqua transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" /></svg>
                    </button>
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
