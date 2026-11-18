"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface ScrollControls {
  /** Freezes page scrolling (also with Lenis, which would otherwise keep reacting to the wheel). */
  lock: () => void;
  unlock: () => void;
}

const ScrollControlsContext = createContext<ScrollControls | null>(null);

/** Lets any component freeze/unfreeze page scrolling (e.g. a full-screen menu). */
export function useScrollControls(): ScrollControls {
  const controls = useContext(ScrollControlsContext);
  if (!controls)
    throw new Error("useScrollControls must be used inside <SmoothScroll>");
  return controls;
}

/** Lenis smooth scrolling for the whole site (disabled with prefers-reduced-motion). */
export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduced = usePrefersReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ anchors: true });
    lenisRef.current = lenis;
    let frame = requestAnimationFrame(function raf(time) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });
    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  const controls = useMemo<ScrollControls>(
    () => ({
      lock: () => {
        lenisRef.current?.stop();
        document.documentElement.style.overflow = "hidden";
      },
      unlock: () => {
        document.documentElement.style.overflow = "";
        lenisRef.current?.start();
      },
    }),
    [],
  );

  return (
    <ScrollControlsContext value={controls}>{children}</ScrollControlsContext>
  );
}
