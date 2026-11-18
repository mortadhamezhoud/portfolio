import type { CvOption } from "@/lib/cv-files";
import CvMenu from "./CvMenu";
import LanguageSwitch from "./LanguageSwitch";

/**
 * Fixed top-end bar (top right in LTR, top left in RTL), above every section including the hero:
 * language switch + CV download.
 */
export default function TopActions({ cvs }: { cvs: CvOption[] }) {
  return (
    <div className="fixed end-3 top-3 z-50 flex items-center gap-1.5 rounded-xl border border-border bg-surface/70 p-1 backdrop-blur-md sm:end-4 sm:top-4">
      <LanguageSwitch />
      <CvMenu cvs={cvs} />
    </div>
  );
}
