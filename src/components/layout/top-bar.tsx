import { useState } from "react";
import { Crosshair, GlobeHemisphereWest, ListBullets, Moon, Sun } from "@phosphor-icons/react";

export function TopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const [light, setLight] = useState(false); const [query, setQuery] = useState(""); const [message, setMessage] = useState("");
  const toggleTheme = () => { setLight((value) => { document.documentElement.classList.toggle("light-theme", !value); return !value; }); };
  const search = () => { if (!query.trim()) return; setMessage(`جاري البحث عن: ${query}`); window.setTimeout(() => setMessage(""), 2000); };
  return <><header className="top-bar"><div className="brand"><div className="brand-orb"><GlobeHemisphereWest weight="fill" /></div><b>ORBIT</b><button className="theme-button" onClick={toggleTheme} aria-label="تغيير المظهر">{light ? <Moon /> : <Sun />}</button></div><label className="global-search"><Crosshair /><input value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && search()} placeholder="ابحث واضغط Enter..." /></label><div className="top-left"><button className="menu-button" onClick={onMenuOpen} aria-label="فتح القائمة"><ListBullets /></button><span>آخر مزامنة: الآن</span><button className="signal" onClick={() => { setMessage("تمت مزامنة البيانات"); window.setTimeout(() => setMessage(""), 2000); }} aria-label="مزامنة"><i /></button></div></header>{message && <div className="toast top-toast">{message}</div>}</>;
}
