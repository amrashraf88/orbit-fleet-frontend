"use client";

import { useMemo, useState } from "react";

type NavItem = { id: string; label: string; icon: string; section?: string };

const navItems: NavItem[] = [
  { id: "overview", label: "نظرة عامة", icon: "⌁" },
  { id: "vehicles", label: "المركبات", icon: "◈", section: "التشغيل" },
  { id: "alerts", label: "التنبيهات", icon: "!" },
  { id: "history", label: "سجل الحركة", icon: "↺" },
  { id: "reports", label: "التقارير", icon: "▤" },
  { id: "commands", label: "إرسال الأوامر", icon: "⌁", section: "الإدارة" },
  { id: "media", label: "الكاميرا والميديا", icon: "◉" },
  { id: "sharing", label: "المشاركة", icon: "↗" },
  { id: "maintenance", label: "الصيانة", icon: "◇" },
  { id: "tasks", label: "المهام", icon: "✓" },
  { id: "drivers", label: "السائقون", icon: "♙", section: "الأصول" },
  { id: "geofences", label: "الحدود الجغرافية", icon: "⬡" },
  { id: "routes", label: "الطرق", icon: "⌇" },
  { id: "poi", label: "المعالم المهمة", icon: "◆" },
];

const vehicles = [
  ["2410 ASA", "الرياض · TCS", "متوقف", "منذ 12 دقيقة", "0 كم/س"],
  ["2414 ASA", "الرياض · TCS", "متحرك", "الآن", "74 كم/س"],
  ["2442 ASA", "الرياض · OPS", "متوقف", "منذ 3 دقائق", "0 كم/س"],
  ["2447 ASA", "الرياض · OPS", "خامل", "منذ دقيقة", "0 كم/س"],
  ["7926 BXA", "جدة · TCS", "متوقف", "منذ 18 دقيقة", "0 كم/س"],
];

const pageNames: Record<string, string> = {
  overview: "نظرة عامة", vehicles: "المركبات", alerts: "التنبيهات", history: "سجل الحركة",
  reports: "التقارير", commands: "إرسال الأوامر", media: "الكاميرا والميديا",
  sharing: "المشاركة", maintenance: "الصيانة", tasks: "المهام", drivers: "السائقون",
  geofences: "الحدود الجغرافية", routes: "تخطيط الطرق", poi: "المعالم المهمة",
};

function MiniMap() {
  return (
    <div className="map-canvas" aria-label="خريطة المركبات">
      <div className="road road-a" /><div className="road road-b" /><div className="road road-c" />
      <span className="district d1">الرياض</span><span className="district d2">الملز</span><span className="district d3">العليا</span>
      <button className="marker m1 moving" aria-label="مركبة متحركة">◈</button>
      <button className="marker m2" aria-label="مجموعة 4 مركبات">4</button>
      <button className="marker m3 warning" aria-label="مركبة تحتاج انتباه">!</button>
      <div className="map-controls"><button aria-label="تكبير">+</button><button aria-label="تصغير">−</button></div>
      <div className="map-legend"><i className="green" /> متصل <i className="amber" /> خامل <i className="red" /> تنبيه</div>
    </div>
  );
}

function Stat({ label, value, delta, tone }: { label: string; value: string; delta: string; tone?: string }) {
  return <article className="stat"><div className={`stat-icon ${tone || ""}`}>↗</div><div><span>{label}</span><strong>{value}</strong><small>{delta}</small></div></article>;
}

function Overview({ onOpen }: { onOpen: (id: string) => void }) {
  return <>
    <section className="stats-grid">
      <Stat label="إجمالي المركبات" value="13" delta="جميعها متصلة" />
      <Stat label="مركبات متحركة" value="4" delta="31% من الأسطول" tone="blue" />
      <Stat label="في وضع التوقف" value="8" delta="متوسط 42 دقيقة" tone="amber" />
      <Stat label="تنبيهات اليوم" value="3" delta="تنبيه واحد حرج" tone="red" />
    </section>
    <section className="main-grid">
      <article className="panel map-panel"><header><div><span className="eyebrow">تغطية مباشرة</span><h2>حركة الأسطول الآن</h2></div><button className="text-btn" onClick={() => onOpen("vehicles")}>عرض الكل ←</button></header><MiniMap /></article>
      <article className="panel activity-panel"><header><div><span className="eyebrow">آخر التحديثات</span><h2>النشاط المباشر</h2></div><span className="live-dot">مباشر</span></header>
        <div className="timeline">
          <div><i className="alert" /><p><strong>تجاوز سرعة · 2414 ASA</strong><span>تم تسجيل سرعة 120 كم/س</span></p><time>منذ 4 د</time></div>
          <div><i /><p><strong>وصول إلى الموقع · 7926 BXA</strong><span>دخل نطاق مستودع جدة</span></p><time>منذ 18 د</time></div>
          <div><i className="blue" /><p><strong>اكتمال مهمة · 2447 ASA</strong><span>تم تسليم الشحنة رقم #2841</span></p><time>منذ 34 د</time></div>
          <div><i /><p><strong>بدء رحلة · 2442 ASA</strong><span>من الرياض إلى القصيم</span></p><time>منذ 52 د</time></div>
        </div>
        <button className="full-btn" onClick={() => onOpen("alerts")}>عرض سجل التنبيهات</button>
      </article>
    </section>
    <section className="panel fleet-table"><header><div><span className="eyebrow">حالة الأسطول</span><h2>المركبات النشطة</h2></div><button className="filter-btn">آخر تحديث ↓</button></header><VehicleTable rows={vehicles.slice(0, 4)} /></section>
  </>;
}

