"use client";

import { Clock, Search, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { branchById, departments, doctors, type DepartmentId, type Lang } from "@/content/data";
import { getUI } from "@/content/ui";
import { sum, tr, type Locale } from "@/lib/i18n";
import { dateKey, nextFreeSlot } from "@/lib/slots";
import Avatar from "./Avatar";
import { BookButton } from "./Booking";

export default function Doctors({ lang }: { lang: Locale }) {
  const ui = getUI(lang);
  const t = ui.doctors;
  const [department, setDepartment] = useState<DepartmentId | "all">("all");
  const [language, setLanguage] = useState<Lang | "all">("all");
  const [query, setQuery] = useState("");
  const [now, setNow] = useState<Date | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(new Date());
    // «Врачи отделения» из блока «Структура»
    const onShow = (e: Event) => setDepartment((e as CustomEvent<DepartmentId>).detail);
    window.addEventListener("clinic:doctors", onShow);
    return () => window.removeEventListener("clinic:doctors", onShow);
  }, []);

  const q = query.trim().toLowerCase();
  const list = doctors.filter(
    (d) =>
      (department === "all" || d.department === department) &&
      (language === "all" || d.languages.includes(language)) &&
      (!q || tr(d.name, lang).toLowerCase().includes(q))
  );

  return (
    <section id="doctors" aria-labelledby="doctors-title" className="bg-surface py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{t.eyebrow}</p>
            <h2 id="doctors-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.title}</h2>
            <p className="mt-3 max-w-2xl text-muted">{t.subtitle}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative">
              <span className="sr-only">{t.search}</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-subtle" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} className="input h-11 rounded-full pl-10 sm:w-56" />
            </label>
            <div role="group" aria-label={t.language} className="flex rounded-full border border-line p-0.5 text-sm font-semibold">
              {(["all", "uz", "ru", "en"] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  aria-pressed={language === l}
                  onClick={() => setLanguage(l)}
                  className={`h-10 rounded-full px-3.5 ${language === l ? "bg-ink text-white" : "text-muted hover:text-ink"}`}
                >
                  {l === "all" ? t.all : t.langs[l]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
          {[{ id: "all" as const, label: t.all }, ...departments.map((d) => ({ id: d.id, label: tr(d.name, lang) }))].map((chip) => (
            <button
              key={chip.id}
              type="button"
              aria-pressed={department === chip.id}
              onClick={() => setDepartment(chip.id)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                department === chip.id ? "border-brand bg-brand text-white" : "border-line hover:border-brand/50"
              }`}
            >
              {chip.label}
            </button>
          ))}
        </div>

        {list.length ? (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(expanded ? list : list.slice(0, 8)).map((d) => {
              const slot = now ? nextFreeSlot(d, now) : null;
              return (
                <li key={d.id} className="panel flex flex-col p-5 transition-shadow hover:shadow-xl">
                  <div className="flex items-start gap-4">
                    <Avatar id={d.id} name={tr(d.name, lang)} size="lg" />
                    <div className="min-w-0">
                      <p className="flex items-center gap-1 text-sm font-bold">
                        <Star className="h-4 w-4 fill-sun text-sun" />
                        {d.rating.toFixed(1)}
                      </p>
                      <p className="mt-1 text-xs text-muted">
                        {d.experience} {t.years}
                      </p>
                      <p className="mt-1 flex gap-1">
                        {d.languages.map((l) => (
                          <span key={l} className="rounded-md bg-bg px-1.5 py-0.5 text-[10px] font-bold text-muted">
                            {t.langs[l]}
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                  <h3 className="mt-4 font-bold">{tr(d.name, lang)}</h3>
                  <p className="text-sm text-muted">{tr(d.title, lang)}</p>
                  <p className="mt-1 text-xs text-subtle">{tr(branchById(d.branch).name, lang)}</p>
                  <div className="mt-4 flex items-center justify-between gap-2 rounded-xl bg-brand-soft px-3 py-2 text-xs">
                    <span className="inline-flex items-center gap-1.5 text-brand-dark">
                      <Clock className="h-3.5 w-3.5" />
                      {slot && now ? `${dateKey(slot.date) === dateKey(now) ? ui.hero.today : `${slot.date.getDate()} ${ui.months[slot.date.getMonth()]}`}, ${slot.time}` : "…"}
                    </span>
                    <span className="font-bold">
                      {t.from} {sum(d.price)}
                    </span>
                  </div>
                  <BookButton prefill={{ doctor: d.id }} className="mt-4 h-11 rounded-full bg-ink font-semibold text-white transition-colors hover:bg-brand">
                    {ui.book}
                  </BookButton>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="mt-10 rounded-2xl border border-dashed border-line p-8 text-center text-muted">{t.empty}</p>
        )}
        {!expanded && list.length > 8 ? (
          <div className="mt-8 text-center">
            <button type="button" onClick={() => setExpanded(true)} className="h-12 rounded-full border border-line px-8 font-semibold transition-colors hover:bg-bg">
              {t.showAll} · {list.length}
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
