export interface AuthUser { name: string; email: string; role: string }
export interface LoginCredentials { email: string; password: string }

const DEMO_EMAIL = "admin@orbit.sa";
const DEMO_PASSWORD = "Orbit@2026";

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  const endpoint = process.env.NEXT_PUBLIC_AUTH_ENDPOINT ?? (apiUrl ? `${apiUrl}/auth/login` : undefined);
  const useMock = process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";
  if (endpoint && !useMock) {
    const response = await fetch(endpoint, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error(response.status === 401 ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : "تعذر تسجيل الدخول، حاول مرة أخرى");
    const payload = await response.json() as { user: AuthUser };
    return payload.user;
  }

  await new Promise((resolve) => window.setTimeout(resolve, 650));
  if (credentials.email.toLowerCase() !== DEMO_EMAIL || credentials.password !== DEMO_PASSWORD) throw new Error("استخدم بيانات الدخول التجريبية الموضحة بالأسفل");
  return { name: "مدير الأسطول", email: DEMO_EMAIL, role: "مشرف النظام" };
}

export async function currentUser(): Promise<AuthUser | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!apiUrl || process.env.NEXT_PUBLIC_USE_MOCK_API !== "false") return null;
  const response = await fetch(`${apiUrl}/auth/me`, { credentials: "include", headers: { Accept: "application/json" } });
  if (response.status === 401) return null;
  if (!response.ok) throw new Error("تعذر التحقق من جلسة المستخدم");
  return response.json() as Promise<AuthUser>;
}

export async function logout(): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "");
  if (!apiUrl || process.env.NEXT_PUBLIC_USE_MOCK_API !== "false") return;
  await fetch(`${apiUrl}/auth/logout`, { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: "{}" });
}

export const demoCredentials = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
