import { mockVehicles } from "@/src/data/mock-vehicles";
import { apiClient } from "@/src/lib/api/client";
import type { ApiListResponse, Vehicle } from "@/src/types/vehicle";

const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";

export const vehiclesService = {
  async list(search = ""): Promise<Vehicle[]> {
    if (USE_MOCKS) {
      const normalized = search.trim().toLocaleLowerCase("ar");
      return mockVehicles.filter((vehicle) =>
        `${vehicle.id} ${vehicle.name} ${vehicle.group}`.toLocaleLowerCase("ar").includes(normalized),
      );
    }
    const response = await apiClient<ApiListResponse<Vehicle>>(`/vehicles?search=${encodeURIComponent(search)}`);
    return response.data;
  },

  getById(id: string): Promise<Vehicle> {
    if (USE_MOCKS) {
      const vehicle = mockVehicles.find((item) => item.id === id);
      return vehicle ? Promise.resolve(vehicle) : Promise.reject(new Error("المركبة غير موجودة"));
    }
    return apiClient<Vehicle>(`/vehicles/${encodeURIComponent(id)}`);
  },
};
