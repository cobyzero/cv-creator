export interface JobIntelligence {
  role: string;
  seniority: "Junior" | "Mid" | "Senior" | "Lead" | "Unknown";
  requiredSkills: string[];
  preferredSkills: string[];
  keywords: string[];
  relatedTitles: string[];
  rawText: string;
}

export interface MatchBreakdown {
  skills: number; // 0-100
  experience: number;
  title: number;
  education: number;
  keywords: number;
  seniority: number;
}

export interface MatchResult {
  overall: number;
  breakdown: MatchBreakdown;
  missingSkills: string[];
  presentSkills: string[];
}

export interface KeywordCoverage {
  required: { skill: string; status: "found" | "missing"; evidence: "skill-only" | "with-context" | "none" }[];
  preferred: { skill: string; status: "found" | "missing"; evidence: "skill-only" | "with-context" | "none" }[];
  related: { term: string; found: boolean }[];
}

export interface VisibilityAnalysis {
  keywordCoverage: number; // 0-100
  semanticCoverage: number;
  titleAlignment: number;
  experienceEvidence: number;
  sectionRecognition: number;
  parsingSafety: number;
  issues: string[]; // parsing safety warnings
  keywordDetails: KeywordCoverage;
}

export interface AtsScores {
  atsCompatibility: number;
  recruiterReadability: number;
  jobRelevance: number;
  overallVisibility: number;
}

export interface Positioning {
  primary: string;
  secondary: string[];
  coreExpertise: string[];
  domain: string;
}
