"use client";

import { type MotionValue, motion, useTransform } from "framer-motion";

interface OrbitBadgeProps {
  label: string;
  /** Parallax strength in px; negative values move against the pointer. */
  depth: number;
  /** Tailwind position classes (kept at the card edges, away from the face). */
  position: string;
  floatDuration: number;
  floatDelay: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}

/** Small skill badge floating around the card with mouse parallax. */
export default function OrbitBadge({
  label,
  depth,
  position,
  floatDuration,
  floatDelay,
  pointerX,
  pointerY,
}: OrbitBadgeProps) {
  const x = useTransform(pointerX, (v) => v * depth);
  const y = useTransform(pointerY, (v) => v * depth);

  return (
    <motion.div
      aria-hidden="true"
      className={`pointer-events-none absolute z-20 ${position}`}
      style={{ x, y }}
    >
      <div
        className="orbit-float rounded-lg border border-border bg-surface/80 px-2.5 py-1 font-mono text-[11px] text-text backdrop-blur-sm motion-reduce:animate-none"
        style={
          {
            "--float-duration": `${floatDuration}s`,
            "--float-delay": `${floatDelay}s`,
          } as React.CSSProperties
        }
      >
        {label}
      </div>
    </motion.div>
  );
}
