import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const HomePage = lazy(() => import("@/pages/Home"));
const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import("@/pages/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const TripBuilderPage = lazy(() => import("@/pages/trip-builder"));


export function AppRouter() {
  return (
    <Suspense fallback={<div>Loading page...</div>}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/users/me/" element={<HomePage />} />
        {/*<Route*/}
        {/*  path="/"*/}
        {/*  element={*/}
        {/*    <ProtectedRoute>*/}
        {/*      <HomePage />*/}
        {/*    </ProtectedRoute>*/}
        {/*  }*/}
        {/*/>*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/trip-builder" element={<TripBuilderPage />} />
      </Routes>
    </Suspense>
  );
}
