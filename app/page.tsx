"use client";
import { useEffect, useState } from "react";
import { Sidebar } from "@/src/components/layout/sidebar";
import { TopBar } from "@/src/components/layout/top-bar";
import { DataPage } from "@/src/features/data-page/data-page";
import { LiveMapPage } from "@/src/features/live-map/live-map-page";
import { MaintenancePage } from "@/src/features/maintenance/maintenance-page";
import { AnalyticsPage } from "@/src/features/analytics/analytics-page";
import { LoginPage } from "@/src/features/auth/login-page";
import type { AuthUser } from "@/src/services/auth-service";
import type { PageId } from "@/src/types/navigation";
export default function Home() {
  const [page, setPage] = useState<PageId>("live");
  const [navOpen, setNavOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => { const timer = window.setTimeout(() => { const saved = window.localStorage.getItem("orbit-user") ?? window.sessionStorage.getItem("orbit-user"); if (saved) try { setUser(JSON.parse(saved)); } catch { /* invalid local session */ } setAuthReady(true); }, 0); return () => window.clearTimeout(timer); }, []);
  const signedIn = (nextUser: AuthUser, remember: boolean) => { const storage = remember ? window.localStorage : window.sessionStorage; storage.setItem("orbit-user", JSON.stringify(nextUser)); setUser(nextUser); };
  const logout = () => { window.localStorage.removeItem("orbit-user"); window.sessionStorage.removeItem("orbit-user"); setUser(null); setNavOpen(false); };
  if (!authReady) return <main className="auth-boot" aria-label="جارٍ تحميل المنصة"><i/></main>;
  if (!user) return <LoginPage onSuccess={signedIn}/>;
  return <main className="orbit-app" dir="rtl"><Sidebar page={page} onPageChange={setPage} open={navOpen} onClose={() => setNavOpen(false)} onLogout={logout}/><section className="main-area"><TopBar onMenuOpen={() => setNavOpen(true)} />{page === "home" ? <AnalyticsPage /> : page === "live" ? <LiveMapPage /> : page === "maintenance" ? <MaintenancePage onNavigate={setPage}/> : <DataPage page={page} />}</section></main>;
}
