export interface AuthUser { name: string; email: string; role: string }
export interface LoginCredentials { email: string; password: string }

const DEMO_EMAIL = "admin@orbit.sa";
const DEMO_PASSWORD = "Orbit@2026";

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const endpoint = process.env.NEXT_PUBLIC_AUTH_ENDPOINT;
  if (endpoint) {
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

export const demoCredentials = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
