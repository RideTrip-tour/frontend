import type { LegalDocumentSlug } from '@/shared/config';

import marketingConsent from './documents/marketing-consent.md?raw';
import privacyConsent from './documents/privacy-consent.md?raw';
import privacyPolicy from './documents/privacy-policy.md?raw';
import publicOffer from './documents/public-offer.md?raw';
import termsOfService from './documents/terms-of-service.md?raw';
import userAgreement from './documents/user-agreement.md?raw';
import { legalVariables, type LegalVariableKey } from './variables';

const RAW_CONTENT: Record<LegalDocumentSlug, string> = {
  'privacy-policy': privacyPolicy,
  'user-agreement': userAgreement,
  'terms-of-service': termsOfService,
  'public-offer': publicOffer,
  'privacy-consent': privacyConsent,
  'marketing-consent': marketingConsent,
};

const VARIABLE_RE = /\{\{(\w+)}}/g;

const fillVariables = (content: string) =>
  content.replace(VARIABLE_RE, (match, key: string) =>
    key in legalVariables ? legalVariables[key as LegalVariableKey] : match,
  );

export const getLegalDocumentContent = (slug: LegalDocumentSlug) =>
  fillVariables(RAW_CONTENT[slug]);
