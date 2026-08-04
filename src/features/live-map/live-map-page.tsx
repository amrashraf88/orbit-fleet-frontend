import { useState } from "react";
import { CarProfile, SidebarSimple } from "@phosphor-icons/react";
import { BottomPanels } from "@/src/components/map/bottom-panels";
import { MapTools } from "@/src/components/map/map-tools";
import { VehicleDrawer } from "@/src/components/vehicles/vehicle-drawer";
import { useVehicles } from "@/src/hooks/use-vehicles";

export function LiveMapPage() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string>();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const { vehicles, isLoading, error, retry } = useVehicles(query);
  const selectedVehicle = vehicles.find((vehicle) => vehicle.id === selectedId) ?? vehicles[0];

  return <div className="live-map">
    <div className="map-filter glass"><button className="active">الكل</button><button>متحركة</button><button>خاملة</button><button>متوقفة</button></div>
    <div className="map-status glass"><span className="dot green" /> مباشر <span>{vehicles.length}</span><span className="dot pink" />{vehicles.filter((v) => v.state === "stopped").length}<span className="dot yellow" />{vehicles.filter((v) => v.state === "idle").length}</div>
    {drawerOpen && <VehicleDrawer vehicles={vehicles} selectedId={selectedVehicle?.id} query={query} onQueryChange={setQuery} onSelect={(vehicle) => setSelectedId(vehicle.id)} isLoading={isLoading} error={error} onRetry={retry} />}
    <button className="drawer-toggle" onClick={() => setDrawerOpen((value) => !value)} aria-label="إظهار أو إخفاء المركبات"><SidebarSimple /></button>
    <MapTools />
    <button className="vehicle-marker marker-one" aria-label="مركبة"><CarProfile weight="fill" /></button><button className="vehicle-marker marker-two idle" aria-label="مركبة خاملة"><CarProfile weight="fill" /></button><button className="vehicle-marker marker-three" aria-label="مركبة"><CarProfile weight="fill" /></button>
    {selectedVehicle && <BottomPanels vehicle={selectedVehicle} />}
  </div>;
}
