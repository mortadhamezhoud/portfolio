"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export interface TocItem {
  id: string;
  title: string;
}

/** Sticky table of contents (desktop): highlights the section crossing the middle of the viewport. */
export default function CaseToc({ items }: { items: TocItem[] }) {
  const t = useTranslations("caseStudy");
  const [active, setActive] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const inBand = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) inBand.add(e.target.id);
          else inBand.delete(e.target.id);
        }
        const current = items.find((i) => inBand.has(i.id));
        if (current) setActive(current.id);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    items.forEach((i) => {
      const el = document.getElementById(i.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label={t("toc")} className="hidden lg:block">
      <div className="sticky top-28">
        <p className="mb-4 font-mono text-xs uppercase tracking-wider text-muted">
          {t("toc")}
        </p>
        <ol className="flex flex-col gap-1 border-l border-border">
          {items.map((item, index) => {
            const isActive = item.id === active;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`-ml-px flex gap-3 border-l py-1.5 pl-4 text-sm transition-colors motion-reduce:transition-none ${
                    isActive
                      ? "border-accent text-text"
                      : "border-transparent text-muted hover:text-text"
                  }`}
                >
                  <span className="font-mono text-xs text-accent/80">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {item.title}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
