"use client";

import { useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const SPRING = { stiffness: 150, damping: 18, mass: 0.5 };
const clamp = (v: number, limit: number) =>
  Math.max(-limit, Math.min(limit, v));

/**
 * Normalized pointer position over the card, from -0.5 to 0.5 on each axis (0 = centered),
 * smoothed with springs. Fed by the mouse on desktop and by the gyroscope on touch devices
 * (where available without a permission prompt, i.e. not on iOS). Inert with reduced motion.
 */
export function useCardPointer() {
  const reduced = usePrefersReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);

  const onPointerMove = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (reduced || e.pointerType !== "mouse") return;
      const rect = e.currentTarget.getBoundingClientRect();
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    },
    [reduced, rawX, rawY],
  );

  const onPointerLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
  }, [rawX, rawY]);

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: none) and (pointer: coarse)").matches)
      return;
    if (typeof DeviceOrientationEvent === "undefined") return;
    // iOS needs an explicit permission prompt: skipped on purpose
    const permissionApi = DeviceOrientationEvent as unknown as {
      requestPermission?: unknown;
    };
    if (typeof permissionApi.requestPermission === "function") return;

    const onOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;
      // +/-30 degrees of device tilt => +/-0.25 (about 6 degrees of card tilt)
      rawX.set(clamp(e.gamma / 120, 0.25));
      rawY.set(clamp((e.beta - 45) / 120, 0.25));
    };
    window.addEventListener("deviceorientation", onOrientation);
    return () => window.removeEventListener("deviceorientation", onOrientation);
  }, [reduced, rawX, rawY]);

  return { x, y, onPointerMove, onPointerLeave };
}
