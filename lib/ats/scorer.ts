import { CvData } from "@/lib/cv/types";
import { JobIntelligence, MatchResult, VisibilityAnalysis, AtsScores, Positioning } from "./types";

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function cvText(data: CvData): string {
  return [
    data.personal.summary,
    data.personal.role,
    ...data.experience.map((e) => `${e.role} ${e.company} ${e.description}`),
    ...data.projects.map((p) => `${p.name} ${p.description} ${p.technologies.join(" ")}`),
    ...data.education.map((e) => `${e.degree} ${e.school} ${e.description}`),
    ...data.skills.map((s) => s.name),
    ...data.certifications.map((c) => `${c.name} ${c.issuer}`),
  ]
    .join(" ")
    .toLowerCase();
}

function hasSkill(text: string, skill: string) {
  const n = normalize(skill);
  // match exact o substring (para REST / REST APIs)
  if (n === "rest" || n === "rest apis" || n === "rest api") {
    return text.includes("rest") && (text.includes("api") || text.includes("apis"));
  }
  return text.includes(n);
}

function hasSkillWithContext(data: CvData, skill: string): boolean {
  const n = normalize(skill);
  const inExperienceOrProjects = [...data.experience, ...data.projects].some((item) => {
    const desc = "description" in item ? (item as { description: string }).description.toLowerCase() : "";
    const techs = "technologies" in item ? (item as { technologies: string[] }).technologies.join(" ").toLowerCase() : "";
    return desc.includes(n) || techs.includes(n);
  });
  return inExperienceOrProjects;
}

export function computeMatch(data: CvData, job: JobIntelligence): MatchResult {
  const text = cvText(data);
  const required = job.requiredSkills;
  const preferred = job.preferredSkills;

  const presentRequired = required.filter((s) => hasSkill(text, s));
  const presentPreferred = preferred.filter((s) => hasSkill(text, s));

  const skillsScore = required.length === 0 ? 100 : Math.round((presentRequired.length / required.length) * 100);

  // Experience relevance: % de experiencias cuyo role/desc contiene keywords del job
  const jobKeywords = job.keywords.map(normalize);
  const expRelevant = data.experience.filter((e) => jobKeywords.some((k) => normalize(e.role + " " + e.description).includes(k))).length;
  const experienceScore = data.experience.length === 0 ? 0 : Math.round((expRelevant / Math.max(1, data.experience.length)) * 100);

  // Title match
  const titleScore = hasSkill(normalize(data.personal.role), job.role) || job.relatedTitles.some((t) => hasSkill(normalize(data.personal.role), t)) ? 100 : 60;

  // Education: si existe, 100; si no y job no pide, 80
  const educationScore = data.education.length > 0 ? 100 : 70;

  // Keywords coverage
  const kwPresent = job.keywords.filter((k) => hasSkill(text, k)).length;
  const keywordsScore = job.keywords.length === 0 ? 100 : Math.round((kwPresent / job.keywords.length) * 100);

  // Seniority: simplificado - si CV tiene 2+ experiencias y job es Junior => 95, si Senior y 0 exp => 40
  let seniorityScore = 85;
  if (job.seniority === "Junior" && data.experience.length >= 1) seniorityScore = 95;
  if (job.seniority === "Senior" && data.experience.length < 2) seniorityScore = 60;
  if (job.seniority === "Lead" && data.experience.length < 3) seniorityScore = 55;

  const overall = Math.round((skillsScore * 0.35 + experienceScore * 0.2 + titleScore * 0.15 + keywordsScore * 0.15 + educationScore * 0.05 + seniorityScore * 0.1));

  return {
    overall: Math.min(100, overall),
    breakdown: {
      skills: skillsScore,
      experience: experienceScore,
      title: titleScore,
      education: educationScore,
      keywords: keywordsScore,
      seniority: seniorityScore,
    },
    missingSkills: required.filter((s) => !hasSkill(text, s)),
    presentSkills: presentRequired,
  };
}

