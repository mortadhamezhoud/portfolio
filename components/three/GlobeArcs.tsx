"use client";

import { useEffect, useMemo, useState } from "react";
import {
  type ArcData,
  generateInitialArcs,
  generateTarget,
  globeConfig,
  latLonToVector3,
  mulberry32,
} from "@/lib/globe";
import Arc from "./Arc";

interface GlobeArcsProps {
  animated: boolean;
}

interface ArcState extends ArcData {
  dying: boolean;
}

function randomDelayMs(): number {
  const { minSeconds, maxSeconds } = globeConfig.regenerate;
  return (minSeconds + Math.random() * (maxSeconds - minSeconds)) * 1000;
}

/**
 * Arcs from Tunis to points spread over every continent. Every 6-8 s one arc fades out
 * and is replaced by a new arc to a random point in the same region, so all continents
 * stay covered while the network keeps changing.
 */
export default function GlobeArcs({ animated }: GlobeArcsProps) {
  const origin = useMemo(
    () => latLonToVector3(globeConfig.origin.lat, globeConfig.origin.lon),
    [],
  );
  const [arcs, setArcs] = useState<ArcState[]>(() =>
    generateInitialArcs(mulberry32(7)).map((arc) => ({ ...arc, dying: false })),
  );

  useEffect(() => {
    if (!animated) return;
    let nextId = globeConfig.arcCount;
    const timers: ReturnType<typeof setTimeout>[] = [];

    const cycle = () => {
      const index = Math.floor(Math.random() * globeConfig.arcCount);
      setArcs((current) => current.map((a, i) => (i === index ? { ...a, dying: true } : a)));

      timers.push(
        setTimeout(() => {
          setArcs((current) =>
            current.map((a, i) => {
              if (i !== index) return a;
              const region = globeConfig.regions.find((r) => r.id === a.regionId);
              if (!region) return a;
              return {
                id: nextId++,
                regionId: region.id,
                target: generateTarget(region, Math.random),
                dying: false,
              };
            }),
          );
        }, globeConfig.regenerate.fadeSeconds * 1000),
      );
      timers.push(setTimeout(cycle, randomDelayMs()));
    };

    timers.push(setTimeout(cycle, randomDelayMs()));
    return () => timers.forEach(clearTimeout);
  }, [animated]);

  return (
    <>
      {arcs.map((arc) => (
        <Arc
          key={arc.id}
          from={origin}
          target={arc.target}
          dying={arc.dying}
          animated={animated}
        />
      ))}
      <mesh position={origin}>
        <sphereGeometry args={[0.022, 16, 16]} />
        <meshBasicMaterial color="#3EE6C1" toneMapped={false} />
      </mesh>
    </>
  );
}
