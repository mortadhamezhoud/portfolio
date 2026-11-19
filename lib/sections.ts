import {
  Award,
  Briefcase,
  FolderGit2,
  Mail,
  User,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type SectionId =
  | "about"
  | "experience"
  | "projects"
  | "credentials"
  | "skills"
  | "contact";

export interface SectionItem {
  id: SectionId;
  /** Key under `nav` in messages/{locale}.json */
  labelKey: SectionId;
  icon: LucideIcon;
  /** Keyboard shortcut (1-6) */
  shortcut: string;
}

/** Single source of truth for the header menu, the mobile menu and the keyboard shortcuts. */
export const SECTIONS: readonly SectionItem[] = [
  { id: "about", labelKey: "about", icon: User, shortcut: "1" },
  { id: "experience", labelKey: "experience", icon: Briefcase, shortcut: "2" },
  { id: "projects", labelKey: "projects", icon: FolderGit2, shortcut: "3" },
  { id: "credentials", labelKey: "credentials", icon: Award, shortcut: "4" },
  { id: "skills", labelKey: "skills", icon: Wrench, shortcut: "5" },
  { id: "contact", labelKey: "contact", icon: Mail, shortcut: "6" },
];

/** The hero is not in the nav list: it is the page top. */
export const TOP_ID = "top";
