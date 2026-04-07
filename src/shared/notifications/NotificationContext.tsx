// import { useContext } from 'react';
import { createContext, useState } from 'react';
import type { ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type NotificationContextType = {
  notify: (message: string, type?: ToastType) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const notify = (message: string, type: ToastType = 'info') => {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  registerNotifier(notify);

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      <ToastContainer toasts={toasts} />
    </NotificationContext.Provider>
  );
}

// export function useNotify() {
//   const ctx = useContext(NotificationContext);
//   if (!ctx) throw new Error('useNotify must be used inside NotificationProvider');
//   return ctx.notify;
// }

import { ToastContainer } from './ToastContainer';
import { registerNotifier } from './notifyBus';
