import type { Icon } from "@phosphor-icons/react";

export type PageId =
  | "home"
  | "live"
  | "vehicles"
  | "drivers"
  | "tasks"
  | "history"
  | "geofences"
  | "alerts"
  | "cameras"
  | "maintenance"
  | "fuel"
  | "reports";

export interface NavigationItem {
  id: PageId;
  label: string;
  icon: Icon;
  badge?: number;
}

export interface NavigationGroup {
  label?: string;
  items: NavigationItem[];
}
