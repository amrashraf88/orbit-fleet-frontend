import { mockVehicles } from "@/src/data/mock-vehicles";
import { apiClient } from "@/src/lib/api/client";
import type { ApiListResponse, Vehicle } from "@/src/types/vehicle";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

interface ApiVehicle extends Omit<Vehicle, "id" | "state" | "group" | "updatedAt"> {
  id: string;
  plateNumber?: string;
  state: string;
  group?: string | null;
  updatedAt?: string;
  lastSeenAt?: string | null;
  driver?: { name?: string } | null;
}

const validStates = new Set<Vehicle["state"]>(["moving", "idle", "stopped", "online", "offline"]);

function normalizeVehicle(vehicle: ApiVehicle): Vehicle {
  const rawState = vehicle.state?.toLowerCase() as Vehicle["state"];
  const state = validStates.has(rawState) ? rawState : "offline";
  return {
    ...vehicle,
    id: vehicle.id,
    group: vehicle.group || "بدون مجموعة",
    state,
    speed: Number(vehicle.speed) || 0,
    updatedAt: vehicle.lastSeenAt || vehicle.updatedAt || "—",
    driverName: vehicle.driver?.name || vehicle.driverName,
    latitude: vehicle.latitude == null ? undefined : Number(vehicle.latitude),
    longitude: vehicle.longitude == null ? undefined : Number(vehicle.longitude),
  };
}

export const vehiclesService = {
  async list(search = ""): Promise<Vehicle[]> {
    if (USE_MOCKS) {
      const normalized = search.trim().toLocaleLowerCase("ar");
      return mockVehicles.filter((vehicle) =>
        `${vehicle.id} ${vehicle.name} ${vehicle.group}`.toLocaleLowerCase("ar").includes(normalized),
      );
    }
    const response = await apiClient<ApiListResponse<ApiVehicle>>(`/vehicles?search=${encodeURIComponent(search)}`);
    return response.data.map(normalizeVehicle);
  },

  getById(id: string): Promise<Vehicle> {
    if (USE_MOCKS) {
      const vehicle = mockVehicles.find((item) => item.id === id);
      return vehicle ? Promise.resolve(vehicle) : Promise.reject(new Error("المركبة غير موجودة"));
    }
    return apiClient<ApiVehicle>(`/vehicles/${encodeURIComponent(id)}`).then(normalizeVehicle);
  },
};
