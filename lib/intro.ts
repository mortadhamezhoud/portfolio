"use client";

import { useSyncExternalStore } from "react";

/** Tiny shared store: true once the loader is finished or skipped (or not needed). */
let done = false;
const listeners = new Set<() => void>();

export function markIntroDone(): void {
  if (done) return;
  done = true;
  listeners.forEach((listener) => listener());
}

export function useIntroDone(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => done,
    () => false,
  );
}
