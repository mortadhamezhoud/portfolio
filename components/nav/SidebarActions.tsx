import { Download, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/BrandIcons";
import { CV_URL } from "@/lib/cv";
import type { Profile } from "@/lib/types";

interface SidebarActionsProps {
  contact: Profile["contact"];
  hasCv: boolean;
}

const ICON_LINK =
  "flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

/** Bottom of the sidebar: CV download (only if the PDF exists) and contact icons (only if set). */
export default function SidebarActions({
  contact,
  hasCv,
}: SidebarActionsProps) {
  const t = useTranslations("nav");

  const links = [
    {
      key: "linkedin",
      href: contact.linkedin,
      icon: LinkedInIcon,
      external: true,
    },
    { key: "github", href: contact.github, icon: GitHubIcon, external: true },
    {
      key: "email",
      href: contact.email ? `mailto:${contact.email}` : "",
      icon: Mail,
      external: false,
    },
  ] as const;

  return (
    <div className="flex flex-col gap-3">
      {hasCv && (
        <a
          href={CV_URL}
          download
          title={t("downloadCv")}
          aria-label={t("downloadCv")}
          className="flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-bg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent in-[.sidebar-collapsed]:px-0"
        >
          <Download className="h-4 w-4 shrink-0" aria-hidden="true" />
          <span className="in-[.sidebar-collapsed]:hidden">
            {t("downloadCv")}
          </span>
        </a>
      )}
      <div className="flex flex-wrap items-center gap-2 in-[.sidebar-collapsed]:flex-col">
        {links
          .filter((link) => link.href)
          .map(({ key, href, icon: Icon, external }) => (
            <a
              key={key}
              href={href}
              title={t(key)}
              aria-label={t(key)}
              className={ICON_LINK}
              {...(external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}
      </div>
    </div>
  );
}
