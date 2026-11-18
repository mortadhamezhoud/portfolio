"use client";

import { useMotionValueEvent, useScroll } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { SECTIONS, type SectionId } from "@/lib/sections";

/** Scroll distance (px) ignored before the direction is considered to have changed. */
const SCROLL_THRESHOLD = 8;

interface MobileBarProps {
  activeId: SectionId | null;
  /** False while the hero is on screen: the bar stays hidden. */
  visible: boolean;
}

/**
 * Bottom bar for small screens (< 1024px). Hides while scrolling down, comes back
 * when scrolling up, and respects the iPhone bottom safe area.
 */
export default function MobileBar({ activeId, visible }: MobileBarProps) {
  const t = useTranslations("nav");
  const { scrollY } = useScroll();
  const [scrollingDown, setScrollingDown] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? latest;
    const delta = latest - previous;
    if (delta > SCROLL_THRESHOLD) setScrollingDown(true);
    else if (delta < -SCROLL_THRESHOLD) setScrollingDown(false);
  });

  const shown = visible && !scrollingDown;

  return (
    <nav
      aria-label={t("label")}
      inert={!shown}
      className={`fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
        shown ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <ul className="flex items-center justify-around gap-1 px-2 py-1.5">
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const active = activeId === section.id;
          const label = t(section.labelKey);
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-label={label}
                title={label}
                aria-current={active ? "true" : undefined}
                className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  active ? "bg-surface text-accent" : "text-muted"
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
