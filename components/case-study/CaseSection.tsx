"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface CaseSectionProps {
  id: string;
  /** 1-based position, shown as 01-10 in JetBrains Mono. */
  number: number;
  title: string;
  children?: React.ReactNode;
}

/** A numbered case study section that fades in when it scrolls into view. */
export default function CaseSection({ id, number, title, children }: CaseSectionProps) {
  const reduced = usePrefersReducedMotion();
  return (
    <motion.section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-28 py-14"
      initial={reduced ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <p className="font-mono text-sm text-accent">{String(number).padStart(2, "0")}</p>
      <h2
        id={`${id}-title`}
        className="mt-2 font-display text-3xl font-bold text-text sm:text-4xl"
      >
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </motion.section>
  );
}
