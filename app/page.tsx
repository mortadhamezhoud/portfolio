import profileData from "@/data/profile.json";
import projectsData from "@/data/projects.json";
import type { Profile, Project } from "@/lib/types";

const profile: Profile = profileData;
const projects: Project[] = projectsData;

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-bg px-6 text-center">
        <p className="font-mono text-xs text-accent sm:text-sm">{profile.status}</p>
        <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-7xl lg:text-8xl">
          {profile.name}
        </h1>
        <p className="text-lg text-muted sm:text-2xl">{profile.title}</p>
        <button
          type="button"
          className="mt-4 rounded-xl bg-accent px-6 py-3 font-medium text-bg transition-opacity hover:opacity-90"
        >
          {profile.ctaLabel}
        </button>
      </main>

      {/* Temporary: data check, to be replaced by the real projects section */}
      <section className="mx-auto w-full max-w-3xl px-6 py-16">
        <ul className="flex flex-col gap-3">
          {projects.map((project) => (
            <li
              key={project.slug}
              className="rounded-2xl border border-border bg-surface p-4"
            >
              <p className="font-display text-lg text-text">{project.title}</p>
              <p className="font-mono text-xs text-muted">
                {project.period} · {project.company}
              </p>
              <p className="mt-2 font-mono text-xs text-secondary">
                {project.stack.join(" · ")}
              </p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
