"use client";

import { ArrowLeft, CalendarPlus, Check, Star, X } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { branchById, centers, departmentById, departments, doctors, type DepartmentId, type Doctor } from "@/content/data";
import { getUI } from "@/content/ui";
import { sum, tr, type Locale } from "@/lib/i18n";
import { dateKey, freeSlots, icsFile, isDayOff, nextDays, nextFreeSlot } from "@/lib/slots";
import Avatar from "./Avatar";

type Prefill = { department?: DepartmentId; doctor?: string };

const BookingContext = createContext<(prefill?: Prefill) => void>(() => {});
export const useBooking = () => useContext(BookingContext);

/** Окно записи доступно из любого места страницы: кнопки вызывают useBooking()(prefill) */
export default function BookingProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  const [prefill, setPrefill] = useState<Prefill | null>(null);
  return (
    <BookingContext.Provider value={(p = {}) => setPrefill(p)}>
      {children}
      {prefill ? <BookingModal lang={lang} prefill={prefill} onClose={() => setPrefill(null)} /> : null}
    </BookingContext.Provider>
  );
}

export function BookButton({ prefill, className, children }: { prefill?: Prefill; className?: string; children: ReactNode }) {
  const open = useBooking();
  return (
    <button type="button" onClick={() => open(prefill)} className={className}>
      {children}
    </button>
  );
}

const ANY = "any";

function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").replace(/^998/, "").slice(0, 9);
  const parts = [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean);
  return `+998 ${parts.join(" ")}`.trimEnd();
}

