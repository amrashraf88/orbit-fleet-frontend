"use client";

import { useEffect, useRef } from "react";
import type { Vehicle } from "@/src/types/vehicle";

type Props = {
  vehicles: Vehicle[];
  selectedId?: string;
  onSelect: (id: string) => void;
  zoomCommand: number;
};

const movingRoute: [number, number][] = [
  [24.7136,46.6753],[24.7144,46.6771],[24.7151,46.6792],[24.7160,46.6815],
  [24.7172,46.6833],[24.7187,46.6845],[24.7202,46.6841],[24.7214,46.6824],
  [24.7210,46.6801],[24.7197,46.6778],[24.7178,46.6759],[24.7157,46.6748],
];

const routeWaypoints: [number, number][] = [
  [24.7136,46.6753],
  [24.7184,46.6828],
  [24.7247,46.6894],
  [24.7189,46.6962],
];

async function getRoadRoute(signal: AbortSignal): Promise<[number,number][]> {
  const coordinates = routeWaypoints.map(([lat,lng]) => `${lng},${lat}`).join(";");
  const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coordinates}?overview=full&geometries=geojson&steps=false`, {signal});
  if (!response.ok) throw new Error("تعذر تحميل مسار الطريق");
  const payload = await response.json() as {routes?: {geometry?: {coordinates?: [number,number][]}}[]};
  const road = payload.routes?.[0]?.geometry?.coordinates;
  if (!road?.length) throw new Error("لم يتم العثور على مسار طريق");
  return road.map(([lng,lat]) => [lat,lng]);
}

export function InteractiveFleetMap({ vehicles, selectedId, onSelect, zoomCommand }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef(new Map<string, import("leaflet").Marker>());
  const routeIndexRef = useRef(0);
  const onSelectRef = useRef(onSelect);
  const selectedIdRef = useRef(selectedId);
  useEffect(() => { onSelectRef.current = onSelect; }, [onSelect]);
  useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId]);

  useEffect(() => {
    let cancelled = false;
    let timer = 0;
    const controller = new AbortController();
    const markers = markersRef.current;
    async function mountMap() {
      if (!hostRef.current || mapRef.current) return;
      const L = await import("leaflet");
      if (cancelled || !hostRef.current) return;
      const map = L.map(hostRef.current, { center:[24.7136,46.6753], zoom:11, zoomControl:false, attributionControl:true });
      mapRef.current = map;
      const streets = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom:19, attribution:"© OpenStreetMap" });
      const satellite = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", { maxZoom:19, attribution:"Tiles © Esri" });
      satellite.addTo(map);
      L.control.layers({ "قمر صناعي": satellite, "شوارع": streets }, undefined, { position:"topleft" }).addTo(map);
      L.control.zoom({position:"topleft"}).addTo(map);

      const bounds: [number,number][] = [];
      vehicles.forEach((vehicle) => {
        if (vehicle.latitude == null || vehicle.longitude == null) return;
        const icon = L.divIcon({ className:"fleet-leaflet-icon", html:`<span class="leaflet-car ${vehicle.state}"><span class="car-direction"></span><img src="/car-marker.svg" alt="" /><i class="car-state-dot"></i></span><span class="leaflet-car-label">${vehicle.speed} كم/س</span>`, iconSize:[38,54], iconAnchor:[19,25] });
        const marker = L.marker([vehicle.latitude,vehicle.longitude], {icon, title:vehicle.name, riseOnHover:true}).addTo(map);
        marker.on("click", () => onSelectRef.current(vehicle.id));
        marker.bindTooltip(`<b>${vehicle.name}</b><br>${vehicle.speed} كم/س`, {direction:"top",offset:[0,-18],className:"fleet-tooltip"});
        markers.set(vehicle.id, marker);
        bounds.push([vehicle.latitude,vehicle.longitude]);
      });
      if (bounds.length > 1) map.fitBounds(bounds, {padding:[70,70],maxZoom:12});

      let roadRoute = movingRoute;
      try { roadRoute = await getRoadRoute(controller.signal); } catch { roadRoute = movingRoute; }
      if (cancelled) return;
      const routeLine = L.polyline(roadRoute, {color:"#25dfd5",weight:5,opacity:.88,lineCap:"round",lineJoin:"round"}).addTo(map);
      routeLine.bindTooltip("مسار المركبة المتحركة");
      const movingVehicle = vehicles.find((vehicle) => vehicle.state === "moving");
      if (movingVehicle) timer = window.setInterval(() => {
        routeIndexRef.current = (routeIndexRef.current + 1) % roadRoute.length;
        const point = roadRoute[routeIndexRef.current];
        const next = roadRoute[(routeIndexRef.current + 1) % roadRoute.length];
        const marker = markers.get(movingVehicle.id);
        marker?.setLatLng(point);
        const angle = Math.atan2((next[1]-point[1]) * Math.cos(point[0] * Math.PI / 180), next[0]-point[0]) * 180 / Math.PI;
        const car = marker?.getElement()?.querySelector<HTMLElement>(".leaflet-car");
        if (car) car.style.setProperty("--car-heading", `${angle}deg`);
        if (selectedIdRef.current === movingVehicle.id) map.panTo(point, {animate:true,duration:.65});
      }, 700);
      window.setTimeout(() => map.invalidateSize(), 50);
    }
    mountMap();
    return () => { cancelled=true; controller.abort(); window.clearInterval(timer); mapRef.current?.remove(); mapRef.current=null; markers.clear(); };
  }, [vehicles]);

  useEffect(() => {
    if (!selectedId) return;
    const marker = markersRef.current.get(selectedId);
    if (marker && mapRef.current) {
      marker.setZIndexOffset(1000);
      mapRef.current.flyTo(marker.getLatLng(), 18, {duration:1.35, easeLinearity:.2});
      window.setTimeout(() => marker.openTooltip(), 650);
    }
  }, [selectedId]);

  useEffect(() => { if (!mapRef.current || zoomCommand === 0) return; if (zoomCommand > 0) mapRef.current.zoomIn(); else mapRef.current.zoomOut(); }, [zoomCommand]);

  return <div ref={hostRef} className="interactive-fleet-map" aria-label="خريطة تفاعلية للمركبات"/>;
}
