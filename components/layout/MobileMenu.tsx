"use client";

import { AnimatePresence, motion, type Variants } from "framer-motion";
import { Mail, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useScrollControls } from "@/components/providers/SmoothScroll";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import type { CvOption } from "@/lib/cv-files";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { SECTIONS, type SectionId } from "@/lib/sections";
import type { Profile } from "@/lib/types";
import CvMenu from "./CvMenu";
import LanguageSwitch from "./LanguageSwitch";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  activeId: SectionId | null;
  cvs: CvOption[];
  contact: Profile["contact"];
}

/**
 * Full-screen menu for < 1024px: links in large type (staggered), language switch and CV at the
 * bottom. Closes with the X button, Escape or a click on a link. Locks page scroll and traps focus.
 */
export default function MobileMenu({
  open,
  onClose,
  activeId,
  cvs,
  contact,
}: MobileMenuProps) {
  const t = useTranslations("nav");
  const reduced = usePrefersReducedMotion();
  const { lock, unlock } = useScrollControls();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Lock scroll while open, move focus in, and give it back to the opener on close
  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    lock();
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;
      // Focus trap: Tab and Shift+Tab loop inside the menu
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    // The menu is only for small screens: close it if the window becomes wide
    const media = window.matchMedia("(min-width: 1024px)");
    const onMedia = () => media.matches && onClose();

    document.addEventListener("keydown", onKeyDown);
    media.addEventListener("change", onMedia);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      media.removeEventListener("change", onMedia);
      unlock();
      opener?.focus?.();
    };
  }, [open, onClose, lock, unlock]);

  const contactLinks = [
    {
      key: "linkedin",
      href: contact.linkedin,
      icon: LinkedInIcon,
      external: true,
    },
    { key: "github", href: contact.github, icon: GitHubIcon, external: true },
    {
      key: "email",
      href: contact.email ? `mailto:${contact.email}` : "",
      icon: Mail,
      external: false,
    },
  ] as const;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={panelRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={t("menuTitle")}
          // Lenis must not hijack wheel/touch events inside the menu
          data-lenis-prevent
          className="fixed inset-0 z-[60] flex flex-col overflow-y-auto bg-bg px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 lg:hidden"
          initial={reduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduced ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: reduced ? 0 : 0.25 }}
        >
          <div className="flex h-16 shrink-0 items-center justify-between">
            <span
              dir="ltr"
              aria-hidden="true"
              className="font-display text-lg font-bold tracking-tight text-white"
            >
              MM<span className="text-accent">.</span>
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t("closeMenu")}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav
            aria-label={t("label")}
            className="flex flex-1 flex-col justify-center py-6"
          >
            <motion.ul
              className="flex flex-col gap-2"
              variants={list}
              initial={reduced ? false : "hidden"}
              animate="show"
            >
              {SECTIONS.map((section, index) => {
                const active = activeId === section.id;
                return (
                  <motion.li key={section.id} variants={item}>
                    <a
                      href={`#${section.id}`}
                      aria-current={active ? "true" : undefined}
                      // Unlock first so the browser (or Lenis) can scroll to the section
                      onClick={() => {
                        unlock();
                        onClose();
                      }}
                      className={`flex items-baseline gap-4 rounded-lg py-2 font-display text-4xl font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        active ? "text-accent" : "text-text hover:text-accent"
                      }`}
                    >
                      <span className="font-mono text-sm font-normal text-muted">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {t(section.labelKey)}
                    </a>
                  </motion.li>
                );
              })}
            </motion.ul>
          </nav>

          <div className="flex shrink-0 flex-col gap-4 border-t border-border pt-4">
            <div className="flex items-center justify-between gap-3">
              <LanguageSwitch />
              <div className="flex items-center gap-2">
                {contactLinks
                  .filter((link) => link.href)
                  .map(({ key, href, icon: Icon, external }) => (
                    <a
                      key={key}
                      href={href}
                      aria-label={t(key)}
                      title={t(key)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                      {...(external
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  ))}
              </div>
            </div>
            <CvMenu cvs={cvs} variant="full" placement="top" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