function BookingModal({ lang, prefill, onClose }: { lang: Locale; prefill: Prefill; onClose: () => void }) {
  const ui = getUI(lang);
  const t = ui.booking;
  const [now] = useState(() => new Date());
  const presetDoctor = prefill.doctor ? doctors.find((d) => d.id === prefill.doctor) : undefined;

  const [step, setStep] = useState(presetDoctor ? 2 : prefill.department ? 1 : 0);
  const [department, setDepartment] = useState<DepartmentId | null>(presetDoctor?.department ?? prefill.department ?? null);
  const [doctorId, setDoctorId] = useState<string | null>(presetDoctor?.id ?? null);
  const [pickedDate, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("+998 ");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  // Escape закрывает окно, страница под окном не прокручивается
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    panel.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const deptDoctors = useMemo(() => doctors.filter((d) => d.department === department), [department]);
  const days = useMemo(() => nextDays(now, 14), [now]);

  // «Любой врач»: на каждое время — первый свободный врач отделения
  const slotsFor = (day: Date): { time: string; doctor: Doctor }[] => {
    const pool = doctorId && doctorId !== ANY ? deptDoctors.filter((d) => d.id === doctorId) : deptDoctors;
    const byTime = new Map<string, Doctor>();
    for (const doctor of pool) for (const slot of freeSlots(doctor, day, now)) if (!byTime.has(slot)) byTime.set(slot, doctor);
    return [...byTime.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([time, doctor]) => ({ time, doctor }));
  };

  // Пока день не выбран, показываем первый день со свободным временем — без пустого шага
  const date = step >= 2 ? (pickedDate ?? days.find((d) => slotsFor(d).length) ?? null) : pickedDate;

  const daySlots = date ? slotsFor(date) : [];
  const chosen = time ? daySlots.find((s) => s.time === time) : undefined;
  const doctor = chosen?.doctor ?? (doctorId && doctorId !== ANY ? doctors.find((d) => d.id === doctorId) : undefined);
  const dateLabel = (d: Date) => `${d.getDate()} ${ui.months[d.getMonth()]}`;

  const submit = () => {
    const next: typeof errors = {};
    if (name.trim().length < 2) next.name = t.errorName;
    if (phone.replace(/\D/g, "").length < 12) next.phone = t.errorPhone;
    setErrors(next);
    if (!Object.keys(next).length) setDone(true);
  };

  const downloadIcs = () => {
    if (!doctor || !date || !time) return;
    const blob = new Blob(
      [icsFile({ title: `Mehr Medical — ${tr(doctor.name, lang)}`, location: tr(branchById(doctor.branch).address, lang), date, time })],
      { type: "text/calendar" }
    );
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement("a"), { href: url, download: "mehr-medical.ics" });
    a.click();
    URL.revokeObjectURL(url);
  };

  const canNext = [Boolean(department), Boolean(doctorId), Boolean(time), true][step];

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-ink/40 backdrop-blur-[2px] sm:items-center sm:p-6" onClick={onClose}>
      <div
        ref={panel}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-title"
        onClick={(e) => e.stopPropagation()}
        className="animate-rise flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl outline-none sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            {step > 0 && !done ? (
              <button type="button" onClick={() => setStep(step - 1)} aria-label={t.back} className="rounded-full p-2 text-muted hover:bg-bg">
                <ArrowLeft className="h-5 w-5" />
              </button>
            ) : null}
            <h2 id="booking-title" className="text-lg font-bold">
              {done ? t.successTitle : t.title}
            </h2>
          </div>
          <button type="button" onClick={onClose} aria-label={ui.close} className="rounded-full p-2 text-muted hover:bg-bg">
            <X className="h-5 w-5" />
          </button>
        </div>

        {!done ? (
          <ol className="flex gap-2 px-5 pt-4 sm:px-7" aria-label={t.title}>
            {t.steps.map((label, i) => (
              <li key={label} className="flex-1">
                <span className={`block h-1.5 rounded-full ${i <= step ? "bg-brand" : "bg-line"}`} />
                <span className={`mt-1.5 hidden text-xs sm:block ${i === step ? "font-semibold text-ink" : "text-subtle"}`}>{label}</span>
              </li>
            ))}
          </ol>
        ) : null}

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          {done && doctor && date && time ? (
            <div className="flex flex-col items-center text-center">
              <span className="animate-rise flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white">
                <Check className="h-8 w-8" strokeWidth={3} />
              </span>
              <p className="mt-4 max-w-md text-sm text-muted">{t.successText}</p>
              <Summary lang={lang} doctor={doctor} date={date} time={time} dateLabel={dateLabel} />
              <div className="mt-6 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
                <button type="button" onClick={downloadIcs} className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-6 font-semibold hover:bg-bg">
                  <CalendarPlus className="h-5 w-5 text-brand" />
                  {t.addToCalendar}
                </button>
                <button type="button" onClick={onClose} className="inline-flex h-12 items-center justify-center rounded-full bg-brand px-8 font-semibold text-white hover:bg-brand-dark">
                  {t.done}
                </button>
              </div>
            </div>
          ) : step === 0 ? (
            <div>
              <p className="font-semibold">{t.chooseDepartment}</p>
              <div className="mt-4 flex flex-col gap-5">
                {centers.map((center) => (
                  <div key={center.id}>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-subtle">{tr(center.name, lang)}</p>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      {departments
                        .filter((d) => d.center === center.id)
                        .map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => {
                              setDepartment(d.id);
                              setDoctorId(null);
                              setDate(null);
                              setTime(null);
                              setStep(1);
                            }}
                            className={`rounded-2xl border px-4 py-3 text-left transition-colors hover:border-brand/60 ${
                              department === d.id ? "border-brand bg-brand-soft" : "border-line"
                            }`}
                          >
                            <span className="block font-semibold">{tr(d.name, lang)}</span>
                            <span className="mt-0.5 block text-xs text-muted">{tr(d.short, lang)}</span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : step === 1 && department ? (
            <div>
              <p className="font-semibold">
                {t.chooseDoctor} · <span className="text-brand">{tr(departmentById(department).name, lang)}</span>
              </p>
              <div className="mt-4 flex flex-col gap-2">
                {deptDoctors.length > 1 ? (
                  <ChoiceRow active={doctorId === ANY} onClick={() => { setDoctorId(ANY); setDate(null); setTime(null); setStep(2); }}>
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-2xl" aria-hidden="true">⚡</span>
                    <span className="font-semibold">{t.anyDoctor}</span>
                  </ChoiceRow>
                ) : null}
                {deptDoctors.map((d) => {
                  const slot = nextFreeSlot(d, now);
                  return (
                    <ChoiceRow key={d.id} active={doctorId === d.id} onClick={() => { setDoctorId(d.id); setDate(null); setTime(null); setStep(2); }}>
                      <Avatar id={d.id} name={tr(d.name, lang)} />
                      <span className="min-w-0 flex-1">
                        <span className="block font-semibold">{tr(d.name, lang)}</span>
                        <span className="block text-sm text-muted">{tr(d.title, lang)}</span>
                        <span className="mt-1 flex flex-wrap items-center gap-x-3 text-xs text-subtle">
                          <span className="inline-flex items-center gap-1 font-semibold text-ink">
                            <Star className="h-3.5 w-3.5 fill-sun text-sun" />
                            {d.rating.toFixed(1)}
                          </span>
                          <span>{sum(d.price)} {t.currency}</span>
                          {slot ? <span className="text-brand-dark">{dateKey(slot.date) === dateKey(now) ? ui.hero.today : dateLabel(slot.date)}, {slot.time}</span> : null}
                        </span>
                      </span>
                    </ChoiceRow>
                  );
                })}
              </div>
            </div>
          ) : step === 2 && department ? (
            <div>
              <p className="font-semibold">{t.chooseDate}</p>
              <div className="-mx-5 mt-3 flex gap-2 overflow-x-auto px-5 pb-2 sm:-mx-7 sm:px-7">
                {days.map((day) => {
                  const count = slotsFor(day).length;
                  const active = date && dateKey(day) === dateKey(date);
                  const off = deptDoctors.every((d) => isDayOff(d, day));
                  return (
                    <button
                      key={dateKey(day)}
                      type="button"
                      disabled={!count}
                      onClick={() => { setDate(day); setTime(null); }}
                      className={`flex w-16 shrink-0 flex-col items-center rounded-2xl border px-2 py-2.5 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                        active ? "border-brand bg-brand text-white" : "border-line hover:border-brand/60"
                      }`}
                    >
                      <span className={`text-xs ${active ? "text-white/80" : "text-subtle"}`}>{ui.weekdays[day.getDay()]}</span>
                      <span className="text-lg font-bold">{day.getDate()}</span>
                      <span className={`text-[10px] ${active ? "text-white/80" : "text-subtle"}`}>{off ? t.dayOff : count}</span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-5 font-semibold">{t.chooseTime}</p>
              {daySlots.length ? (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                  {daySlots.map((slot) => (
                    <button
                      key={slot.time}
                      type="button"
                      onClick={() => setTime(slot.time)}
                      className={`h-11 rounded-xl border text-sm font-semibold transition-colors ${
                        time === slot.time ? "border-brand bg-brand text-white" : "border-line hover:border-brand/60"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">{t.noSlots}</p>
              )}
            </div>
          ) : step === 3 && doctor && date && time ? (
            <div>
              <Summary lang={lang} doctor={doctor} date={date} time={time} dateLabel={dateLabel} />
              <div className="mt-5 grid gap-4">
                <Field label={t.name} error={errors.name}>
                  <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" className="input" />
                </Field>
                <Field label={t.phone} error={errors.phone}>
                  <input value={phone} onChange={(e) => setPhone(formatPhone(e.target.value))} inputMode="tel" autoComplete="tel" className="input" />
                </Field>
                <Field label={t.comment}>
                  <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={2} className="input resize-none" />
                </Field>
              </div>
            </div>
          ) : null}
        </div>

        {!done && step > 0 ? (
          <div className="border-t border-line px-5 py-4 sm:px-7">
            {step === 3 ? (
              <button type="button" onClick={submit} className="h-12 w-full rounded-full bg-brand font-semibold text-white hover:bg-brand-dark">
                {t.confirm}
              </button>
            ) : step === 2 ? (
              <button
                type="button"
                disabled={!canNext}
                onClick={() => setStep(3)}
                className="h-12 w-full rounded-full bg-brand font-semibold text-white transition-opacity hover:bg-brand-dark disabled:opacity-40"
              >
                {t.next}
                {chosen ? ` · ${dateLabel(date!)}, ${time}` : ""}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ChoiceRow({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-4 rounded-2xl border p-3 text-left transition-colors hover:border-brand/60 ${active ? "border-brand bg-brand-soft" : "border-line"}`}
    >
      {children}
    </button>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5 text-sm font-medium">
      {label}
      {children}
      {error ? <span className="text-xs font-normal text-coral">{error}</span> : null}
    </label>
  );
}

function Summary({ lang, doctor, date, time, dateLabel }: { lang: Locale; doctor: Doctor; date: Date; time: string; dateLabel: (d: Date) => string }) {
  const t = getUI(lang).booking;
  const rows = [
    [t.summary.doctor, `${tr(doctor.name, lang)} · ${tr(doctor.title, lang)}`],
    [t.summary.when, `${dateLabel(date)}, ${time}`],
    [t.summary.where, tr(branchById(doctor.branch).address, lang)],
    [t.summary.price, `${sum(doctor.price)} ${t.currency}`],
  ];
  return (
    <dl className="mt-5 w-full rounded-2xl bg-bg p-4 text-left text-sm">
      {rows.map(([k, v]) => (
        <div key={k} className="flex justify-between gap-4 py-1.5">
          <dt className="text-muted">{k}</dt>
          <dd className="text-right font-semibold">{v}</dd>
        </div>
      ))}
    </dl>
  );
}
