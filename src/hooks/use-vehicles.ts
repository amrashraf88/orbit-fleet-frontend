import { useCallback, useEffect, useState } from "react";
import { vehiclesService } from "@/src/services/vehicles.service";
import type { Vehicle } from "@/src/types/vehicle";

export function useVehicles(search = "") {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setVehicles(await vehiclesService.list(search)); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "حدث خطأ غير متوقع"); }
    finally { setIsLoading(false); }
  }, [search]);

  useEffect(() => {
    const requestTimer = window.setTimeout(() => { void load(); }, 150);
    return () => window.clearTimeout(requestTimer);
  }, [load]);
  return { vehicles, isLoading, error, retry: load };
}
