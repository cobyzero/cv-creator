import { z } from "zod";

export const cvPersonalSchema = z.object({
  fullName: z.string().min(1).max(80),
  role: z.string().min(1).max(80),
  location: z.string().max(80),
  email: z.string().email(),
  phone: z.string().max(30),
  website: z.string().max(120),
  linkedin: z.string().max(120),
  github: z.string().max(120),
  summary: z.string().max(1200),
});

export const cvExperienceSchema = z.object({
  id: z.string(),
  role: z.string().min(1),
  company: z.string().min(1),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  current: z.boolean(),
  description: z.string().max(1000),
});

export const cvEducationSchema = z.object({
  id: z.string(),
  degree: z.string().min(1),
  school: z.string().min(1),
  location: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string().max(600),
});

export const cvProjectSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  role: z.string().optional(),
  link: z.string().optional(),
  technologies: z.array(z.string()),
  description: z.string().max(800),
});

export const cvCertificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  issuer: z.string().min(1),
  date: z.string(),
  link: z.string().optional(),
});

export const cvSkillSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  category: z.string(),
});

export const cvLanguageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  level: z.string().min(1),
});

export const cvDataSchema = z.object({
  personal: cvPersonalSchema,
  experience: z.array(cvExperienceSchema),
  education: z.array(cvEducationSchema),
  projects: z.array(cvProjectSchema),
  certifications: z.array(cvCertificationSchema),
  skills: z.array(cvSkillSchema),
  languages: z.array(cvLanguageSchema),
});

export const createCvSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  template: z.enum(["minimal", "executive", "creative"]).optional(),
  lang: z.enum(["es", "en"]).optional(),
  data: cvDataSchema.optional(),
});

export const updateCvSchema = z.object({
  title: z.string().min(1).max(100).optional(),
  template: z.enum(["minimal", "executive", "creative"]).optional(),
  lang: z.enum(["es", "en"]).optional(),
  data: cvDataSchema.optional(),
});
