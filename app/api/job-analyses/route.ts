import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  cvId: z.string().min(1),
  jobText: z.string().min(10).max(8000),
  jobIntelligence: z.unknown(),
  match: z.unknown().optional(),
  visibility: z.unknown().optional(),
  scores: z.unknown().optional(),
  positioning: z.unknown().optional(),
  source: z.enum(["deepseek", "fallback"]).optional(),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const { searchParams } = new URL(req.url);
  const cvId = searchParams.get("cvId");

  const where = cvId ? { userId, cvId } : { userId };

  const analyses = await prisma.jobAnalysis.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return NextResponse.json({ analyses });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const userId = (session.user as { id: string }).id;

  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { cvId, jobText, jobIntelligence, match, visibility, scores, positioning, source } = parsed.data;

  // Verifica que el CV pertenece al usuario
  const cv = await prisma.cv.findFirst({ where: { id: cvId, userId } });
  if (!cv) return NextResponse.json({ error: "CV no encontrado" }, { status: 404 });

  const analysis = await prisma.jobAnalysis.create({
    data: {
      userId,
      cvId,
      jobText,
      jobIntelligence: jobIntelligence as object,
      match: (match as object) || {},
      visibility: (visibility as object) || {},
      scores: (scores as object) || {},
      positioning: (positioning as object) || {},
      source: source || "fallback",
    },
  });

  return NextResponse.json({ analysis }, { status: 201 });
}
