import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import About from "@/components/about/About";
import Projects from "@/components/projects/Projects";
import Experience from "@/components/experience/Experience";
import Credentials from "@/components/credentials/Credentials";
import Skills from "@/components/skills/Skills";
import Hero from "@/components/hero/Hero";
import SectionPlaceholder from "@/components/ui/SectionPlaceholder";
import { routing } from "@/i18n/routing";
import { getProfile, getProjects } from "@/lib/content";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations("nav");
  const profile = getProfile(locale);
  const projects = getProjects(locale);

  return (
    <>
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills groups={profile.skills} />
      <Projects projects={projects} />
      <Experience items={profile.experience} />
      <Credentials />
      <SectionPlaceholder id="contact" title={t("contact")} />
    </>
  );
}
