import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import ConfidentialityBanner from "@/components/case-study/ConfidentialityBanner";
import { routing } from "@/i18n/routing";
import { CASE_STUDY_SLUGS, getCaseStudy } from "@/lib/case-studies";

export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    CASE_STUDY_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/projects/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const study = getCaseStudy(locale, slug);
  if (!study) notFound();
  return {
    title: study.seo.title,
    description: study.seo.description,
    alternates: {
      canonical: `/${locale}/projects/${slug}`,
      languages: {
        en: `/en/projects/${slug}`,
        fr: `/fr/projects/${slug}`,
        "x-default": `/en/projects/${slug}`,
      },
    },
    openGraph: {
      title: study.seo.title,
      description: study.seo.description,
      type: "article",
    },
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const study = getCaseStudy(locale, slug);
  if (!study) notFound();

  return (
    <main className="mx-auto w-full max-w-6xl px-6 lg:px-16">
      <CaseStudyHeader study={study} locale={locale} />
      <ConfidentialityBanner />
    </main>
  );
}
