import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const HomePage = lazy(() => import('@/pages/HomePage').then((m) => ({ default: m.HomePage })));

export function AppRouter() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users/me/" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}
