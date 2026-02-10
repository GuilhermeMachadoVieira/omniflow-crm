import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTeamMembers } from "@/app/actions/team";
import { TeamMemberSafe } from "@/lib/frontend-types";
import { TeamClient } from "@/components/team/TeamClient";

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  // Evitar acesso ao banco durante build estático ou quando DATABASE_URL não está disponível
  if (!process.env.DATABASE_URL) {
    return <div>Carregando...</div>;
  }

  // Proteção de rota
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Buscar dados no servidor (já sanitizados)
  const members = await getTeamMembers();

  return <TeamClient initialMembers={members} currentUser={user} />;
}
