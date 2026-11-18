"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  SIDEBAR_CLASS as CLASS_NAME,
  SIDEBAR_STORAGE_KEY as STORAGE_KEY,
} from "@/lib/sidebar-state";

function subscribe(onChange: () => void) {
  // The class on <html> is the source of truth (set before paint by a head script)
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

const getSnapshot = () =>
  document.documentElement.classList.contains(CLASS_NAME);
const getServerSnapshot = () => false;

/** Collapsed state of the desktop sidebar, remembered in localStorage (failures are ignored). */
export function useSidebarCollapsed() {
  const collapsed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggle = useCallback(() => {
    const next = !document.documentElement.classList.contains(CLASS_NAME);
    document.documentElement.classList.toggle(CLASS_NAME, next);
    try {
      localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
    } catch {
      /* storage unavailable: the choice just won't be remembered */
    }
  }, []);

  return { collapsed, toggle };
}
