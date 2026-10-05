"use client";

import { CalendarCheck, FlaskConical, HeartPulse, Home, Search, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { departmentById, doctors, priceList } from "@/content/data";
import { getUI } from "@/content/ui";
import { sum, tr, type Locale } from "@/lib/i18n";
import { dateKey, earliestSlots, freeSlots, nextDays } from "@/lib/slots";
import Avatar from "./Avatar";
import { BookButton, useBooking } from "./Booking";

const quickIcons = { book: CalendarCheck, lab: FlaskConical, checkup: HeartPulse, home: Home } as const;

export default function Hero({ lang }: { lang: Locale }) {
  const ui = getUI(lang);
  const t = ui.hero;
  const book = useBooking();
  // Сколько окон свободно сегодня (или завтра, если сегодня уже поздно) — считается в браузере
  const [badge, setBadge] = useState<string | null>(null);
  useEffect(() => {
    const now = new Date();
    const [today, tomorrow] = nextDays(now, 2);
    const count = (day: Date) => doctors.reduce((n, d) => n + freeSlots(d, day, now).length, 0);
    const n = count(today);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBadge(n >= 5 ? t.badgeToday.replace("{n}", String(n)) : t.badgeTomorrow.replace("{n}", String(count(tomorrow))));
  }, [t]);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="bg-cross absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div aria-hidden="true" className="absolute -top-32 right-0 h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,rgb(14_159_110/0.18),transparent)]" />
      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 pt-10 pb-16 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-10 lg:px-8 lg:pt-16 lg:pb-24">
        <div className="animate-rise">
          <p className="inline-flex min-h-8 items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-sm font-semibold text-brand-dark">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative h-2 w-2 rounded-full bg-brand" />
            </span>
            {badge ?? "…"}
          </p>
          <h1 className="mt-5 text-4xl leading-[1.05] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {t.title} <span className="text-brand">{t.titleAccent}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{t.subtitle}</p>

          <SearchBox lang={lang} />

          <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {t.quick.map((q) => {
              const Icon = quickIcons[q.id as keyof typeof quickIcons];
              const action = () => {
                if (q.id === "lab") book({ department: "lab" });
                else if (q.id === "checkup") document.getElementById("checkups")?.scrollIntoView();
                else if (q.id === "home") book({ department: "therapy" });
                else book();
              };
              return (
                <button
                  key={q.id}
                  type="button"
                  onClick={action}
                  className="flex items-center gap-2.5 rounded-2xl border border-line bg-surface px-3 py-3 text-left text-sm font-semibold transition-colors hover:border-brand/50 hover:bg-brand-soft"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                    <Icon className="h-5 w-5" />
                  </span>
                  {q.label}
                </button>
              );
            })}
          </div>

          <dl className="mt-8 grid grid-cols-4 gap-2 border-t border-line pt-6">
            {t.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="text-2xl font-extrabold tracking-tight sm:text-3xl">{s.value}</dd>
                <dd className="text-xs text-muted sm:text-sm">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <NextSlots lang={lang} />
      </div>
    </section>
  );
}

