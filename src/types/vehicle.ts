export type VehicleState = "moving" | "idle" | "stopped" | "online";

export interface Vehicle {
  id: string;
  name: string;
  group: string;
  speed: number;
  state: VehicleState;
  updatedAt: string;
  address?: string;
  driverName?: string;
  fuelLevel?: number;
  altitude?: number;
  engineOn?: boolean;
}

export interface ApiListResponse<T> {
  data: T[];
  meta: { total: number; page: number; perPage: number };
}
