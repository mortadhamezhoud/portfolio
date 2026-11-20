"use client";

import dynamic from "next/dynamic";
import { Component, type ReactNode, useCallback, useEffect, useState } from "react";
import { useGlobeMode } from "@/lib/hooks/useGlobeMode";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useIntroDone } from "@/lib/intro";

const loadGlobe = () => import("@/components/three/DataGlobe");
const DataGlobe = dynamic(loadGlobe, { ssr: false });
const loadMobileGlobe = () => import("@/components/three/MobileGlobe");
const MobileGlobe = dynamic(loadMobileGlobe, { ssr: false });

/** Pre-rendered globe, used whenever the real one cannot or should not run. */
function StaticGlobe({ mobile }: { mobile: boolean }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- static export, image is pre-optimized
    <img
      src="/images/globe-static.webp"
      alt=""
      width={640}
      height={640}
      decoding="async"
      fetchPriority={mobile ? "high" : "auto"}
      className={
        mobile
          ? "absolute left-1/2 top-[44%] w-[92vw] max-w-[28rem] -translate-x-1/2 -translate-y-1/2 opacity-70"
          : "absolute right-[-6%] top-1/2 w-[52vw] max-w-[52rem] -translate-y-1/2 opacity-80"
      }
    />
  );
}

/** If WebGL crashes, the pre-rendered image replaces the canvas without any error. */
class GlobeErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * 3D layer behind the page.
 * Desktop: fixed full-screen canvas that morphs while scrolling.
 * Phone: a simple globe behind the Hero only (it scrolls away with it and stops rendering
 * once off screen), then a plain dark gradient. Weak devices get a static image instead.
 */
export default function GlobeBackground() {
  const introDone = useIntroDone();
  const mobile = useMediaQuery("(max-width: 1023px), (pointer: coarse)");
  const reduced = usePrefersReducedMotion();
  const detected = useGlobeMode(mobile, reduced);
  const [lost, setLost] = useState(false);
  const onLost = useCallback(() => setLost(true), []);
  // Phones: the static image is shown first; the live globe starts on the first touch or after 6 s, if the Hero is still on screen
  const [liveOk, setLiveOk] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);
  useEffect(() => {
    if (!mobile || detected !== "3d") return;
    // Only worth starting while the Hero (the only place the globe is visible) is still on screen
    const start = () => {
      if (window.scrollY < window.innerHeight * 0.5) setLiveOk(true);
    };
    const timer = window.setTimeout(start, 6000);
    const events = ["touchstart", "scroll", "pointerdown"] as const;
    events.forEach((e) => window.addEventListener(e, start, { once: true, passive: true }));
    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, start));
    };
  }, [mobile, detected]);
  const mode = lost ? "static" : detected;

  useEffect(() => {
    if (mode !== "3d" || (mobile && !liveOk)) return;
    const idle =
      window.requestIdleCallback ??
      ((cb: () => void) => window.setTimeout(cb, 200));
    idle(() => void (mobile ? loadMobileGlobe() : loadGlobe()));
  }, [mode, mobile, liveOk]);

  const liveMobile = mobile && mode === "3d" && liveOk;

  return (
    <>
      {/* Phones: gradient + static globe are in the server HTML (CSS decides who sees them), so the
          globe image is the first paint and no JS is needed to show it. */}
      <div
        aria-hidden="true"
        className="mobile-globe pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_50%_0%,rgba(62,230,193,0.07),transparent_55%),linear-gradient(180deg,#05070d,#080d1a_60%,#05070d)]"
      />
      <div
        aria-hidden="true"
        className="mobile-globe pointer-events-none absolute inset-x-0 top-0 -z-10 h-dvh overflow-hidden"
      >
        {!(mobile && ready && mode === "3d") && <StaticGlobe mobile />}
        {liveMobile && (
          <GlobeErrorBoundary fallback={null}>
            <MobileGlobe onLost={onLost} onReady={onReady} />
          </GlobeErrorBoundary>
        )}
      </div>
      {!mobile && (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
          {introDone && mode === "static" && <StaticGlobe mobile={false} />}
          {introDone && mode === "3d" && (
            <GlobeErrorBoundary fallback={<StaticGlobe mobile={false} />}>
              <DataGlobe onLost={onLost} />
            </GlobeErrorBoundary>
          )}
        </div>
      )}
    </>
  );
}
