"use client";
import { useState } from "react";
import { Sidebar } from "@/src/components/layout/sidebar";
import { TopBar } from "@/src/components/layout/top-bar";
import { DataPage } from "@/src/features/data-page/data-page";
import { LiveMapPage } from "@/src/features/live-map/live-map-page";
import type { PageId } from "@/src/types/navigation";
export default function Home() { const [page, setPage] = useState<PageId>("live"); const [navOpen, setNavOpen] = useState(false); return <main className="orbit-app" dir="rtl"><Sidebar page={page} onPageChange={setPage} open={navOpen} onClose={() => setNavOpen(false)} /><section className="main-area"><TopBar onMenuOpen={() => setNavOpen(true)} />{page === "live" ? <LiveMapPage /> : <DataPage page={page} />}</section></main>; }
