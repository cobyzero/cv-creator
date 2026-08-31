import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createCvSchema } from "@/lib/validations/cv";
import { defaultCvData } from "@/lib/cv/defaults";
import { normalizeCvData } from "@/lib/cv/normalize";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const cvs = await prisma.cv.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  const normalized = cvs.map((cv) => ({ ...cv, data: normalizeCvData(cv.data) }));
  return NextResponse.json({ cvs: normalized });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const body = await req.json().catch(() => ({}));
  const parsed = createCvSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { title, template, lang, data } = parsed.data;

  const cv = await prisma.cv.create({
    data: {
      userId,
      title: title || "Mi CV sin título",
      template: template || "minimal",
      lang: lang || "es",
      data: (data as object) ?? (defaultCvData as object),
    },
  });

  return NextResponse.json({ cv }, { status: 201 });
}
