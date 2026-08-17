import type { PageId } from "./navigation";

export type EntityStatus = "active" | "attention" | "inactive";
export interface EntityRecord { id: string; name: string; details: string; updatedAt: string; status: EntityStatus; notes?: string; metadata?: Record<string, string> }
export type EntityStore = Record<PageId, EntityRecord[]>;

export type FieldType = "text" | "email" | "tel" | "number" | "date" | "datetime-local" | "textarea" | "select" | "checkbox" | "color";
export interface EntityField { key: string; label: string; type: FieldType; placeholder?: string; required?: boolean; options?: { label: string; value: string }[]; optionCategory?: string; wide?: boolean }
export interface EntityFormSchema { singular: string; primaryKey: string; secondaryKey: string; fields: EntityField[] }
