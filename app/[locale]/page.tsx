import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import About from "@/components/about/About";
import Hero from "@/components/hero/Hero";
import SectionPlaceholder from "@/components/ui/SectionPlaceholder";
import { routing } from "@/i18n/routing";
import { getProfile } from "@/lib/content";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  const profile = getProfile(locale);

  return (
    <>
      <Hero profile={profile} />
      {/* Everything after the hero leaves room for the desktop sidebar */}
      <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] transition-[margin] lg:pb-0 duration-300 motion-reduce:transition-none lg:ms-[var(--sidebar-w)]">
        <About profile={profile} />
        <SectionPlaceholder id="projects" title={t("projects")} />
        <SectionPlaceholder id="experience" title={t("experience")} />
        <SectionPlaceholder id="credentials" title={t("credentials")} />
        <SectionPlaceholder id="contact" title={t("contact")} />
      </div>
    </>
  );
}
