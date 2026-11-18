"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useSidebarCollapsed } from "./useSidebarCollapsed";

/** Round button on the sidebar's outer edge: collapse to icons only, or expand again. */
export default function SidebarToggle() {
  const t = useTranslations("nav");
  const { collapsed, toggle } = useSidebarCollapsed();
  const label = collapsed ? t("expand") : t("collapse");
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      aria-expanded={!collapsed}
      className="absolute -end-3 top-[4.5rem] z-10 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-bg text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent rtl:rotate-180"
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
    </button>
  );
}
