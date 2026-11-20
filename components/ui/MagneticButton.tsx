"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface MagneticButtonProps {
  href: string;
  variant?: "primary" | "outline";
  children: React.ReactNode;
}

const STRENGTH = 0.3;

const VARIANTS = {
  primary: "bg-accent text-bg hover:brightness-110",
  outline: "border border-border text-text hover:border-accent hover:text-accent",
} as const;

/** Link-button that drifts slightly toward the cursor. */
export default function MagneticButton({
  href,
  variant = "primary",
  children,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent) => {
    // Touch taps also emit mouse events: only a real mouse makes the button drift
    if (reduced || e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * STRENGTH);
    y.set((e.clientY - (rect.top + rect.height / 2)) * STRENGTH);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x: sx, y: sy }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`inline-block rounded-xl px-6 py-3 font-medium transition-colors ${VARIANTS[variant]}`}
    >
      {children}
    </motion.a>
  );
}
