import { useTranslations } from "next-intl";
import type { Profile } from "@/lib/types";
import IdentityCard from "./IdentityCard";

export default function About({ profile }: { profile: Profile }) {
  const t = useTranslations("about");
  return (
    <section
      id="about"
      className="mx-auto grid overflow-x-clip min-h-screen w-full max-w-6xl items-center gap-12 px-6 py-24 lg:grid-cols-[minmax(0,26rem)_1fr] lg:gap-20 lg:px-16"
    >
      <div className="mx-auto w-[85%] max-w-sm lg:w-full lg:max-w-none">
        <IdentityCard
          profile={{
            name: profile.name,
            title: profile.title,
            photo: profile.photo,
            photoAlt: profile.photoAlt,
            featuredSkills: profile.featuredSkills,
          }}
        />
      </div>

      <div className="flex flex-col gap-8">
        <h2 className="font-display text-4xl font-bold text-text sm:text-5xl">
          {t("title")}
        </h2>
        <p className="max-w-2xl text-lg leading-relaxed text-muted">
          {profile.about}
        </p>
        <dl className="grid grid-cols-2 gap-4">
          {profile.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <dd className="font-display text-2xl font-bold text-text sm:text-3xl">
                {stat.value}
              </dd>
              <dt className="mt-1 font-mono text-xs text-muted">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
