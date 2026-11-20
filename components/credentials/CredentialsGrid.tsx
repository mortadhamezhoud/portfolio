"use client";

import { FileText, Lock, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useRef, useState } from "react";
import { useScrollControls } from "@/components/providers/SmoothScroll";
import Reveal from "@/components/ui/Reveal";
import type { Certificate } from "@/lib/types";

export type CredentialItem = Certificate & {
  available: boolean;
  logoNode: React.ReactNode;
};

export default function CredentialsGrid({ items }: { items: CredentialItem[] }) {
  const t = useTranslations("credentials");
  const locale = useLocale();
  const { lock, unlock } = useScrollControls();
  const dialog = useRef<HTMLDialogElement>(null);
  const lastTrigger = useRef<HTMLElement | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = items.find((i) => i.id === openId) ?? null;

  const fmt = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short", year: "numeric" });
  const dates = (c: Certificate) => `${fmt.format(new Date(c.start))} – ${fmt.format(new Date(c.end))}`;

  const close = useCallback(() => dialog.current?.close(), []);

  // showModal() gives focus trapping, Escape to close and an inert background
  useEffect(() => {
    const el = dialog.current;
    if (!el) return;
    if (openId && !el.open) {
      el.showModal();
      lock();
    }
  }, [openId, lock]);

  const onClosed = () => {
    setOpenId(null);
    unlock();
    lastTrigger.current?.focus();
  };

  return (
    <>
      <ul className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((item, index) => {
          const body = (
            <>
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-surface">
                {item.available ? (
                  // eslint-disable-next-line @next/next/no-img-element -- static export, redacted copy
                  <img
                    src={`/certificates/${item.file}`}
                    alt={`${t("imageAlt")} — ${item.company}`}
                    loading="lazy"
                    className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center text-muted">
                    <FileText className="h-10 w-10" aria-hidden="true" />
                    <span className="font-mono text-xs">{t("missing")}</span>
                  </div>
                )}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent"
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                {item.logoNode}
                <div className="min-w-0 text-left">
                  <p className="font-display text-lg font-bold text-text">{item.company}</p>
                  <p className="font-mono text-xs text-accent">{t(`types.${item.type}`)}</p>
                </div>
              </div>
              <p className="mt-3 text-left text-sm text-muted">{item.title[locale] ?? item.title.en}</p>
              <p className="mt-1 text-left font-mono text-xs text-text">{dates(item)}</p>
            </>
          );
          return (
            <Reveal as="li" key={item.id} delay={index * 0.1}>
              {item.available ? (
                <button
                  type="button"
                  onClick={(e) => {
                    lastTrigger.current = e.currentTarget;
                    setOpenId(item.id);
                  }}
                  aria-label={`${t("open")}: ${item.company}, ${dates(item)}`}
                  className="group block w-full rounded-2xl border border-border bg-surface/60 p-4 transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:transition-none"
                >
                  {body}
                </button>
              ) : (
                <div className="group rounded-2xl border border-dashed border-border bg-surface/40 p-4">{body}</div>
              )}
            </Reveal>
          );
        })}
      </ul>

      {/* Modal: the reminder is repeated at the bottom */}
      <dialog
        ref={dialog}
        onClose={onClosed}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
        aria-label={open ? `${open.company} — ${open.title[locale] ?? open.title.en}` : undefined}
        className="m-auto max-h-[92dvh] w-[min(92vw,56rem)] overflow-hidden rounded-2xl border border-border bg-bg p-0 text-text backdrop:bg-black/80 backdrop:backdrop-blur-sm"
      >
        {open && (
          <div className="flex max-h-[92dvh] flex-col">
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3">
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-bold">{open.company}</p>
                <p className="font-mono text-xs text-muted">{dates(open)}</p>
              </div>
              <button
                type="button"
                onClick={close}
                aria-label={t("close")}
                className="rounded-full border border-border p-2 text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-surface p-3">
              {/* eslint-disable-next-line @next/next/no-img-element -- static export, redacted copy */}
              <img
                src={`/certificates/${open.file}`}
                alt={`${t("imageAlt")} — ${open.company}`}
                className="mx-auto h-auto max-w-full"
              />
            </div>
            <div className="border-t border-border px-5 py-3 font-mono text-[11px] leading-relaxed text-[#8B97B3]">
              <p className="flex items-start gap-2">
                <Lock className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                {t("note")}
              </p>
              <p className="mt-1 pl-5">
                <a
                  href="#contact"
                  onClick={close}
                  className="text-accent underline-offset-2 hover:underline"
                >
                  {t("onRequest")}
                </a>
              </p>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
