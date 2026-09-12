import { jsPDF } from "jspdf";
import type { CvJson } from "./types";

const M = 15; // margen mm
const W = 210 - M * 2;

// PDF con texto real (no imagen): lo puede leer un ATS y pesa poco.
// Réplica del template Minimal ATS a una página.
export function exportCvPdf(cv: CvJson, title: string): void {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = M;

  const need = (h: number) => {
    if (y + h > 297 - M) { doc.addPage(); y = M; }
  };
  const section = (t: string) => {
    need(12);
    doc.setFont("helvetica", "bold"); doc.setFontSize(10);
    doc.setTextColor(0, 0, 0); doc.text(t.toUpperCase(), M, y);
    y += 2;
    doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.4);
    doc.line(M, y, M + W, y);
    y += 5;
  };
  const para = (t: string, size = 9.5) => {
    doc.setFont("helvetica", "normal"); doc.setFontSize(size);
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(t, W);
    for (const ln of lines) { need(5); doc.text(ln, M, y); y += 4.5; }
    y += 1.5;
  };

  doc.setFont("helvetica", "bold"); doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text(cv.personal.nombre || "Sin nombre", M, y);
  y += 6;
  const contact = [cv.personal.ciudad, cv.personal.email, cv.personal.telefono, cv.personal.linkedin]
    .filter(Boolean).join(" · ");
  if (contact) para(contact, 9);

  if (cv.resumen) { section("Resumen"); para(cv.resumen); }
  if (cv.experiencia.length) {
    section("Experiencia");
    for (const e of cv.experiencia) {
      need(10);
      doc.setFont("helvetica", "bold"); doc.setFontSize(10);
      doc.text(`${e.puesto} — ${e.empresa}${e.fechas ? `  ${e.fechas}` : ""}`, M, y, { maxWidth: W });
      y += 5;
      for (const b of e.bullets) {
        doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
        const lines = doc.splitTextToSize(`•  ${b}`, W - 5);
        for (const ln of lines) { need(5); doc.text(ln, M + 5, y); y += 4.5; }
      }
      y += 2;
    }
  }
  if (cv.educacion.length) {
    section("Educación");
    for (const e of cv.educacion) para(`${e.titulo}${e.centro ? ` — ${e.centro}` : ""}${e.fechas ? `  ${e.fechas}` : ""}`);
  }
  if (cv.skills.length) { section("Skills"); para(cv.skills.join(", ")); }
  if (cv.idiomas.length) { section("Idiomas"); para(cv.idiomas.join(", ")); }

  const safe = (title || "cv").replace(/[^\w\-áéíóúñü]+/gi, "_").slice(0, 60);
  doc.save(`${safe}.pdf`);
}
