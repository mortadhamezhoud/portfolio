"use client";

import { useLocale, useTranslations } from "next-intl";
import Flag from "@/components/ui/Flags";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/** EN | FR switch. Keeps the scroll position and remembers the choice for the `/` redirect. */
export default function LanguageSwitcher() {
  const t = useTranslations("language");
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (locale: Locale) => {
    if (locale === current) return;
    try {
      localStorage.setItem("locale", locale);
    } catch {
      /* storage unavailable: the choice is simply not remembered */
    }
    router.replace(pathname, { locale, scroll: false });
  };

  return (
    <nav
      aria-label={t("label")}
      className="fixed end-4 top-4 z-50 flex items-center gap-1 rounded-xl border border-border bg-bg/70 p-1 font-mono text-xs backdrop-blur-sm"
    >
      {routing.locales.map((locale) => {
        const active = locale === current;
        return (
          <button
            key={locale}
            type="button"
            lang={locale}
            aria-label={t(locale)}
            aria-current={active ? "true" : undefined}
            onClick={() => switchTo(locale)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              active ? "bg-surface text-accent" : "text-muted hover:text-text"
            }`}
          >
            <Flag locale={locale} />
            {locale}
          </button>
        );
      })}
    </nav>
  );
}
