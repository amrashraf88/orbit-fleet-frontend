"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/src/components/layout/sidebar";
import { TopBar } from "@/src/components/layout/top-bar";
import { DataPage } from "@/src/features/data-page/data-page";
import { LiveMapPage } from "@/src/features/live-map/live-map-page";
import { MaintenancePage } from "@/src/features/maintenance/maintenance-page";
import { AnalyticsPage } from "@/src/features/analytics/analytics-page";
import { LoginPage } from "@/src/features/auth/login-page";
import { currentUser, logout as logoutSession, type AuthUser } from "@/src/services/auth-service";
import type { PageId } from "@/src/types/navigation";
import { ConfigurationPage } from "@/src/features/settings/configuration-page";
export default function Home() {
  const [page, setPage] = useState<PageId>("live");
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => { let active=true;(async()=>{const saved=window.localStorage.getItem("orbit-user")??window.sessionStorage.getItem("orbit-user");if(saved)try{setUser(JSON.parse(saved));}catch{/* invalid local session */}try{const remote=await currentUser();if(active&&remote)setUser(remote);}catch{/* keep the last locally known UI session while the API is unavailable */}finally{if(active)setAuthReady(true);}})();return()=>{active=false};}, []);
  const signedIn = (nextUser: AuthUser, remember: boolean) => { const storage = remember ? window.localStorage : window.sessionStorage; storage.setItem("orbit-user", JSON.stringify(nextUser)); setUser(nextUser); };
  const logout = () => { void logoutSession(); window.localStorage.removeItem("orbit-user"); window.sessionStorage.removeItem("orbit-user"); setUser(null); setNavOpen(false); };
  if (!authReady) return <main className="auth-boot" aria-label="جارٍ تحميل المنصة"><i/></main>;
  if (!user) return <LoginPage onSuccess={signedIn}/>;
  return <main className="orbit-app" dir="rtl"><Sidebar page={page} onPageChange={setPage} open={navOpen} onClose={() => setNavOpen(false)} onLogout={logout}/><section className="main-area"><TopBar onMenuOpen={() => setNavOpen(true)} />{page === "home" ? <AnalyticsPage /> : page === "live" ? <LiveMapPage /> : page === "maintenance" ? <MaintenancePage onNavigate={setPage}/> : page === "settings" ? <ConfigurationPage/> : <DataPage page={page} />}</section></main>;
}
