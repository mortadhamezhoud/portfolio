import { existsSync } from "node:fs";
import { join } from "node:path";

interface CompanyLogoProps {
  /** Logo key: public/logos/{logo}.png. */
  logo: string;
  /** Monogram shown when the file does not exist (e.g. "ESPRIT"). */
  fallback: string;
  alt: string;
  /** md = 40 px, xl = 96 px (Experience). */
  size?: "md" | "xl";
}

/** Server component: 40 px rounded square (light translucent background so logos stay readable on dark). */
export default function CompanyLogo({ logo, fallback, alt, size = "md" }: CompanyLogoProps) {
  const xl = size === "xl";
  const hasFile = logo !== "" && existsSync(join(process.cwd(), "public", "logos", `${logo}.png`));
  return (
    <span
      className={`flex shrink-0 items-center justify-center overflow-hidden border border-border bg-white/90 ${xl ? "h-24 w-24 rounded-2xl" : "h-10 w-10 rounded-lg"}`}
      title={alt}
    >
      {hasFile ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-optimized
        <img src={`/logos/${logo}.png`} alt={alt} width={xl ? 96 : 40} height={xl ? 96 : 40} className={`h-full w-full object-contain ${xl ? "p-2.5" : "p-1"}`} />
      ) : (
        <span
          aria-label={alt}
          className={`px-0.5 text-center font-mono font-bold leading-none text-bg ${xl ? (fallback.length > 3 ? "text-sm" : "text-3xl") : fallback.length > 3 ? "text-[8px]" : "text-base"}`}
        >
          {fallback}
        </span>
      )}
    </span>
  );
}
