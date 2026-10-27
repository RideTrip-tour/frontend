export const legalVariables = {
  COMPANY_NAME: 'Travel Designer',
  SITE_URL: import.meta.env.VITE_API_URL ?? 'trip.elmobil.ru',
  PRIVACY_EMAIL: 'support.travel@mail.ru',
  SUPPORT_EMAIL: 'support.travel@mail.ru',
  LEGAL_EMAIL: 'support.travel@mail.ru',
  SUPPORT_PHONE: '+7 (800) 123-45-67',
  UPDATED_AT: '26.10.2026',
  SERVICE_NAME: 'Travel Designer',
  COMPANY_ADDRESS: 'Moscow, Russia',
  COMPANY_INN: '1234567890',
  COMPANY_OGRN: '1234567890123',
} as const;

export type LegalVariableKey = keyof typeof legalVariables;
