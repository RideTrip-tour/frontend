import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router';

import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import PaddedLayout from '@/components/layout/PaddedLayout';

const HomePage = lazy(() => import('@/pages/Home'));
const ProfilePage = lazy(() => import('@/pages/Profile'));
const ProfileSettingsPage = lazy(() => import('@/pages/Profile/ProfileSettingsPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })),
);
const TripBuilderPage = lazy(() => import('@/pages/trip-builder'));
const RegistrationVerifyPage = lazy(() => import('@/pages/RegistrationVerifyPage'));
const PrivacyPolicyPage = lazy(() =>
  import('@/pages/Legal/LegalPages').then((m) => ({ default: m.PrivacyPolicyPage })),
);
const TermsOfServicePage = lazy(() =>
  import('@/pages/Legal/LegalPages').then((m) => ({ default: m.TermsOfServicePage })),
);
const PrivacyConsentPage = lazy(() =>
  import('@/pages/Legal/LegalPages').then((m) => ({ default: m.PrivacyConsentPage })),
);
const MarketingConsentPage = lazy(() =>
  import('@/pages/Legal/LegalPages').then((m) => ({ default: m.MarketingConsentPage })),
);
const PublicOfferPage = lazy(() =>
  import('@/pages/Legal/LegalPages').then((m) => ({ default: m.PublicOfferPage })),
);
const UserAgreementPage = lazy(() =>
  import('@/pages/Legal/LegalPages').then((m) => ({ default: m.UserAgreementPage })),
);

export function AppRouter() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />
        <Route
          path="/login"
          element={<LoginPage />}
        />
        <Route
          path="/register"
          element={<RegisterPage />}
        />
        <Route
          path="/auth/verify"
          element={<RegistrationVerifyPage />}
        />
        <Route
          path="/trip-builder"
          element={<TripBuilderPage />}
        />

        <Route element={<PaddedLayout />}>
          <Route
            path="/legal/privacy-policy"
            element={<PrivacyPolicyPage />}
          />
          <Route
            path="/legal/terms-of-service"
            element={<TermsOfServicePage />}
          />
          <Route
            path="/legal/privacy-consent"
            element={<PrivacyConsentPage />}
          />
          <Route
            path="/legal/marketing-consent"
            element={<MarketingConsentPage />}
          />
          <Route
            path="/legal/public-offer"
            element={<PublicOfferPage />}
          />
          <Route element={<PaddedLayout />}>
            <Route
              path="/legal/user-agreement"
              element={<UserAgreementPage />}
            />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<PaddedLayout />}>
            <Route path="/profile">
              <Route
                index
                element={<ProfilePage />}
              />
              <Route
                path="settings"
                element={<ProfileSettingsPage />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
