"use client";

import { Menu, Phone, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getUI } from "@/content/ui";
import type { Locale } from "@/lib/i18n";
import { BookButton } from "./Booking";
import LangSwitch from "./LangSwitch";
import Logo from "./Logo";

export default function Header({ lang }: { lang: Locale }) {
  const ui = getUI(lang);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const links = [
    { href: "#structure", label: ui.nav.structure },
    { href: "#doctors", label: ui.nav.doctors },
    { href: "#prices", label: ui.nav.prices },
    { href: "#checkups", label: ui.nav.checkups },
    { href: "#branches", label: ui.nav.branches },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors ${scrolled || open ? "border-line bg-surface/95" : "border-transparent bg-bg/80"}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.5rem] lg:px-8">
        <Logo lang={lang} />
        <nav aria-label={ui.menu} className="hidden lg:block">
          <ul className="flex gap-1">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="rounded-full px-3.5 py-2 text-sm font-medium text-muted transition-colors hover:bg-brand-soft hover:text-brand-dark">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <a href="tel:+998710000000" className="hidden items-center gap-2 text-sm font-semibold xl:inline-flex">
            <Phone className="h-4 w-4 text-brand" />
            {ui.phone}
          </a>
          <div className="hidden sm:block">
            <LangSwitch lang={lang} label={ui.langLabel} />
          </div>
          <BookButton className="hidden h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white shadow-lg shadow-brand/25 transition-colors hover:bg-brand-dark md:inline-flex">
            {ui.book}
          </BookButton>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label={open ? ui.close : ui.menu}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-line bg-surface lg:hidden">
          <nav aria-label={ui.menu} className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <ul className="flex flex-col">
              {links.map((l) => (
                <li key={l.href} className="border-b border-line last:border-0">
                  <a href={l.href} onClick={() => setOpen(false)} className="block py-3.5 text-lg font-semibold">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex items-center justify-between gap-3">
              <LangSwitch lang={lang} label={ui.langLabel} />
              <a href="tel:+998710000000" className="inline-flex items-center gap-2 text-sm font-semibold">
                <Phone className="h-4 w-4 text-brand" />
                {ui.phone}
              </a>
            </div>
            <BookButton className="mt-4 h-12 w-full rounded-full bg-brand font-semibold text-white">{ui.book}</BookButton>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