export function computeVisibility(data: CvData, job: JobIntelligence): VisibilityAnalysis {
  const text = cvText(data);
  const issues: string[] = [];

  // Keyword Coverage - required/preferred
  const keywordDetails = {
    required: job.requiredSkills.map((skill) => {
      const found = hasSkill(text, skill);
      const withContext = found && hasSkillWithContext(data, skill);
      return {
        skill,
        status: found ? ("found" as const) : ("missing" as const),
        evidence: !found ? ("none" as const) : withContext ? ("with-context" as const) : ("skill-only" as const),
      };
    }),
    preferred: job.preferredSkills.map((skill) => {
      const found = hasSkill(text, skill);
      const withContext = found && hasSkillWithContext(data, skill);
      return {
        skill,
        status: found ? ("found" as const) : ("missing" as const),
        evidence: !found ? ("none" as const) : withContext ? ("with-context" as const) : ("skill-only" as const),
      };
    }),
    related: job.keywords.map((term) => ({ term, found: hasSkill(text, term) })),
  };

  const reqFound = keywordDetails.required.filter((r) => r.status === "found").length;
  const keywordCoverage = job.requiredSkills.length === 0 ? 100 : Math.round((reqFound / job.requiredSkills.length) * 100);

  // Semantic Coverage - % de required con with-context
  const withContextCount = keywordDetails.required.filter((r) => r.evidence === "with-context").length;
  const semanticCoverage = job.requiredSkills.length === 0 ? 100 : Math.round((withContextCount / job.requiredSkills.length) * 100);

  // Title Alignment
  const titleAlignment = hasSkill(normalize(data.personal.role), job.role) ? 100 : job.relatedTitles.some((t) => hasSkill(normalize(data.personal.role), t)) ? 85 : 45;

  // Experience Evidence - avg de with-context vs skill-only
  const experienceEvidence = keywordCoverage === 100 ? (semanticCoverage >= 70 ? 95 : 70) : Math.round(semanticCoverage * 0.8 + keywordCoverage * 0.2);

  // Section Recognition - verifica que CV tenga las 6 secciones (si alguna vacía, penaliza)
  const hasSection = {
    Summary: !!data.personal.summary,
    Skills: data.skills.length >= 3,
    Experience: data.experience.length > 0,
    Projects: data.projects.length > 0,
    Education: data.education.length > 0,
    Certifications: data.certifications.length > 0,
  };
  const filledSections = Object.values(hasSection).filter(Boolean).length;
  const sectionRecognition = Math.round((filledSections / 6) * 100);
  if (!hasSection.Projects) issues.push("Añade Projectos como evidencia de skills si tienes poca experiencia");
  if (!hasSection.Summary) issues.push("Falta Summary concreto — añade tu posicionamiento");
  if (data.skills.length < 5) issues.push("Skills incompleto — añade al menos 5 skills relevantes");

  // Parsing Safety - nuestro preview es 100% texto, sin tablas/columnas/imágenes -> 100 por diseño
  // Penaliza si summary o descriptions contienen emojis, barras, caracteres raros
  let parsingSafety = 100;
  const risky = /[▓█▄▀●■◆★☆]|progress|%.*skill/i.test(text);
  if (risky) {
    parsingSafety = 70;
    issues.push("Evita barras de progreso o gráficos — usa texto plano");
  }
  // longitud excesiva penaliza readability
  if (text.length > 8000) issues.push("CV muy largo — ideal 1-2 páginas");

  return {
    keywordCoverage,
    semanticCoverage,
    titleAlignment,
    experienceEvidence,
    sectionRecognition,
    parsingSafety,
    issues,
    keywordDetails,
  };
}

export function computeAtsScores(match: MatchResult, visibility: VisibilityAnalysis): AtsScores {
  const atsCompatibility = Math.round((visibility.keywordCoverage * 0.3 + visibility.parsingSafety * 0.2 + visibility.sectionRecognition * 0.15 + visibility.semanticCoverage * 0.2 + visibility.titleAlignment * 0.15));
  const recruiterReadability = Math.round((visibility.sectionRecognition * 0.3 + visibility.experienceEvidence * 0.25 + match.breakdown.experience * 0.2 + (match.breakdown.title) * 0.15 + visibility.parsingSafety * 0.1));
  const jobRelevance = match.overall;
  const overallVisibility = Math.round((atsCompatibility * 0.4 + recruiterReadability * 0.3 + jobRelevance * 0.3));
  return {
    atsCompatibility: Math.min(100, atsCompatibility),
    recruiterReadability: Math.min(100, recruiterReadability),
    jobRelevance,
    overallVisibility: Math.min(100, overallVisibility),
  };
}

export function computePositioning(data: CvData, job: JobIntelligence): Positioning {
  return {
    primary: job.role,
    secondary: job.relatedTitles.slice(0, 3).filter((t) => t !== job.role),
    coreExpertise: job.requiredSkills.slice(0, 5),
    domain: job.keywords.slice(0, 2).join(" · ") || "General",
  };
}
