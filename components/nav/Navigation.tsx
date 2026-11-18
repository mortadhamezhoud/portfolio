"use client";

import { useScroll } from "framer-motion";
import Sidebar, { type NavProfile } from "./Sidebar";
import { useActiveSection } from "./useActiveSection";
import { useSectionShortcuts } from "./useSectionShortcuts";

interface NavigationProps {
  profile: NavProfile;
  hasCv: boolean;
}

/** Site navigation: desktop sidebar (and, later, the mobile bar). */
export default function Navigation({ profile, hasCv }: NavigationProps) {
  const { activeId, heroInView } = useActiveSection();
  const { scrollYProgress } = useScroll();
  useSectionShortcuts();

  return (
    <Sidebar
      profile={profile}
      hasCv={hasCv}
      activeId={activeId}
      visible={!heroInView}
      progress={scrollYProgress}
    />
  );
}
