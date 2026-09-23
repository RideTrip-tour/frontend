import {lazy, Suspense} from 'react'
import {Routes, Route} from 'react-router'
import PaddedLayout from '@/components/layout/PaddedLayout'

const HomePage = lazy(() => import("@/pages/Home"));
const ProfilePage = lazy(() => import("@/pages/Profile"));
const ProfileSettingsPage = lazy(() =>
  import("@/pages/Profile/ProfileSettingsPage")
);
const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({default: m.LoginPage}))
)
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({default: m.RegisterPage}))
);
const TripBuilderPage = lazy(() => import("@/pages/trip-builder"));
const RegistrationVerifyPage = lazy(() => import('@/pages/RegistrationVerifyPage'));


export function AppRouter() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        {/*<Route*/}
        {/*  path="/"*/}
        {/*  element={*/}
        {/*    <ProtectedRoute>*/}
        {/*      <HomePage />*/}
        {/*    </ProtectedRoute>*/}
        {/*  }*/}
        {/*/>*/}

        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/auth/verify" element={<RegistrationVerifyPage />} />

        <Route element={<PaddedLayout />}>
          <Route path="/profile">
            <Route index element={<ProfilePage />} />
            <Route path="settings" element={<ProfileSettingsPage />} />
          </Route>
        </Route>
        <Route path="/trip-builder" element={<TripBuilderPage />} />
      </Routes>
    </Suspense>
  );
}
