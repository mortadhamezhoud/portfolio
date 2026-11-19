import { AppWindow, BrainCircuit, Database, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Domain } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  "data-bi": Database,
  "machine-learning": BrainCircuit,
  web: AppWindow,
};

/** Compact row of the three expertise pillars; each links to the project that proves it best. */
export default function Pillars({ domains }: { domains: Domain[] }) {
  const t = useTranslations("about");
  return (
    <ul
      aria-label={t("pillarsLabel")}
      className="grid gap-4 sm:grid-cols-3 lg:col-span-2"
    >
      {domains.map((domain) => {
        const Icon = ICONS[domain.id] ?? Database;
        return (
          <li
            key={domain.id}
            className="flex flex-col gap-4 rounded-2xl border border-border bg-surface/80 p-5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-bg text-accent">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="font-display text-lg font-bold text-text">
                {domain.title}
              </h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {domain.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded-full border border-border px-2.5 py-0.5 font-mono text-xs text-muted"
                >
                  {tool}
                </li>
              ))}
            </ul>
            <a
              href={`#project-${domain.project}`}
              className="mt-auto font-mono text-sm text-accent hover:underline"
            >
              {t("seeProject")}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
