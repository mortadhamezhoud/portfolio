import { useTranslations } from "next-intl";
import { SCENE_SHAPE } from "@/lib/scenes";
import type { Project } from "@/lib/types";
import ProjectProgress from "./ProjectProgress";

/**
 * Scrollytelling: one full-height screen per project. The text sits on the left, the fixed
 * 3D canvas behind the page morphs to the project scene (data: project.scene) on the right.
 * No pinning: on mobile each project simply scrolls (the shape stays small above the text).
 */
export default function Projects({ projects }: { projects: Project[] }) {
  const t = useTranslations("projects");
  return (
    <section id="projects" className="relative">
      <h2 className="sr-only">{t("label")}</h2>
      <ProjectProgress total={projects.length} />

      {projects.map((project, index) => (
        <article
          key={project.slug}
          id={`project-${project.slug}`}
          data-project=""
          data-shape={SCENE_SHAPE[project.scene] ?? 0}
          className="relative flex min-h-screen items-end px-4 pb-12 pt-[42vh] lg:items-center lg:px-16 lg:py-24"
        >
          {/* Dark veil so the text stays readable over the 3D */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/75 to-transparent lg:bg-gradient-to-r lg:from-bg/85 lg:via-bg/40 lg:to-transparent"
          />
          <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-5 rounded-2xl bg-bg/85 p-5 lg:mx-0 lg:max-w-[44%] lg:bg-transparent lg:p-0">
            <p className="font-mono text-sm text-accent">
              {String(index + 1).padStart(2, "0")}
              <span className="text-muted">
                {" "}
                · {project.company} · {project.period}
              </span>
            </p>
            <h3 className="font-display text-3xl font-bold text-text sm:text-5xl">
              {project.title}
            </h3>
            {project.role && <p className="text-text">{project.role}</p>}
            {project.problem && (
              <div>
                <p className="font-mono text-xs uppercase tracking-wider text-muted">
                  {t("problem")}
                </p>
                <p className="mt-1 max-w-xl leading-relaxed text-muted">{project.problem}</p>
              </div>
            )}
            <div>
              <p className="font-mono text-xs uppercase tracking-wider text-muted">
                {t("solution")}
              </p>
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
            {project.stack.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((tool) => (
                  <li
                    key={tool}
                    className="rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs text-text"
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-2 flex items-center gap-3">
              {/* Case study pages come in the next step */}
              <button
                type="button"
                disabled
                aria-disabled="true"
                title={t("soon")}
                className="cursor-not-allowed rounded-full border border-border px-6 py-3 text-sm font-medium text-muted"
              >
                {t("viewCase")}
              </button>
              <span className="font-mono text-xs text-muted">{t("soon")}</span>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
