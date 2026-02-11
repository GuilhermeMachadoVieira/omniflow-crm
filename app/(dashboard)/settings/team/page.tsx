import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/nextauth-client";
import { TeamClient } from "@/components/team/TeamClient";

export const dynamic = 'force-dynamic';

export default async function TeamPage() {
  // Proteção de rota
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return <TeamClient currentUser={user} />;
}
