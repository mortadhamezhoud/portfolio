import { useId } from "react";
import type { Locale } from "@/i18n/routing";

const FLAG_CLASS = "h-3.5 w-5 shrink-0 rounded-[3px]";

/** Decorative flags (the button already has an accessible name). */
function FranceFlag() {
  return (
    <svg
      viewBox="0 0 3 2"
      aria-hidden="true"
      focusable="false"
      className={FLAG_CLASS}
    >
      <rect width="1" height="2" fill="#0055A4" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#EF4135" />
    </svg>
  );
}

function UnitedKingdomFlag() {
  const id = useId();
  const clipRect = `${id}-rect`;
  const clipCross = `${id}-cross`;
  return (
    <svg
      viewBox="0 0 60 30"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      className={FLAG_CLASS}
    >
      <clipPath id={clipRect}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={clipCross}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${clipRect})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        <path
          d="M0,0 L60,30 M60,0 L0,30"
          clipPath={`url(#${clipCross})`}
          stroke="#C8102E"
          strokeWidth="4"
        />
        <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

export default function Flag({ locale }: { locale: Locale }) {
  return locale === "fr" ? <FranceFlag /> : <UnitedKingdomFlag />;
}
