import Image from "next/image";
import { useTranslations } from "next-intl";
import SectionLink from "@/components/nav/SectionLink";
import type { Profile } from "@/lib/types";

export type BrandProfile = Pick<Profile, "name" | "photo" | "photoAlt">;

/** "MM." logo, round avatar (cyan ring, online dot) and name. One link back to the top. */
export default function HeaderBrand({ profile }: { profile: BrandProfile }) {
  const t = useTranslations("nav");

  return (
    <SectionLink
      aria-label={t("backToTop")}
      title={t("backToTop")}
      className="group flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <span
        dir="ltr"
        aria-hidden="true"
        className="font-display text-lg font-bold tracking-tight text-white"
      >
        MM<span className="text-accent">.</span>
      </span>
      <span className="relative shrink-0">
        <span className="avatar-ring block rounded-full p-[2px]">
          <Image
            src={profile.photo}
            alt=""
            priority
            width={28}
            height={28}
            sizes="28px"
            className="h-7 w-7 rounded-full border-2 border-bg object-cover object-[50%_20%]"
          />
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-0 end-0 h-2 w-2 rounded-full border border-bg bg-green-400"
        />
      </span>
      <span className="hidden font-display text-sm font-semibold text-text xl:block">
        {profile.name}
      </span>
    </SectionLink>
  );
}
