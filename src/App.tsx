import { Header, Footer } from "@/components";
import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { AppRouter } from "@/router";
import './App.css'
import './shared/styles/themes/index.css'
import './shared/styles/main/index.css'

export function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
    document.body.setAttribute('data-theme', 'light')
  }, [checkAuth]);
  return (
    <>
      <Header />

      <main>
        <AppRouter />
      </main>

      <Footer />
    </>
  );
}
