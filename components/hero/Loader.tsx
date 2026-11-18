"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { markIntroDone, useIntroDone } from "@/lib/intro";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import messages from "@/messages/en.json";

const SEEN_KEY = "intro-seen";
const DURATION = 1500; // ms of counting; fade adds ~0.4s => 2s max

function hasSeenIntro(): boolean {
  try {
    return sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function rememberIntro(): void {
  try {
    sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable: the loader will simply show again */
  }
}

/** Terminal-style loader, shown once per session. Skipped with prefers-reduced-motion. */
export default function Loader() {
  const done = useIntroDone();
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (reduced || hasSeenIntro()) {
      markIntroDone();
      return;
    }
    const begin = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - begin) / DURATION, 1);
      setProgress(Math.round((1 - (1 - t) ** 3) * 100));
      if (t < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        rememberIntro();
        markIntroDone();
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [reduced]);

  const skip = () => {
    rememberIntro();
    markIntroDone();
  };

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          className="intro-loader fixed inset-0 z-[9000] flex flex-col items-center justify-center gap-4 bg-black px-6 font-mono text-accent"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm sm:text-base">
            {messages.loader.text}
            <span className="ml-1 animate-pulse">_</span>
          </p>
          <p className="text-4xl tabular-nums sm:text-6xl">{progress}%</p>
          <div className="h-px w-48 bg-border sm:w-72">
            <div className="h-full bg-accent" style={{ width: `${progress}%` }} />
          </div>
          <button
            type="button"
            onClick={skip}
            className="absolute bottom-8 right-8 rounded-lg border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:border-accent hover:text-accent"
          >
            {messages.loader.skip}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
