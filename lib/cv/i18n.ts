import { CvLang } from "./types";

export const cvTranslations = {
  es: {
    summary: "Resumen",
    skills: "Habilidades",
    experience: "Experiencia",
    projects: "Proyectos",
    education: "Educación",
    certifications: "Certificaciones",
    languages: "Idiomas",
    present: "Actual",
  },
  en: {
    summary: "Summary",
    skills: "Skills",
    experience: "Experience",
    projects: "Projects",
    education: "Education",
    certifications: "Certifications",
    languages: "Languages",
    present: "Present",
  },
} satisfies Record<CvLang, Record<string, string>>;

export function t(lang: CvLang, key: keyof typeof cvTranslations["es"]) {
  return cvTranslations[lang][key] || key;
}
