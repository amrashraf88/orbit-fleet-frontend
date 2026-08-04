import {
  Bell, CarProfile, ChartBar, ClipboardText, Crosshair, GasPump, House,
  MapPin, Path, Users, VideoCamera, Wrench,
} from "@phosphor-icons/react";
import type { NavigationGroup, PageId } from "@/src/types/navigation";

export const navigationGroups: NavigationGroup[] = [
  { items: [{ id: "home", label: "الرئيسية", icon: House }, { id: "live", label: "الخريطة الحية", icon: Crosshair }] },
  { label: "التشغيل", items: [{ id: "vehicles", label: "المركبات", icon: CarProfile }, { id: "drivers", label: "السائقون", icon: Users }, { id: "tasks", label: "المهام", icon: ClipboardText }, { id: "history", label: "سجل المسارات", icon: Path }] },
  { label: "المراقبة", items: [{ id: "geofences", label: "النطاقات الجغرافية", icon: MapPin }, { id: "alerts", label: "التنبيهات والإشعارات", icon: Bell, badge: 3 }, { id: "cameras", label: "الكاميرات", icon: VideoCamera }] },
  { label: "الإدارة", items: [{ id: "maintenance", label: "الصيانة", icon: Wrench }, { id: "fuel", label: "الوقود", icon: GasPump }, { id: "reports", label: "التقارير", icon: ChartBar }] },
];

export const pageLabels: Record<PageId, string> = Object.fromEntries(
  navigationGroups.flatMap((group) => group.items).map(({ id, label }) => [id, label]),
) as Record<PageId, string>;

export const getNavigationItem = (page: PageId) =>
  navigationGroups.flatMap((group) => group.items).find((item) => item.id === page);
