// Статичные блоки: чек-апы, филиалы, вопросы и подвал
import { Check, ChevronDown, Clock, MapPin, Phone, TrainFront } from "lucide-react";
import { branches, checkups, faq } from "@/content/data";
import { getUI } from "@/content/ui";
import { sum, tr, type Locale } from "@/lib/i18n";
import { BookButton } from "./Booking";
import Logo from "./Logo";

export function Checkups({ lang }: { lang: Locale }) {
  const t = getUI(lang).checkups;
  return (
    <section id="checkups" aria-labelledby="checkups-title" className="bg-ink py-16 text-white sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#6ee7b7]">{t.eyebrow}</p>
        <h2 id="checkups-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.title}</h2>
        <p className="mt-3 max-w-2xl text-white/70">{t.subtitle}</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {checkups.map((c) => (
            <li
              key={c.id}
              className={`relative flex flex-col rounded-3xl p-6 ${c.featured ? "bg-brand text-white shadow-2xl shadow-brand/30" : "bg-white/[0.06] ring-1 ring-white/10"}`}
            >
              {c.featured ? (
                <span className="absolute -top-3 left-6 rounded-full bg-sun px-3 py-1 text-xs font-bold text-ink">{t.popular}</span>
              ) : null}
              <h3 className="text-xl font-bold">{tr(c.name, lang)}</h3>
              <p className={`mt-1 text-sm ${c.featured ? "text-white/85" : "text-white/60"}`}>{tr(c.forWhom, lang)}</p>
              <p className="mt-5 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight">{sum(c.price)}</span>
                <span className="text-sm">{t.currency}</span>
              </p>
              <p className={`text-sm line-through ${c.featured ? "text-white/70" : "text-white/40"}`}>{sum(c.oldPrice)}</p>
              <p className={`mt-1 inline-flex items-center gap-1.5 text-xs ${c.featured ? "text-white/85" : "text-white/60"}`}>
                <Clock className="h-3.5 w-3.5" />
                {tr(c.duration, lang)}
              </p>
              <ul className="mt-5 flex flex-col gap-2.5 text-sm">
                {c.items.map((item) => (
                  <li key={item.ru} className="flex items-start gap-2">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${c.featured ? "text-white" : "text-[#6ee7b7]"}`} />
                    {tr(item, lang)}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                <BookButton
                  prefill={{ department: "therapy" }}
                  className={`h-12 w-full rounded-full font-semibold transition-colors ${c.featured ? "bg-white text-brand-dark hover:bg-brand-soft" : "bg-white/10 hover:bg-white/20"}`}
                >
                  {t.choose}
                </BookButton>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Branches({ lang }: { lang: Locale }) {
  const t = getUI(lang).branches;
  return (
    <section id="branches" aria-labelledby="branches-title" className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{t.eyebrow}</p>
        <h2 id="branches-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.title}</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {branches.map((b, i) => (
            <li key={b.id} className="panel overflow-hidden">
              {/* Условная карта: в настоящем сайте здесь была бы Яндекс или Google Карта */}
              <div aria-hidden="true" className="bg-cross relative h-36 bg-brand-soft">
                <svg viewBox="0 0 300 140" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                  <path d={["M0 90 Q80 60 150 80 T300 50", "M0 40 Q90 90 170 60 T300 100", "M0 110 Q100 30 200 70 T300 30"][i]} stroke="#fff" strokeWidth="10" fill="none" />
                  <path d={["M60 0 L110 140", "M200 0 L150 140", "M30 0 L250 140"][i]} stroke="#fff" strokeWidth="6" fill="none" opacity="0.8" />
                </svg>
                <span className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white shadow-lg ring-8 ring-brand/15">
                  <MapPin className="h-5 w-5" />
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold">{tr(b.name, lang)}</h3>
                <p className="mt-2 flex items-start gap-2 text-sm text-muted">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {tr(b.address, lang)}
                </p>
                <p className="mt-1.5 flex items-start gap-2 text-sm text-muted">
                  <TrainFront className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {tr(b.metro, lang)}
                </p>
                <p className="mt-1.5 flex items-start gap-2 text-sm text-muted">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {tr(b.hours, lang)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Faq({ lang }: { lang: Locale }) {
  const t = getUI(lang).faq;
  return (
    <section aria-labelledby="faq-title" className="bg-surface py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">{t.eyebrow}</p>
        <h2 id="faq-title" className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{t.title}</h2>
        <div className="mt-8 flex flex-col gap-3">
          {faq.map((item) => (
            <details key={item.q.ru} className="group rounded-2xl border border-line bg-bg/50 px-5 py-4 open:bg-surface open:shadow-sm">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {tr(item.q, lang)}
                <ChevronDown className="h-5 w-5 shrink-0 text-brand transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-3 text-muted">{tr(item.a, lang)}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Footer({ lang }: { lang: Locale }) {
  const ui = getUI(lang);
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-start md:justify-between lg:px-8">
        <div className="max-w-sm">
          <Logo lang={lang} light />
          <p className="mt-4 text-sm text-white/60">{ui.footer.about}</p>
        </div>
        <div className="flex flex-col gap-3 text-sm">
          <a href="tel:+998710000000" className="inline-flex items-center gap-2 font-semibold">
            <Phone className="h-4 w-4 text-[#6ee7b7]" />
            {ui.phone}
          </a>
          <BookButton className="h-11 rounded-full bg-brand px-6 font-semibold transition-colors hover:bg-brand-dark">{ui.book}</BookButton>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} Mehr Medical · {ui.footer.rights}</span>
          <a href="https://caravanhouse.uz" className="font-semibold text-[#ffd27a] hover:underline">
            {ui.footer.made} →
          </a>
        </div>
      </div>
    </footer>
  );
}
