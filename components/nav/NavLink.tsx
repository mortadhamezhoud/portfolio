"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type { SectionItem } from "@/lib/sections";

interface NavLinkProps {
  section: SectionItem;
  index: number;
  label: string;
  active: boolean;
}

const INDICATOR_CLASS =
  "absolute inset-0 -z-10 rounded-lg border-s-2 border-accent bg-surface";

/** Numbered sidebar link: shifts toward the content on hover, with an animated underline. */
export default function NavLink({
  section,
  index,
  label,
  active,
}: NavLinkProps) {
  const Icon = section.icon;
  const reduced = usePrefersReducedMotion();

  return (
    <a
      href={`#${section.id}`}
      aria-current={active ? "true" : undefined}
      title={label}
      className={`group/link relative isolate flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-[color,translate] duration-200 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none rtl:hover:-translate-x-1 ${
        active ? "text-accent" : "text-muted hover:text-text"
      }`}
    >
      {active &&
        (reduced ? (
          <span aria-hidden="true" className={INDICATOR_CLASS} />
        ) : (
          // Shared layoutId: the indicator slides from one link to the next
          <motion.span
            layoutId="nav-indicator"
            aria-hidden="true"
            className={INDICATOR_CLASS}
            transition={{ type: "spring", stiffness: 400, damping: 34 }}
          />
        ))}
      <span className="font-mono text-[11px] tabular-nums opacity-70">
        {String(index + 1).padStart(2, "0")}
      </span>
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="relative in-[.sidebar-collapsed]:hidden">
        {label}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/link:scale-x-100 motion-reduce:transition-none rtl:origin-right"
        />
      </span>
    </a>
  );
}
