import Image from "next/image";
import { useTranslations } from "next-intl";
import type { Profile } from "@/lib/types";
import { TOP_ID } from "@/lib/sections";

type ProfileInfo = Pick<Profile, "name" | "photo" | "photoAlt">;

/** Avatar (thin cyan ring, online dot) + name and role. Click goes back to the top. */
export default function SidebarProfile({ profile }: { profile: ProfileInfo }) {
  const t = useTranslations("nav");

  return (
    <a
      href={`#${TOP_ID}`}
      aria-label={t("backToTop")}
      title={t("backToTop")}
      className="group flex items-center gap-3 rounded-xl p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="relative shrink-0">
        <span className="avatar-ring block rounded-full p-[2px]">
          <Image
            src={profile.photo}
            alt={profile.photoAlt}
            width={40}
            height={40}
            sizes="40px"
            className="h-10 w-10 rounded-full border-2 border-bg object-cover object-[50%_20%]"
          />
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-0 end-0 h-2.5 w-2.5 rounded-full border-2 border-bg bg-green-400"
        />
      </span>
      <span className="flex min-w-0 flex-col in-[.sidebar-collapsed]:hidden">
        <span className="truncate font-display text-sm font-semibold text-text">
          {profile.name}
        </span>
        <span className="truncate font-mono text-[11px] text-muted">
          {t("role")}
        </span>
      </span>
    </a>
  );
}
