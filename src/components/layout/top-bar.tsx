import { Crosshair, GlobeHemisphereWest, ListBullets, Sun } from "@phosphor-icons/react";

export function TopBar({ onMenuOpen }: { onMenuOpen: () => void }) {
  return <header className="top-bar"><div className="brand"><div className="brand-orb"><GlobeHemisphereWest weight="fill" /></div><b>ORBIT</b><button className="theme-button" aria-label="تغيير المظهر"><Sun /></button></div><label className="global-search"><Crosshair /><input placeholder="ابحث عن مركبة، سائق أو موقع..." /></label><div className="top-left"><button className="menu-button" onClick={onMenuOpen} aria-label="فتح القائمة"><ListBullets /></button><span>آخر مزامنة: الآن</span><div className="signal"><i /></div></div></header>;
}
