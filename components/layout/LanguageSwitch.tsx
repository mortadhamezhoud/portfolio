"use client";

import { useLocale, useTranslations } from "next-intl";
import Flag from "@/components/ui/Flags";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

const BUTTON_BASE =
  "flex items-center gap-1.5 rounded-lg px-2 py-1.5 font-mono text-[11px] uppercase transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:px-2.5 sm:text-xs";

/**
 * EN · FR · AR. EN and FR switch the site language (next-intl); AR is shown but disabled
 * until the Arabic version exists. Keeps the scroll position and remembers the choice.
 */
export default function LanguageSwitch() {
  const t = useTranslations("language");
  const tTop = useTranslations("topActions");
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
    <div
      role="group"
      aria-label={t("label")}
      className="flex items-center gap-0.5"
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
            className={`${BUTTON_BASE} ${
              active ? "bg-bg text-accent" : "text-muted hover:text-text"
            }`}
          >
            {/* Flags are hidden on small screens to keep the bar compact */}
            <span className="hidden sm:inline-flex">
              <Flag locale={locale} />
            </span>
            {locale}
          </button>
        );
      })}
      <button
        type="button"
        lang="ar"
        aria-disabled="true"
        title={tTop("comingSoon")}
        aria-label={`${t("ar")} (${tTop("comingSoon")})`}
        onClick={(e) => e.preventDefault()}
        className={`${BUTTON_BASE} cursor-not-allowed text-muted opacity-50`}
      >
        ar
      </button>
    </div>
  );
}
