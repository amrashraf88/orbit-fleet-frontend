export class ApiError extends Error {
  constructor(message: string, public status: number, public details?: unknown) {
    super(message);
    this.name = "ApiError";
  }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

export async function apiClient<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Accept: "application/json", ...init.headers },
    credentials: "include",
  });

  if (!response.ok) {
    let details: unknown;
    try { details = await response.json(); } catch { details = undefined; }
    throw new ApiError("تعذر إتمام الطلب", response.status, details);
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}
