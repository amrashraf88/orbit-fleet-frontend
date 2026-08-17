"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  ArrowLeft, Bell, Camera, Car, CaretDown, CaretLeft, CaretRight, CaretUp,
  ChartBar, Check, ClipboardText, ClockCounterClockwise, Command, Gear, Globe,
  MapPin, MapTrifold, PencilSimple, RoadHorizon, SignOut, SlidersHorizontal,
  Trash, User, Users, Wrench, X,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { PageId } from "@/src/types/navigation";
import "./maintenance.css";

type Props = { onNavigate: (page: PageId) => void };
type Service = {
  id: number; name: string; interval: string; lastService: string; trigger: string;
  odometer: string; engineHours: string; description: string; email: string;
};

const initialService: Service = {
  id: 1205, name: "yousif", interval: "500000", lastService: "510000",
  trigger: "10000", odometer: "590108.676", engineHours: "3239.4667",
  description: "", email: "yousif.mohammed@anlsco.com",
};

const navItems: { label: string; icon: Icon; page?: PageId }[] = [
  { label: "العودة إلى الإدارة", icon: ArrowLeft, page: "home" },
  { label: "السيارات", icon: Car, page: "vehicles" },
  { label: "التنبيهات", icon: Bell, page: "alerts" },
  { label: "السجل", icon: ClockCounterClockwise, page: "history" },
  { label: "التقارير", icon: ChartBar, page: "reports" },
  { label: "إرسال الأوامر", icon: Command },
  { label: "كاميرا / ميديا", icon: Camera, page: "cameras" },
  { label: "مشاركة", icon: Globe },
  { label: "اعمال صيانة", icon: Wrench, page: "maintenance" },
  { label: "مهام", icon: ClipboardText, page: "tasks" },
  { label: "السائقين", icon: Users, page: "drivers" },
  { label: "الحدود الجغرافية", icon: MapPin, page: "geofences" },
  { label: "طرق", icon: RoadHorizon },
  { label: "المعالم المهمة", icon: MapTrifold },
  { label: "الملخص", icon: SlidersHorizontal, page: "home" },
];

