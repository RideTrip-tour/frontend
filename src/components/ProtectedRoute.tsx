import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store";
import type { JSX } from "react";

type Props = {
  children: JSX.Element;
};

export function ProtectedRoute({ children }: Props) {
  const { isAuth, isLoading } = useAuthStore();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
