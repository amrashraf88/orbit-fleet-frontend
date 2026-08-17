import { Bell, CaretLeft, Sparkle, X } from "@phosphor-icons/react";
import { navigationGroups } from "@/src/config/navigation";
import type { PageId } from "@/src/types/navigation";

interface SidebarProps { page: PageId; onPageChange: (page: PageId) => void; open: boolean; onClose: () => void }

export function Sidebar({ page, onPageChange, open, onClose }: SidebarProps) {
  const notify = (message: string) => window.alert(message);
  return <aside className={`side-nav ${open ? "is-open" : ""}`}>
    <div className="user-card"><div className="avatar"><span>OR</span><i/></div><div><b>مدير الأسطول</b><span>مشرف النظام · متصل</span></div><button className="icon-button premium-icon-button" onClick={() => { onPageChange("alerts"); onClose(); }} aria-label="التنبيهات"><Bell size={18} weight="duotone"/><i className="notification-ping"/></button><button className="mobile-close" onClick={onClose} aria-label="إغلاق القائمة"><X /></button></div>
    <nav>{navigationGroups.map((group, index) => <div className="nav-group" key={group.label ?? index}>{group.label && <small>{group.label}</small>}{group.items.map((item) => { const Icon = item.icon; const active = page === item.id; return <button key={item.id} className={active ? "active" : ""} aria-current={active ? "page" : undefined} onClick={() => { onPageChange(item.id); onClose(); }}><span className="nav-icon"><Icon size={18} weight={active ? "fill" : "duotone"}/></span><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}{active && <CaretLeft className="nav-caret" size={12}/>}</button>; })}</div>)}</nav>
    <button className="assistant-card" onClick={() => notify("المساعد الذكي جاهز للربط بخدمة المحادثة الخاصة بك")}><div className="assistant-icon"><Sparkle weight="fill" /></div><div><b>المساعد الذكي</b><span>تحليلات فورية لأسطولك</span></div><CaretLeft className="assistant-arrow"/></button>
  </aside>;
}
