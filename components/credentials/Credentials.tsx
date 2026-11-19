import { existsSync } from "node:fs";
import { join } from "node:path";
import { Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import CompanyLogo from "@/components/ui/CompanyLogo";
import certificates from "@/data/certificates.json";
import type { Certificate } from "@/lib/types";
import CredentialsGrid from "./CredentialsGrid";

/**
 * Credentials: redacted certificates only (public/certificates/). A file that is not there yet
 * shows a placeholder card instead of a broken image. The unredacted originals live in
 * public/Attestation/, which is git-ignored and must never be published.
 */
export default function Credentials() {
  const t = useTranslations("nav");
  const c = useTranslations("credentials");
  const items = (certificates as Certificate[]).map((cert) => ({
    ...cert,
    available: existsSync(join(process.cwd(), "public", "certificates", cert.file)),
    logoNode: <CompanyLogo logo={cert.logo} fallback={cert.company} alt={cert.company} />,
  }));

  return (
    <section
      id="credentials"
      className="mx-auto min-h-screen w-full max-w-6xl px-6 py-28 lg:px-16"
    >
      <h2 className="font-display text-5xl font-bold text-text sm:text-6xl">
        {t("credentials")}
      </h2>
      <p className="mt-5 flex max-w-3xl items-start gap-2 font-mono text-xs leading-relaxed text-[#8B97B3]">
        <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {c("note")}
      </p>
      <p className="mt-2 pl-[1.375rem] font-mono text-xs">
        <a href="#contact" className="text-accent underline-offset-2 hover:underline">
          {c("onRequest")}
        </a>
      </p>
      <CredentialsGrid items={items} />
    </section>
  );
}