function VehicleTable({ rows }: { rows: string[][] }) {
  return <div className="table-wrap"><table><thead><tr><th>المركبة</th><th>المجموعة</th><th>الحالة</th><th>آخر اتصال</th><th>السرعة</th><th /></tr></thead><tbody>{rows.map((v) => <tr key={v[0]}><td><span className="vehicle-icon">◈</span><b>{v[0]}</b></td><td>{v[1]}</td><td><span className={`status ${v[2] === "متحرك" ? "online" : v[2] === "خامل" ? "idle" : "parked"}`}>{v[2]}</span></td><td>{v[3]}</td><td>{v[4]}</td><td><button className="dots" aria-label={`خيارات ${v[0]}`}>•••</button></td></tr>)}</tbody></table></div>;
}

function ListingPage({ page }: { page: string }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => vehicles.filter(v => v.join(" ").includes(query)), [query]);
  if (page === "vehicles") return <section className="panel page-panel"><div className="toolbar"><label className="search">⌕<input value={query} onChange={e => setQuery(e.target.value)} placeholder="ابحث باسم أو رقم المركبة..." /></label><button className="filter-btn">الحالة: الكل ↓</button><button className="primary">+ إضافة مركبة</button></div><VehicleTable rows={filtered} /></section>;
  if (["geofences", "routes", "poi", "history"].includes(page)) return <section className="split-workspace"><article className="panel tools-panel"><label className="search">⌕<input placeholder={page === "history" ? "ابحث في سجل الرحلات..." : "ابحث..."} /></label><div className="tool-list">{["منطقة مستودع الرياض", "مركز عمليات جدة", "المسار السريع 01", "نقطة تسليم العليا"].map((x,i)=><button key={x}><span className={`shape s${i}`}>{page === "routes" ? "⌇" : page === "poi" ? "◆" : "⬡"}</span><span><b>{x}</b><small>{i%2 ? "3 مركبات قريبة" : "نشط · تم التحديث اليوم"}</small></span><i>›</i></button>)}</div><button className="primary wide">+ إضافة {page === "routes" ? "طريق" : page === "poi" ? "معلم" : page === "history" ? "تقرير رحلة" : "حد جغرافي"}</button></article><article className="panel large-map"><MiniMap /></article></section>;
  const configs: Record<string, { cols: string[]; rows: string[][]; action: string }> = {
    alerts:{cols:["النوع","المركبة","التفاصيل","الوقت","الحالة"],rows:[["تجاوز السرعة","2414 ASA","120 كم/س على طريق الملك فهد","منذ 4 دقائق","جديد"],["خروج من النطاق","2447 ASA","غادر نطاق مستودع الرياض","منذ 41 دقيقة","تمت المراجعة"],["صيانة دورية","7926 BXA","تبقى 240 كم على الصيانة","منذ ساعتين","متابعة"]],action:"إعداد تنبيه"},
    reports:{cols:["اسم التقرير","النوع","الفترة","آخر تشغيل","الحالة"],rows:[["ملخص الأسطول الأسبوعي","ملخص","أسبوعي","اليوم، 08:00","جاهز"],["تقرير السرعات","أحداث","يومي","أمس، 23:59","جاهز"],["ساعات تشغيل المحرك","تشغيل","شهري","1 أغسطس","مجدول"]],action:"إنشاء تقرير"},
    commands:{cols:["الأمر","المركبة","وقت الإرسال","النتيجة","المنشئ"],rows:[["تحديث الموقع","2414 ASA","الآن","تم التنفيذ","مدير النظام"],["إعادة تشغيل الجهاز","2442 ASA","منذ ساعة","تم التنفيذ","مدير النظام"],["طلب حالة","7926 BXA","أمس، 18:20","قيد الانتظار","فريق العمليات"]],action:"إرسال أمر"},
    media:{cols:["المركبة","نوع الوسائط","تاريخ الالتقاط","المدة","الحالة"],rows:[["7926 BXA","صورة أمامية","اليوم، 14:28","—","متاح"],["2414 ASA","فيديو حدث","اليوم، 10:31","00:22","متاح"],["2447 ASA","صورة المقصورة","أمس، 18:05","—","قيد المعالجة"]],action:"طلب وسائط"},
    sharing:{cols:["اسم الرابط","المركبات","تاريخ الانتهاء","المشاهدات","الحالة"],rows:[["تتبع شحنة #2841","1 مركبة","غدًا، 18:00","24","نشط"],["أسطول الرياض","6 مركبات","12 أغسطس","103","نشط"],["عرض تجريبي","3 مركبات","انتهى أمس","56","منتهي"]],action:"إنشاء رابط"},
    maintenance:{cols:["المركبة","الخدمة القادمة","المتبقي","المسؤول","الحالة"],rows:[["7926 BXA","تغيير زيت وفلاتر","240 كم","مركز جدة","قريب"],["2442 ASA","فحص دوري","8 أيام","مركز الرياض","مجدول"],["2410 ASA","تغيير إطارات","1,420 كم","غير محدد","سليم"]],action:"إضافة صيانة"},
    tasks:{cols:["المهمة","المركبة","الموقع","الموعد","الحالة"],rows:[["تسليم الشحنة #2841","2447 ASA","العليا، الرياض","اليوم 16:30","قيد التنفيذ"],["استلام طلب #771","2414 ASA","الملز، الرياض","اليوم 18:00","جديدة"],["نقل معدات","7926 BXA","جدة الصناعية","غدًا 09:00","مجدولة"]],action:"مهمة جديدة"},
    drivers:{cols:["السائق","المركبة الحالية","رقم الهاتف","التقييم","الحالة"],rows:[["عبدالله سالم","2414 ASA","05••• 2481","4.9","في رحلة"],["محمد العتيبي","2447 ASA","05••• 9024","4.7","متاح"],["سعد القحطاني","7926 BXA","05••• 1180","4.8","استراحة"]],action:"إضافة سائق"},
  };
  const cfg = configs[page] || configs.alerts;
  return <section className="panel page-panel"><div className="toolbar"><label className="search">⌕<input placeholder={`ابحث في ${pageNames[page]}...`} /></label><button className="filter-btn">الفترة: هذا الأسبوع ↓</button><button className="primary">+ {cfg.action}</button></div><div className="table-wrap"><table><thead><tr>{cfg.cols.map(c=><th key={c}>{c}</th>)}<th /></tr></thead><tbody>{cfg.rows.map((r,i)=><tr key={i}>{r.map((c,j)=><td key={j}>{j===r.length-1?<span className={`status ${c.includes("جديد")||c.includes("قريب")?"idle":"online"}`}>{c}</span>:<b className={j===0?"cell-title":""}>{c}</b>}</td>)}<td><button className="dots">•••</button></td></tr>)}</tbody></table></div></section>;
}

