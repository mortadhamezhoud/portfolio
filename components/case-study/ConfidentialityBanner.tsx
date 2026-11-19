import { ShieldAlert } from "lucide-react";
import { useTranslations } from "next-intl";

/** Discreet strip stating that every visual uses synthetic data. */
export default function ConfidentialityBanner() {
  const t = useTranslations("caseStudy");
  return (
    <p
      role="note"
      className="flex items-start gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm text-muted"
    >
      <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden="true" />
      {t("banner")}
    </p>
  );
}
