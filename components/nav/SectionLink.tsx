"use client";

import { Link, usePathname } from "@/i18n/navigation";
import type { ComponentProps } from "react";

type AnchorProps = Omit<ComponentProps<"a">, "href">;

/**
 * Link to a section of the home page. On the home page it is a plain in-page anchor (so
 * Lenis scrolls smoothly); on any other page (e.g. a case study) it navigates to /#id.
 * `id` is omitted for the top of the home page.
 */
export default function SectionLink({ id, ...props }: AnchorProps & { id?: string }) {
  const pathname = usePathname();
  if (pathname === "/") return <a href={`#${id ?? "top"}`} {...props} />;
  return <Link href={id ? `/#${id}` : "/"} {...props} />;
}
