import type { PageId } from "./navigation";

export type EntityStatus = "active" | "attention" | "inactive";
export interface EntityRecord { id: string; name: string; details: string; updatedAt: string; status: EntityStatus; notes?: string }
export type EntityStore = Record<PageId, EntityRecord[]>;
