import Link from "next/link";
import type { Locale } from "@/lib/i18n";

// Логотип вымышленной клиники: сердце внутри медицинского креста
export default function Logo({ lang, light = false }: { lang: Locale; light?: boolean }) {
  return (
    <Link href={`/${lang}`} className="inline-flex items-center gap-2.5 rounded-lg" aria-label="Mehr Medical">
      <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
        <rect width="40" height="40" rx="12" fill="#0e9f6e" />
        <path d="M16 8h8v8h8v8h-8v8h-8v-8H8v-8h8z" fill="#fff" opacity="0.18" />
        <path d="M20 29s-8.5-5-8.5-11a4.7 4.7 0 0 1 8.5-2.8A4.7 4.7 0 0 1 28.5 18c0 6-8.5 11-8.5 11z" fill="#fff" />
      </svg>
      <span className={`text-lg leading-none font-bold tracking-tight ${light ? "text-white" : "text-ink"}`}>
        Mehr<span className="text-brand"> Medical</span>
      </span>
    </Link>
  );
}
