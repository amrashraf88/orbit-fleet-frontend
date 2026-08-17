"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowLeft, CheckCircle, Eye, EyeSlash, GlobeHemisphereWest, LockKey,
  ShieldCheck, Sparkle, User, WarningCircle,
} from "@phosphor-icons/react";
import { demoCredentials, login, type AuthUser } from "@/src/services/auth-service";
import "./login.css";

export function LoginPage({ onSuccess }: { onSuccess: (user: AuthUser, remember: boolean) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setError(""); setLoading(true);
    try { onSuccess(await login({email,password}), remember); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "تعذر تسجيل الدخول"); }
    finally { setLoading(false); }
  };

  const fillDemo = () => { setEmail(demoCredentials.email); setPassword(demoCredentials.password); setError(""); };

  return <main className="login-page" dir="rtl">
    <section className="login-showcase">
      <div className="login-brand"><div className="login-logo"><GlobeHemisphereWest weight="duotone"/><Sparkle weight="fill"/></div><div><b>ORBIT</b><span>FLEET INTELLIGENCE</span></div></div>
      <div className="showcase-copy"><span className="showcase-eyebrow"><i/> منصة إدارة الأسطول الذكية</span><h1>كل مركبة.<br/>كل قرار.<br/><em>في مكان واحد.</em></h1><p>راقب أسطولك لحظيًا، ارفع كفاءة التشغيل، واتخذ قرارات أسرع من لوحة تحكم موحدة.</p></div>
      <div className="login-features"><div><span><CheckCircle weight="fill"/></span><div><b>تتبّع لحظي</b><small>مواقع وحالات المركبات مباشرة</small></div></div><div><span><ShieldCheck weight="duotone"/></span><div><b>بيانات آمنة</b><small>جلسات محمية وصلاحيات دقيقة</small></div></div></div>
      <div className="showcase-orbit orbit-one"/><div className="showcase-orbit orbit-two"/><div className="showcase-grid"/>
    </section>

    <section className="login-panel">
      <div className="login-box">
        <header><span>مرحبًا بعودتك</span><h2>تسجيل الدخول</h2><p>أدخل بيانات حسابك للوصول إلى مركز العمليات.</p></header>
        <form onSubmit={submit} noValidate>
          <label><span>البريد الإلكتروني</span><div className="login-input"><User weight="duotone"/><input type="email" dir="ltr" autoComplete="email" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} required/></div></label>
          <label><span>كلمة المرور</span><div className="login-input"><LockKey weight="duotone"/><input type={showPassword ? "text" : "password"} dir="ltr" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(event) => setPassword(event.target.value)} minLength={6} required/><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}>{showPassword ? <EyeSlash/> : <Eye/>}</button></div></label>
          <div className="login-options"><label className="remember-check"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)}/><i><CheckCircle weight="fill"/></i><span>تذكرني</span></label><button type="button" className="forgot-button" onClick={() => setError("سيتم ربط استعادة كلمة المرور مع API المصادقة")}>نسيت كلمة المرور؟</button></div>
          {error && <div className="login-error" role="alert"><WarningCircle weight="fill"/><span>{error}</span></div>}
          <button className="login-submit" disabled={loading || !email || password.length < 6}>{loading ? <><i className="login-spinner"/>جارٍ التحقق...</> : <>دخول إلى المنصة <ArrowLeft weight="bold"/></>}</button>
        </form>
        <button className="demo-access" onClick={fillDemo}><Sparkle weight="duotone"/><span><b>بيانات الدخول التجريبية</b><small>{demoCredentials.email} · {demoCredentials.password}</small></span><ArrowLeft/></button>
        <footer><ShieldCheck weight="duotone"/> اتصال آمن ومشفّر</footer>
      </div>
    </section>
  </main>;
}
