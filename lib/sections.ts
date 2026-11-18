import {
  Award,
  Briefcase,
  FolderGit2,
  Mail,
  User,
  type LucideIcon,
} from "lucide-react";

export type SectionId =
  "about" | "projects" | "experience" | "credentials" | "contact";

export interface SectionItem {
  id: SectionId;
  /** Key under `nav` in messages/{locale}.json */
  labelKey: SectionId;
  icon: LucideIcon;
  /** Keyboard shortcut (1-5) */
  shortcut: string;
}

/** Single source of truth for the sidebar, the mobile bar and the keyboard shortcuts. */
export const SECTIONS: readonly SectionItem[] = [
  { id: "about", labelKey: "about", icon: User, shortcut: "1" },
  { id: "projects", labelKey: "projects", icon: FolderGit2, shortcut: "2" },
  { id: "experience", labelKey: "experience", icon: Briefcase, shortcut: "3" },
  { id: "credentials", labelKey: "credentials", icon: Award, shortcut: "4" },
  { id: "contact", labelKey: "contact", icon: Mail, shortcut: "5" },
];

/** The hero is not in the nav list: it is the page top. */
export const TOP_ID = "top";
