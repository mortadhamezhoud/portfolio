"use client";

import { motion, useScroll } from "framer-motion";
import { useActiveSection } from "@/components/nav/useActiveSection";
import { useSectionShortcuts } from "@/components/nav/useSectionShortcuts";
import type { CvOption } from "@/lib/cv-files";
import CvMenu from "./CvMenu";
import HeaderBrand, { type BrandProfile } from "./HeaderBrand";
import HeaderNav from "./HeaderNav";
import LanguageSwitch from "./LanguageSwitch";

interface HeaderProps {
  profile: BrandProfile;
  cvs: CvOption[];
}

/** Fixed full-width header: brand on the start side, section links in the center, actions on the end side. */
export default function Header({ profile, cvs }: HeaderProps) {
  const { activeId } = useActiveSection();
  const { scrollYProgress } = useScroll();
  useSectionShortcuts();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto grid h-[var(--header-h)] max-w-[100rem] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 sm:px-6">
        <div className="justify-self-start">
          <HeaderBrand profile={profile} />
        </div>

        <HeaderNav activeId={activeId} />

        <div className="col-start-3 flex items-center gap-2 justify-self-end">
          <LanguageSwitch />
          <CvMenu cvs={cvs} />
        </div>
      </div>

      {/* Scroll progress */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent rtl:origin-right"
        style={{ scaleX: scrollYProgress }}
      />
    </header>
  );
}
