"use client";

import { useEffect, useState } from "react";
import { SECTIONS, TOP_ID, type SectionId } from "@/lib/sections";

/**
 * Tracks the section crossing the middle of the viewport (IntersectionObserver).
 */
export function useActiveSection() {
  const [activeId, setActiveId] = useState<SectionId | null>(null);

  useEffect(() => {
    const inBand = new Set<string>();

    // Thin band across the middle of the viewport
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        const current = SECTIONS.find((s) => inBand.has(s.id))?.id;
        // Keep the previous value between two sections; clear it on the hero
        setActiveId(
          (previous) => current ?? (inBand.has(TOP_ID) ? null : previous),
        );
      },
      { rootMargin: "-48% 0px -48% 0px" },
    );

    [TOP_ID, ...SECTIONS.map((s) => s.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
    return () => {
      sectionObserver.disconnect();
    };
  }, []);

  return { activeId };
}
