import { useMemo, useState } from "react";
import { PaperPlaneTilt, SidebarSimple, X } from "@phosphor-icons/react";
import { BottomPanels } from "@/src/components/map/bottom-panels";
import { InteractiveFleetMap } from "@/src/components/map/interactive-fleet-map";
import { MapTools } from "@/src/components/map/map-tools";
import { VehicleDrawer } from "@/src/components/vehicles/vehicle-drawer";
import { useVehicles } from "@/src/hooks/use-vehicles";
import type { VehicleState } from "@/src/types/vehicle";

type Filter = VehicleState | "all";
export function LiveMapPage() {
  const [query, setQuery] = useState(""); const [selectedId, setSelectedId] = useState<string>(); const [mapTargetId, setMapTargetId] = useState<string>(); const [drawerOpen, setDrawerOpen] = useState(true); const [filter, setFilter] = useState<Filter>("all"); const [activeTool, setActiveTool] = useState(5); const [zoomCommand, setZoomCommand] = useState(0); const [message, setMessage] = useState(""); const [commandOpen, setCommandOpen] = useState(false); const [detailsOpen, setDetailsOpen] = useState(true);
  const { vehicles, isLoading, error, retry } = useVehicles(query); const filtered = useMemo(() => filter === "all" ? vehicles : vehicles.filter((v) => v.state === filter), [vehicles, filter]); const selectedVehicle = filtered.find((v) => v.id === selectedId) ?? filtered[0]; const mapTarget = vehicles.find((v) => v.id === mapTargetId);
  const flash = (text: string) => { setMessage(text); window.setTimeout(() => setMessage(""), 2200); };
  const focusVehicle = (id?: string) => { const vehicle = vehicles.find((item) => item.id === id); if (!vehicle) return; setSelectedId(vehicle.id); setMapTargetId(vehicle.id); setDetailsOpen(true); setActiveTool(5); setZoomCommand(0); flash(`تم الانتقال إلى موقع ${vehicle.name}`); };
  const toolAction = (index: number, label: string) => { setActiveTool(index); if (index === 1) setZoomCommand((v) => Math.abs(v) + 1); else if (index === 2) setZoomCommand((v) => -Math.abs(v || 1)); flash(label); };
  return <div className="live-map"><InteractiveFleetMap vehicles={filtered} selectedId={selectedVehicle?.id} onSelect={focusVehicle} zoomCommand={zoomCommand}/><div className="saudi-map-label glass">{mapTarget ? `📍 ${mapTarget.address ?? mapTarget.name}` : "🇸🇦 المملكة العربية السعودية"}</div>
    <div className="map-filter glass">{([['all','الكل'],['moving','متحركة'],['idle','خاملة'],['stopped','متوقفة']] as [Filter,string][]).map(([id,label]) => <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>)}</div>
    <div className="map-status glass"><span className="dot green" /> مباشر <span>{filtered.length}</span><span className="dot pink" />{vehicles.filter((v) => v.state === "stopped").length}<span className="dot yellow" />{vehicles.filter((v) => v.state === "idle").length}</div>
    {drawerOpen && <VehicleDrawer vehicles={filtered} selectedId={selectedVehicle?.id} query={query} onQueryChange={setQuery} onSelect={(vehicle) => focusVehicle(vehicle.id)} isLoading={isLoading} error={error} onRetry={retry} />}
    <button className="drawer-toggle" onClick={() => setDrawerOpen((value) => !value)} aria-label="إظهار أو إخفاء المركبات"><SidebarSimple /></button><MapTools active={activeTool} onAction={toolAction} />
    {selectedVehicle && detailsOpen && <BottomPanels vehicle={selectedVehicle} onTrack={() => focusVehicle(selectedVehicle.id)} onCommand={() => setCommandOpen(true)} onLocate={() => focusVehicle(selectedVehicle.id)} onClose={() => setDetailsOpen(false)} />}
    {commandOpen && <div className="modal-backdrop"><section className="command-modal glass"><header><div><small>مركز الأوامر</small><h2>إرسال أمر إلى {selectedVehicle?.name}</h2></div><button onClick={() => setCommandOpen(false)}><X /></button></header><div className="command-grid">{["إيقاف المحرك","تشغيل المحرك","طلب الموقع","فتح الأبواب","قفل الأبواب","تشغيل المنبه"].map((command) => <button key={command} onClick={() => { setCommandOpen(false); flash(`تم إرسال: ${command}`); }}><PaperPlaneTilt />{command}</button>)}</div></section></div>}{message && <div className="toast">{message}</div>}
  </div>;
}
