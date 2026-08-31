import { CvData } from "./types";

export const defaultCvData: CvData = {
  personal: {
    fullName: "Ana García",
    role: "Product Designer",
    location: "Madrid, España",
    email: "ana.garcia@email.com",
    phone: "+34 612 345 678",
    website: "anagarcia.design",
    linkedin: "linkedin.com/in/anagarcia",
    github: "",
    summary:
      "Product Designer con 5+ años diseñando productos digitales B2C. Especialista en Design Systems y research. En Cabify lideré el sistema usado por 30+ diseñadores y 5 productos, reduciendo el time-to-delivery un 40%. Busco un equipo donde el diseño impacte en métricas reales.",
  },
  experience: [
    {
      id: "exp1",
      role: "Senior Product Designer",
      company: "Cabify",
      location: "Madrid · Híbrido",
      startDate: "2022-03",
      endDate: "",
      current: true,
      description:
        "Lideré el Design System usado por 30+ diseñadores. Definí tokens y componentes en Figma, integrando REST APIs y documentación para handoff. Mejoré consistencia visual en 5 productos y reduje entrega un 40% medido en sprints.",
    },
    {
      id: "exp2",
      role: "UX/UI Designer",
      company: "Spotahome",
      location: "Madrid",
      startDate: "2020-01",
      endDate: "2022-02",
      current: false,
      description:
        "Rediseñé el flujo de reservas integrando research con 50+ usuarios y prototipado en Figma. El nuevo flujo aumentó conversión un 22%. Colaboré con ingeniería con Agile y Git.",
    },
  ],
  education: [
    {
      id: "edu1",
      degree: "Máster en Diseño de Interacción",
      school: "IED Madrid",
      location: "Madrid",
      startDate: "2018-09",
      endDate: "2019-06",
      description: "Proyecto final: app de movilidad premiada. Enfoque en Mobile Application Development y UX Research.",
    },
  ],
  projects: [
    {
      id: "proj1",
      name: "E-commerce Mobile Application",
      link: "",
      technologies: ["Figma", "Design Systems", "REST API", "User Research"],
      description:
        "Desarrollé el flujo completo de una e-commerce cross-platform, integrando REST APIs para gestión de producto y validando con 20+ tests de usabilidad.",
    },
  ],
  certifications: [
    {
      id: "cert1",
      name: "Google UX Design Certificate",
      issuer: "Google / Coursera",
      date: "2021-06",
    },
  ],
  skills: [
    { id: "s1", name: "Figma", category: "Diseño" },
    { id: "s2", name: "Design Systems", category: "Diseño" },
    { id: "s3", name: "User Research", category: "Research" },
    { id: "s4", name: "Prototyping", category: "Diseño" },
    { id: "s5", name: "REST APIs", category: "Integración" },
    { id: "s6", name: "Git", category: "Código" },
    { id: "s7", name: "Agile", category: "Metodología" },
  ],
  languages: [
    { id: "l1", name: "Español", level: "Nativo" },
    { id: "l2", name: "Inglés", level: "Avanzado (C1)" },
  ],
};

export function createEmptyCv(title = "Mi CV sin título") {
  return {
    title,
    template: "minimal" as const,
    data: structuredClone(defaultCvData),
  };
}
