export type CvTemplate = "minimal" | "executive" | "creative";
export type CvLang = "es" | "en";

export interface CvPersonal {
  fullName: string;
  role: string; // cargo objetivo - Title Alignment
  location: string;
  email: string;
  phone: string;
  website: string; // portfolio
  linkedin: string;
  github: string;
  summary: string; // Professional Summary - concreto, no genérico
}

export interface CvExperience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string; // YYYY-MM
  endDate: string;
  current: boolean;
  description: string; // debe contener contexto: tecnologías + impacto
}

export interface CvEducation {
  id: string;
  degree: string;
  school: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CvProject {
  id: string;
  name: string;
  role?: string;
  link?: string;
  technologies: string[]; // para Evidence
  description: string; // ej: "Developed ... using Flutter, Dart, Firebase..."
}

export interface CvCertification {
  id: string;
  name: string;
  issuer: string;
  date: string; // YYYY-MM
  link?: string;
}

export interface CvSkill {
  id: string;
  name: string;
  category: string; // sin nivel visual - solo semántico
}

export interface CvLanguage {
  id: string;
  name: string;
  level: string; // Nativo, Avanzado, Intermedio
}

export interface CvData {
  personal: CvPersonal;
  experience: CvExperience[];
  education: CvEducation[];
  projects: CvProject[];
  certifications: CvCertification[];
  skills: CvSkill[];
  languages: CvLanguage[];
}

export interface CvRecord {
  id: string;
  title: string;
  template: CvTemplate;
  lang: CvLang;
  data: CvData;
  updatedAt: string;
  createdAt: string;
}

// Secciones estándar ATS - Section Recognition
export const ATS_SECTIONS = ["Summary", "Skills", "Experience", "Projects", "Education", "Certifications"] as const;
