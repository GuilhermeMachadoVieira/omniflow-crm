import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/nextauth-client";
import { getTeamMembers } from "@/app/actions/team";
import { TeamClient } from "@/components/team/TeamClient";

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  // Proteção de rota
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Buscar dados no servidor (Server Component advantage)
  const initialMembers = await getTeamMembers();

  return <TeamClient initialMembers={initialMembers} currentUser={user} />;
}
