"use client";

import { motion, type Variants } from "framer-motion";
import DecryptText from "@/components/ui/DecryptText";
import MagneticButton from "@/components/ui/MagneticButton";
import profile from "@/data/profile.json";
import messages from "@/messages/en.json";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.18, delayChildren: 0.2 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  const reduced = usePrefersReducedMotion();

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden px-6 lg:px-16">
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center gap-6 text-center lg:mx-0 lg:items-start lg:text-left"
        variants={container}
        initial={reduced ? false : "hidden"}
        animate="show"
      >
        <motion.p variants={item} className="font-mono text-xs text-accent sm:text-sm">
          {profile.status}
        </motion.p>
        <h1 className="font-display text-5xl font-bold tracking-tight text-text sm:text-7xl xl:text-8xl">
          <DecryptText text={profile.name} />
        </h1>
        <motion.p variants={item} className="text-lg text-text sm:text-2xl">
          {profile.title}
        </motion.p>
        <motion.p variants={item} className="max-w-xl text-muted">
          {profile.tagline}
        </motion.p>
        <motion.div variants={item} className="mt-4 flex flex-wrap justify-center gap-4 lg:justify-start">
          <MagneticButton href="#projects">{profile.ctaLabel}</MagneticButton>
          <MagneticButton href="#contact" variant="outline">
            {messages.hero.contactLabel}
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
}
