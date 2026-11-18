"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import DecryptText from "@/components/ui/DecryptText";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import profile from "@/data/profile.json";
import messages from "@/messages/en.json";
import OrbitBadge from "./OrbitBadge";
import { useCardPointer } from "./useCardPointer";

const MAX_TILT_DEG = 12;

/** Orbit slots sit on the card edges so they never cover the face (center-top of the card). */
const ORBIT_SLOTS = [
  {
    position: "left-[-4%] top-[-6%] lg:left-[-9%]",
    depth: -60,
    duration: 6,
    delay: 0,
  },
  {
    position: "right-[-4%] top-[14%] lg:right-[-10%]",
    depth: 90,
    duration: 7,
    delay: 1.2,
  },
  {
    position: "left-[-5%] top-[52%] lg:left-[-12%]",
    depth: 45,
    duration: 5.5,
    delay: 0.6,
  },
  {
    position: "right-[-5%] top-[60%] lg:right-[-8%]",
    depth: -80,
    duration: 6.5,
    delay: 2,
  },
  {
    position: "bottom-[-4%] right-[10%]",
    depth: 55,
    duration: 7.5,
    delay: 0.3,
  },
] as const;
const SCAN_MS = 1200;
const VERIFIED_HOLD_MS = 2000;
const VERIFIED_DECRYPT_MS = 1200;

type Phase = "idle" | "scan" | "verified" | "done";

const PHOTO_SIZES = "(min-width: 1024px) 420px, 85vw";
const DUOTONE_FILTER = "url(#mm-duotone)";

/** SVG duotone: shadows -> #05070D, highlights -> a softened cyan (keeps white backgrounds calm). */
function DuotoneFilter() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      className="absolute"
    >
      <filter id="mm-duotone" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.02 0.14" />
          <feFuncG type="table" tableValues="0.03 0.55" />
          <feFuncB type="table" tableValues="0.05 0.5" />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}

/** Holographic ID card: portrait, duotone photo that turns to full color on hover. */
export default function IdentityCard() {
  const { about } = messages;
  const reduced = usePrefersReducedMotion();
  const [phase, setPhase] = useState<Phase>("idle");
  const current: Phase = reduced ? "done" : phase;

  // 3D tilt toward the pointer + iridescent reflection that follows it
  const pointer = useCardPointer();
  const rotateY = useTransform(pointer.x, (v) => v * 2 * MAX_TILT_DEG);
  const rotateX = useTransform(pointer.y, (v) => -v * 2 * MAX_TILT_DEG);
  const glowX = useTransform(pointer.x, (v) => (v + 0.5) * 100);
  const glowY = useTransform(pointer.y, (v) => (v + 0.5) * 100);
  const orbitSkills = profile.featuredSkills.slice(0, ORBIT_SLOTS.length);
  const reflection = useMotionTemplate`radial-gradient(circle at ${glowX}% ${glowY}%, rgba(62,230,193,0.28), rgba(91,140,255,0.18) 28%, rgba(168,85,247,0.14) 48%, transparent 68%)`;

  // Scan -> "identity verified" -> fade out
  useEffect(() => {
    if (phase === "scan") {
      const t = setTimeout(() => setPhase("verified"), SCAN_MS);
      return () => clearTimeout(t);
    }
    if (phase === "verified") {
      const t = setTimeout(
        () => setPhase("done"),
        VERIFIED_DECRYPT_MS + VERIFIED_HOLD_MS,
      );
      return () => clearTimeout(t);
    }
  }, [phase]);

  const revealed = current !== "idle";

  return (
    <div
      className="relative w-full [perspective:900px]"
      onPointerMove={pointer.onPointerMove}
      onPointerLeave={pointer.onPointerLeave}
    >
      {orbitSkills.map((label, i) => (
        <OrbitBadge
          key={label}
          label={label}
          {...ORBIT_SLOTS[i]}
          floatDuration={ORBIT_SLOTS[i].duration}
          floatDelay={ORBIT_SLOTS[i].delay}
          pointerX={pointer.x}
          pointerY={pointer.y}
        />
      ))}
      <motion.div
        className="card-border group w-full rounded-2xl p-px"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onViewportEnter={() => setPhase((p) => (p === "idle" ? "scan" : p))}
        viewport={{ once: true, amount: 0.4 }}
      >
        <DuotoneFilter />
        <div className="relative flex aspect-[4/5] flex-col gap-3 overflow-hidden rounded-[15px] bg-surface p-4">
          {/* Header */}
          <div className="flex items-center justify-between font-mono text-[11px] tracking-wider text-muted">
            <span>{about.idLabel}</span>
            <span className="flex items-center gap-2 text-green-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60 motion-reduce:animate-none" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
              </span>
              {about.online}
            </span>
          </div>

          {/* Photo frame */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-bg">
            <motion.div
              className="absolute inset-0"
              initial={reduced ? false : { clipPath: "inset(0 0 100% 0)" }}
              animate={{
                clipPath: revealed ? "inset(0 0 0% 0)" : "inset(0 0 100% 0)",
              }}
              transition={{
                duration: reduced ? 0 : SCAN_MS / 1000,
                ease: "linear",
              }}
            >
              <Image
                src={profile.photo}
                alt={profile.photoAlt}
                fill
                sizes={PHOTO_SIZES}
                priority={false}
                className="object-cover object-[50%_20%]"
              />
              {/* Duotone layer: fades out on hover (hidden with reduced motion: real colors) */}
              <Image
                src={profile.photo}
                alt=""
                aria-hidden="true"
                fill
                sizes={PHOTO_SIZES}
                priority={false}
                style={{ filter: DUOTONE_FILTER }}
                className="object-cover object-[50%_20%] transition-opacity duration-[600ms] group-hover:opacity-0 motion-reduce:hidden"
              />
            </motion.div>
            {/* Scan line, travels down while the photo is revealed */}
            {current === "scan" && (
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 h-0.5 bg-accent shadow-[0_0_14px_2px_#3EE6C1]"
                initial={{ top: "0%" }}
                animate={{ top: "100%" }}
                transition={{ duration: SCAN_MS / 1000, ease: "linear" }}
              />
            )}
            {/* Verification message */}
            <AnimatePresence>
              {current === "verified" && (
                <motion.p
                  role="status"
                  className="absolute inset-x-0 bottom-3 mx-auto w-fit rounded-md border border-accent/40 bg-bg/80 px-3 py-1 font-mono text-[11px] tracking-wider text-accent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <DecryptText text={about.verified} delay={0} stagger={40} />
                </motion.p>
              )}
            </AnimatePresence>
            {/* Screen overlays: dot grid + scan lines */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(62,230,193,0.18)_1px,transparent_1px)] [background-size:14px_14px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(231,236,247,0.04)_0_1px,transparent_1px_3px)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 [background:linear-gradient(to_top,rgba(14,21,40,0.75),transparent_35%)]"
            />
          </div>

          {/* Footer */}
          <div className="flex flex-col gap-1">
            <p className="font-display text-xl font-bold text-text">
              {profile.name}
            </p>
            <p className="text-sm text-text">{profile.title}</p>
            <p className="font-mono text-[11px] text-accent">
              {about.location}
            </p>
          </div>
          {/* Holographic reflection following the pointer */}
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100 motion-reduce:hidden [@media(hover:none)]:opacity-60"
            style={{ background: reflection }}
          />
        </div>
      </motion.div>
    </div>
  );
}
