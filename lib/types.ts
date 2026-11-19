import type { Locale } from "@/i18n/routing";

export interface Stat {
  value: string;
  label: string;
}

export interface SkillGroup {
  /** Used to pick the icon: data-bi, machine-learning or development. */
  id: string;
  group: string;
  items: string[];
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  type: string;
  /** Name of the project carried out during this experience (empty if unknown). */
  project: string;
  /** Logo key: public/logos/{logo}.png (monogram fallback when the file does not exist). */
  logo: string;
  highlights: string[];
}

export interface Education {
  degree: string;
  school: string;
  location: string;
  period: string;
  specialty: string;
  note: string;
}

export interface Language {
  name: string;
  level: string;
}

export interface VolunteeringItem {
  organization: string;
  year: string;
}

export interface Contact {
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  github: string;
}

export interface Profile {
  name: string;
  title: string;
  status: string;
  ctaLabel: string;
  photo: string;
  /** Background-removed portrait; empty string when not available. */
  photoCutout: string;
  photoAlt: string;
  /** CV PDF per site language (public path). Only files that exist at build time are offered. */
  cv: Record<Locale, string>;
  tagline: string;
  location: string;
  availability: string;
  about: string;
  contact: Contact;
  stats: Stat[];
  /** Skill names (must exist in `skills`) shown as orbiting badges on the identity card. */
  featuredSkills: string[];
  skills: SkillGroup[];
  experience: Experience[];
  education: Education[];
  languages: Language[];
  volunteering: VolunteeringItem[];
}

export interface ShowcaseKpi {
  value: number;
  suffix: string;
  decimals: number;
  label: string;
}

/** Extra content shown for the featured project (larger block in the Projects section). */
export interface Showcase {
  tagline: string;
  department: string;
  badge: string;
  kpis: ShowcaseKpi[];
  pillars: { icon: string; title: string; text: string }[];
  audiences: { id: string; title: string; text: string }[];
}

export interface ProjectLinks {
  demo: string;
  github: string;
  video: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  featured: boolean;
  /** 3D scene shown next to the project (key of SCENE_SHAPE in lib/shapes.ts). */
  scene: string;
  period: string;
  company: string;
  /** Logo key: public/logos/{logo}.png (monogram fallback). */
  logo: string;
  role: string;
  stack: string[];
  context: string;
  problem: string;
  solution: string[];
  /** Three short points shown in the Projects scrollytelling. */
  pitch?: string[];
  /** Present only on the featured project. */
  showcase?: Showcase;
  result: string;
  links: ProjectLinks;
  images: string[];
}

export interface GlobeRegion {
  id: string;
  /** [min, max] latitude in degrees */
  lat: [number, number];
  /** [min, max] longitude in degrees */
  lon: [number, number];
}

export interface GlobeConfig {
  origin: { lat: number; lon: number };
  arcCount: number;
  /** Minimum angular distance (degrees) between the origin and a target point */
  minDistanceDeg: number;
  regenerate: { minSeconds: number; maxSeconds: number; fadeSeconds: number };
  regions: GlobeRegion[];
}

export interface Certificate {
  id: string;
  /** File name in public/certificates/ (redacted copy only). */
  file: string;
  type: "pfe" | "internship";
  company: string;
  /** Logo key: public/logos/{logo}.png. */
  logo: string;
  /** ISO dates (YYYY-MM-DD). */
  start: string;
  end: string;
  title: Record<string, string>;
}
