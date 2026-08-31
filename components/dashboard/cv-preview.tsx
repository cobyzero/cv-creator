import { CvData, CvLang, CvTemplate } from "@/lib/cv/types";
import { t } from "@/lib/cv/i18n";
import { formatMonth, formatRange } from "@/lib/cv/format";

// ATS-friendly + A4: 210mm x 297mm, 12mm padding, 100% texto
export function CvPreview({ data, template, lang = "es", compact = false }: { data: CvData; template: CvTemplate; lang?: CvLang; compact?: boolean }) {
  const isExecutive = template === "executive";
  const isCreative = template === "creative";

  const nameClass = isExecutive
    ? "text-[22px] font-extrabold tracking-tight text-zinc-900 uppercase"
    : isCreative
    ? "text-[22px] font-bold tracking-tight text-violet-700"
    : "text-xl font-bold tracking-tight text-zinc-900";

  const roleClass = isExecutive ? "text-[13px] font-semibold tracking-widest uppercase text-zinc-500" : "text-sm font-medium text-zinc-700";
  const sectionClass = isCreative
    ? "text-xs font-bold uppercase tracking-widest text-violet-700 border-l-4 border-violet-600 pl-2"
    : isExecutive
    ? "text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-900 pb-1"
    : "text-xs font-bold uppercase tracking-widest text-zinc-900";

  const headerWrap = isCreative
    ? "border-b-2 border-violet-600 pb-4"
    : isExecutive
    ? "border-b-2 border-zinc-900 pb-4"
    : "border-b border-zinc-200 pb-4";

  const pagePadding = compact ? "p-4" : "p-6 sm:p-8";

  return (
    <div className={`mx-auto w-full bg-white text-zinc-900 ${pagePadding} print:shadow-none`} style={{ width: "210mm", minHeight: "297mm" }}>
      <div className="mx-auto max-w-[170mm]">
        {/* Header */}
        <header className={headerWrap}>
          <h1 className={nameClass}>{data.personal.fullName}</h1>
          <p className={`mt-1 ${roleClass}`}>{data.personal.role}</p>
          <div className={`mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs ${isExecutive ? "text-zinc-600" : "text-zinc-600"}`}>
            {isExecutive ? (
              <>
                <span>{data.personal.email}</span>
                {data.personal.phone && <span>· {data.personal.phone}</span>}
                {data.personal.location && <span>· {data.personal.location}</span>}
                <br />
                <span className="w-full">
                  {data.personal.website && <span>{data.personal.website} </span>}
                  {data.personal.linkedin && <span>· {data.personal.linkedin} </span>}
                  {data.personal.github && <span>· {data.personal.github}</span>}
                </span>
              </>
            ) : (
              <>
                {data.personal.email && <span>{data.personal.email}</span>}
                {data.personal.phone && <span>· {data.personal.phone}</span>}
                {data.personal.location && <span>· {data.personal.location}</span>}
                {data.personal.website && <span>· {data.personal.website}</span>}
                {data.personal.linkedin && <span>· {data.personal.linkedin}</span>}
                {data.personal.github && <span>· {data.personal.github}</span>}
              </>
            )}
          </div>
        </header>

        {data.personal.summary && (
          <section className="mt-6">
            <h2 className={sectionClass}>{t(lang, "summary")}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-700">{data.personal.summary}</p>
          </section>
        )}

        <section className="mt-6">
          <h2 className={sectionClass}>{t(lang, "skills")}</h2>
          <p className={`mt-3 text-sm leading-6 ${isCreative ? "text-zinc-800" : "text-zinc-700"}`}>
            {data.skills.length > 0 ? data.skills.map((s) => s.name).join(isCreative ? "  •  " : " · ") : "—"}
          </p>
        </section>

        <section className="mt-6">
          <h2 className={sectionClass}>{t(lang, "experience")}</h2>
          <div className="mt-3 space-y-5">
            {data.experience.map((exp) => (
              <div key={exp.id} className={isCreative ? "border-l-2 border-violet-100 pl-3" : ""}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <h3 className="text-sm font-semibold">
                    {exp.role} {exp.company && <span className="font-normal text-zinc-600">— {exp.company}</span>}
                  </h3>
                  <span className="text-xs text-zinc-500">
                    {formatRange(exp.startDate, exp.endDate, exp.current, lang)} {exp.location ? `· ${exp.location}` : ""}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-zinc-700">{exp.description}</p>
              </div>
            ))}
            {data.experience.length === 0 && <p className="text-sm text-zinc-400">—</p>}
          </div>
        </section>

        <section className="mt-6">
          <h2 className={sectionClass}>{t(lang, "projects")}</h2>
          <div className="mt-3 space-y-4">
            {data.projects.map((p) => (
              <div key={p.id} className={isCreative ? "border-l-2 border-violet-100 pl-3" : ""}>
                <h3 className="text-sm font-semibold">
                  {p.name} {p.link ? <span className="font-normal text-zinc-500">· {p.link}</span> : null}
                </h3>
                {p.technologies.length > 0 && <p className="text-xs text-zinc-600">{p.technologies.join(" · ")}</p>}
                <p className="mt-1 text-sm leading-6 text-zinc-700">{p.description}</p>
              </div>
            ))}
            {data.projects.length === 0 && <p className="text-sm text-zinc-400">—</p>}
          </div>
        </section>

        <section className="mt-6">
          <h2 className={sectionClass}>{t(lang, "education")}</h2>
          <div className="mt-3 space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id}>
                <h3 className="text-sm font-semibold">
                  {edu.degree} <span className="font-normal text-zinc-600">— {edu.school}</span>
                </h3>
                <p className="text-xs text-zinc-500">
                  {formatRange(edu.startDate, edu.endDate, false, lang)} {edu.location ? `· ${edu.location}` : ""}
                </p>
                {edu.description && <p className="mt-1 text-sm leading-6 text-zinc-700">{edu.description}</p>}
              </div>
            ))}
            {data.education.length === 0 && <p className="text-sm text-zinc-400">—</p>}
          </div>
        </section>

        {data.certifications.length > 0 && (
          <section className="mt-6">
            <h2 className={sectionClass}>{t(lang, "certifications")}</h2>
            <div className="mt-3 space-y-2">
              {data.certifications.map((c) => (
                <div key={c.id} className="flex justify-between gap-2 text-sm">
                  <span className="font-medium">
                    {c.name} <span className="font-normal text-zinc-600">— {c.issuer}</span>
                  </span>
                  <span className="shrink-0 text-xs text-zinc-500">{formatMonth(c.date, lang)}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.languages.length > 0 && (
          <section className="mt-6">
            <h2 className={sectionClass}>{t(lang, "languages")}</h2>
            <p className="mt-3 text-sm text-zinc-700">{data.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</p>
          </section>
        )}

        <div className="mt-8 border-t border-zinc-100 pt-3 text-center text-[10px] uppercase tracking-widest text-zinc-400">
          {template} · A4 · ATS-friendly
        </div>
      </div>
    </div>
  );
}
