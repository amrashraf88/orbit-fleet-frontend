"use client";

import {
  ArrowDownLeft, ArrowUpLeft, Bell, CarProfile, ChartLineUp, Clock,
  Engine, GasPump, RoadHorizon, ShieldCheck, Speedometer, TrendUp,
} from "@phosphor-icons/react";
import { useVehicles } from "@/src/hooks/use-vehicles";
import "./analytics.css";

const distanceBars = [42,55,48,69,63,82,76,91,68,86,94,78];
const fuelBars = [78,71,74,66,62,69,58,55,61,52,48,57];
const weeklyActivity = [
  {day:"السبت", moving:68, idle:25}, {day:"الأحد", moving:82, idle:31},
  {day:"الإثنين", moving:73, idle:22}, {day:"الثلاثاء", moving:91, idle:36},
  {day:"الأربعاء", moving:84, idle:29}, {day:"الخميس", moving:96, idle:42},
  {day:"الجمعة", moving:56, idle:18},
];

export function AnalyticsPage() {
  const { vehicles, isLoading, error, retry } = useVehicles("");
  const moving = vehicles.filter((v) => v.state === "moving").length;
  const idle = vehicles.filter((v) => v.state === "idle").length;
  const stopped = vehicles.filter((v) => v.state === "stopped").length;
  const online = vehicles.filter((v) => v.state === "online").length;
  const avgFuel = vehicles.length ? Math.round(vehicles.reduce((sum,v) => sum + (v.fuelLevel ?? 0),0) / vehicles.length) : 0;
  const avgSpeed = vehicles.length ? Math.round(vehicles.reduce((sum,v) => sum + v.speed,0) / vehicles.length) : 0;
  const total = vehicles.length || 1;

  if (isLoading) return <div className="analytics-page"><div className="analytics-loading glass">جارٍ تجهيز تحليلات الأسطول...</div></div>;
  if (error) return <div className="analytics-page"><div className="analytics-loading glass"><span>{error}</span><button onClick={retry}>إعادة المحاولة</button></div></div>;

  return <div className="analytics-page">
    <header className="analytics-heading">
      <div><span>مركز ذكاء الأسطول</span><h1>لوحة التحليلات</h1><p>نظرة لحظية على أداء المركبات وكفاءة التشغيل اليوم.</p></div>
      <div className="live-data"><i/> بيانات مباشرة <small>آخر تحديث الآن</small></div>
    </header>

    <section className="analytics-kpis">
      <Kpi icon={CarProfile} label="إجمالي المركبات" value={vehicles.length} delta="12%" positive hint={`${moving + online} متصلة الآن`}/>
      <Kpi icon={RoadHorizon} label="المسافة اليوم" value="1,248" suffix="كم" delta="8.4%" positive hint="مقارنة بالأمس"/>
      <Kpi icon={Speedometer} label="متوسط السرعة" value={avgSpeed} suffix="كم/س" delta="3.1%" positive hint="أثناء الحركة"/>
      <Kpi icon={GasPump} label="متوسط الوقود" value={avgFuel} suffix="%" delta="5.2%" hint="استهلاك اليوم"/>
    </section>

    <section className="analytics-grid">
      <article className="analytics-card fleet-status">
        <CardHeader icon={ChartLineUp} title="حالة الأسطول" caption="التوزيع الحالي للمركبات"/>
        <div className="status-content">
          <div className="status-donut" style={{background:`conic-gradient(#33d397 0 ${moving/total*100}%,#ffc743 0 ${(moving+idle)/total*100}%,#fb638b 0 ${(moving+idle+stopped)/total*100}%,#399ccc 0)`}}><div><b>{vehicles.length}</b><span>مركبة</span></div></div>
          <div className="status-legend"><Legend color="#33d397" label="متحركة" value={moving}/><Legend color="#ffc743" label="خاملة" value={idle}/><Legend color="#fb638b" label="متوقفة" value={stopped}/><Legend color="#399ccc" label="متصلة" value={online}/></div>
        </div>
      </article>

      <article className="analytics-card activity-chart">
        <CardHeader icon={TrendUp} title="نشاط المركبات" caption="ساعات التشغيل خلال الأسبوع"/>
        <div className="chart-legend"><span><i className="moving-dot"/> حركة</span><span><i className="idle-dot"/> خمول</span></div>
        <div className="bar-chart">{weeklyActivity.map((item) => <div className="bar-column" key={item.day}><div className="bars"><i className="bar-idle" style={{height:`${item.idle}%`}}/><i className="bar-moving" style={{height:`${item.moving}%`}}/></div><span>{item.day}</span></div>)}</div>
      </article>

      <article className="analytics-card efficiency-card">
        <CardHeader icon={ShieldCheck} title="كفاءة التشغيل" caption="مؤشرات الأداء الرئيسية"/>
        <Efficiency label="جاهزية الأسطول" value={92} color="#32d59a"/><Efficiency label="كفاءة استهلاك الوقود" value={78} color="#28e1da"/><Efficiency label="الالتزام بالصيانة" value={86} color="#6c8cff"/><Efficiency label="سلامة القيادة" value={74} color="#ffc743"/>
      </article>

      <article className="analytics-card trend-card">
        <CardHeader icon={RoadHorizon} title="المسافة والاستهلاك" caption="آخر 12 ساعة"/>
        <div className="trend-totals"><div><span>إجمالي المسافة</span><b>1,248 <small>كم</small></b></div><div><span>الوقود المستهلك</span><b>186 <small>لتر</small></b></div></div>
        <div className="spark-chart">{distanceBars.map((height,index) => <i key={index} style={{height:`${height}%`}}><em style={{height:`${fuelBars[index]}%`}}/></i>)}</div>
      </article>

      <article className="analytics-card alerts-card">
        <CardHeader icon={Bell} title="التنبيهات الأخيرة" caption="تحتاج إلى مراجعتك" action="عرض الكل"/>
        <Alert icon={Speedometer} color="pink" title="تجاوز السرعة المحددة" meta="تجريبي — متحرك · طريق الملك فهد" time="منذ 4 دقائق"/>
        <Alert icon={GasPump} color="yellow" title="انخفاض مستوى الوقود" meta="تجريبي — متوقفة · 18% متبقي" time="منذ 18 دقيقة"/>
        <Alert icon={Engine} color="cyan" title="موعد صيانة قريب" meta="2447 ASA · متبقي 420 كم" time="منذ ساعة"/>
      </article>

      <article className="analytics-card vehicles-performance">
        <CardHeader icon={CarProfile} title="أداء المركبات" caption="الأعلى نشاطًا اليوم" action="كل المركبات"/>
        <div className="performance-head"><span>المركبة</span><span>المسافة</span><span>السرعة</span><span>الوقود</span></div>
        {vehicles.slice(0,4).map((vehicle) => <div className="performance-row" key={vehicle.id}><div><i className={`vehicle-state ${vehicle.state}`}/><span><b>{vehicle.name}</b><small>{vehicle.plateNumber ?? vehicle.id}</small></span></div><strong>{vehicle.speed ? vehicle.speed * 8 : 24} كم</strong><strong>{vehicle.speed} كم/س</strong><div className="mini-progress"><i style={{width:`${vehicle.fuelLevel ?? 0}%`}}/><span>{vehicle.fuelLevel ?? 0}%</span></div></div>)}
      </article>
    </section>
  </div>;
}

