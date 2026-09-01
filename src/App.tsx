import { Header, Footer } from "@/components";
import { useEffect } from "react";
import { useAuthStore } from "@/store";
import { useInitProfile } from "@/hooks";
import { AppRouter } from "@/router";
import './index.css'
import '@/shared/styles/themes/index.css'
import './shared/styles/main/index.css'

export function App() {
  const checkAuth = useAuthStore((s) => s.checkAuth)
  useInitProfile()

  useEffect(() => {
    checkAuth()
    document.body.setAttribute('data-theme', 'light')
  }, [checkAuth])

  return (
    <>
      <Header />

      <main>
        <AppRouter />
      </main>

      <Footer />
    </>
  )
}