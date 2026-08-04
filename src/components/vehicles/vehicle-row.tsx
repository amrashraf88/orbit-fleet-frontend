import { CarProfile } from "@phosphor-icons/react";
import type { Vehicle, VehicleState } from "@/src/types/vehicle";

const stateMeta: Record<VehicleState, { tone: string; label: string }> = { moving: { tone: "green", label: "متحركة" }, idle: { tone: "yellow", label: "خاملة" }, stopped: { tone: "pink", label: "متوقفة" }, online: { tone: "cyan", label: "متصلة" } };

export function VehicleRow({ vehicle, selected, onClick }: { vehicle: Vehicle; selected: boolean; onClick: () => void }) {
  const { tone, label } = stateMeta[vehicle.state];
  return <button className={`vehicle-row ${selected ? "selected" : ""} ${tone}`} onClick={onClick}><div className="vehicle-row-head"><div><b>{vehicle.name}</b><span>{vehicle.group}</span></div><span className={`state-pill ${tone}`}>{label}</span><div className="vehicle-mini-icon"><CarProfile size={19} weight="fill" /></div></div><div className="vehicle-row-foot"><span><strong>{vehicle.speed}</strong> كم/س</span><time>{vehicle.updatedAt}</time></div></button>;
}
