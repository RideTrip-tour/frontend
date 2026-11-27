export const LEGAL_DOCUMENTS = [
  { slug: 'privacy-policy', title: 'Политика конфиденциальности' },
  { slug: 'user-agreement', title: 'Пользовательское соглашение' },
  { slug: 'terms-of-service', title: 'Условия использования сервиса' },
  { slug: 'public-offer', title: 'Публичная оферта' },
  { slug: 'privacy-consent', title: 'Согласие на обработку персональных данных' },
  { slug: 'marketing-consent', title: 'Согласие на получение рекламных рассылок' },
] as const;

export type LegalDocumentSlug = (typeof LEGAL_DOCUMENTS)[number]['slug'];

export const LEGAL_ROUTE = '/legal/:slug';

export const getLegalDocumentPath = (slug: LegalDocumentSlug) => `/legal/${slug}`;

export const isLegalDocumentSlug = (value: string | undefined): value is LegalDocumentSlug =>
  LEGAL_DOCUMENTS.some((doc) => doc.slug === value);
