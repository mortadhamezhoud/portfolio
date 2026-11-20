import {
  AppWindow,
  Award,
  Bot,
  BrainCircuit,
  ChartColumn,
  Crown,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import CompanyLogo from "@/components/ui/CompanyLogo";
import { SCENE_SHAPE } from "@/lib/scenes";
import type { Project } from "@/lib/types";
import KpiCard from "./KpiCard";
import ProjectProgress from "./ProjectProgress";

const PILLAR_ICONS: Record<string, LucideIcon> = {
  bi: ChartColumn,
  ml: BrainCircuit,
  web: AppWindow,
  ai: Bot,
};

const AUDIENCE_ICONS: Record<string, LucideIcon> = {
  executive: Crown,
  security: ShieldCheck,
};

function Tags({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((tool) => (
        <li
          key={tool}
          className="rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs text-text"
        >
          {tool}
        </li>
      ))}
    </ul>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs uppercase tracking-wider text-muted">{children}</p>
  );
}

function InfoCard({
  Icon,
  title,
  text,
}: {
  Icon: LucideIcon;
  title: string;
  text: string;
}) {
  return (
    <li className="rounded-xl border border-border bg-surface/80 p-4 backdrop-blur-sm">
      <p className="flex items-center gap-2 font-display text-base font-bold text-text">
        <Icon className="h-4 w-4 text-accent" aria-hidden="true" />
        {title}
      </p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
    </li>
  );
}

/**
 * Scrollytelling: one full-height screen per project (the featured project is taller). The
 * text sits on the left, the fixed 3D canvas behind the page morphs to the project scene
 * (data: project.scene) on the right. No pinning: on mobile each project simply scrolls
 * (the shape stays small above the text).
 */
export default function Projects({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");
  const locale = useLocale();
  return (
    <section id="projects" className="relative">
      <h2 className="sr-only">{t("label")}</h2>
      <ProjectProgress total={projects.length} />

      {projects.map((project, index) => {
        const showcase = project.showcase;
        return (
          <article
            key={project.slug}
            id={`project-${project.slug}`}
            data-project=""
            data-shape={SCENE_SHAPE[project.scene] ?? 0}
            className="relative flex items-end px-4 py-8 lg:min-h-dvh lg:items-start lg:px-16 lg:py-28"
          >
            {/* Dark veil so the text stays readable over the 3D */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-transparent lg:bg-gradient-to-r lg:from-bg/85 lg:via-bg/40 lg:to-transparent"
            />
            <div
              className={`relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 rounded-2xl bg-bg/85 p-5 lg:mx-0 lg:bg-transparent lg:p-0 ${
                showcase ? "lg:max-w-[50%]" : "lg:max-w-[44%] lg:self-center"
              }`}
            >
              <div className="flex items-center gap-3">
                <CompanyLogo logo={project.logo} fallback={project.company} alt={project.company} />
                <p className="font-mono text-sm text-accent">
                  {String(index + 1).padStart(2, "0")}
                  <span className="text-muted">
                    {" "}
                    · {project.company}
                    {showcase && `, ${showcase.department}`} · {project.period}
                  </span>
                </p>
              </div>

              <h3
                className={`font-display font-bold text-text ${
                  showcase ? "text-4xl sm:text-6xl" : "text-3xl sm:text-5xl"
                }`}
              >
                {project.title}
              </h3>
              {showcase && (
                <p className="max-w-xl text-lg leading-relaxed text-muted">{showcase.tagline}</p>
              )}
              {project.role && <p className="text-text">{project.role}</p>}
              {showcase && (
                <p className="flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
                  <Award className="h-3.5 w-3.5" aria-hidden="true" />
                  {showcase.badge}
                </p>
              )}

              {showcase && (
                <ul className="grid grid-cols-2 gap-3">
                  {showcase.kpis.map((kpi) => (
                    <li key={kpi.label}>
                      <KpiCard kpi={kpi} locale={locale} />
                    </li>
                  ))}
                </ul>
              )}

              {project.problem && (
                <div>
                  <Label>{t("problem")}</Label>
                  <p className="mt-1 max-w-xl leading-relaxed text-muted">{project.problem}</p>
                </div>
              )}

              {showcase ? (
                <>
                  <div>
                    <Label>{t("pillars")}</Label>
                    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                      {showcase.pillars.map((pillar) => (
                        <InfoCard
                          key={pillar.title}
                          Icon={PILLAR_ICONS[pillar.icon]}
                          title={pillar.title}
                          text={pillar.text}
                        />
                      ))}
                    </ul>
                  </div>
                  <div>
                    <Label>{t("audiences")}</Label>
                    <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                      {showcase.audiences.map((audience) => (
                        <InfoCard
                          key={audience.id}
                          Icon={AUDIENCE_ICONS[audience.id]}
                          title={audience.title}
                          text={audience.text}
                        />
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                project.pitch &&
                project.pitch.length > 0 && (
                  <div>
                    <Label>{t("solution")}</Label>
                    <ul className="mt-2 flex max-w-xl flex-col gap-2">
                      {project.pitch.map((point) => (
                        <li key={point} className="flex gap-3 leading-relaxed text-text">
                          <span
                            aria-hidden="true"
                            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent"
                          />
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              )}

              {project.stack.length > 0 && <Tags items={project.stack} />}
              {showcase && <p className="font-mono text-[11px] text-muted">{t("synthetic")}</p>}
            </div>
          </article>
        );
      })}
    </section>
  );
}
