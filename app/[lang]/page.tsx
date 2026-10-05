import { notFound } from "next/navigation";
import BookingProvider from "@/components/Booking";
import DemoBar from "@/components/DemoBar";
import Doctors from "@/components/Doctors";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Prices from "@/components/Prices";
import { Branches, Checkups, Faq, Footer } from "@/components/Sections";
import Structure from "@/components/Structure";
import { hasLocale } from "@/lib/i18n";

export default async function Page({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return (
    <BookingProvider lang={lang}>
      <DemoBar lang={lang} />
      <Header lang={lang} />
      <main>
        <Hero lang={lang} />
        <Structure lang={lang} />
        <Doctors lang={lang} />
        <Prices lang={lang} />
        <Checkups lang={lang} />
        <Branches lang={lang} />
        <Faq lang={lang} />
      </main>
      <Footer lang={lang} />
    </BookingProvider>
  );
}
