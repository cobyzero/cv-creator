"use client";

import { useState } from "react";
import { CvData, CvTemplate } from "@/lib/cv/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Tab = "personal" | "experience" | "projects" | "education" | "skills";

export function CvEditor({
  data,
  template,
  title,
  onChangeData,
  onChangeMeta,
}: {
  data: CvData;
  template: CvTemplate;
  title: string;
  onChangeData: (d: CvData) => void;
  onChangeMeta: (patch: { title?: string; template?: CvTemplate }) => void;
}) {
  const [tab, setTab] = useState<Tab>("personal");

  return (
    <div className="flex h-full flex-col">
      {/* meta */}
      <div className="border-b border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="cv-title" className="text-xs">Título del CV</Label>
            <Input id="cv-title" value={title} onChange={(e) => onChangeMeta({ title: e.target.value })} placeholder="Ej: CV Ana - Producto" />
          </div>
          <div className="w-36">
            <Label className="text-xs">Plantilla</Label>
            <select
              value={template}
              onChange={(e) => onChangeMeta({ template: e.target.value as CvTemplate })}
              className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 text-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <option value="minimal">Minimal</option>
              <option value="executive">Executive</option>
              <option value="creative">Creative</option>
            </select>
          </div>
        </div>

        <div className="mt-4 flex gap-1 overflow-x-auto rounded-full bg-zinc-100 p-1 dark:bg-zinc-800">
          {[
            ["personal", "Personal"],
            ["experience", "Experiencia"],
            ["projects", "Proyectos"],
            ["education", "Educación"],
            ["skills", "Skills"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id as Tab)}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition ${tab === id ? "bg-white shadow-sm dark:bg-zinc-900" : "text-zinc-500"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {tab === "personal" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-amber-50 p-3 text-xs leading-5 text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
              <b>Regla ATS:</b> usa títulos profesionales reconocibles. Evita “Ninja” o “Gurú”. El campo <b>Rol</b> debe coincidir con la oferta.
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre completo</Label>
                <Input value={data.personal.fullName} onChange={(e) => onChangeData({ ...data, personal: { ...data.personal, fullName: e.target.value } })} />
              </div>
              <div className="space-y-2">
                <Label>Cargo objetivo *</Label>
                <Input value={data.personal.role} onChange={(e) => onChangeData({ ...data, personal: { ...data.personal, role: e.target.value } })} placeholder="Ej: Flutter Developer" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Email</Label><Input value={data.personal.email} onChange={(e) => onChangeData({ ...data, personal: { ...data.personal, email: e.target.value } })} /></div>
              <div className="space-y-2"><Label>Teléfono</Label><Input value={data.personal.phone} onChange={(e) => onChangeData({ ...data, personal: { ...data.personal, phone: e.target.value } })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>Ubicación</Label><Input value={data.personal.location} onChange={(e) => onChangeData({ ...data, personal: { ...data.personal, location: e.target.value } })} /></div>
              <div className="space-y-2"><Label>Portfolio / Web</Label><Input value={data.personal.website} onChange={(e) => onChangeData({ ...data, personal: { ...data.personal, website: e.target.value } })} /></div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2"><Label>LinkedIn</Label><Input value={data.personal.linkedin} onChange={(e) => onChangeData({ ...data, personal: { ...data.personal, linkedin: e.target.value } })} placeholder="linkedin.com/in/..." /></div>
              <div className="space-y-2"><Label>GitHub</Label><Input value={data.personal.github} onChange={(e) => onChangeData({ ...data, personal: { ...data.personal, github: e.target.value } })} /></div>
            </div>
            <div className="space-y-2">
              <Label>Professional Summary *</Label>
              <Textarea rows={4} value={data.personal.summary} onChange={(e) => onChangeData({ ...data, personal: { ...data.personal, summary: e.target.value } })} placeholder="Profesión + años + tecnologías + especialización. Ej: Product Designer con 5 años..." />
              <p className="text-xs text-zinc-500">Evita frases genéricas. Usa términos de la oferta si son reales.</p>
            </div>
          </div>
        )}

        {tab === "experience" && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500">Describe cada rol con <b>tecnologías + contexto + impacto</b>. Ej: “Developed cross-platform apps using Flutter and Dart, integrating Firebase and REST APIs.” Nunca inventes métricas.</p>
            {data.experience.map((exp, idx) => (
              <div key={exp.id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500">Experiencia {idx + 1}</span>
                  <button onClick={() => onChangeData({ ...data, experience: data.experience.filter((e) => e.id !== exp.id) })} className="text-xs text-red-500">Eliminar</button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Rol" value={exp.role} onChange={(e) => onChangeData({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, role: e.target.value } : x)) })} />
                  <Input placeholder="Empresa" value={exp.company} onChange={(e) => onChangeData({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, company: e.target.value } : x)) })} />
                  <Input placeholder="Ubicación" value={exp.location} onChange={(e) => onChangeData({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, location: e.target.value } : x)) })} />
                  <div className="flex gap-2">
                    <Input type="month" value={exp.startDate} onChange={(e) => onChangeData({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, startDate: e.target.value } : x)) })} />
                    <Input type="month" value={exp.endDate} disabled={exp.current} onChange={(e) => onChangeData({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, endDate: e.target.value } : x)) })} />
                  </div>
                </div>
                <label className="mt-2 flex items-center gap-2 text-xs"><input type="checkbox" checked={exp.current} onChange={(e) => onChangeData({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, current: e.target.checked } : x)) })} /> Trabajo actual</label>
                <Textarea className="mt-3" placeholder="Developed..." value={exp.description} onChange={(e) => onChangeData({ ...data, experience: data.experience.map((x) => (x.id === exp.id ? { ...x, description: e.target.value } : x)) })} />
              </div>
            ))}
            <Button variant="outline" className="w-full rounded-xl" onClick={() => onChangeData({ ...data, experience: [...data.experience, { id: `exp${Date.now()}`, role: "", company: "", location: "", startDate: "", endDate: "", current: false, description: "" }] })}>
              + Añadir experiencia
            </Button>
          </div>
        )}

        {tab === "projects" && (
          <div className="space-y-4">
            <p className="text-xs text-zinc-500">Los proyectos son <b>evidencia</b> de skills. Formato: <i>“Developed X using Y, integrating Z.”</i> Lista tecnologías separadas por “·”.</p>
            {data.projects.map((p, idx) => (
              <div key={p.id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500">Proyecto {idx + 1}</span>
                  <button onClick={() => onChangeData({ ...data, projects: data.projects.filter((x) => x.id !== p.id) })} className="text-xs text-red-500">Eliminar</button>
                </div>
                <div className="mt-3 space-y-3">
                  <Input placeholder="Nombre del proyecto" value={p.name} onChange={(e) => onChangeData({ ...data, projects: data.projects.map((x) => (x.id === p.id ? { ...x, name: e.target.value } : x)) })} />
                  <Input placeholder="Tecnologías (ej: Flutter · Dart · Firebase)" value={p.technologies.join(" · ")} onChange={(e) => onChangeData({ ...data, projects: data.projects.map((x) => (x.id === p.id ? { ...x, technologies: e.target.value.split("·").map((s) => s.trim()).filter(Boolean) } : x)) })} />
                  <Input placeholder="Link (opcional)" value={p.link || ""} onChange={(e) => onChangeData({ ...data, projects: data.projects.map((x) => (x.id === p.id ? { ...x, link: e.target.value } : x)) })} />
                  <Textarea placeholder="Descripción con contexto..." value={p.description} onChange={(e) => onChangeData({ ...data, projects: data.projects.map((x) => (x.id === p.id ? { ...x, description: e.target.value } : x)) })} />
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full rounded-xl" onClick={() => onChangeData({ ...data, projects: [...data.projects, { id: `proj${Date.now()}`, name: "", technologies: [], description: "", link: "" }] })}>
              + Añadir proyecto
            </Button>
          </div>
        )}

        {tab === "education" && (
          <div className="space-y-4">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500">Educación {idx + 1}</span>
                  <button onClick={() => onChangeData({ ...data, education: data.education.filter((e) => e.id !== edu.id) })} className="text-xs text-red-500">Eliminar</button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <Input placeholder="Título" value={edu.degree} onChange={(e) => onChangeData({ ...data, education: data.education.map((x) => (x.id === edu.id ? { ...x, degree: e.target.value } : x)) })} />
                  <Input placeholder="Escuela" value={edu.school} onChange={(e) => onChangeData({ ...data, education: data.education.map((x) => (x.id === edu.id ? { ...x, school: e.target.value } : x)) })} />
                  <Input type="month" value={edu.startDate} onChange={(e) => onChangeData({ ...data, education: data.education.map((x) => (x.id === edu.id ? { ...x, startDate: e.target.value } : x)) })} />
                  <Input type="month" value={edu.endDate} onChange={(e) => onChangeData({ ...data, education: data.education.map((x) => (x.id === edu.id ? { ...x, endDate: e.target.value } : x)) })} />
                </div>
                <Textarea className="mt-3" placeholder="Descripción..." value={edu.description} onChange={(e) => onChangeData({ ...data, education: data.education.map((x) => (x.id === edu.id ? { ...x, description: e.target.value } : x)) })} />
              </div>
            ))}
            <Button variant="outline" className="w-full rounded-xl" onClick={() => onChangeData({ ...data, education: [...data.education, { id: `edu${Date.now()}`, degree: "", school: "", location: "", startDate: "", endDate: "", description: "" }] })}>
              + Añadir educación
            </Button>

            <div className="space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <h4 className="text-sm font-semibold">Certificaciones</h4>
              {data.certifications.map((c) => (
                <div key={c.id} className="flex items-center gap-2 rounded-xl border border-zinc-100 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/50">
                  <Input className="flex-1" placeholder="Certificación" value={c.name} onChange={(e) => onChangeData({ ...data, certifications: data.certifications.map((x) => (x.id === c.id ? { ...x, name: e.target.value } : x)) })} />
                  <Input className="flex-1" placeholder="Emisor" value={c.issuer} onChange={(e) => onChangeData({ ...data, certifications: data.certifications.map((x) => (x.id === c.id ? { ...x, issuer: e.target.value } : x)) })} />
                  <Input className="w-28" type="month" value={c.date} onChange={(e) => onChangeData({ ...data, certifications: data.certifications.map((x) => (x.id === c.id ? { ...x, date: e.target.value } : x)) })} />
                  <button onClick={() => onChangeData({ ...data, certifications: data.certifications.filter((x) => x.id !== c.id) })} className="text-zinc-400 hover:text-red-500">×</button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => onChangeData({ ...data, certifications: [...data.certifications, { id: `cert${Date.now()}`, name: "", issuer: "", date: "" }] })}>
                + Certificación
              </Button>
            </div>
          </div>
        )}

        {tab === "skills" && (
          <div className="space-y-6">
            <div className="rounded-xl bg-zinc-900 p-3 text-xs text-white dark:bg-white dark:text-zinc-900">
              <b>Regla ATS:</b> lista plana, sin barras ni porcentajes. Ej: “Flutter · Dart · Firebase · REST APIs” — fácil de parsear.
            </div>
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Habilidades</h4>
              {data.skills.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <Input className="flex-1" value={s.name} onChange={(e) => onChangeData({ ...data, skills: data.skills.map((x) => (x.id === s.id ? { ...x, name: e.target.value } : x)) })} placeholder="Ej: Flutter" />
                  <Input className="w-32" value={s.category} onChange={(e) => onChangeData({ ...data, skills: data.skills.map((x) => (x.id === s.id ? { ...x, category: e.target.value } : x)) })} placeholder="Categoría" />
                  <button onClick={() => onChangeData({ ...data, skills: data.skills.filter((x) => x.id !== s.id) })} className="text-zinc-400 hover:text-red-500">×</button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => onChangeData({ ...data, skills: [...data.skills, { id: `s${Date.now()}`, name: "", category: "General" }] })}>
                + Habilidad
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Idiomas</h4>
              {data.languages.map((l) => (
                <div key={l.id} className="flex items-center gap-2">
                  <Input className="flex-1" value={l.name} onChange={(e) => onChangeData({ ...data, languages: data.languages.map((x) => (x.id === l.id ? { ...x, name: e.target.value } : x)) })} placeholder="Idioma" />
                  <Input className="flex-1" value={l.level} onChange={(e) => onChangeData({ ...data, languages: data.languages.map((x) => (x.id === l.id ? { ...x, level: e.target.value } : x)) })} placeholder="Nivel" />
                  <button onClick={() => onChangeData({ ...data, languages: data.languages.filter((x) => x.id !== l.id) })} className="text-zinc-400 hover:text-red-500">×</button>
                </div>
              ))}
              <Button variant="outline" size="sm" className="rounded-full" onClick={() => onChangeData({ ...data, languages: [...data.languages, { id: `l${Date.now()}`, name: "", level: "" }] })}>
                + Idioma
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
