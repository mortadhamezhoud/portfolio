import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import type { OpenTo } from "@/lib/types";
import ContactCards from "./ContactCards";
import ContactForm from "./ContactForm";

interface ContactProps {
  openTo: OpenTo;
  email: string;
  linkedin: string;
  location: string;
  /** Base64 of the phone number: it must not appear in clear text in the HTML. */
  phoneToken: string;
}

function TagGroup({ label, tags }: { label: string; tags: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-xs uppercase tracking-wider text-muted">{label}</span>
      {tags.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-text"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

export default function Contact({ openTo, email, linkedin, location, phoneToken }: ContactProps) {
  const t = useTranslations("contact");
  const tk = (key: string) => t(key as never);
  return (
    <section
      id="contact"
      className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)] items-center gap-10 px-6 py-16 lg:min-h-dvh lg:grid-cols-2 lg:gap-16 lg:px-16"
    >
      <Reveal className="flex flex-col gap-6">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-accent/40 bg-surface px-4 py-1.5 font-mono text-xs text-accent">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-400" />
          </span>
          {t("status")}
        </span>
        <h2 className="font-display font-bold text-text text-[clamp(1.875rem,9vw,2.25rem)] sm:text-5xl">{t("title")}</h2>
        <p className="max-w-md text-lg text-muted">{t("intro")}</p>
        <div className="flex flex-col gap-3">
          <TagGroup
            label={t("rolesLabel")}
            tags={openTo.roles.map((r) => tk(`openTo.roles.${r}`))}
          />
          <TagGroup
            label={t("formatsLabel")}
            tags={openTo.formats.map((f) => tk(`openTo.formats.${f}`))}
          />
          <TagGroup
            label={t("availabilityLabel")}
            tags={[tk(`openTo.availability.${openTo.availability}`)]}
          />
        </div>
        <ContactCards
          email={email}
          linkedin={linkedin}
          location={location}
          phoneToken={phoneToken}
        />
      </Reveal>
      <Reveal delay={0.15}>
        <ContactForm email={email} />
      </Reveal>
    </section>
  );
}
