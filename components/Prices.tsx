"use client";

import { Search } from "lucide-react";
import { useState } from "react";
import { departments, priceList, type DepartmentId } from "@/content/data";
import { getUI } from "@/content/ui";
import { sum, tr, type Locale } from "@/lib/i18n";
import { BookButton } from "./Booking";

export default function Prices({ lang }: { lang: Locale }) {
  const ui = getUI(lang);
  const t = ui.prices;
  const [query, setQuery] = useState("");
  const [department, setDepartment] = useState<DepartmentId | "all">("all");
  const [expanded, setExpanded] = useState(false);
  const q = query.trim().toLowerCase();
  const rows = priceList.filter(
    (p) => (department === "all" || p.department === department) && (!q || tr(p.name, lang).toLowerCase().includes(q))
  );
  const collapsed = !expanded && !q && department === "all" && rows.length > 10;
  // отделения, у которых есть услуги в прайсе — в том же порядке, что и в структуре
  const withPrices = departments.filter((d) => priceList.some((p) => p.department === d.id));

  return (
    <section id="prices" aria-labelledby="prices-title" className="py-16 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{t.eyebrow}</p>
          <h2 id="prices-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.title}</h2>
          <p className="mt-3 text-muted">{t.subtitle}</p>
          <label className="relative mt-6 block">
            <span className="sr-only">{t.search}</span>
            <Search className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-subtle" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t.search} className="input h-12 pl-12" />
          </label>
          <label className="mt-3 block">
            <span className="sr-only">{t.all}</span>
            <select value={department} onChange={(e) => setDepartment(e.target.value as DepartmentId | "all")} className="input h-12 cursor-pointer">
              <option value="all">{t.all}</option>
              {withPrices.map((d) => (
                <option key={d.id} value={d.id}>
                  {tr(d.name, lang)}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="panel overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-bg text-xs uppercase tracking-wider text-subtle">
              <tr>
                <th scope="col" className="px-5 py-3 font-bold">{t.service}</th>
                <th scope="col" className="px-5 py-3 text-right font-bold">{t.price}</th>
                <th scope="col" className="hidden w-0 px-3 py-3 sm:table-cell"><span className="sr-only">{ui.book}</span></th>
              </tr>
            </thead>
            <tbody>
              {(collapsed ? rows.slice(0, 10) : rows).map((p) => (
                <tr key={p.name.ru} className="border-t border-line transition-colors hover:bg-brand-soft/50">
                  <td className="px-5 py-3.5">
                    <BookButton prefill={{ department: p.department }} className="text-left font-medium transition-colors hover:text-brand-dark">
                      {tr(p.name, lang)}
                    </BookButton>
                    <span className="block text-xs text-subtle">{tr(departments.find((d) => d.id === p.department)!.name, lang)}</span>
                  </td>
                  <td className="px-5 py-3.5 text-right font-bold whitespace-nowrap">
                    {sum(p.price)} <span className="font-normal text-subtle">{t.currency}</span>
                  </td>
                  <td className="hidden px-3 py-3.5 sm:table-cell">
                    <BookButton prefill={{ department: p.department }} className="rounded-full bg-brand-soft px-3 py-1.5 text-xs font-bold whitespace-nowrap text-brand-dark transition-colors hover:bg-brand hover:text-white">
                      {ui.bookShort}
                    </BookButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length ? <p className="p-8 text-center text-muted">{t.empty}</p> : null}
          {collapsed ? (
            <button type="button" onClick={() => setExpanded(true)} className="w-full border-t border-line py-4 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand-soft">
              {t.showAll} · {rows.length}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
