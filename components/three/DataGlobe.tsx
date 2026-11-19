"use client";

import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "@/lib/hooks/useMediaQuery";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import GlobeEffects from "./GlobeEffects";
import GlobeScene from "./GlobeScene";

const DESKTOP = { particles: 4000, size: 3.0, dpr: [1, 1.75] as [number, number] };
const MOBILE = { particles: 1200, size: 3.8, dpr: [1, 1.5] as [number, number] };

/**
 * The single fixed Canvas of the site: one particle system that morphs between shapes as
 * the page scrolls. Loaded with next/dynamic (ssr: false) by GlobeBackground.
 */
export default function DataGlobe() {
  const reduced = usePrefersReducedMotion();
  const compact = useMediaQuery("(max-width: 1023px), (pointer: coarse)");
  const config = compact ? MOBILE : DESKTOP;

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={config.dpr}
        frameloop={reduced ? "demand" : "always"}
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
