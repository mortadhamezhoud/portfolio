"use client";

import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { Domain } from "@/lib/types";

/** Scroll progress (0-1 through the pinned section) where each domain is centred. */
const DOMAIN_CENTRES = [0.15, 0.5, 0.85];

function domainAt(progress: number, count: number): number {
  return Math.min(Math.floor(progress * count), count - 1);
}

/**
 * Pinned section (300vh): the text on the left changes with the scroll while the single
 * fixed 3D canvas morphs behind it (the right half is intentionally empty).
 */
export default function WhatIDo({ domains }: { domains: Domain[] }) {
  const t = useTranslations("nav");
  const section = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const update = () => {
      const el = section.current;
      if (!el) return;
      const range = Math.max(el.offsetHeight - window.innerHeight, 1);
      const progress = (window.scrollY - (el.getBoundingClientRect().top + window.scrollY)) / range;
      setActive(domainAt(Math.min(Math.max(progress, 0), 0.999), domains.length));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [domains.length]);

  const goTo = (index: number) => {
    const el = section.current;
    if (!el) return;
    const range = el.offsetHeight - window.innerHeight;
    const top = el.getBoundingClientRect().top + window.scrollY + range * DOMAIN_CENTRES[index];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <section ref={section} id="what-i-do" className="relative h-[300vh]">
      <div className="sticky top-0 flex h-screen items-end px-6 pb-16 lg:items-center lg:px-16 lg:pb-0">
        {/* Dark veil so the text stays readable over the 3D (mobile: behind the text) */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg via-bg/70 to-transparent lg:bg-gradient-to-r lg:from-bg/85 lg:via-bg/40 lg:to-transparent"
        />
        <h2 className="sr-only">{t("what-i-do")}</h2>

        {/* Progress indicator */}
        <ol
          aria-label={t("what-i-do")}
          className="absolute left-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-4 lg:left-8"
        >
          {domains.map((domain, i) => (
            <li key={domain.id}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={domain.title}
                aria-current={i === active ? "step" : undefined}
                className="group flex h-6 w-6 items-center justify-center"
              >
                <span
                  className={`block rounded-full transition-all duration-300 motion-reduce:transition-none ${
                    i === active
                      ? "h-3 w-3 bg-accent shadow-[0_0_12px_var(--color-accent)]"
                      : "h-2 w-2 bg-border group-hover:bg-muted"
                  }`}
                />
              </button>
            </li>
          ))}
        </ol>

        {/* Stacked blocks: they share one grid cell, so the container takes the tallest height */}
        <div className="relative z-10 mx-auto grid w-full max-w-7xl lg:mx-0 lg:max-w-[44%] lg:pl-12">
          {domains.map((domain, i) => {
            const visible = i === active;
            return (
              <article
                key={domain.id}
                aria-hidden={!visible}
                className={`col-start-1 row-start-1 transition-all duration-500 motion-reduce:transition-none ${
                  visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
                }`}
              >
                <p className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-3 font-display text-3xl font-bold text-text sm:text-5xl">
                  {domain.title}
                </h3>
                <p className="mt-5 max-w-xl leading-relaxed text-muted sm:text-lg">
                  {domain.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {domain.tools.map((tool) => (
                    <li
                      key={tool}
                      className="rounded-full border border-border bg-surface/80 px-3 py-1 font-mono text-xs text-text"
                    >
                      {tool}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
