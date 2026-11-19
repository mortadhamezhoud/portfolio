import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import About from "@/components/about/About";
import Projects from "@/components/projects/Projects";
import Experience from "@/components/experience/Experience";
import Credentials from "@/components/credentials/Credentials";
import Skills from "@/components/skills/Skills";
import Hero from "@/components/hero/Hero";
import Contact from "@/components/contact/Contact";
import { routing } from "@/i18n/routing";
import { getProfile, getProjects } from "@/lib/content";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const profile = getProfile(locale);
  const projects = getProjects(locale);

  return (
    <>
      <Hero
        profile={{
          status: profile.status,
          name: profile.name,
          title: profile.title,
          tagline: profile.tagline,
          ctaLabel: profile.ctaLabel,
        }}
      />
      <About profile={profile} />
      <Skills groups={profile.skills} />
      <Projects projects={projects} />
      <Experience items={profile.experience} />
      <Credentials />
      <Contact
        openTo={profile.openTo}
        email={profile.contact.email}
        linkedin={profile.contact.linkedin}
        location={profile.contact.location}
        phoneToken={Buffer.from(profile.contact.whatsapp).toString("base64")}
      />
    </>
  );
}
