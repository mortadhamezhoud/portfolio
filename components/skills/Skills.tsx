"use client";

import { Braces, BrainCircuit, Database, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import type { SkillGroup } from "@/lib/types";

const ICONS: Record<string, LucideIcon> = {
  "data-bi": Database,
  "machine-learning": BrainCircuit,
  development: Braces,
};

const MAX_TILT = 6; // degrees

/** One category card: tags cascade in when it enters the screen, 3D tilt toward the mouse on hover. */
function SkillCard({ group, index }: { group: SkillGroup; index: number }) {
  const reduced = usePrefersReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const Icon = ICONS[group.id] ?? Database;

  // Direct style updates: no React re-render on every pointer move
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || reduced || e.pointerType === "touch") return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * MAX_TILT * 2).toFixed(2)}deg) rotateY(${(x * MAX_TILT * 2).toFixed(2)}deg)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <motion.li
      initial={reduced ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, ease: "easeOut", delay: index * 0.12 }}
    >
      <div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="h-full rounded-2xl border border-border bg-surface p-6 transition-[border-color,transform] duration-200 ease-out hover:border-accent motion-reduce:transition-none"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-bg text-accent">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </span>
          <p className="font-mono text-sm text-accent">{String(index + 1).padStart(2, "0")}</p>
        </div>
        <h3 className="mt-5 font-display text-2xl font-bold text-text">{group.group}</h3>
        <motion.ul
          className="mt-5 flex flex-wrap gap-2"
          initial={reduced ? false : "hidden"}
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 + index * 0.12 } } }}
        >
          {group.items.map((item) => (
            <motion.li
              key={item}
              variants={{ hidden: { opacity: 0, y: 8, scale: 0.9 }, show: { opacity: 1, y: 0, scale: 1 } }}
              className="rounded-full border border-border bg-bg px-3 py-1 font-mono text-xs text-text"
            >
              {item}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </motion.li>
  );
}

export default function Skills({ groups }: { groups: SkillGroup[] }) {
  const t = useTranslations("nav");
  return (
    <section
      id="skills"
      className="mx-auto flex w-full max-w-6xl flex-col justify-center px-6 py-16 lg:min-h-dvh lg:py-24 lg:px-16"
    >
      <h2 className="font-display font-bold text-text text-[clamp(1.875rem,9vw,2.25rem)] sm:text-5xl">{t("skills")}</h2>
      <ul className="mt-12 grid gap-5 lg:grid-cols-3">
        {groups.map((group, index) => (
          <SkillCard key={group.id} group={group} index={index} />
        ))}
      </ul>
    </section>
  );
}
