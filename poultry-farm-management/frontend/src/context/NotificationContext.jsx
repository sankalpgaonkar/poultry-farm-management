import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 5000);
  }, []);

  // Listen for global notification events (for axios interceptors)
  useEffect(() => {
    const handleGlobalNotify = (e) => {
      const { message, type } = e.detail;
      addNotification(message, type);
    };
    window.addEventListener('app-notify', handleGlobalNotify);
    return () => window.removeEventListener('app-notify', handleGlobalNotify);
  }, [addNotification]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-3 max-w-sm w-full">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`flex items-center gap-4 p-4 rounded-2xl shadow-2xl border transition-all duration-300 animate-in slide-in-from-right-full ${
              n.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' :
              n.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
              'bg-slate-50 border-slate-100 text-slate-800'
            }`}
          >
            <div className="shrink-0">
              {n.type === 'error' ? <AlertCircle size={20} /> :
               n.type === 'success' ? <CheckCircle size={20} /> :
               <Info size={20} />}
            </div>
            <p className="text-xs font-bold leading-tight flex-1">{n.message}</p>
            <button 
              onClick={() => removeNotification(n.id)}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
