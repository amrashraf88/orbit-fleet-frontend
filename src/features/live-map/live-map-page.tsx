import { useMemo, useState } from "react";
import { CarProfile, PaperPlaneTilt, SidebarSimple, X } from "@phosphor-icons/react";
import { BottomPanels } from "@/src/components/map/bottom-panels";
import { MapTools } from "@/src/components/map/map-tools";
import { VehicleDrawer } from "@/src/components/vehicles/vehicle-drawer";
import { useVehicles } from "@/src/hooks/use-vehicles";
import type { VehicleState } from "@/src/types/vehicle";

type Filter = VehicleState | "all";
export function LiveMapPage() {
  const [query, setQuery] = useState(""); const [selectedId, setSelectedId] = useState<string>(); const [mapTargetId, setMapTargetId] = useState<string>(); const [drawerOpen, setDrawerOpen] = useState(true); const [filter, setFilter] = useState<Filter>("all"); const [activeTool, setActiveTool] = useState(5); const [zoom, setZoom] = useState(1); const [message, setMessage] = useState(""); const [commandOpen, setCommandOpen] = useState(false); const [detailsOpen, setDetailsOpen] = useState(true);
  const { vehicles, isLoading, error, retry } = useVehicles(query); const filtered = useMemo(() => filter === "all" ? vehicles : vehicles.filter((v) => v.state === filter), [vehicles, filter]); const selectedVehicle = filtered.find((v) => v.id === selectedId) ?? filtered[0]; const mapTarget = vehicles.find((v) => v.id === mapTargetId);
  const mapUrl = useMemo(() => { if (mapTarget?.latitude == null || mapTarget.longitude == null) return "https://www.openstreetmap.org/export/embed.html?bbox=34.3%2C16.1%2C55.8%2C32.4&layer=mapnik"; const span = .055; const bbox = [mapTarget.longitude - span, mapTarget.latitude - span, mapTarget.longitude + span, mapTarget.latitude + span].join(","); return `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${mapTarget.latitude}%2C${mapTarget.longitude}`; }, [mapTarget]);
  const flash = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(""), 2200); };
  const focusVehicle = (id?: string) => { const vehicle = vehicles.find((item) => item.id === id); if (!vehicle) return; setSelectedId(vehicle.id); setMapTargetId(vehicle.id); setDetailsOpen(true); setActiveTool(5); setZoom(1); flash(`تم الانتقال إلى موقع ${vehicle.name}`); };
  const toolAction = (index: number, label: string) => { setActiveTool(index); if (index === 1) setZoom((v) => Math.min(v + .15, 1.75)); else if (index === 2) setZoom((v) => Math.max(v - .15, .7)); flash(label); };
  return <div className="live-map"><iframe key={mapUrl} className="map-canvas" style={{ transform: `scale(${zoom})` }} title="خريطة المملكة العربية السعودية" src={mapUrl} loading="eager" /><div className="saudi-map-label glass">{mapTarget ? `📍 ${mapTarget.address ?? mapTarget.name}` : "🇸🇦 المملكة العربية السعودية"}</div>
    <div className="map-filter glass">{([['all','الكل'],['moving','متحركة'],['idle','خاملة'],['stopped','متوقفة']] as [Filter,string][]).map(([id,label]) => <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>)}</div>
    <div className="map-status glass"><span className="dot green" /> مباشر <span>{filtered.length}</span><span className="dot pink" />{vehicles.filter((v) => v.state === "stopped").length}<span className="dot yellow" />{vehicles.filter((v) => v.state === "idle").length}</div>
    {drawerOpen && <VehicleDrawer vehicles={filtered} selectedId={selectedVehicle?.id} query={query} onQueryChange={setQuery} onSelect={(vehicle) => focusVehicle(vehicle.id)} isLoading={isLoading} error={error} onRetry={retry} />}
    <button className="drawer-toggle" onClick={() => setDrawerOpen((value) => !value)} aria-label="إظهار أو إخفاء المركبات"><SidebarSimple /></button><MapTools active={activeTool} onAction={toolAction} />
    {!mapTarget && <><button className="vehicle-marker marker-one" onClick={() => focusVehicle(vehicles[0]?.id)} aria-label="مركبة"><CarProfile weight="fill" /></button><button className="vehicle-marker marker-two idle" onClick={() => focusVehicle(vehicles[1]?.id)} aria-label="مركبة خاملة"><CarProfile weight="fill" /></button><button className="vehicle-marker marker-three" onClick={() => focusVehicle(vehicles[2]?.id)} aria-label="مركبة"><CarProfile weight="fill" /></button></>}
    {selectedVehicle && detailsOpen && <BottomPanels vehicle={selectedVehicle} onTrack={() => focusVehicle(selectedVehicle.id)} onCommand={() => setCommandOpen(true)} onLocate={() => focusVehicle(selectedVehicle.id)} onClose={() => setDetailsOpen(false)} />}
    {commandOpen && <div className="modal-backdrop"><section className="command-modal glass"><header><div><small>مركز الأوامر</small><h2>إرسال أمر إلى {selectedVehicle?.name}</h2></div><button onClick={() => setCommandOpen(false)}><X /></button></header><div className="command-grid">{["إيقاف المحرك","تشغيل المحرك","طلب الموقع","فتح الأبواب","قفل الأبواب","تشغيل المنبه"].map((command) => <button key={command} onClick={() => { setCommandOpen(false); flash(`تم إرسال: ${command}`); }}><PaperPlaneTilt />{command}</button>)}</div></section></div>}{message && <div className="toast">{message}</div>}
  </div>;
}
