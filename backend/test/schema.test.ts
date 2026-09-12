import { CvSchema } from "../src/schemas/cv.schema.js";
const ok = { personal:{nombre:"A"}, resumen:"x", experiencia:[], educacion:[], skills:["React"], idiomas:[] };
console.assert(CvSchema.safeParse(ok).success, "debe pasar");
console.assert(!CvSchema.safeParse({}).success, "vacio debe fallar");
console.log("schema ok");
