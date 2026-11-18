"use client";

import Lenis from "lenis";
import { useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/** Lenis smooth scrolling for the whole site (disabled with prefers-reduced-motion). */
export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ anchors: true });
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, [reduced]);

  return <>{children}</>;
}
