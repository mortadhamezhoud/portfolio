"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const INTERACTIVE = 'a, button, [role="button"], [data-cursor="hover"]';

/** Cyan dot + lagging ring. Desktop (fine pointer) only; the ring grows over links and buttons. */
export default function CustomCursor() {
  const enabled = useMediaQuery("(hover: hover) and (pointer: fine)");
  const reduced = usePrefersReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 180, damping: 22, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 180, damping: 22, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("custom-cursor");

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      setHovering(!!(e.target as Element | null)?.closest?.(INTERACTIVE));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("pointermove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999]">
      <motion.div
        className="absolute left-0 top-0 -ml-[3px] -mt-[3px] h-[6px] w-[6px] rounded-full bg-accent"
        style={{ x, y, opacity: visible ? 1 : 0 }}
      />
      <motion.div
        className="absolute left-0 top-0 -ml-4 -mt-4 h-8 w-8 rounded-full border border-accent"
        style={{ x: reduced ? x : ringX, y: reduced ? y : ringY }}
        animate={{ scale: hovering ? 1.8 : 1, opacity: visible ? (hovering ? 0.6 : 0.9) : 0 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
