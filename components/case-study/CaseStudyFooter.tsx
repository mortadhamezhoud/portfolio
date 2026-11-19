import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Project } from "@/lib/types";

/** "Next project" + contact call to action at the bottom of a case study. */
export default function CaseStudyFooter({ next }: { next?: Project }) {
  const t = useTranslations("caseStudy");
  return (
    <footer className="mt-10 flex flex-col gap-6 border-t border-border py-16 sm:flex-row sm:items-center sm:justify-between">
      {next && (
        <Link href={`/#project-${next.slug}`} className="group block">
          <p className="font-mono text-xs uppercase tracking-wider text-muted">
            {t("nextProject")}
          </p>
          <p className="mt-2 flex items-center gap-3 font-display text-3xl font-bold text-text transition-colors group-hover:text-accent sm:text-4xl">
            {next.title}
            <ArrowRight
              className="h-6 w-6 transition-transform group-hover:translate-x-1 motion-reduce:transition-none"
              aria-hidden="true"
            />
          </p>
        </Link>
      )}
      <Link
        href="/#contact"
        className="w-fit rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-bg transition-transform hover:scale-[1.03] motion-reduce:transition-none"
      >
        {t("contactMe")}
      </Link>
    </footer>
  );
}
