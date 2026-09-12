import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Carga backend/.env sin importar desde dónde se arranque:
// backend/ (dev), raíz del repo (concurrently) o dist/ (compilado).
for (const p of [
  path.resolve(process.cwd(), "backend/.env"),
  path.resolve(process.cwd(), ".env"),
  path.resolve(__dirname, "../../.env"),
  path.resolve(__dirname, "../../../.env"),
]) {
  if (!dotenv.config({ path: p }).error) break;
}

export const PORT = Number(process.env.PORT) || 3001;
export const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
