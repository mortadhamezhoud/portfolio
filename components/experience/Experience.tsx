import { useTranslations } from "next-intl";
import CompanyLogo from "@/components/ui/CompanyLogo";
import type { Experience as ExperienceItem } from "@/lib/types";

/** Compact list: logo, job title, company, project name and dates. Details live in the case studies. */
export default function Experience({ items }: { items: ExperienceItem[] }) {
  const t = useTranslations("experience");
  return (
    <section
      id="experience"
      className="mx-auto min-h-screen w-full max-w-4xl px-6 py-24 lg:px-16"
    >
      <h2 className="font-display text-4xl font-bold text-text sm:text-5xl">
        {t("title")}
      </h2>
      <ol className="mt-12 flex flex-col gap-4">
        {items.map((item) => {
          const company = item.company || t("companyTbd");
          return (
            <li
              key={item.id}
              className="flex items-start gap-4 rounded-2xl border border-border bg-bg/70 p-5 backdrop-blur-sm sm:items-center"
            >
              <CompanyLogo
                logo={item.logo}
                fallback={item.company || "?"}
                alt={company}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
                <div className="min-w-0">
                  <h3 className="font-display text-lg font-bold text-text">
                    {item.role}
                  </h3>
                  <p className="text-muted">
                    <span className={item.company ? "" : "italic"}>{company}</span>
                    {item.project && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span className="text-text">{item.project}</span>
                      </>
                    )}
                  </p>
                  {item.type && (
                    <p className="mt-0.5 font-mono text-xs text-muted">{item.type}</p>
                  )}
                </div>
                <p
                  className={`shrink-0 font-mono text-sm sm:text-right ${
                    item.period ? "text-accent" : "italic text-muted"
                  }`}
                >
                  {item.period || t("datesTbd")}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
