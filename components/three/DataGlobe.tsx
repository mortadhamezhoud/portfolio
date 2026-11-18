"use client";

import { Canvas } from "@react-three/fiber";
import GlobeEffects from "./GlobeEffects";
import GlobeScene from "./GlobeScene";

/** Interactive 3D data globe. Loaded with next/dynamic (ssr: false) by GlobeBackground. */
export default function DataGlobe() {
  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.75]}
        camera={{ position: [0, 0, 3.6], fov: 45 }}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      >
        <GlobeScene particleCount={2000} particleSize={3.2} animated />
        <GlobeEffects />
      </Canvas>
    </div>
  );
}
