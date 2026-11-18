"use client";

import { ChevronDown, Download } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useId, useRef, useState } from "react";
import Flag from "@/components/ui/Flags";
import type { CvOption } from "@/lib/cv-files";

const BUTTON_CLASS =
  "flex items-center justify-center gap-2 rounded-lg bg-accent px-2.5 py-2 text-xs font-semibold text-bg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent lg:px-3 lg:py-1.5";

/**
 * "Download CV" button. With several CV languages it opens a menu (current site language first);
 * with a single file it is a direct download; with none it renders nothing.
 */
interface CvMenuProps {
  cvs: CvOption[];
  /** "compact": icon only below lg (header). "full": always with its label (mobile menu). */
  variant?: "compact" | "full";
  /** Where the dropdown opens relative to the button. */
  placement?: "bottom" | "top";
}

export default function CvMenu({
  cvs,
  variant = "compact",
  placement = "bottom",
}: CvMenuProps) {
  const t = useTranslations("topActions");
  const tLang = useTranslations("language");
  const locale = useLocale();
  const menuId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const full = variant === "full";
  const labelClass = full ? "inline" : "hidden lg:inline";

  // Current site language first
  const options = [...cvs].sort(
    (a, b) => Number(b.locale === locale) - Number(a.locale === locale),
  );

  // Close with Escape (focus returns to the button) or a click outside
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Move focus to the first item when the menu opens
  useEffect(() => {
    if (open)
      rootRef.current?.querySelector<HTMLElement>('[role="menuitem"]')?.focus();
  }, [open]);

  if (options.length === 0) return null;

  if (options.length === 1) {
    return (
      <a
        href={options[0].url}
        download
        aria-label={t("downloadCv")}
        title={t("downloadCv")}
        className={`${BUTTON_CLASS} ${full ? "w-full py-3 text-sm lg:w-full" : ""}`}
      >
        <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className={labelClass}>{t("downloadCv")}</span>
      </a>
    );
  }

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(
      e.currentTarget.querySelectorAll<HTMLElement>('[role="menuitem"]'),
    );
    const index = items.indexOf(document.activeElement as HTMLElement);
    const move = (next: number) => {
      e.preventDefault();
      items[(next + items.length) % items.length]?.focus();
    };
    if (e.key === "ArrowDown") move(index + 1);
    else if (e.key === "ArrowUp") move(index - 1);
    else if (e.key === "Home") move(0);
    else if (e.key === "End") move(items.length - 1);
    else if (e.key === "Tab") setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${full ? "w-full" : ""}`}>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        aria-label={t("downloadCv")}
        title={t("downloadCv")}
        onClick={() => setOpen((v) => !v)}
        className={`${BUTTON_CLASS} ${full ? "w-full py-3 text-sm lg:w-full" : ""}`}
      >
        <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span className={labelClass}>{t("downloadCv")}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${full ? "block" : "hidden lg:block"} ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          aria-label={t("cvMenuLabel")}
          onKeyDown={onMenuKeyDown}
          className={`absolute end-0 min-w-44 ${placement === "top" ? "bottom-full mb-2" : "top-full mt-2"} rounded-xl border border-border bg-surface p-1 shadow-lg`}
        >
          {options.map((option) => (
            <a
              key={option.locale}
              role="menuitem"
              href={option.url}
              download
              tabIndex={-1}
              lang={option.locale}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-text transition-colors hover:bg-bg hover:text-accent focus-visible:bg-bg focus-visible:text-accent focus-visible:outline-none"
            >
              <Flag locale={option.locale} />
              {tLang(option.locale)} ({option.locale.toUpperCase()})
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
