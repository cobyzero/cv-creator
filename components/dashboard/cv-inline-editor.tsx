"use client";

import { CvData, CvLang, CvTemplate } from "@/lib/cv/types";
import { t } from "@/lib/cv/i18n";

function InlineInput({
  value,
  onChange,
  placeholder,
  className = "",
  multiline = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
  multiline?: boolean;
}) {
  const base =
    "w-full bg-transparent outline-none placeholder:text-zinc-400 hover:bg-zinc-50 focus:bg-white focus:ring-1 focus:ring-zinc-900 rounded px-1 -mx-1 transition";
  if (multiline) {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={value.split("\n").length || 1}
        className={`${base} resize-none py-0.5 ${className}`}
        style={{ fieldSizing: "content" } as React.CSSProperties}
      />
    );
  }
  return <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`${base} ${className}`} />;
}

export function CvInlineEditor({
  data,
  template,
  lang = "es",
  onChange,
}: {
  data: CvData;
  template: CvTemplate;
  lang?: CvLang;
  onChange: (d: CvData) => void;
}) {
  const isExecutive = template === "executive";
  const isCreative = template === "creative";

  const nameClass = isExecutive ? "text-[22px] font-extrabold uppercase tracking-tight" : isCreative ? "text-[22px] font-bold text-violet-700 tracking-tight" : "text-xl font-bold tracking-tight";
  const roleClass = isExecutive ? "text-[13px] font-semibold uppercase tracking-widest text-zinc-500" : "text-sm font-medium text-zinc-700";
  const sectionClass = isCreative
    ? "text-xs font-bold uppercase tracking-widest text-violet-700 border-l-4 border-violet-600 pl-2"
    : isExecutive
    ? "text-xs font-bold uppercase tracking-widest text-zinc-900 border-b border-zinc-900 pb-1"
    : "text-xs font-bold uppercase tracking-widest text-zinc-900";
  const headerWrap = isCreative ? "border-b-2 border-violet-600 pb-4" : isExecutive ? "border-b-2 border-zinc-900 pb-4" : "border-b border-zinc-200 pb-4";

  const setPersonal = (patch: Partial<CvData["personal"]>) => onChange({ ...data, personal: { ...data.personal, ...patch } });

  return (
    <div className="w-full bg-white p-6 text-zinc-900 sm:p-8" style={{ width: "210mm", minHeight: "297mm" }}>
      <div className="mx-auto max-w-[170mm]">
        <header className={headerWrap}>
          <InlineInput value={data.personal.fullName} onChange={(v) => setPersonal({ fullName: v })} placeholder="Nombre completo" className={nameClass} />
          <InlineInput value={data.personal.role} onChange={(v) => setPersonal({ role: v })} placeholder="Cargo objetivo (ej: Flutter Developer)" className={`mt-1 ${roleClass}`} />
          <div className="mt-3 grid gap-1.5 sm:grid-cols-2">
            <InlineInput value={data.personal.email} onChange={(v) => setPersonal({ email: v })} placeholder="email@ejemplo.com" className="text-xs text-zinc-600" />
            <InlineInput value={data.personal.phone} onChange={(v) => setPersonal({ phone: v })} placeholder="Teléfono" className="text-xs text-zinc-600" />
            <InlineInput value={data.personal.location} onChange={(v) => setPersonal({ location: v })} placeholder="Ubicación" className="text-xs text-zinc-600" />
            <InlineInput value={data.personal.website} onChange={(v) => setPersonal({ website: v })} placeholder="Portfolio / Web" className="text-xs text-zinc-600" />
            <InlineInput value={data.personal.linkedin} onChange={(v) => setPersonal({ linkedin: v })} placeholder="linkedin.com/in/..." className="text-xs text-zinc-600" />
            <InlineInput value={data.personal.github} onChange={(v) => setPersonal({ github: v })} placeholder="github.com/..." className="text-xs text-zinc-600" />
          </div>
        </header>

        <section className="mt-6">
          <h2 className={sectionClass}>{t(lang, "summary")}</h2>
          <InlineInput value={data.personal.summary} onChange={(v) => setPersonal({ summary: v })} placeholder="Professional Summary — profesión + años + tecnologías + impacto..." multiline className="mt-3 text-sm leading-6 text-zinc-700" />
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className={sectionClass}>{t(lang, "skills")}</h2>
            <button onClick={() => onChange({ ...data, skills: [...data.skills, { id: `s${Date.now()}`, name: "", category: "General" }] })} className="rounded-full bg-zinc-900 px-2 py-0.5 text-xs text-white hover:bg-zinc-800 dark:bg-white dark:text-zinc-900">
              +
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {data.skills.map((s) => (
              <span key={s.id} className="group/skill inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white px-2.5 py-1 text-zinc-900 shadow-sm">
                <input value={s.name} onChange={(e) => onChange({ ...data, skills: data.skills.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)) })} placeholder="Skill" className="w-20 bg-transparent text-xs font-medium text-zinc-900 outline-none placeholder:text-zinc-400" />
                <button onClick={() => onChange({ ...data, skills: data.skills.filter((x) => x.id !== s.id) })} className="opacity-0 group-hover/skill:opacity-100 text-zinc-400 hover:text-red-500">
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className={sectionClass}>{t(lang, "experience")}</h2>
            <button onClick={() => onChange({ ...data, experience: [...data.experience, { id: `exp${Date.now()}`, role: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" }] })} className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs hover:bg-zinc-50 dark:border-zinc-700">
              + Añadir
            </button>
          </div>
          <div className="mt-3 space-y-4">
            {data.experience.map((exp) => (
              <div key={exp.id} className={`group relative rounded-xl p-2 ${isCreative ? "border-l-2 border-violet-100 hover:border-violet-200" : "border border-transparent hover:border-zinc-200 hover:bg-zinc-50/50"}`}>
                <button onClick={() => onChange({ ...data, experience: data.experience.filter((x) => x.id !== exp.id) })} className="absolute right-2 top-2 hidden rounded-full bg-white px-1.5 py-0.5 text-xs shadow group-hover:block hover:text-red-600">
                  ✕
                </button>
                <div className="grid gap-1.5 sm:grid-cols-2">
                  <InlineInput value={exp.role} onChange={(v) => onChange({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, role: v } : x)) })} placeholder="Rol" className="text-sm font-semibold" />
                  <InlineInput value={exp.company} onChange={(v) => onChange({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, company: v } : x)) })} placeholder="Empresa" className="text-sm" />
                  <InlineInput value={exp.location} onChange={(v) => onChange({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, location: v } : x)) })} placeholder="Ubicación" className="text-xs text-zinc-500" />
                  <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
                    <input type="month" value={exp.startDate} onChange={(e) => onChange({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, startDate: e.target.value } : x)) })} className="w-[132px] rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 shadow-sm focus:border-zinc-400 focus:outline-none" />
                    <span className="text-xs text-zinc-400">—</span>
                    <input type="month" value={exp.endDate} disabled={exp.current} onChange={(e) => onChange({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, endDate: e.target.value } : x)) })} className="w-[132px] rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 shadow-sm focus:border-zinc-400 focus:outline-none disabled:opacity-40 disabled:bg-zinc-50" />
                    <label className="flex items-center gap-1.5 rounded-full bg-zinc-50 px-2 py-1 text-xs font-medium text-zinc-600">
                      <input type="checkbox" checked={exp.current} onChange={(e) => onChange({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, current: e.target.checked } : x)) })} className="h-3 w-3 rounded border-zinc-300" /> {lang === "en" ? "Present" : "Actual"}
                    </label>
                  </div>
                </div>
                <InlineInput value={exp.description} onChange={(v) => onChange({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, description: v } : x)) })} placeholder="Developed cross-platform apps using..." multiline className="mt-2 text-sm leading-6 text-zinc-700" />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className={sectionClass}>{t(lang, "projects")}</h2>
            <button onClick={() => onChange({ ...data, projects: [...data.projects, { id: `proj${Date.now()}`, name: "", technologies: [], description: "", link: "" }] })} className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs hover:bg-zinc-50 dark:border-zinc-700">
              + Añadir
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {data.projects.map((p) => (
              <div key={p.id} className={`group relative rounded-xl p-2 ${isCreative ? "border-l-2 border-violet-100" : "border border-transparent hover:border-zinc-200"}`}>
                <button onClick={() => onChange({ ...data, projects: data.projects.filter((x) => x.id !== p.id) })} className="absolute right-2 top-2 hidden rounded-full bg-white px-1.5 py-0.5 text-xs shadow group-hover:block hover:text-red-600">
                  ✕
                </button>
                <InlineInput value={p.name} onChange={(v) => onChange({ ...data, projects: data.projects.map((x) => (x.id === p.id ? { ...x, name: v } : x)) })} placeholder="Nombre del proyecto" className="text-sm font-semibold" />
                <InlineInput value={p.technologies.join(" · ")} onChange={(v) => onChange({ ...data, projects: data.projects.map((x) => (x.id === p.id ? { ...x, technologies: v.split("·").map((s) => s.trim()).filter(Boolean) } : x)) })} placeholder="Tecnologías · ej: Flutter · Dart · Firebase" className="text-xs text-zinc-600" />
                <InlineInput value={p.link || ""} onChange={(v) => onChange({ ...data, projects: data.projects.map((x) => (x.id === p.id ? { ...x, link: v } : x)) })} placeholder="Link opcional" className="text-xs text-zinc-500" />
                <InlineInput value={p.description} onChange={(v) => onChange({ ...data, projects: data.projects.map((x) => (x.id === p.id ? { ...x, description: v } : x)) })} placeholder="Descripción con contexto..." multiline className="mt-1 text-sm leading-6 text-zinc-700" />
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className={sectionClass}>{t(lang, "education")}</h2>
            <button onClick={() => onChange({ ...data, education: [...data.education, { id: `edu${Date.now()}`, degree: "", school: "", location: "", startDate: "", endDate: "", description: "" }] })} className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs hover:bg-zinc-50 dark:border-zinc-700">
              + Añadir
            </button>
          </div>
          <div className="mt-3 space-y-3">
            {data.education.map((edu) => (
              <div key={edu.id} className="group relative rounded-xl p-2 hover:border-zinc-200 hover:bg-zinc-50/50">
                <button onClick={() => onChange({ ...data, education: data.education.filter((x) => x.id !== edu.id) })} className="absolute right-2 top-2 hidden rounded-full bg-white px-1.5 py-0.5 text-xs shadow group-hover:block hover:text-red-600">
                  ✕
                </button>
                <InlineInput value={edu.degree} onChange={(v) => onChange({ ...data, education: data.education.map((x) => (x.id === edu.id ? { ...x, degree: v } : x)) })} placeholder="Título" className="text-sm font-semibold" />
                <InlineInput value={edu.school} onChange={(v) => onChange({ ...data, education: data.education.map((x) => (x.id === edu.id ? { ...x, school: v } : x)) })} placeholder="Escuela" className="text-sm" />
                <div className="flex flex-wrap items-center gap-2">
                  <input type="month" value={edu.startDate} onChange={(e) => onChange({ ...data, education: data.education.map((x) => (x.id === edu.id ? { ...x, startDate: e.target.value } : x)) })} className="w-[132px] rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 shadow-sm focus:border-zinc-400 focus:outline-none" />
                  <span className="text-xs text-zinc-400">—</span>
                  <input type="month" value={edu.endDate} onChange={(e) => onChange({ ...data, education: data.education.map((x) => (x.id === edu.id ? { ...x, endDate: e.target.value } : x)) })} className="w-[132px] rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 shadow-sm focus:border-zinc-400 focus:outline-none" />
                  <InlineInput value={edu.location} onChange={(v) => onChange({ ...data, education: data.education.map((x) => (x.id === edu.id ? { ...x, location: v } : x)) })} placeholder="Ubicación" className="flex-1 text-xs text-zinc-500" />
                </div>
                <InlineInput value={edu.description} onChange={(v) => onChange({ ...data, education: data.education.map((x) => (x.id === edu.id ? { ...x, description: v } : x)) })} placeholder="Descripción..." multiline className="mt-1 text-sm leading-6 text-zinc-700" />
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-700">{t(lang, "certifications")}</h3>
              <button onClick={() => onChange({ ...data, certifications: [...data.certifications, { id: `cert${Date.now()}`, name: "", issuer: "", date: "" }] })} className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs hover:bg-zinc-50 dark:border-zinc-700">
                + Añadir
              </button>
            </div>
            {data.certifications.map((c) => (
              <div key={c.id} className="group flex items-center gap-1.5">
                <InlineInput value={c.name} onChange={(v) => onChange({ ...data, certifications: data.certifications.map((x) => (x.id === c.id ? { ...x, name: v } : x)) })} placeholder="Certificación" className="flex-1 text-sm" />
                <InlineInput value={c.issuer} onChange={(v) => onChange({ ...data, certifications: data.certifications.map((x) => (x.id === c.id ? { ...x, issuer: v } : x)) })} placeholder="Emisor" className="flex-1 text-sm" />
                <input type="month" value={c.date} onChange={(e) => onChange({ ...data, certifications: data.certifications.map((x) => (x.id === c.id ? { ...x, date: e.target.value } : x)) })} className="w-[132px] rounded-lg border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 shadow-sm focus:border-zinc-400 focus:outline-none" />
                <button onClick={() => onChange({ ...data, certifications: data.certifications.filter((x) => x.id !== c.id) })} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500">
                  ×
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6">
          <h2 className={sectionClass}>{t(lang, "languages")}</h2>
          <div className="mt-3 space-y-1.5">
            {data.languages.map((l) => (
              <div key={l.id} className="group flex items-center gap-1.5">
                <InlineInput value={l.name} onChange={(v) => onChange({ ...data, languages: data.languages.map((x) => (x.id === l.id ? { ...x, name: v } : x)) })} placeholder="Idioma" className="flex-1 text-sm" />
                <InlineInput value={l.level} onChange={(v) => onChange({ ...data, languages: data.languages.map((x) => (x.id === l.id ? { ...x, level: v } : x)) })} placeholder="Nivel" className="flex-1 text-sm" />
                <button onClick={() => onChange({ ...data, languages: data.languages.filter((x) => x.id !== l.id) })} className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500">
                  ×
                </button>
              </div>
            ))}
            <button onClick={() => onChange({ ...data, languages: [...data.languages, { id: `l${Date.now()}`, name: "", level: "" }] })} className="rounded-full border border-zinc-200 px-2 py-0.5 text-xs hover:bg-zinc-50 dark:border-zinc-700">
              + Idioma
            </button>
          </div>
        </section>

        <div className="mt-8 border-t border-zinc-100 pt-3 text-center text-[10px] uppercase tracking-widest text-zinc-400">
          {template} · A4 · ATS-friendly · 210×297mm
        </div>
      </div>
    </div>
  );
}
