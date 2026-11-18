"use client";

import { useEffect, useState } from "react";
import { SECTIONS, TOP_ID, type SectionId } from "@/lib/sections";

/** Share of the hero that must still be visible for the navigation to stay hidden. */
const HERO_VISIBLE_RATIO = 0.6;

/**
 * Tracks the section crossing the middle of the viewport (IntersectionObserver)
 * and whether the hero is still mostly on screen.
 */
export function useActiveSection() {
  const [activeId, setActiveId] = useState<SectionId | null>(null);
  const [heroInView, setHeroInView] = useState(true);

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

    const heroObserver = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.intersectionRatio >= HERO_VISIBLE_RATIO),
      { threshold: [HERO_VISIBLE_RATIO] },
    );

    [TOP_ID, ...SECTIONS.map((s) => s.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) sectionObserver.observe(el);
    });
    const hero = document.getElementById(TOP_ID);
    if (hero) heroObserver.observe(hero);

    return () => {
      sectionObserver.disconnect();
      heroObserver.disconnect();
    };
  }, []);

  return { activeId, heroInView };
}
