"use client";

import { Bloom, ChromaticAberration, EffectComposer, Noise } from "@react-three/postprocessing";
import { useState } from "react";
import * as THREE from "three";

/** Desktop post-processing: light bloom, very subtle grain, slight chromatic aberration. */
export default function GlobeEffects({ minimal = false }: { minimal?: boolean }) {
  const [offset] = useState(() => new THREE.Vector2(0.0006, 0.0006));

  if (minimal) {
    return (
      <EffectComposer multisampling={0}>
        <Bloom intensity={0.6} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
      </EffectComposer>
    );
  }

  return (
    <EffectComposer multisampling={0}>
      <Bloom intensity={0.6} luminanceThreshold={0.2} luminanceSmoothing={0.4} mipmapBlur />
      <Noise opacity={0.04} />
      <ChromaticAberration offset={offset} radialModulation={false} modulationOffset={0} />
    </EffectComposer>
  );
}
