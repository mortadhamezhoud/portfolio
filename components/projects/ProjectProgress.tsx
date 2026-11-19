"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

/** "01 / 04" counter, sticky while the Projects section is on screen. */
export default function ProjectProgress({ total }: { total: number }) {
  const t = useTranslations("projects");
  const [active, setActive] = useState(0);

  useEffect(() => {
    const articles = Array.from(document.querySelectorAll<HTMLElement>("[data-project]"));
    const inBand = new Set<Element>();
    // Thin band across the middle of the viewport
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target);
          else inBand.delete(e.target);
        }
        const index = articles.findIndex((a) => inBand.has(a));
        if (index >= 0) setActive(index);
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );
    articles.forEach((a) => observer.observe(a));
    return () => observer.disconnect();
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="pointer-events-none sticky top-0 z-20 h-0">
      <p
        aria-label={t("counter", { current: active + 1, total })}
        className="absolute right-6 top-24 font-mono text-sm text-muted lg:right-16"
      >
        <span className="text-accent">{pad(active + 1)}</span> / {pad(total)}
      </p>
    </div>
  );
}
