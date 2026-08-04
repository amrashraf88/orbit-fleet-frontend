import { Bell, Lightning, X } from "@phosphor-icons/react";
import { navigationGroups } from "@/src/config/navigation";
import type { PageId } from "@/src/types/navigation";

interface SidebarProps { page: PageId; onPageChange: (page: PageId) => void; open: boolean; onClose: () => void }

export function Sidebar({ page, onPageChange, open, onClose }: SidebarProps) {
  const notify = (message: string) => window.alert(message);
  return <aside className={`side-nav ${open ? "is-open" : ""}`}>
    <div className="user-card"><div className="avatar">OR</div><div><b>مدير الأسطول</b><span>مشرف · Tracker 4</span></div><button className="icon-button" onClick={() => { onPageChange("alerts"); onClose(); }} aria-label="التنبيهات"><Bell size={18} /></button><button className="mobile-close" onClick={onClose} aria-label="إغلاق القائمة"><X /></button></div>
    <nav>{navigationGroups.map((group, index) => <div className="nav-group" key={group.label ?? index}>{group.label && <small>{group.label}</small>}{group.items.map((item) => { const Icon = item.icon; return <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => { onPageChange(item.id); onClose(); }}><Icon size={19} weight={page === item.id ? "fill" : "regular"} /><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}</button>; })}</div>)}</nav>
    <button className="assistant-card" onClick={() => notify("المساعد الذكي جاهز للربط بخدمة المحادثة الخاصة بك")}><div className="assistant-icon"><Lightning weight="fill" /></div><div><b>المساعد الذكي</b><span>اسأل عن أسطولك وتقاريرك</span></div></button>
  </aside>;
}
