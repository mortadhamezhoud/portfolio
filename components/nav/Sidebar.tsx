"use client";

import { motion, type MotionValue } from "framer-motion";
import { useTranslations } from "next-intl";
import { SECTIONS, type SectionId } from "@/lib/sections";
import type { Profile } from "@/lib/types";
import NavLink from "./NavLink";
import SidebarActions from "./SidebarActions";
import SidebarProfile from "./SidebarProfile";
import SidebarToggle from "./SidebarToggle";

export type NavProfile = Pick<
  Profile,
  "name" | "photo" | "photoAlt" | "contact"
>;

interface SidebarProps {
  profile: NavProfile;
  hasCv: boolean;
  activeId: SectionId | null;
  /** False while the hero is on screen: the sidebar stays hidden. */
  visible: boolean;
  /** Page scroll progress, 0 to 1. */
  progress: MotionValue<number>;
}

/** Fixed desktop sidebar (>= 1024px). Sits at the inline start, so it flips to the right in RTL. */
export default function Sidebar({
  profile,
  hasCv,
  activeId,
  visible,
  progress,
}: SidebarProps) {
  const t = useTranslations("nav");

  return (
    <aside
      inert={!visible}
      className={`fixed inset-y-0 start-0 z-40 hidden w-[var(--sidebar-w)] flex-col gap-6 border-e border-border bg-bg p-4 transition-[width,opacity] duration-300 motion-reduce:transition-none lg:flex ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      {/* Scroll progress: the right border fills with cyan */}
      <motion.span
        aria-hidden="true"
        className="absolute inset-y-0 -end-px w-0.5 origin-top bg-accent"
        style={{ scaleY: progress }}
      />
      <SidebarToggle />
      <SidebarProfile profile={profile} />

      <nav
        aria-label={t("label")}
        className="flex flex-1 flex-col justify-center"
      >
        <ul className="flex flex-col gap-1">
          {SECTIONS.map((section, index) => (
            <li key={section.id}>
              <NavLink
                section={section}
                index={index}
                label={t(section.labelKey)}
                active={activeId === section.id}
              />
            </li>
          ))}
        </ul>
      </nav>

      <SidebarActions contact={profile.contact} hasCv={hasCv} />
    </aside>
  );
}
