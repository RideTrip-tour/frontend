// Клиент сообщает об окончании сессии, не импортируя Zustand store.
let sessionExpiredHandler: (() => void) | undefined;

export function setSessionExpiredHandler(handler: () => void): void {
  sessionExpiredHandler = handler;
}

export function notifySessionExpired(): void {
  sessionExpiredHandler?.();
}
