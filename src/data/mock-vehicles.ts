import type { Vehicle } from "@/src/types/vehicle";

export const mockVehicles: Vehicle[] = [
  { id: "2414 ASA", name: "تجريبي — متحرك", group: "أسطول الرياض", speed: 73, state: "moving", updatedAt: "14:36:58 05-07-2026", address: "طريق الملك فهد، الرياض", driverName: "خالد محمد", fuelLevel: 72, altitude: 620, engineOn: true, latitude: 24.7136, longitude: 46.6753 },
  { id: "2447 ASA", name: "تجريبي — خاملة", group: "أسطول الرياض 2", speed: 2, state: "idle", updatedAt: "14:36:58 05-07-2026", address: "حي النرجس، الرياض", fuelLevel: 64, altitude: 618, engineOn: true, latitude: 24.7743, longitude: 46.7386 },
  { id: "7926 BXA", name: "تجريبي — متوقفة", group: "أسطول جدة", speed: 0, state: "stopped", updatedAt: "14:34:21 05-07-2026", address: "العزيزية، جدة، السعودية", fuelLevel: 38, altitude: 25, engineOn: false, latitude: 21.560717, longitude: 39.208975 },
  { id: "2451 ASA", name: "تجريبي — متصلة", group: "بدون مجموعة", speed: 0, state: "online", updatedAt: "14:31:03 05-07-2026", address: "حي الملز، الرياض", fuelLevel: 81, altitude: 612, engineOn: false, latitude: 24.633, longitude: 46.716 },
];
