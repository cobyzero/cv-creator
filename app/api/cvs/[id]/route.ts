import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateCvSchema } from "@/lib/validations/cv";
import { normalizeCvData } from "@/lib/cv/normalize";

async function getUserId() {
  const session = await auth();
  if (!session?.user?.id) return null;
  return (session.user as { id: string }).id;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;

  const cv = await prisma.cv.findFirst({ where: { id, userId } });
  if (!cv) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ cv: { ...cv, data: normalizeCvData(cv.data) } });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = updateCvSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.cv.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const cv = await prisma.cv.update({
    where: { id },
    data: {
      ...(parsed.data.title !== undefined && { title: parsed.data.title }),
      ...(parsed.data.template !== undefined && { template: parsed.data.template }),
      ...(parsed.data.lang !== undefined && { lang: parsed.data.lang }),
      ...(parsed.data.data !== undefined && { data: parsed.data.data as object }),
    },
  });

  return NextResponse.json({ cv });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId();
  if (!userId) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const { id } = await params;

  const existing = await prisma.cv.findFirst({ where: { id, userId } });
  if (!existing) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  await prisma.cv.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
