"use client";

import { ArrowRight, Building2, MapPin } from "lucide-react";
import { useState } from "react";
import { branches, centers, departments, doctors, type BranchId, type DepartmentId } from "@/content/data";
import { getUI } from "@/content/ui";
import { tr, type Locale } from "@/lib/i18n";
import Avatar from "./Avatar";
import { BookButton } from "./Booking";

// Цвет центра — чтобы на схеме здания было видно, к какому центру относится отделение
const centerColor = {
  adult: "bg-brand",
  kids: "bg-sun",
  diagnostics: "bg-coral",
  surgery: "bg-ink",
} as const;

/** Показать врачей отделения в блоке «Врачи» (Doctors слушает это событие) */
export const showDoctorsOf = (department: DepartmentId) => {
  window.dispatchEvent(new CustomEvent("clinic:doctors", { detail: department }));
  document.getElementById("doctors")?.scrollIntoView();
};

export default function Structure({ lang }: { lang: Locale }) {
  const ui = getUI(lang);
  const t = ui.structure;
  const [branchId, setBranchId] = useState<BranchId>("yunusabad");
  const branch = branches.find((b) => b.id === branchId)!;
  const inBranch = departments.filter((d) => d.location.branch === branchId);
  const [selected, setSelected] = useState<DepartmentId>(inBranch[0].id);
  const dept = departments.find((d) => d.id === selected)!;
  const deptDoctors = doctors.filter((d) => d.department === dept.id);
  const floors = Array.from({ length: branch.floors }, (_, i) => branch.floors - i);

  const chooseBranch = (id: BranchId) => {
    setBranchId(id);
    setSelected(departments.find((d) => d.location.branch === id)!.id);
  };

  return (
    <section id="structure" aria-labelledby="structure-title" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{t.eyebrow}</p>
        <h2 id="structure-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.title}</h2>
        <p className="mt-3 max-w-2xl text-muted">{t.subtitle}</p>

        <div role="tablist" aria-label={ui.nav.branches} className="mt-8 flex gap-2 overflow-x-auto pb-1">
          {branches.map((b) => (
            <button
              key={b.id}
              role="tab"
              aria-selected={b.id === branchId}
              onClick={() => chooseBranch(b.id)}
              className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors ${
                b.id === branchId ? "border-ink bg-ink text-white" : "border-line bg-surface hover:border-ink/30"
              }`}
            >
              <MapPin className="h-4 w-4" />
              {tr(b.name, lang)}
            </button>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          {/* Здание в разрезе: верхний этаж сверху */}
          <div className="panel overflow-hidden p-4 sm:p-6">
            <div aria-hidden="true" className="mx-auto mb-1 flex h-10 w-2/3 items-end justify-center rounded-t-[2rem] bg-gradient-to-b from-brand-soft to-transparent">
              <Building2 className="mb-1 h-6 w-6 text-brand" />
            </div>
            <ol className="flex flex-col gap-2">
              {floors.map((floor) => {
                const here = inBranch.filter((d) => d.location.floor === floor);
                return (
                  <li key={floor} className="flex items-stretch gap-3 rounded-2xl border border-line bg-bg/60 p-2.5">
                    <span className="flex w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-surface text-center">
                      <span className="text-lg leading-none font-extrabold">{floor}</span>
                      <span className="text-[10px] text-subtle">{t.floor}</span>
                    </span>
                    <div className="flex flex-1 flex-wrap items-center gap-2">
                      {floor === 1 ? (
                        <span className="rounded-xl border border-dashed border-line px-3 py-2 text-xs text-muted">{t.reception}</span>
                      ) : null}
                      {here.length ? (
                        here.map((d) => (
                          <button
                            key={d.id}
                            type="button"
                            onClick={() => setSelected(d.id)}
                            aria-pressed={d.id === selected}
                            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-all ${
                              d.id === selected ? "bg-ink text-white shadow-lg" : "bg-surface hover:-translate-y-0.5 hover:shadow-md"
                            }`}
                          >
                            <span className={`h-2.5 w-2.5 rounded-full ${centerColor[d.center]}`} />
                            {tr(d.name, lang)}
                          </button>
                        ))
                      ) : floor !== 1 ? (
                        <span className="px-1 text-xs text-subtle">{t.admin}</span>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
            <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted" aria-label={t.centers}>
              {centers.map((c) => (
                <li key={c.id} className="inline-flex items-center gap-1.5">
                  <span className={`h-2.5 w-2.5 rounded-full ${centerColor[c.id]}`} />
                  {tr(c.name, lang)}
                </li>
              ))}
            </ul>
          </div>

          {/* Карточка выбранного отделения */}
          <div key={dept.id} className="panel animate-rise flex flex-col p-6 sm:p-8">
            <p className="text-sm font-semibold text-brand">
              {tr(centers.find((c) => c.id === dept.center)!.name, lang)} · {dept.location.floor} {t.floor}
            </p>
            <h3 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{tr(dept.name, lang)}</h3>
            <p className="mt-2 text-muted">{tr(dept.short, lang)}</p>

            <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-subtle">{t.services}</p>
            <ul className="mt-3 flex flex-col gap-2">
              {dept.services.map((s) => (
                <li key={s.ru} className="flex items-center gap-2.5 text-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                  {tr(s, lang)}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex items-center gap-3">
              <div className="flex -space-x-3">
                {deptDoctors.map((d) => (
                  <span key={d.id} className="rounded-2xl ring-4 ring-surface">
                    <Avatar id={d.id} name={tr(d.name, lang)} size="sm" />
                  </span>
                ))}
              </div>
              <span className="text-sm text-muted">
                {deptDoctors.length} {t.doctors}
              </span>
            </div>

            <div className="mt-auto flex flex-col gap-2 pt-8 sm:flex-row">
              <BookButton prefill={{ department: dept.id }} className="h-12 flex-1 rounded-full bg-brand px-6 font-semibold text-white transition-colors hover:bg-brand-dark">
                {ui.book}
              </BookButton>
              <button
                type="button"
                onClick={() => showDoctorsOf(dept.id)}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full border border-line px-6 font-semibold transition-colors hover:bg-bg"
              >
                {t.showDoctors}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
