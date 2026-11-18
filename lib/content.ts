import profileEn from "@/data/en/profile.json";
import profileFr from "@/data/fr/profile.json";
import projectsEn from "@/data/en/projects.json";
import projectsFr from "@/data/fr/projects.json";
import type { Locale } from "@/i18n/routing";
import type { Profile, Project } from "@/lib/types";

const profiles: Record<Locale, Profile> = { en: profileEn, fr: profileFr };
const projects: Record<Locale, Project[]> = { en: projectsEn, fr: projectsFr };

export const getProfile = (locale: Locale): Profile => profiles[locale];
export const getProjects = (locale: Locale): Project[] => projects[locale];
