import marketingConsent from '@/pages/Legal/documents/marketing-consent.md?raw';
import privacyConsent from '@/pages/Legal/documents/privacy-consent.md?raw';
import privacyPolicy from '@/pages/Legal/documents/privacy-policy.md?raw';
import publicOffer from '@/pages/Legal/documents/public-offer.md?raw';
import termsOfService from '@/pages/Legal/documents/terms-of-service.md?raw';
import userAgreement from '@/pages/Legal/documents/user-agreement.md?raw';

export const legalDocuments = {
  'privacy-policy': {
    title: 'Privacy Policy',
    content: privacyPolicy,
  },
  'terms-of-service': {
    title: 'Terms of Service',
    content: termsOfService,
  },
  'privacy-consent': {
    title: 'Privacy Consent',
    content: privacyConsent,
  },
  'marketing-consent': {
    title: 'Marketing Consent',
    content: marketingConsent,
  },
  'public-offer': {
    title: 'Public Offer',
    content: publicOffer,
  },
  'user-agreement': {
    title: 'User Agreement',
    content: userAgreement,
  },
} as const;

export type LegalDocumentKey = keyof typeof legalDocuments;
