export type CvJson = {
  personal: { nombre: string; email?: string; telefono?: string; ciudad?: string; linkedin?: string };
  resumen: string;
  experiencia: { puesto: string; empresa: string; fechas?: string; bullets: string[] }[];
  educacion: { titulo: string; centro?: string; fechas?: string }[];
  skills: string[];
  idiomas: string[];
};
export const emptyCv: CvJson = { personal:{nombre:""}, resumen:"", experiencia:[], educacion:[], skills:[], idiomas:[] };
