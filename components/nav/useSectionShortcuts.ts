"use client";

import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { scrollToSection } from "@/lib/scroll";
import { SECTIONS } from "@/lib/sections";

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.isContentEditable ||
    ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
  );
}

/** Keys 1-6 jump to the sections (ignored while typing or with a modifier key). */
export function useSectionShortcuts() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.shiftKey ||
        isTypingTarget(e.target)
      )
        return;
      const section = SECTIONS.find((s) => s.shortcut === e.key);
      if (!section) return;
      e.preventDefault();
      scrollToSection(section.id, reduced);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [reduced]);
}
