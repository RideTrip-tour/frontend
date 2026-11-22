// Клиент сообщает об окончании сессии, не импортируя Zustand store.
let sessionExpiredHandler: (() => boolean) | undefined;
let sessionVersion = 0;
let pendingTransition: {
  version: number;
  promise: Promise<void>;
  settle: () => void;
} | null = null;

export function getSessionVersion(): number {
  return sessionVersion;
}

export function advanceSessionVersion(): number {
  pendingTransition?.settle();
  pendingTransition = null;
  sessionVersion += 1;
  return sessionVersion;
}

// Вход и выход инвалидируют прежние ответы ещё до завершения HTTP-запроса.
export function beginSessionTransition(): number {
  const version = advanceSessionVersion();
  let settle: () => void = () => undefined;
  const promise = new Promise<void>((resolve) => {
    settle = resolve;
  });
  pendingTransition = { version, promise, settle };
  return version;
}

export function finishSessionTransition(version: number): void {
  if (pendingTransition?.version === version) {
    pendingTransition.settle();
    pendingTransition = null;
  }
}

export function getPendingSessionTransition(): Promise<void> | null {
  return pendingTransition?.promise ?? null;
}

export function setSessionExpiredHandler(handler: () => boolean): void {
  sessionExpiredHandler = handler;
}

export function notifySessionExpired(expectedVersion: number): boolean {
  if (expectedVersion !== sessionVersion) {
    return false;
  }

  return sessionExpiredHandler?.() ?? false;
}
