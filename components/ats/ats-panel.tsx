"use client";

import { useState } from "react";
import { CvData } from "@/lib/cv/types";
import { parseJobOffer, computeMatch, computeVisibility, computeAtsScores, computePositioning } from "@/lib/ats";
import type { JobIntelligence } from "@/lib/ats/types";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AtsPanel({ data, onApply }: { data: CvData; onApply?: (optimized: CvData) => void }) {
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [job, setJob] = useState<(JobIntelligence & { summary?: string; source?: string }) | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [optimizeMsg, setOptimizeMsg] = useState<string | null>(null);

  async function handleAnalyze() {
    const text = jobText;
    if (!text.trim() || text.trim().length < 10) {
      setError("Pega la oferta completa para analizar.");
      return;
    }
    setLoading(true);
    setError(null);
    setWarning(null);
    try {
      const res = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobText: text }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "Error al analizar");
      setJob(payload.job);
      if (payload.warning) setWarning(payload.warning);
    } catch (e) {
      // Fallback local si la API falla totalmente
      console.warn(e);
      const fallback = parseJobOffer(text);
      setJob({ ...fallback, source: "fallback" });
      setWarning("No se pudo conectar a DeepSeek — usando análisis local.");
    } finally {
      setLoading(false);
    }
  }

  async function handleOptimize() {
    if (!job || !onApply) return;
    setOptimizing(true);
    setOptimizeMsg(null);
    setError(null);
    try {
      const res = await fetch("/api/ats/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobText: job.rawText, cvData: data, jobIntelligence: job }),
      });
      const payload = await res.json();
      if (!res.ok) throw new Error(payload.error || "No se pudo optimizar");
      onApply(payload.cvData as CvData);
      const src = payload.source === "deepseek" ? "DeepSeek" : "local";
      setOptimizeMsg(`✓ CV optimizado con ${src} — ${payload.changes?.join(" · ") || "cambios aplicados"} (sin inventar).`);
      if (payload.warning) setWarning(payload.warning);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error al optimizar");
    } finally {
      setOptimizing(false);
    }
  }

  const result = job
    ? (() => {
        const match = computeMatch(data, job);
        const visibility = computeVisibility(data, job);
        const scores = computeAtsScores(match, visibility);
        const positioning = computePositioning(data, job);
        return { job, match, visibility, scores, positioning };
      })()
    : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">2. Analizar oferta laboral</h3>
          <span className="flex items-center gap-1.5 text-xs text-zinc-500">
            <span className={`h-2 w-2 rounded-full ${job?.source === "deepseek" ? "bg-violet-500" : job?.source === "fallback" ? "bg-amber-500" : "bg-zinc-300"}`} />
            {job?.source === "deepseek" ? "DeepSeek" : job?.source === "fallback" ? "Local" : "Job Intelligence"}
          </span>
        </div>
        <p className="mt-1 text-xs text-zinc-500">Pega la descripción. Con DeepSeek recibirás Role/Seniority/Skills/Keywords más claros. Sin key usa parser local.</p>
        <Textarea value={jobText} onChange={(e) => setJobText(e.target.value)} rows={8} placeholder="Pega aquí la oferta para la postulación..." className="mt-3 font-mono text-xs" />
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={() => handleAnalyze()} size="sm" className="rounded-full" disabled={loading || !jobText.trim()}>
            {loading ? "Analizando..." : "Analizar oferta"}
          </Button>
          {job && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setJob(null);
                setWarning(null);
                setError(null);
              }}
            >
              Limpiar
            </Button>
          )}
        </div>
        {warning && <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700 dark:bg-amber-950/30 dark:text-amber-300">{warning}</p>}
        {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700 dark:bg-red-950/30 dark:text-red-300">{error}</p>}
      </div>

      {!result ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 p-6 text-center text-sm text-zinc-500 dark:border-zinc-700">
          Pega la oferta para la postulación y pulsa <b>Analizar oferta</b> para ver Job Match Score y Candidate Visibility.
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="text-xs font-bold uppercase tracking-widest">Job Intelligence {result.job.source === "deepseek" && <span className="ml-2 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold text-violet-700 dark:bg-violet-900 dark:text-violet-200">IA</span>}</h4>
            {(result.job as { summary?: string }).summary && (
              <p className="mt-2 rounded-lg bg-zinc-50 px-3 py-2 text-xs italic text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">{(result.job as { summary?: string }).summary}</p>
            )}
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-xs font-semibold text-zinc-500">Role</p>
                <p className="text-sm font-medium">{result.job.role}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500">Seniority</p>
                <p className="text-sm">{result.job.seniority}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500">Required skills</p>
                <p className="text-sm">{result.job.requiredSkills.join(" · ") || "—"}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-500">Preferred skills</p>
                <p className="text-sm">{result.job.preferredSkills.join(" · ") || "—"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-zinc-500">Keywords</p>
                <p className="text-sm">{result.job.keywords.join(" · ") || "—"}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs font-semibold text-zinc-500">Related titles</p>
                <p className="text-sm">{result.job.relatedTitles.join(" · ")}</p>
              </div>
            </div>
          </div>

          {/* PRIORIDAD - lo que te falta, más intuitivo */}
          <div className="rounded-2xl border-2 border-amber-300 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/40">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs text-white">!</span>
              <h4 className="text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-200">Prioridad — qué te falta</h4>
              <span className="ml-auto rounded-full bg-white px-2 py-0.5 text-xs font-bold text-amber-700 dark:bg-zinc-900 dark:text-amber-300">{result.match.overall}% Match</span>
            </div>
            {result.match.missingSkills.length > 0 ? (
              <div className="mt-3">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">Faltan ({result.match.missingSkills.length}) — no las inventaremos:</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {result.match.missingSkills.map((s) => (
                    <span key={s} className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-red-600 shadow-sm dark:bg-zinc-800 dark:text-red-300">
                      ✕ {s}
                    </span>
                  ))}
                </div>
                <p className="mt-2 text-xs italic text-amber-700 dark:text-amber-300">“Aparecen en la oferta pero no hay evidencia en tu perfil. No las añadiremos si no las tienes.”</p>
              </div>
            ) : (
              <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-medium text-emerald-700 dark:bg-zinc-800 dark:text-emerald-300">✓ No te faltan skills requeridas — buen encaje.</p>
            )}
            {result.visibility.issues.length > 0 && (
              <div className="mt-3">
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-200">Qué mejorar ahora:</p>
                <ul className="mt-1.5 space-y-1.5">
                  {result.visibility.issues.slice(0, 3).map((iss, i) => (
                    <li key={i} className="flex gap-2 text-xs leading-5 text-zinc-700 dark:text-zinc-300">
                      <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                      {iss}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <Button onClick={handleOptimize} disabled={optimizing || !onApply} size="sm" className="mt-4 w-full rounded-full bg-violet-600 hover:bg-violet-700">
              {optimizing ? "Optimizando..." : "✦ Aplicar mejoras priorizadas"}
            </Button>
            {optimizeMsg && <p className="mt-2 rounded-lg bg-white px-3 py-2 text-xs text-emerald-700 dark:bg-zinc-800 dark:text-emerald-300">{optimizeMsg}</p>}
          </div>

          <div className="rounded-2xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-900 dark:bg-violet-950/30">
            <h4 className="text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">CV Intelligence — Cómo te estamos posicionando</h4>
            <div className="mt-3 grid gap-2 sm:grid-cols-2 text-sm">
              <div>
                <span className="font-semibold">Primary:</span> {result.positioning.primary}
              </div>
              <div>
                <span className="font-semibold">Secondary:</span> {result.positioning.secondary.join(", ") || "—"}
              </div>
              <div>
                <span className="font-semibold">Core expertise:</span> {result.positioning.coreExpertise.join(" · ")}
              </div>
              <div>
                <span className="font-semibold">Domain:</span> {result.positioning.domain}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-widest">Job Match Score</h4>
              <span className="rounded-full bg-zinc-900 px-3 py-1 text-sm font-bold text-white dark:bg-white dark:text-zinc-900">{result.match.overall}% Match</span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              {Object.entries(result.match.breakdown).map(([k, v]) => (
                <div key={k} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="capitalize">{k}</span>
                    <span className="font-semibold">{v}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-zinc-100 dark:bg-zinc-800">
                    <div className="h-1.5 rounded-full bg-zinc-900 dark:bg-white" style={{ width: `${v}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {result.match.missingSkills.length > 0 && (
              <div className="mt-4 rounded-xl bg-amber-50 p-3 text-xs dark:bg-amber-950/30">
                <p className="font-semibold text-amber-700 dark:text-amber-300">Missing skill — no inventamos:</p>
                <p className="mt-1 text-zinc-700 dark:text-zinc-300">{result.match.missingSkills.join(" · ")}</p>
                <p className="mt-1 italic text-zinc-500">“Esta habilidad aparece en la oferta pero no encontramos evidencia en tu perfil.”</p>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="text-xs font-bold uppercase tracking-widest">Candidate Visibility</h4>
            <p className="mt-1 text-xs text-zinc-500">“Optimizado para máquinas. Escrito para humanos.”</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ["ATS Compatibility", result.scores.atsCompatibility],
                ["Recruiter Readability", result.scores.recruiterReadability],
                ["Job Relevance", result.scores.jobRelevance],
                ["Overall Visibility", result.scores.overallVisibility],
              ].map(([label, val]) => (
                <div key={label as string} className="rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
                  <p className="text-xs font-semibold text-zinc-500">{label as string}</p>
                  <p className="mt-1 text-2xl font-bold">{val as number}%</p>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              {[
                ["Keyword Coverage", result.visibility.keywordCoverage],
                ["Semantic Coverage", result.visibility.semanticCoverage],
                ["Title Alignment", result.visibility.titleAlignment],
                ["Experience Evidence", result.visibility.experienceEvidence],
                ["Section Recognition", result.visibility.sectionRecognition],
                ["Parsing Safety", result.visibility.parsingSafety],
              ].map(([label, val]) => (
                <div key={label as string} className="flex items-center justify-between text-xs">
                  <span>{label as string}</span>
                  <span className={`font-semibold ${val as number < 60 ? "text-red-600" : val as number < 80 ? "text-amber-600" : "text-emerald-600"}`}>{val as number}%</span>
                </div>
              ))}
            </div>
            {result.visibility.issues.length > 0 && (
              <div className="mt-4 rounded-xl bg-zinc-900 p-3 text-xs text-white dark:bg-white dark:text-zinc-900">
                <p className="font-semibold">Improve your visibility — qué modificar</p>
                <ul className="mt-2 list-disc space-y-1 pl-4">
                  {result.visibility.issues.map((iss, i) => (
                    <li key={i}>{iss}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="text-xs font-bold uppercase tracking-widest">Keyword Coverage</h4>
            <div className="mt-3 space-y-3 text-xs">
              <div>
                <p className="font-semibold">Required</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {result.visibility.keywordDetails.required.map((r) => (
                    <span
                      key={r.skill}
                      className={`rounded-full px-2.5 py-1 font-medium ${r.status === "found" ? (r.evidence === "with-context" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-200" : "bg-amber-100 text-amber-700") : "bg-red-100 text-red-700"}`}
                      title={r.evidence}
                    >
                      {r.status === "found" ? "✓" : "⚠"} {r.skill} {r.evidence === "with-context" ? "· Evidence" : r.evidence === "skill-only" ? "· Skill-only" : ""}
                    </span>
                  ))}
                </div>
              </div>
              {result.visibility.keywordDetails.preferred.length > 0 && (
                <div>
                  <p className="font-semibold">Preferred</p>
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {result.visibility.keywordDetails.preferred.map((r) => (
                      <span key={r.skill} className={`rounded-full px-2.5 py-1 ${r.status === "found" ? "bg-zinc-100 dark:bg-zinc-800" : "bg-red-50 text-red-600"}`}>
                        {r.status === "found" ? "✓" : "⚠"} {r.skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="font-semibold">Related</p>
                <div className="mt-1 flex flex-wrap gap-1.5">
                  {result.visibility.keywordDetails.related.map((r) => (
                    <span key={r.term} className={`rounded-full px-2 py-1 ${r.found ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-500"}`}>{r.found ? "✓" : "·"} {r.term}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
}