function Kpi({icon:Icon,label,value,suffix,delta,positive,hint}:{icon:typeof CarProfile;label:string;value:string|number;suffix?:string;delta:string;positive?:boolean;hint:string}) { return <article className="analytics-kpi"><div className="kpi-icon"><Icon size={22} weight="duotone"/></div><div className="kpi-title"><span>{label}</span><b>{value} <small>{suffix}</small></b></div><div className={`kpi-delta ${positive ? "positive" : "negative"}`}>{positive ? <ArrowUpLeft/> : <ArrowDownLeft/>}{delta}</div><p>{hint}</p></article>; }
function CardHeader({icon:Icon,title,caption,action}:{icon:typeof CarProfile;title:string;caption:string;action?:string}) { return <header className="analytics-card-head"><div className="card-head-icon"><Icon size={18}/></div><div><h2>{title}</h2><p>{caption}</p></div>{action && <button>{action}</button>}</header>; }
function Legend({color,label,value}:{color:string;label:string;value:number}) { return <div><i style={{background:color}}/><span>{label}</span><b>{value}</b></div>; }
function Efficiency({label,value,color}:{label:string;value:number;color:string}) { return <div className="efficiency-row"><div><span>{label}</span><b>{value}%</b></div><div><i style={{width:`${value}%`,background:color}}/></div></div>; }
function Alert({icon:Icon,color,title,meta,time}:{icon:typeof CarProfile;color:string;title:string;meta:string;time:string}) { return <div className="alert-row"><div className={`alert-icon ${color}`}><Icon size={17}/></div><div><b>{title}</b><span>{meta}</span></div><time><Clock size={12}/>{time}</time></div>; }
