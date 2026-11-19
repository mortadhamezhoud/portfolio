import { existsSync } from "node:fs";
import { join } from "node:path";

interface CompanyLogoProps {
  /** Logo key: public/logos/{logo}.png. */
  logo: string;
  /** Monogram shown when the file does not exist (e.g. "ESPRIT"). */
  fallback: string;
  alt: string;
}

/** Server component: 40 px rounded square (light translucent background so logos stay readable on dark). */
export default function CompanyLogo({ logo, fallback, alt }: CompanyLogoProps) {
  const hasFile = logo !== "" && existsSync(join(process.cwd(), "public", "logos", `${logo}.png`));
  return (
    <span
      className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-white/90"
      title={alt}
    >
      {hasFile ? (
        // eslint-disable-next-line @next/next/no-img-element -- static export, images are pre-optimized
        <img src={`/logos/${logo}.png`} alt={alt} width={40} height={40} className="h-full w-full object-contain p-1" />
      ) : (
        <span
          aria-label={alt}
          className={`px-0.5 text-center font-mono font-bold leading-none text-bg ${fallback.length > 3 ? "text-[8px]" : "text-base"}`}
        >
          {fallback}
        </span>
      )}
    </span>
  );
}
