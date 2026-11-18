export interface Stat {
  value: string;
  label: string;
}

export interface SkillGroup {
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
  period: string;
  company: string;
  role: string;
  stack: string[];
  context: string;
  problem: string;
  solution: string[];
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
