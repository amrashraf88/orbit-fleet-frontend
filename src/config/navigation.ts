import {
  BellRinging, ChartLineUp, ClipboardText, Drop, HouseLine,
  MapPinArea, MapTrifold, Path, SteeringWheel, Truck, VideoCamera, Wrench,
} from "@phosphor-icons/react";
import type { NavigationGroup, PageId } from "@/src/types/navigation";

export const navigationGroups: NavigationGroup[] = [
  { items: [{ id: "home", label: "الرئيسية", icon: HouseLine }, { id: "live", label: "الخريطة الحية", icon: MapTrifold }] },
  { label: "التشغيل", items: [{ id: "vehicles", label: "المركبات", icon: Truck }, { id: "drivers", label: "السائقون", icon: SteeringWheel }, { id: "tasks", label: "المهام", icon: ClipboardText }, { id: "history", label: "سجل المسارات", icon: Path }] },
  { label: "المراقبة", items: [{ id: "geofences", label: "النطاقات الجغرافية", icon: MapPinArea }, { id: "alerts", label: "التنبيهات والإشعارات", icon: BellRinging, badge: 3 }, { id: "cameras", label: "الكاميرات", icon: VideoCamera }] },
  { label: "الإدارة", items: [{ id: "maintenance", label: "الصيانة", icon: Wrench }, { id: "fuel", label: "الوقود", icon: Drop }, { id: "reports", label: "التقارير", icon: ChartLineUp }] },
];

export const pageLabels: Record<PageId, string> = Object.fromEntries(
  navigationGroups.flatMap((group) => group.items).map(({ id, label }) => [id, label]),
) as Record<PageId, string>;

export const getNavigationItem = (page: PageId) =>
  navigationGroups.flatMap((group) => group.items).find((item) => item.id === page);
