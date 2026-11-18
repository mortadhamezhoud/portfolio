"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import { useActiveSection } from "@/components/nav/useActiveSection";
import { useSectionShortcuts } from "@/components/nav/useSectionShortcuts";
import type { CvOption } from "@/lib/cv-files";
import type { Profile } from "@/lib/types";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import CvMenu from "./CvMenu";
import HeaderBrand, { type BrandProfile } from "./HeaderBrand";
import HeaderNav from "./HeaderNav";
import MobileMenu from "./MobileMenu";
import LanguageSwitch from "./LanguageSwitch";

/** Scroll position (px) after which the header takes its "scrolled" look. */
const SCROLLED_AT = 8;
/** The header never hides this close to the top of the page. */
const HIDE_AFTER = 120;
/** Scroll distance (px) ignored before the direction is considered to have changed. */
const DIRECTION_THRESHOLD = 8;

interface HeaderProps {
  profile: BrandProfile & Pick<Profile, "contact">;
  cvs: CvOption[];
}

/**
 * Fixed full-width header: transparent over the hero, frosted once scrolled (and shorter),
 * hidden while scrolling down and back when scrolling up.
 */
export default function Header({ profile, cvs }: HeaderProps) {
  const { activeId } = useActiveSection();
  const { scrollY, scrollYProgress } = useScroll();
  const reduced = usePrefersReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("nav");
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  useSectionShortcuts();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setScrolled(latest > SCROLLED_AT);
    const delta = latest - (scrollY.getPrevious() ?? latest);
    if (delta > DIRECTION_THRESHOLD && latest > HIDE_AFTER)
      setScrollingDown(true);
    else if (delta < -DIRECTION_THRESHOLD || latest <= HIDE_AFTER)
      setScrollingDown(false);
  });

  // With reduced motion the header never hides
  const hidden = scrollingDown && !reduced && !menuOpen;

  return (
    <>
      <header
        // A keyboard user tabbing into a hidden header brings it back
        onFocusCapture={() => setScrollingDown(false)}
        className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter,transform] duration-300 motion-reduce:transition-none ${
          scrolled
            ? "border-border bg-bg/80 backdrop-blur-md"
            : "border-transparent bg-transparent backdrop-blur-none"
        } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        <div
          className={`mx-auto grid max-w-[100rem] grid-cols-[1fr_auto_1fr] items-center gap-4 px-4 transition-[height] duration-300 motion-reduce:transition-none sm:px-6 ${
            scrolled ? "h-16" : "h-20"
          }`}
        >
          <div className="justify-self-start">
            <HeaderBrand profile={profile} />
          </div>

          <HeaderNav activeId={activeId} />

          <div className="col-start-3 flex items-center gap-2 justify-self-end">
            {/* Language switch: desktop header only (it lives in the full-screen menu on small screens) */}
            <div className="hidden lg:block">
              <LanguageSwitch />
            </div>
            <CvMenu cvs={cvs} />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("openMenu")}
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-text transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Scroll progress */}
        <motion.span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent rtl:origin-right"
          style={{ scaleX: scrollYProgress }}
        />
      </header>

      {/* Outside the header: a transformed/blurred ancestor would break position: fixed */}
      <MobileMenu
        open={menuOpen}
        onClose={closeMenu}
        activeId={activeId}
        cvs={cvs}
        contact={profile.contact}
      />
    </>
  );
}
