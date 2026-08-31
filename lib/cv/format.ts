import { CvLang } from "./types";

export function formatMonth(value: string, lang: CvLang = "es"): string {
  if (!value) return "";
  // value is YYYY-MM
  const [y, m] = value.split("-");
  if (!y || !m) return value;
  const date = new Date(Number(y), Number(m) - 1, 1);
  if (isNaN(date.getTime())) return value;
  const locale = lang === "en" ? "en-US" : "es-ES";
  // Short month: "mar 2022" or "Mar 2022"
  const fmt = new Intl.DateTimeFormat(locale, { month: "short", year: "numeric" });
  // Capitalize first letter
  const str = fmt.format(date);
  return str.charAt(0).toUpperCase() + str.slice(1).replace(".", "");
}

export function formatRange(start: string, end: string, current: boolean, lang: CvLang = "es"): string {
  const s = formatMonth(start, lang);
  const e = current ? (lang === "en" ? "Present" : "Actual") : formatMonth(end, lang) || (lang === "en" ? "Present" : "Actual");
  if (!s && !e) return "";
  if (!s) return e;
  if (!e) return s;
  return `${s} – ${e}`;
}
