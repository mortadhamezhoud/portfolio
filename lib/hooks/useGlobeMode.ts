"use client";

import { useEffect, useState } from "react";

/**
 * "3d": real WebGL globe. "static": pre-rendered image (weak device, battery saver,
 * reduced motion/data, or no WebGL). `null` until the client has decided.
 */
export type GlobeMode = "3d" | "static" | null;

interface NavigatorExtras extends Navigator {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
  getBattery?: () => Promise<{ level: number; charging: boolean }>;
}

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

/** Phones with 4 cores or less / 4 GB or less, or with data saver on, get the static image. */
function isWeakDevice(): boolean {
  const nav = navigator as NavigatorExtras;
  if (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) return true;
  if (nav.deviceMemory && nav.deviceMemory <= 4) return true;
  return !!nav.connection?.saveData;
}

export function useGlobeMode(mobile: boolean, reducedMotion: boolean): GlobeMode {
  const [mode, setMode] = useState<GlobeMode>(null);

  useEffect(() => {
    if (!hasWebGL() || (mobile && (reducedMotion || isWeakDevice()))) {
      setMode("static");
      return;
    }
    setMode("3d");
    if (!mobile) return;

    // Battery saver is not exposed by browsers: a low, discharging battery is the closest signal.
    let cancelled = false;
    const nav = navigator as NavigatorExtras;
    nav
      .getBattery?.()
      .then((battery) => {
        if (!cancelled && !battery.charging && battery.level <= 0.2) setMode("static");
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [mobile, reducedMotion]);

  return mode;
}
