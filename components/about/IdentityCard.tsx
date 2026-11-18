import Image from "next/image";
import profile from "@/data/profile.json";
import messages from "@/messages/en.json";

const PHOTO_SIZES = "(min-width: 1024px) 420px, 85vw";
const DUOTONE_FILTER = "url(#mm-duotone)";

/** SVG duotone: shadows -> #05070D, highlights -> a softened cyan (keeps white backgrounds calm). */
function DuotoneFilter() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" className="absolute">
      <filter id="mm-duotone" colorInterpolationFilters="sRGB">
        <feColorMatrix
          type="matrix"
          values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 1 0"
        />
        <feComponentTransfer>
          <feFuncR type="table" tableValues="0.02 0.14" />
          <feFuncG type="table" tableValues="0.03 0.55" />
          <feFuncB type="table" tableValues="0.05 0.5" />
        </feComponentTransfer>
      </filter>
    </svg>
  );
}

/** Holographic ID card: portrait, duotone photo that turns to full color on hover. */
export default function IdentityCard() {
  const { about } = messages;

  return (
    <div className="card-border group w-full rounded-2xl p-px">
      <DuotoneFilter />
      <div className="relative flex aspect-[4/5] flex-col gap-3 overflow-hidden rounded-[15px] bg-surface p-4">
        {/* Header */}
        <div className="flex items-center justify-between font-mono text-[11px] tracking-wider text-muted">
          <span>{about.idLabel}</span>
          <span className="flex items-center gap-2 text-green-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
            </span>
            {about.online}
          </span>
        </div>

        {/* Photo frame */}
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-xl border border-border bg-bg">
          <Image
            src={profile.photo}
            alt={profile.photoAlt}
            fill
            sizes={PHOTO_SIZES}
            priority={false}
            className="object-cover object-[50%_20%]"
          />
          {/* Duotone layer: fades out on hover (hidden with reduced motion: real colors) */}
          <Image
            src={profile.photo}
            alt=""
            aria-hidden="true"
            fill
            sizes={PHOTO_SIZES}
            priority={false}
            style={{ filter: DUOTONE_FILTER }}
            className="object-cover object-[50%_20%] transition-opacity duration-[600ms] group-hover:opacity-0 motion-reduce:hidden"
          />
          {/* Screen overlays: dot grid + scan lines */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(rgba(62,230,193,0.18)_1px,transparent_1px)] [background-size:14px_14px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:repeating-linear-gradient(0deg,rgba(231,236,247,0.04)_0_1px,transparent_1px_3px)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background:linear-gradient(to_top,rgba(14,21,40,0.75),transparent_35%)]"
          />
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-1">
          <p className="font-display text-xl font-bold text-text">{profile.name}</p>
          <p className="text-sm text-text">{profile.title}</p>
          <p className="font-mono text-[11px] text-accent">{about.location}</p>
        </div>
      </div>
    </div>
  );
}
