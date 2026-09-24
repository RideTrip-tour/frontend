export type CartMessageType =
  | 'save-success'
  | 'save-empty'
  | 'save-error'
  | 'pdf-empty'
  | 'pdf-service-error';

export type CartModalType = 'reset-confirm' | 'save-unauthorized' | CartMessageType;

export type CartModalState =
  | { type: 'reset-confirm' }
  | { type: 'save-unauthorized' }
  | { type: CartMessageType; description?: string }
  | null;
