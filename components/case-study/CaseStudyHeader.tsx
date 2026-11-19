import { Award, Building2, CalendarRange } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { CaseStudy } from "@/lib/case-study-types";
import KpiCard from "./KpiCard";

export default function CaseStudyHeader({
  study,
  locale,
}: {
  study: CaseStudy;
  locale: string;
}) {
  const t = useTranslations("caseStudy");
  const { header } = study;
  return (
    <header id="top" className="pt-32 pb-16">
      <Link
        href="/#projects"
        className="font-mono text-sm text-muted transition-colors hover:text-accent"
      >
        ← {t("back")}
      </Link>
      <h1 className="mt-6 font-display text-5xl font-bold tracking-tight text-text sm:text-7xl">
        {header.title}
      </h1>
      <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted sm:text-xl">
        {header.tagline}
      </p>

      <dl className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
        <div className="flex items-start gap-3">
          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
          <div>
            <dd className="text-text">{header.role}</dd>
            <dd className="text-muted">{header.company}</dd>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <CalendarRange className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <dd className="font-mono text-text">{header.period}</dd>
          </div>
          <div className="flex items-center gap-3">
            <Award className="h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
            <dd className="w-fit rounded-full border border-accent/40 bg-accent/10 px-3 py-0.5 font-mono text-xs text-accent">
              {header.badge}
            </dd>
          </div>
        </div>
      </dl>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {header.kpis.map((kpi) => (
          <li key={kpi.label}>
            <KpiCard kpi={kpi} locale={locale} />
          </li>
        ))}
      </ul>
    </header>
  );
}
