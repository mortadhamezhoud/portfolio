"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { SECTIONS, type SectionId } from "@/lib/sections";

const UNDERLINE_CLASS =
  "absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent";

/** Desktop links: white when active (cyan underline sliding between links), cyan on hover. */
export default function HeaderNav({
  activeId,
}: {
  activeId: SectionId | null;
}) {
  const t = useTranslations("nav");
  const reduced = usePrefersReducedMotion();

  return (
    <nav aria-label={t("label")} className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {SECTIONS.map((section) => {
          const active = activeId === section.id;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={active ? "true" : undefined}
                className={`relative block rounded-md px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none ${
                  active
                    ? "text-white hover:text-accent"
                    : "text-muted hover:text-accent"
                }`}
              >
                {t(section.labelKey)}
                {active &&
                  (reduced ? (
                    <span aria-hidden="true" className={UNDERLINE_CLASS} />
                  ) : (
                    // Shared layoutId: the underline slides from one link to the next
                    <motion.span
                      layoutId="nav-underline"
                      aria-hidden="true"
                      className={UNDERLINE_CLASS}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 34,
                      }}
                    />
                  ))}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
