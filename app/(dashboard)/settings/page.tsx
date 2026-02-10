import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  // Import dinâmico do prisma apenas quando DATABASE_URL está disponível
  const { prisma } = await import("@/lib/db");

  const user = await getCurrentUser();
  if (!user || !user.id) {
    redirect("/login");
  }

  // Buscar dados completos do usuário e organização
  const [userData, orgData] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        nome: true,
        email: true,
        image: true,
        role: true,
      },
    }),
    prisma.organization.findUnique({
      where: { id: user.organizationId },
      select: {
        id: true,
        name: true,
        logo: true,
        slug: true,
      },
    }),
  ]);

  if (!userData || !orgData) {
    redirect("/dashboard");
  }

  return <SettingsClient user={userData} organization={orgData} />;
}