export default function Home() {
  const [page, setPage] = useState("overview"); const [sidebar, setSidebar] = useState(false);
  return <main className="app-shell" dir="rtl">
    <aside className={sidebar ? "sidebar open" : "sidebar"}>
      <div className="brand"><div className="brand-mark">I</div><div><b>إنجاز</b><span>إدارة الأسطول</span></div><button className="close-menu" onClick={()=>setSidebar(false)}>×</button></div>
      <nav>{navItems.map((item,i)=><div key={item.id}>{item.section && <span className="nav-section">{item.section}</span>}<button className={page===item.id?"active":""} onClick={()=>{setPage(item.id);setSidebar(false)}}><i>{item.icon}</i>{item.label}{item.id==="alerts"&&<em>3</em>}</button></div>)}</nav>
      <div className="sidebar-footer"><div className="avatar">ح</div><div><b>حساب التجربة</b><span>مدير النظام</span></div><button>⋮</button></div>
    </aside>
    <section className="workspace">
      <header className="topbar"><button className="menu-btn" onClick={()=>setSidebar(true)}>☰</button><div className="crumb"><span>لوحة التحكم</span><i>/</i><b>{pageNames[page]}</b></div><div className="top-actions"><button aria-label="البحث">⌕</button><button aria-label="الإشعارات" className="notification">♢<i /></button><button className="help">؟</button><span className="date">الثلاثاء، 4 أغسطس</span></div></header>
      <div className="content"><div className="page-heading"><div><span className="eyebrow">مركز العمليات</span><h1>{pageNames[page]}</h1><p>{page==="overview"?"صورة لحظية واضحة لأداء أسطولك اليوم.":`إدارة ${pageNames[page]} ومتابعة جميع التفاصيل من مكان واحد.`}</p></div><div className="sync"><i /> آخر مزامنة: الآن</div></div>{page==="overview"?<Overview onOpen={setPage}/>:<ListingPage page={page}/>}</div>
    </section>
  </main>;
}
