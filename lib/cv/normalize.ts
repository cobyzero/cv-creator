import { CvData } from "./types";
import { defaultCvData } from "./defaults";

export function normalizeCvData(raw: unknown): CvData {
  const d = raw as Partial<CvData> | null;
  if (!d || typeof d !== "object") return structuredClone(defaultCvData);

  return {
    personal: {
      fullName: d.personal?.fullName ?? defaultCvData.personal.fullName,
      role: d.personal?.role ?? defaultCvData.personal.role,
      location: d.personal?.location ?? "",
      email: d.personal?.email ?? "",
      phone: d.personal?.phone ?? "",
      website: d.personal?.website ?? "",
      linkedin: (d.personal as unknown as { linkedin?: string })?.linkedin ?? "",
      github: (d.personal as unknown as { github?: string })?.github ?? "",
      summary: d.personal?.summary ?? "",
    },
    experience: Array.isArray(d.experience) ? d.experience : [],
    education: Array.isArray(d.education) ? d.education : [],
    projects: Array.isArray((d as { projects?: unknown }).projects) ? (d as { projects: CvData["projects"] }).projects : [],
    certifications: Array.isArray((d as { certifications?: unknown }).certifications) ? (d as { certifications: CvData["certifications"] }).certifications : [],
    skills: Array.isArray(d.skills)
      ? d.skills.map((s: unknown) => {
          const skill = s as { name?: string; category?: string; level?: number };
          return {
            id: (s as { id?: string }).id || `s${Math.random().toString(36).slice(2, 7)}`,
            name: skill.name || "",
            category: skill.category || "General",
          };
        })
      : [],
    languages: Array.isArray(d.languages) ? d.languages : [],
  };
}
