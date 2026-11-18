"use client";

import Sidebar, { type NavProfile } from "./Sidebar";

interface NavigationProps {
  profile: NavProfile;
  hasCv: boolean;
}

/** Site navigation: desktop sidebar (and, later, the mobile bar). */
export default function Navigation({ profile, hasCv }: NavigationProps) {
  return <Sidebar profile={profile} hasCv={hasCv} activeId={null} />;
}
