"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect } from "react";
import { useIntroDone } from "@/lib/intro";

const loadGlobe = () => import("@/components/three/DataGlobe");
const DataGlobe = dynamic(loadGlobe, { ssr: false });

/** If WebGL is unavailable the hero simply stays text-only. */
class GlobeErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Globe layer behind the hero text. The chunk is prefetched while the loader runs
 * (after the text has rendered) and the globe mounts once the intro is done.
 * Desktop: right side. Mobile: centered behind the text.
 */
export default function GlobeBackground() {
  const introDone = useIntroDone();

  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
    idle(() => void loadGlobe());
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 left-0 right-0 opacity-75 lg:left-[38%] lg:opacity-100"
    >
      {introDone && (
        <GlobeErrorBoundary>
          <DataGlobe />
        </GlobeErrorBoundary>
      )}
    </div>
  );
}
