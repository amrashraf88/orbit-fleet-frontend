import type { EntityStore } from "@/src/types/entity";

const rows = (prefix: string, details: string[]) => details.map((detail, index) => ({ id: `${prefix}-${index + 1}`, name: detail.split("|")[0], details: detail.split("|")[1] ?? "—", updatedAt: index === 0 ? "الآن" : `منذ ${index + 1} ساعات`, status: index === 2 ? "attention" as const : "active" as const }));
export const initialEntityData: EntityStore = {
  home: rows("DASH", ["ملخص الأسطول|24 مركبة", "حالة التشغيل|18 نشطة", "مؤشرات الأداء|92% كفاءة"]),
  live: [],
  vehicles: rows("VEH", ["2414 ASA|أسطول الرياض", "2447 ASA|أسطول الرياض 2", "7926 BXA|أسطول جدة"]),
  drivers: rows("DRV", ["خالد محمد|رخصة سارية", "سلمان أحمد|متاح الآن", "عبدالله سالم|يحتاج مراجعة"]),
  tasks: rows("TSK", ["توصيل شحنة الرياض|قيد التنفيذ", "فحص مركبة 2447|مجدولة", "استلام من المستودع|متأخرة"]),
  history: rows("TRP", ["الرياض ← الخرج|82 كم", "الملز ← العليا|18 كم", "جدة ← مكة|91 كم"]),
  geofences: rows("GEO", ["مستودع الرياض|دائرة 2 كم", "فرع جدة|مضلع 6 نقاط", "منطقة محظورة|دائرة 500 م"]),
  alerts: rows("ALT", ["تجاوز سرعة|المركبة 2414", "خروج من النطاق|المركبة 7926", "صيانة مستحقة|المركبة 2447"]),
  cameras: rows("CAM", ["كاميرا 2414 الأمامية|متصلة", "كاميرا 2447 الداخلية|متصلة", "كاميرا 7926 الخلفية|غير متصلة"]),
  maintenance: rows("MNT", ["تغيير زيت 2414|مكتمل", "فحص دوري 2447|غدًا", "إطارات 7926|متأخر"]),
  fuel: rows("FUL", ["تعبئة 2414|42 لتر", "تعبئة 2447|35 لتر", "استهلاك غير طبيعي|7926 BXA"]),
  reports: rows("RPT", ["تقرير التشغيل اليومي|PDF", "تقرير الوقود الشهري|Excel", "تقرير المخالفات|PDF"]),
};
