import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "@/components/dashboard/dashboard-client";
import { normalizeCvData } from "@/lib/cv/normalize";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const userId = (session?.user as { id: string } | undefined)?.id;
  if (!userId) return null;

  const cvs = await prisma.cv.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });

  // Serialize + normalize for client (migra CVs antiguos)
  const serialized = cvs.map((cv) => ({
    ...cv,
    data: normalizeCvData(cv.data),
    createdAt: cv.createdAt.toISOString(),
    updatedAt: cv.updatedAt.toISOString(),
  }));

  return <DashboardClient initialCvs={serialized as never} userName={session?.user?.name || "Usuario"} />;
}