/** Поиск по врачам и услугам — результаты сразу под полем */
function SearchBox({ lang }: { lang: Locale }) {
  const t = getUI(lang).hero;
  const book = useBooking();
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => box.current && !box.current.contains(e.target as Node) && setFocused(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const q = query.trim().toLowerCase();
  const results = useMemo(() => {
    if (q.length < 2) return null;
    const match = (s: string) => s.toLowerCase().includes(q);
    return {
      doctors: doctors.filter((d) => match(tr(d.name, lang)) || match(tr(d.title, lang)) || match(tr(departmentById(d.department).name, lang))).slice(0, 4),
      services: priceList.filter((p) => match(tr(p.name, lang))).slice(0, 5),
    };
  }, [q, lang]);

  return (
    <div ref={box} className="relative mt-8 max-w-xl">
      <label className="relative block">
        <span className="sr-only">{t.searchPlaceholder}</span>
        <Search className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-subtle" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder={t.searchPlaceholder}
          className="h-14 w-full rounded-full border border-line bg-surface pr-5 pl-13 text-base shadow-sm outline-none transition-shadow focus:border-brand focus:shadow-[0_0_0_4px_rgb(14_159_110/0.15)]"
        />
      </label>
      {focused && results ? (
        <div className="panel absolute inset-x-0 top-[calc(100%+0.5rem)] z-30 max-h-96 overflow-y-auto p-2">
          {!results.doctors.length && !results.services.length ? (
            <p className="px-3 py-4 text-sm text-muted">{t.searchEmpty}</p>
          ) : null}
          {results.doctors.length ? (
            <p className="px-3 pt-2 pb-1 text-xs font-bold uppercase tracking-wider text-subtle">{t.searchDoctors}</p>
          ) : null}
          {results.doctors.map((d) => (
            <button key={d.id} type="button" onClick={() => book({ doctor: d.id })} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-brand-soft">
              <Avatar id={d.id} name={tr(d.name, lang)} size="sm" />
              <span>
                <span className="block text-sm font-semibold">{tr(d.name, lang)}</span>
                <span className="block text-xs text-muted">{tr(d.title, lang)}</span>
              </span>
            </button>
          ))}
          {results.services.length ? (
            <p className="px-3 pt-3 pb-1 text-xs font-bold uppercase tracking-wider text-subtle">{t.searchServices}</p>
          ) : null}
          {results.services.map((s) => (
            <button key={tr(s.name, lang)} type="button" onClick={() => book({ department: s.department })} className="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-brand-soft">
              <span>{tr(s.name, lang)}</span>
              <span className="shrink-0 font-semibold text-brand-dark">{sum(s.price)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Карточка «Ближайшие окна»: время известно только в браузере, до этого — скелет */
function NextSlots({ lang }: { lang: Locale }) {
  const ui = getUI(lang);
  const [now, setNow] = useState<Date | null>(null);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setNow(new Date()), []);
  const slots = now ? earliestSlots(now, 4) : [];

  return (
    <div className="animate-rise relative mx-auto w-full max-w-md [animation-delay:150ms]">
      <div aria-hidden="true" className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand/20 via-transparent to-sun/20" />
      <div className="panel p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <p className="font-bold">{ui.hero.nextSlots}</p>
          <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-dark">online</span>
        </div>
        <ul className="mt-4 flex flex-col gap-2.5">
          {now
            ? slots.map(({ doctor, date, time }) => (
                <li key={doctor.id} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                  <Avatar id={doctor.id} name={tr(doctor.name, lang)} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{tr(doctor.name, lang)}</p>
                    <p className="flex items-center gap-1.5 text-xs text-muted">
                      <Star className="h-3 w-3 fill-sun text-sun" />
                      {doctor.rating.toFixed(1)} · {tr(departmentById(doctor.department).name, lang)}
                    </p>
                  </div>
                  <BookButton
                    prefill={{ doctor: doctor.id }}
                    className="shrink-0 rounded-xl bg-brand-soft px-3 py-2 text-xs font-bold text-brand-dark transition-colors hover:bg-brand hover:text-white"
                  >
                    {dateKey(date) === dateKey(now) ? ui.hero.today : `${date.getDate()}.${String(date.getMonth() + 1).padStart(2, "0")}`} {time}
                  </BookButton>
                </li>
              ))
            : Array.from({ length: 4 }, (_, i) => <li key={i} className="h-[66px] animate-pulse rounded-2xl bg-bg" />)}
        </ul>
        <BookButton className="mt-4 h-12 w-full rounded-full bg-ink font-semibold text-white transition-colors hover:bg-brand-dark">{ui.book}</BookButton>
      </div>
    </div>
  );
}
