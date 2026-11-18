import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import About from "@/components/about/About";
import Hero from "@/components/hero/Hero";
import { routing } from "@/i18n/routing";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("sections");

  return (
    <>
      <Hero />
      <About />
      {/* Temporary placeholder sections so the hero buttons have a target */}
      <section
        id="projects"
        className="flex min-h-screen items-center justify-center px-6"
      >
        <h2 className="font-display text-4xl text-text">{t("projects")}</h2>
      </section>
      <section
        id="contact"
        className="flex min-h-screen items-center justify-center px-6"
      >
        <h2 className="font-display text-4xl text-text">{t("contact")}</h2>
      </section>
    </>
  );
}
