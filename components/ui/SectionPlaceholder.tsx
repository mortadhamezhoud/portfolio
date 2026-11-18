import type { SectionId } from "@/lib/sections";

interface SectionPlaceholderProps {
  id: SectionId;
  title: string;
}

/** Temporary empty section (title only) until its real content is built. */
export default function SectionPlaceholder({
  id,
  title,
}: SectionPlaceholderProps) {
  return (
    <section
      id={id}
      className="flex min-h-screen items-center justify-center px-6"
    >
      <h2 className="font-display text-4xl text-text">{title}</h2>
    </section>
  );
}
