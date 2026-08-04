import { useMemo, useState } from "react";
import { CarProfile, PaperPlaneTilt, SidebarSimple, X } from "@phosphor-icons/react";
import { BottomPanels } from "@/src/components/map/bottom-panels";
import { MapTools } from "@/src/components/map/map-tools";
import { VehicleDrawer } from "@/src/components/vehicles/vehicle-drawer";
import { useVehicles } from "@/src/hooks/use-vehicles";
import type { VehicleState } from "@/src/types/vehicle";

type Filter = VehicleState | "all";
export function LiveMapPage() {
  const [query, setQuery] = useState(""); const [selectedId, setSelectedId] = useState<string>(); const [drawerOpen, setDrawerOpen] = useState(true); const [filter, setFilter] = useState<Filter>("all"); const [activeTool, setActiveTool] = useState(5); const [zoom, setZoom] = useState(1); const [message, setMessage] = useState(""); const [commandOpen, setCommandOpen] = useState(false); const [detailsOpen, setDetailsOpen] = useState(true);
  const { vehicles, isLoading, error, retry } = useVehicles(query); const filtered = useMemo(() => filter === "all" ? vehicles : vehicles.filter((v) => v.state === filter), [vehicles, filter]); const selectedVehicle = filtered.find((v) => v.id === selectedId) ?? filtered[0];
  const flash = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(""), 2200); };
  const toolAction = (index: number, label: string) => { setActiveTool(index); if (index === 1) setZoom((v) => Math.min(v + .15, 1.75)); else if (index === 2) setZoom((v) => Math.max(v - .15, .7)); flash(label); };
  return <div className="live-map"><iframe className="map-canvas" style={{ transform: `scale(${zoom})` }} title="خريطة المملكة العربية السعودية" src="https://www.openstreetmap.org/export/embed.html?bbox=34.3%2C16.1%2C55.8%2C32.4&layer=mapnik&marker=24.7136%2C46.6753" loading="eager" /><div className="saudi-map-label glass">🇸🇦 المملكة العربية السعودية</div>
    <div className="map-filter glass">{([['all','الكل'],['moving','متحركة'],['idle','خاملة'],['stopped','متوقفة']] as [Filter,string][]).map(([id,label]) => <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>)}</div>
    <div className="map-status glass"><span className="dot green" /> مباشر <span>{filtered.length}</span><span className="dot pink" />{vehicles.filter((v) => v.state === "stopped").length}<span className="dot yellow" />{vehicles.filter((v) => v.state === "idle").length}</div>
    {drawerOpen && <VehicleDrawer vehicles={filtered} selectedId={selectedVehicle?.id} query={query} onQueryChange={setQuery} onSelect={(vehicle) => { setSelectedId(vehicle.id); setDetailsOpen(true); }} isLoading={isLoading} error={error} onRetry={retry} />}
    <button className="drawer-toggle" onClick={() => setDrawerOpen((value) => !value)} aria-label="إظهار أو إخفاء المركبات"><SidebarSimple /></button><MapTools active={activeTool} onAction={toolAction} />
    <button className="vehicle-marker marker-one" onClick={() => { setSelectedId(vehicles[0]?.id); setDetailsOpen(true); }} aria-label="مركبة"><CarProfile weight="fill" /></button><button className="vehicle-marker marker-two idle" onClick={() => { setSelectedId(vehicles[1]?.id); setDetailsOpen(true); }} aria-label="مركبة خاملة"><CarProfile weight="fill" /></button><button className="vehicle-marker marker-three" onClick={() => { setSelectedId(vehicles[2]?.id); setDetailsOpen(true); }} aria-label="مركبة"><CarProfile weight="fill" /></button>
    {selectedVehicle && detailsOpen && <BottomPanels vehicle={selectedVehicle} onTrack={() => flash(`جاري تتبع ${selectedVehicle.name}`)} onCommand={() => setCommandOpen(true)} onLocate={() => { setActiveTool(5); flash("تم تحديد المركبة على الخريطة"); }} onClose={() => setDetailsOpen(false)} />}
    {commandOpen && <div className="modal-backdrop"><section className="command-modal glass"><header><div><small>مركز الأوامر</small><h2>إرسال أمر إلى {selectedVehicle?.name}</h2></div><button onClick={() => setCommandOpen(false)}><X /></button></header><div className="command-grid">{["إيقاف المحرك","تشغيل المحرك","طلب الموقع","فتح الأبواب","قفل الأبواب","تشغيل المنبه"].map((command) => <button key={command} onClick={() => { setCommandOpen(false); flash(`تم إرسال: ${command}`); }}><PaperPlaneTilt />{command}</button>)}</div></section></div>}{message && <div className="toast">{message}</div>}
  </div>;
}
