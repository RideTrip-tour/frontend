import { legalDocuments } from '@/config/legal';
import { LegalPage } from '@/shared/ui/pages/Legal/LegalPage';

interface LegalPageProps {
  document: keyof typeof legalDocuments;
}

export function LegalWrapperPage({ document }: Readonly<LegalPageProps>) {
  const doc = legalDocuments[document];

  return <LegalPage content={doc.content} />;
}

export function PrivacyPolicyPage() {
  return <LegalWrapperPage document="privacy-policy" />;
}

export function TermsOfServicePage() {
  return <LegalWrapperPage document="terms-of-service" />;
}

export function PrivacyConsentPage() {
  return <LegalWrapperPage document="privacy-consent" />;
}

export function MarketingConsentPage() {
  return <LegalWrapperPage document="marketing-consent" />;
}

export function PublicOfferPage() {
  return <LegalWrapperPage document="public-offer" />;
}

export function UserAgreementPage() {
  return <LegalWrapperPage document="user-agreement" />;
}
