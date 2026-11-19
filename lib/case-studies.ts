import enCyber from "@/data/case-studies/en/cybersuivi-gat.json";
import frCyber from "@/data/case-studies/fr/cybersuivi-gat.json";
import type { Locale } from "@/i18n/routing";
import type { CaseStudy } from "@/lib/case-study-types";

const caseStudies: Record<Locale, Record<string, CaseStudy>> = {
  en: { "cybersuivi-gat": enCyber as CaseStudy },
  fr: { "cybersuivi-gat": frCyber as CaseStudy },
};

/** Slugs of the projects that have a case study page. */
export const CASE_STUDY_SLUGS = Object.keys(caseStudies.en);

export const hasCaseStudy = (slug: string): boolean => CASE_STUDY_SLUGS.includes(slug);

export const getCaseStudy = (locale: Locale, slug: string): CaseStudy | undefined =>
  caseStudies[locale][slug];
