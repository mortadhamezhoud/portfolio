import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import CaseSection from "@/components/case-study/CaseSection";
import CaseStudyFooter from "@/components/case-study/CaseStudyFooter";
import CaseStudyHeader from "@/components/case-study/CaseStudyHeader";
import CaseToc from "@/components/case-study/CaseToc";
import ConfidentialityBanner from "@/components/case-study/ConfidentialityBanner";
import { routing } from "@/i18n/routing";
import { CASE_STUDY_SLUGS, getCaseStudy } from "@/lib/case-studies";
import { getProjects } from "@/lib/content";

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

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="flex max-w-3xl flex-col gap-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-lg text-text">
          <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/[locale]/projects/[slug]">) {
  const { locale, slug } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const study = getCaseStudy(locale, slug);
  if (!study) notFound();

  const projects = getProjects(locale);
  const next = projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length];

  // Order and titles of the numbered sections (also feeds the table of contents)
  const sections = [
    { id: "problem", title: study.problem.title },
    { id: "solution", title: study.solution.title },
    { id: "audiences", title: study.audiences.title },
    { id: "features", title: study.features.title },
    { id: "bi", title: study.bi.title },
    { id: "ml", title: study.ml.title },
    { id: "demo", title: study.demo.title },
    { id: "architecture", title: study.architecture.title },
    { id: "results", title: study.results.title },
    { id: "learned", title: study.learned.title },
  ];
  const body: Record<string, React.ReactNode> = {
    problem: <p className="max-w-3xl text-lg leading-relaxed text-muted">{study.problem.text}</p>,
    results: <BulletList items={study.results.items} />,
    learned: <BulletList items={study.learned.items} />,
  };

  return (
    // data-scene: the fixed 3D canvas shows this scene as a blurred backdrop on this page
    <main data-scene="neural-shield" className="mx-auto w-full max-w-6xl px-6 lg:px-16">
      <CaseStudyHeader study={study} locale={locale} />
      <ConfidentialityBanner />
      <div className="mt-8 lg:grid lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <CaseToc items={sections} />
        <div>
          {sections.map((section, index) => (
            <CaseSection key={section.id} id={section.id} number={index + 1} title={section.title}>
              {body[section.id]}
            </CaseSection>
          ))}
        </div>
      </div>
      <CaseStudyFooter next={next} />
    </main>
  );
}
