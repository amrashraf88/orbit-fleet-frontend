import type { Metadata } from "next";
import "./globals.css";
import "./orbit-overrides.css";
import "./pro-system.css";

export const metadata: Metadata = {
  title: "إنجاز | إدارة الأسطول",
  description: "منصة متكاملة لمراقبة وإدارة الأسطول والمركبات والمهام.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "إنجاز | إدارة الأسطول",
    description: "إدارة الأسطول بوضوح كامل",
    type: "website",
    locale: "ar_SA",
    images: [{ url: "/og.png", width: 1680, height: 938 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "إنجاز | إدارة الأسطول",
    description: "إدارة الأسطول بوضوح كامل",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ar" dir="rtl"><body>{children}</body></html>;
}
