
import React from 'react';
import { Notification } from '../types';

interface NotificationPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ notifications, onClose, onMarkRead }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose}></div>
      <div className="relative w-full max-w-sm bg-white h-full shadow-2xl border-l border-slate-100 animate-in slide-in-from-right duration-500">
        <div className="p-8 h-full flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Notificações</h2>
              <p className="text-[10px] font-black uppercase tracking-widest text-deepAqua mt-1">Sua central de alertas</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {notifications.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                 <div className="text-5xl mb-4">📭</div>
                 <p className="font-bold text-slate-400 uppercase text-[10px] tracking-widest">Nenhuma notificação por enquanto</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n.id} 
                  onClick={() => onMarkRead(n.id)}
                  className={`p-5 rounded-[2rem] border transition-all cursor-pointer ${n.read ? 'bg-slate-50 border-transparent opacity-60' : 'bg-white border-babyBlue/30 shadow-lg shadow-babyBlue/10 hover:border-aqua'}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`text-sm font-bold ${n.read ? 'text-slate-500' : 'text-slate-900'}`}>{n.title}</h4>
                    {!n.read && <span className="w-2 h-2 bg-aqua rounded-full"></span>}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed mb-3">{n.message}</p>
                  <p className="text-[9px] font-black uppercase text-slate-300 tracking-widest">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100">
             <p className="text-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
               Limparemos alertas lidos em 24h
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel;
