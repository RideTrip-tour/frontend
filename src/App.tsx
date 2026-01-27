import { Header, Footer } from "@/components";
import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { AppRouter } from "@/router";

export function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header />

      <main style={{ flex: 1, padding: "24px 0" }}>
        <AppRouter />
      </main>

      <Footer />
    </div>
  );
}
