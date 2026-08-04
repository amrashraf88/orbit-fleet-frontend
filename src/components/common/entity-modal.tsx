import { useState } from "react";
import { FloppyDisk, X } from "@phosphor-icons/react";
import type { EntityRecord } from "@/src/types/entity";

interface Props { title: string; record?: EntityRecord; onClose: () => void; onSave: (record: EntityRecord) => void }
export function EntityModal({ title, record, onClose, onSave }: Props) {
  const [form, setForm] = useState<EntityRecord>(record ?? { id: "", name: "", details: "", updatedAt: "الآن", status: "active", notes: "" });
  const update = (key: keyof EntityRecord, value: string) => setForm((current) => ({ ...current, [key]: value }));
  return <div className="modal-backdrop" role="presentation" onMouseDown={(e) => e.target === e.currentTarget && onClose()}><section className="entity-modal glass" role="dialog" aria-modal="true"><header><div><small>{record ? "تعديل البيانات" : "سجل جديد"}</small><h2>{title}</h2></div><button onClick={onClose} aria-label="إغلاق"><X /></button></header><div className="form-grid"><label><span>الاسم</span><input autoFocus value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="اكتب الاسم" /></label><label><span>التفاصيل</span><input value={form.details} onChange={(e) => update("details", e.target.value)} placeholder="اكتب التفاصيل" /></label><label><span>الحالة</span><select value={form.status} onChange={(e) => update("status", e.target.value)}><option value="active">نشط</option><option value="attention">يحتاج انتباه</option><option value="inactive">غير نشط</option></select></label><label className="full"><span>ملاحظات</span><textarea value={form.notes} onChange={(e) => update("notes", e.target.value)} placeholder="ملاحظات إضافية" /></label></div><footer><button onClick={onClose}>إلغاء</button><button className="save-button" disabled={!form.name.trim()} onClick={() => onSave({ ...form, id: form.id || crypto.randomUUID(), name: form.name.trim(), details: form.details.trim() || "—" })}><FloppyDisk /> حفظ البيانات</button></footer></section></div>;
}
