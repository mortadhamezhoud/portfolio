"use client";

import { Check, Copy, Eye, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { LinkedInIcon } from "@/components/ui/BrandIcons";

const cardClass =
  "flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors duration-200 hover:border-accent";
const iconClass =
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-bg text-accent";
const smallBtn =
  "flex min-h-11 items-center rounded-lg border border-border bg-bg px-3 py-1.5 font-mono text-xs text-text transition-colors hover:border-accent focus-visible:outline-2 focus-visible:outline-accent";

interface Props {
  email: string;
  linkedin: string;
  location: string;
  phoneToken: string;
}

export default function ContactCards({ email, linkedin, location, phoneToken }: Props) {
  const t = useTranslations("contact.cards");
  const [copied, setCopied] = useState(false);
  const [phone, setPhone] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  // The number is only assembled here, on click: it is never in the initial HTML.
  const reveal = () => setPhone(atob(phoneToken));
  const digits = phone?.replace(/\D/g, "") ?? "";

  return (
    <ul className="flex flex-col gap-3">
      <li className={cardClass}>
        <span className={iconClass}>
          <Mail className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs text-muted">{t("email")}</p>
          <a href={`mailto:${email}`} className="flex min-h-11 items-center truncate text-text hover:text-accent">
            {email}
          </a>
        </div>
        <button type="button" onClick={copy} className={smallBtn}>
          <span className="inline-flex items-center gap-1.5" aria-live="polite">
            {copied ? (
              <Check className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            ) : (
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            {copied ? t("copied") : t("copy")}
          </span>
        </button>
      </li>

      <li>
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className={cardClass}>
          <span className={iconClass}>
            <LinkedInIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="font-mono text-xs text-muted">{t("linkedin")}</p>
            <p className="text-text">{t("linkedinText")}</p>
          </div>
        </a>
      </li>

      <li className={cardClass}>
        <span className={iconClass}>
          <MessageCircle className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-xs text-muted">{t("whatsapp")}</p>
          <p className="text-text">{phone ?? t("hiddenNumber")}</p>
        </div>
        {phone ? (
          <div className="flex gap-2">
            <a
              href={`https://wa.me/${digits}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("chat")}
              className={smallBtn}
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
            </a>
            <a href={`tel:+${digits}`} aria-label={t("call")} className={smallBtn}>
              <Phone className="h-4 w-4" aria-hidden="true" />
            </a>
          </div>
        ) : (
          <button type="button" onClick={reveal} className={smallBtn}>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-3.5 w-3.5" aria-hidden="true" />
              {t("showNumber")}
            </span>
          </button>
        )}
      </li>

      <li className={cardClass}>
        <span className={iconClass}>
          <MapPin className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="font-mono text-xs text-muted">{t("location")}</p>
          <p className="text-text">{location}</p>
        </div>
      </li>
    </ul>
  );
}
