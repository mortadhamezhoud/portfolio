"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import GlobeEffects from "./GlobeEffects";
import GlobeScene from "./GlobeScene";

const DESKTOP = { particles: 2000, size: 3.2, dpr: [1, 1.75] as [number, number] };
const MOBILE = { particles: 600, size: 3.8, dpr: [1, 1.5] as [number, number] };

/** Interactive 3D data globe. Loaded with next/dynamic (ssr: false) by GlobeBackground. */
export default function DataGlobe() {
  const reduced = usePrefersReducedMotion();
  const compact = useMediaQuery("(max-width: 1023px), (pointer: coarse)");
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Stop rendering while the hero is off-screen
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const config = compact ? MOBILE : DESKTOP;

  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        dpr={config.dpr}
        frameloop={inView && !reduced ? "always" : "demand"}
        camera={{ position: [0, 0, 3.6], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <GlobeScene
          particleCount={config.particles}
          particleSize={config.size}
          animated={!reduced}
        />
        {/* No post-processing on mobile */}
        {!compact && <GlobeEffects minimal={reduced} />}
      </Canvas>
    </div>
  );
}
