"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useEffect } from "react";
import { useIntroDone } from "@/lib/intro";

const loadGlobe = () => import("@/components/three/DataGlobe");
const DataGlobe = dynamic(loadGlobe, { ssr: false });

/** If WebGL is unavailable the hero simply stays text-only. */
class GlobeErrorBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Fixed full-screen 3D layer behind the whole page. The chunk is prefetched while the loader runs
 * (after the text has rendered) and the globe mounts once the intro is done.
 * The shape sits on the right on desktop and is centered on mobile.
 */
export default function GlobeBackground() {
  const introDone = useIntroDone();

  useEffect(() => {
    const idle =
      window.requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 200));
    idle(() => void loadGlobe());
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10"
    >
      {introDone && (
        <GlobeErrorBoundary>
          <DataGlobe />
        </GlobeErrorBoundary>
      )}
    </div>
  );
}
