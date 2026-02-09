import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getTeamMembers } from "@/app/actions/team";
import { TeamMemberSafe } from "@/lib/frontend-types";
import { TeamClient } from "@/components/team/TeamClient";

export default async function TeamPage() {
  // Proteção de rota
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Buscar dados no servidor (já sanitizados)
  const members = await getTeamMembers();

  return <TeamClient initialMembers={members} currentUser={user} />;
}
