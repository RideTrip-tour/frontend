import type { ToastType } from './NotificationContext';

type NotifyFn = (message: string, type?: ToastType) => void;

let notifyFn: NotifyFn | null = null;

export function registerNotifier(fn: NotifyFn) {
  notifyFn = fn;
}

export function notifyGlobal(message: string, type: ToastType = 'error') {
  notifyFn?.(message, type);
}
