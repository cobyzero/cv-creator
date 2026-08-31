import { JobIntelligence } from "./types";

// Diccionario base para extracción - se amplía dinámicamente con lo que el usuario pegue
const KNOWN_SKILLS = [
  "Flutter", "Dart", "Firebase", "REST", "REST APIs", "REST API", "GraphQL",
  "Git", "GitHub", "GitLab", "Android", "iOS", "Agile", "Scrum", "CI/CD", "Docker", "Kubernetes",
  "Testing", "Unit Testing", "Jest", "React", "Next.js", "TypeScript", "JavaScript", "Node.js",
  "Figma", "Design Systems", "UX", "UI", "Product Design", "User Research",
  "Python", "Java", "Kotlin", "Swift", "SQL", "PostgreSQL", "MongoDB", "AWS", "Vercel",
];

const SENIORITY_PATTERNS: Record<string, JobIntelligence["seniority"]> = {
  junior: "Junior",
  jr: "Junior",
  mid: "Mid",
  middle: "Mid",
  senior: "Senior",
  sr: "Senior",
  lead: "Lead",
  principal: "Lead",
  staff: "Lead",
};

const RELATED_TITLES_MAP: Record<string, string[]> = {
  "flutter developer": ["Flutter Developer", "Mobile Developer", "Software Developer", "Mobile Application Developer"],
  "mobile developer": ["Mobile Developer", "Flutter Developer", "React Native Developer", "Software Developer"],
  "product designer": ["Product Designer", "UX Designer", "UI Designer", "Product Design Lead"],
  "software developer": ["Software Developer", "Software Engineer", "Developer", "Programmer"],
  "frontend developer": ["Frontend Developer", "React Developer", "Web Developer", "Software Developer"],
};

function extractSkills(text: string, allSkills: string[]): string[] {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const s of allSkills) {
    if (lower.includes(s.toLowerCase())) found.add(s);
  }
  // también extrae líneas con bullets que parezcan skills (palabras cortas)
  const lines = text.split(/[\n,;]/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.length > 1 && line.length < 30 && /^[A-Za-z0-9 /+.#-]+$/.test(line) && line.split(" ").length <= 3) {
      // heurística: si parece skill y no está ya, añádelo si aparece en contexto de requisitos
      const norm = line.replace(/^[-•\s]+/, "").trim();
      if (norm.length >= 2 && !found.has(norm) && /^(flutter|dart|firebase|rest|git|android|agile|ci\/cd|docker|testing|react|figma|typescript|javascript|python|java|kotlin|swift|sql|aws|docker|kubernetes)/i.test(norm)) {
        found.add(norm);
      }
    }
  }
  return [...found];
}

function detectSeniority(text: string): JobIntelligence["seniority"] {
  const lower = text.toLowerCase();
  for (const [k, v] of Object.entries(SENIORITY_PATTERNS)) {
    if (lower.includes(k)) return v;
  }
  return "Unknown";
}

function detectRole(text: string): string {
  const firstLine = text.split("\n")[0]?.trim() || "";
  // si la primera línea parece un título (pocas palabras, contiene Developer/Designer/etc)
  if (firstLine.length < 80 && /developer|designer|engineer|manager|analyst|scientist/i.test(firstLine)) {
    return firstLine.replace(/requirements?:.*/i, "").trim();
  }
  // fallback: busca "Role: xxx" o similar
  const roleMatch = text.match(/(?:role|position|title)\s*[:\-]\s*(.+)/i);
  if (roleMatch) return roleMatch[1].split("\n")[0].trim().slice(0, 60);
  return firstLine.slice(0, 60) || "Unknown Role";
}

function splitRequirements(text: string): { required: string; preferred: string } {
  const lower = text.toLowerCase();
  // busca secciones Nice to have / Preferred / Bonus
  const niceIdx = lower.search(/(nice to have|preferred|bonus|plus|desired)/i);
  if (niceIdx !== -1) {
    return {
      required: text.slice(0, niceIdx),
      preferred: text.slice(niceIdx),
    };
  }
  // si hay "Requirements:" y luego lista, todo es required
  return { required: text, preferred: "" };
}

export function parseJobOffer(rawText: string): JobIntelligence {
  const text = rawText.trim();
  if (!text) {
    return {
      role: "Unknown Role",
      seniority: "Unknown",
      requiredSkills: [],
      preferredSkills: [],
      keywords: [],
      relatedTitles: [],
      rawText: "",
    };
  }

  const { required, preferred } = splitRequirements(text);
  const role = detectRole(text);
  const seniority = detectSeniority(text);

  // Extrae skills de cada sección
  const requiredSkills = extractSkills(required, KNOWN_SKILLS);
  const preferredSkills = extractSkills(preferred, KNOWN_SKILLS).filter((s) => !requiredSkills.includes(s));

  // Keywords: dominio + skills normalizadas
  const keywordsBase = [...requiredSkills, ...preferredSkills].map((s) => s.toLowerCase());
  const domainKeywords: string[] = [];
  if (keywordsBase.some((k) => k.includes("flutter") || k.includes("dart") || k.includes("mobile") || k.includes("android") || k.includes("ios"))) {
    domainKeywords.push("Mobile Development", "Cross-platform Development", "API Integration");
  }
  if (keywordsBase.some((k) => k.includes("figma") || k.includes("design"))) {
    domainKeywords.push("Product Design", "Design Systems", "User Experience");
  }
  if (keywordsBase.some((k) => k.includes("react") || k.includes("next"))) {
    domainKeywords.push("Web Development", "Frontend Development", "Component Architecture");
  }
  const keywords = [...new Set([...requiredSkills.slice(0, 8), ...domainKeywords])];

  const relatedKey = role.toLowerCase();
  let relatedTitles: string[] = [];
  for (const [k, v] of Object.entries(RELATED_TITLES_MAP)) {
    if (relatedKey.includes(k) || k.includes(relatedKey.split(" ")[0])) {
      relatedTitles = v;
      break;
    }
  }
  if (relatedTitles.length === 0) {
    relatedTitles = [role, role.replace(/junior|senior|mid|lead/i, "").trim(), "Software Developer"].filter(Boolean);
    relatedTitles = [...new Set(relatedTitles)].slice(0, 4);
  }

  return {
    role,
    seniority,
    requiredSkills,
    preferredSkills,
    keywords,
    relatedTitles,
    rawText: text,
  };
}
