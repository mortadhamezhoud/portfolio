"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>/\_#$%&*+=";

interface DecryptTextProps {
  text: string;
  /** Start the effect when true (lets the parent wait for the loader). */
  start?: boolean;
  /** Delay before the first letter locks, in ms. */
  delay?: number;
  /** Time between each letter locking, in ms. */
  stagger?: number;
  className?: string;
}

/** Left-to-right "decrypt" effect: each letter cycles random glyphs, then locks. */
export default function DecryptText({
  text,
  start = true,
  delay = 150,
  stagger = 70,
  className,
}: DecryptTextProps) {
  const reduced = usePrefersReducedMotion();
  const [display, setDisplay] = useState(text);
  const [ready, setReady] = useState(false);
  const animate = start && !reduced;

  useEffect(() => {
    if (!animate) return;
    const scrambleSpan = 350;
    const begin = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - begin - delay;
      let done = true;
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const lockAt = i * stagger + scrambleSpan;
        if (char === " " || elapsed >= lockAt) {
          out += char;
        } else {
          done = false;
          out += elapsed < i * stagger ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
      }
      setDisplay(out);
      setReady(true);
      if (!done) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [text, animate, delay, stagger]);

  return (
    <span
      data-decrypt=""
      className={`${className ?? ""} ${reduced || ready ? "" : "invisible"}`}
      aria-label={text}
    >
      <span aria-hidden="true">{animate ? display : text}</span>
    </span>
  );
}
