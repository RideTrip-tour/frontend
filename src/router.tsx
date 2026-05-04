import {lazy, Suspense} from 'react'
import {Routes, Route} from 'react-router-dom'
import ProfilePage from '@/pages/Profile'
import ProfileSettingsPage from '@/pages/Profile/ProfileSettingsPage'
import PaddedLayout from '@/components/layout/PaddedLayout'

const HomePage = lazy(() => import('@/pages/Home'))
const LoginPage = lazy(() =>
  import('@/pages/LoginPage').then((m) => ({default: m.LoginPage}))
)
const RegisterPage = lazy(() =>
  import('@/pages/RegisterPage').then((m) => ({default: m.RegisterPage}))
)

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

        <Route element={<PaddedLayout />}>
          <Route path="/profile">
            <Route index element={<ProfilePage />} />
            <Route path="settings" element={<ProfileSettingsPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
}