export function MaintenancePage({ onNavigate }: Props) {
  const [service, setService] = useState<Service>(initialService);
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Service>(service);
  const [deleted, setDeleted] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);
  const visible = useMemo(() => !deleted && (service.name.includes(search) || String(service.id).includes(search)), [deleted, search, service]);

  const openEdit = () => { setDraft(service); setEditing(true); setMenuOpen(false); };
  const saveEdit = () => { setService(draft); setEditing(false); };

  return <main className="injaz-maintenance" dir="rtl">
    <button className="injaz-mobile-menu" onClick={() => setDrawerOpen(true)} aria-label="فتح القائمة"><SlidersHorizontal size={20}/></button>
    {drawerOpen && <button className="injaz-drawer-scrim" onClick={() => setDrawerOpen(false)} aria-label="إغلاق القائمة"/>}
    <aside className={`injaz-side ${drawerOpen ? "open" : ""}`}>
      <div className="injaz-logo-wrap"><Image src="/injaz-logo.png" alt="INJAZ TELEMATICS" width={210} height={60} priority /></div>
      <nav>
        {navItems.map(({ label, icon: IconComponent, page }) => <button key={label} className={label === "اعمال صيانة" ? "active" : ""} onClick={() => page && onNavigate(page)}>
          <IconComponent size={17} weight="regular"/><span>{label}</span>
        </button>)}
      </nav>
      <div className="injaz-side-footer">
        <button><User size={17}/><span>test2@injaz.com</span></button>
        <button><span className="sa-flag">🇸🇦</span><span>العربية</span><CaretDown size={12}/></button>
        <div className="legacy-row"><span>التبديل إلى الإصدار القديم</span><button className="switch" aria-label="التبديل إلى الإصدار القديم"><i/></button></div>
        <button><SignOut size={17}/><span>تسجيل الخروج</span></button>
      </div>
    </aside>

    <section className="injaz-main">
      <header className="injaz-page-title"><Wrench size={22}/><h1>اعمال صيانة</h1></header>
      <div className="injaz-toolbar">
        <label><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="بحث"/><SlidersHorizontal size={15}/></label>
      </div>
      <div className="injaz-table-wrap">
        <table>
          <thead><tr>
            <th onClick={() => setSortAsc(!sortAsc)}>هوية شخصية {sortAsc ? <CaretUp size={10}/> : <CaretDown size={10}/>}</th>
            <th onClick={() => setSortAsc(!sortAsc)}>الاسم <CaretDown size={10}/></th>
            <th>مسافة</th><th>مسافة الباقى</th><th>ساعات المحرك</th><th>ساعات المحرك الباقى</th><th>ايام</th><th>ايام الباقى</th><th className="action-head"/>
          </tr></thead>
          <tbody>{visible ? <tr>
            <td>{service.id}</td><td>{service.name}</td>
            <td><div className="progress-cell"><div><i style={{width: "84%"}}/></div><span>84%</span></div></td>
            <td>419892km</td><td>-</td><td>-</td><td>-</td><td>-</td>
            <td className="action-cell"><button onClick={() => setMenuOpen(!menuOpen)} aria-label="إجراءات"><Gear size={16}/></button>
              {menuOpen && <div className="row-menu"><button onClick={openEdit}><PencilSimple size={15}/>تعديل</button><button onClick={() => {setDeleteOpen(true); setMenuOpen(false);}}><Trash size={15}/>حذف</button></div>}
            </td>
          </tr> : <tr><td colSpan={9} className="empty-row">لا توجد بيانات</td></tr>}</tbody>
        </table>
      </div>
      <footer className="injaz-pagination"><span>صفوف لكل صفحة:</span><button>20 <CaretDown size={10}/></button><span>1–{visible ? 1 : 0} من {visible ? 1 : 0}</span><button disabled><CaretRight size={13}/></button><button disabled><CaretLeft size={13}/></button></footer>
    </section>

    {editing && <div className="injaz-modal-layer" role="dialog" aria-modal="true">
      <div className="injaz-modal edit-modal">
        <header><h2>تعديل اعمال صيانة</h2><button onClick={() => setEditing(false)}><X size={18}/></button></header>
        <div className="form-grid">
          <Field label="الاسم" value={draft.name} onChange={(name) => setDraft({...draft, name})}/>
          <label className="field"><span>انتهاء الصلاحية</span><select defaultValue="odometer"><option value="odometer">مسافة</option><option value="engine_hours">ساعات المحرك</option><option value="days">أيام</option></select></label>
          <Field label="فترة" value={draft.interval} onChange={(interval) => setDraft({...draft, interval})}/>
          <Field label="ميعاد أخر صيانة" value={draft.lastService} onChange={(lastService) => setDraft({...draft, lastService})}/>
          <Field label="صيد الحدث عند المغادرة" value={draft.trigger} onChange={(trigger) => setDraft({...draft, trigger})}/>
          <ToggleField label="التجديد بعد الانتهاء" checked/>
          <ToggleField label="السماح بالقيمة منتهية الصلاحية"/>
          <Field label="عداد المسافات الحالي" value={draft.odometer} onChange={(odometer) => setDraft({...draft, odometer})}/>
          <Field label="ساعات المحرك الحالية" value={draft.engineHours} onChange={(engineHours) => setDraft({...draft, engineHours})}/>
          <Field label="الوصف" value={draft.description} onChange={(description) => setDraft({...draft, description})} wide/>
          <Field label="البريد الإلكترونى" value={draft.email} onChange={(email) => setDraft({...draft, email})} wide type="email"/>
        </div>
        <footer><button className="cancel" onClick={() => setEditing(false)}>إلغاء</button><button className="save" onClick={saveEdit}><Check size={16}/>حفظ</button></footer>
      </div>
    </div>}

    {deleteOpen && <div className="injaz-modal-layer" role="alertdialog" aria-modal="true"><div className="injaz-modal confirm-modal"><header><h2>حذف اعمال صيانة</h2><button onClick={() => setDeleteOpen(false)}><X size={18}/></button></header><p>هل أنت متأكد من حذف سجل الصيانة الخاص بـ <b>{service.name}</b>؟</p><footer><button className="cancel" onClick={() => setDeleteOpen(false)}>إلغاء</button><button className="delete" onClick={() => {setDeleted(true); setDeleteOpen(false);}}>حذف</button></footer></div></div>}
  </main>;
}

function Field({label, value, onChange, wide, type = "text"}: {label:string; value:string; onChange:(v:string)=>void; wide?:boolean; type?:string}) {
  return <label className={`field ${wide ? "wide" : ""}`}><span>{label}</span><input type={type} value={value} onChange={(e) => onChange(e.target.value)}/></label>;
}
function ToggleField({label, checked = false}: {label:string; checked?:boolean}) {
  const [on, setOn] = useState(checked);
  return <label className="field toggle-field"><span>{label}</span><button type="button" className={`switch ${on ? "on" : ""}`} onClick={() => setOn(!on)}><i/></button></label>;
}
