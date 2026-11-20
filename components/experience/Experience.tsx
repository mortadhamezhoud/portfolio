import { useTranslations } from "next-intl";
import CompanyLogo from "@/components/ui/CompanyLogo";
import Reveal from "@/components/ui/Reveal";
import type { Experience as ExperienceItem } from "@/lib/types";

/**
 * Timeline: a glowing spine runs through big company logos. Each step is a large card with the
 * job title, company, project (highlighted) and dates. Details live in the Projects section.
 */
export default function Experience({ items }: { items: ExperienceItem[] }) {
  const t = useTranslations("experience");
  return (
    <section
      id="experience"
      className="mx-auto w-full max-w-5xl px-6 py-16 lg:min-h-dvh lg:py-28 lg:px-16"
    >
      <h2 className="font-display font-bold text-text text-[clamp(2rem,10vw,3rem)] sm:text-6xl">
        {t("title")}
      </h2>

      <ol className="relative mt-20 flex flex-col gap-14">
        {/* Spine: cyan to blue, fading out at the end */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-12 top-0 w-px -translate-x-1/2 bg-gradient-to-b from-accent via-secondary to-transparent"
        />
        {items.map((item, index) => {
          const company = item.company || t("companyTbd");
          return (
            <Reveal as="li" key={item.id} className="relative grid grid-cols-[6rem_1fr] gap-5 sm:gap-8">
              {/* Logo sits on the spine, with a glow ring */}
              <div className="relative z-10 h-fit">
                <span
                  aria-hidden="true"
                  className="absolute -inset-2 rounded-3xl bg-gradient-to-br from-accent/50 to-secondary/50 opacity-70 blur-md"
                />
                <div className="relative">
                  <CompanyLogo
                    logo={item.logo}
                    fallback={item.company || "?"}
                    alt={company}
                    size="xl"
                  />
                </div>
              </div>

              <article className="group relative overflow-hidden rounded-3xl border border-border bg-bg/70 p-6 backdrop-blur-sm transition-colors duration-300 hover:border-accent/70 sm:p-8 motion-reduce:transition-none">
                {/* Big outlined index, in the background */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2 -top-6 select-none font-mono text-8xl font-bold text-transparent [-webkit-text-stroke:1px_#1C2742] sm:text-9xl"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                {/* Glow on hover */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-accent/10 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
                />

                <p
                  className={`relative w-fit rounded-full border px-4 py-1 font-mono text-sm ${
                    item.period
                      ? "border-accent/40 bg-accent/10 text-accent"
                      : "border-border italic text-muted"
                  }`}
                >
                  {item.period || t("datesTbd")}
                </p>

                <h3 className="relative mt-5 font-display text-3xl font-bold leading-tight text-text sm:text-4xl">
                  {item.role}
                </h3>
                <p
                  className={`relative mt-2 text-xl sm:text-2xl ${
                    item.company ? "text-accent" : "italic text-muted"
                  }`}
                >
                  {company}
                </p>

                {item.project && (
                  <p className="relative mt-6 w-fit max-w-full rounded-2xl bg-gradient-to-r from-accent to-secondary px-5 py-2 font-display text-lg font-semibold text-bg sm:text-xl">
                    {item.project}
                  </p>
                )}
                {item.type && (
                  <p className="relative mt-4 font-mono text-sm text-muted">{item.type}</p>
                )}
              </article>
            </Reveal>
          );
        })}
      </ol>
    </section>
  );
}
