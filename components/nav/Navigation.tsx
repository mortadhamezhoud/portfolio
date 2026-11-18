"use client";

import { useScroll } from "framer-motion";
import MobileBar from "./MobileBar";
import Sidebar, { type NavProfile } from "./Sidebar";
import { useActiveSection } from "./useActiveSection";
import { useSectionShortcuts } from "./useSectionShortcuts";

interface NavigationProps {
  profile: NavProfile;
}

/** Site navigation: desktop sidebar and mobile bottom bar. */
export default function Navigation({ profile }: NavigationProps) {
  const { activeId, heroInView } = useActiveSection();
  const { scrollYProgress } = useScroll();
  useSectionShortcuts();

  return (
    <>
      <Sidebar
        profile={profile}
        activeId={activeId}
        visible={!heroInView}
        progress={scrollYProgress}
      />
      <MobileBar activeId={activeId} visible={!heroInView} />
    </>
  );
}
