import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/i18n/routing";
import type { Profile } from "@/lib/types";

export interface CvOption {
  locale: Locale;
  url: string;
}

/** Server only (build time): the CV languages whose PDF actually exists in public/. */
export function getAvailableCvs(cv: Profile["cv"]): CvOption[] {
  return (Object.entries(cv) as [Locale, string][])
    .filter(([, url]) => existsSync(join(process.cwd(), "public", url)))
    .map(([locale, url]) => ({ locale, url }));
}
