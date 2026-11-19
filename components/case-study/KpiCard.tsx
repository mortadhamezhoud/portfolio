"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type { Kpi } from "@/lib/case-study-types";

/** KPI card with a counter that counts up when it scrolls into view. */
export default function KpiCard({ kpi, locale }: { kpi: Kpi; locale: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduced = usePrefersReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, kpi.value, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: setValue,
    });
    return () => controls.stop();
  }, [inView, reduced, kpi.value]);

  const shown = reduced ? kpi.value : value;
  const text = new Intl.NumberFormat(locale, {
    minimumFractionDigits: kpi.decimals,
    maximumFractionDigits: kpi.decimals,
  }).format(shown);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-border bg-surface/80 p-5 backdrop-blur-sm"
    >
      <p className="font-display text-4xl font-bold text-text">
        {/* Final value for screen readers and crawlers, the animated one is visual only */}
        <span className="sr-only">
          {new Intl.NumberFormat(locale, {
            minimumFractionDigits: kpi.decimals,
            maximumFractionDigits: kpi.decimals,
          }).format(kpi.value)}
          {kpi.suffix}
        </span>
        <span aria-hidden="true">
          {text}
          {kpi.suffix}
        </span>
      </p>
      <p className="mt-2 text-sm leading-snug text-muted">{kpi.label}</p>
    </div>
  );
}
