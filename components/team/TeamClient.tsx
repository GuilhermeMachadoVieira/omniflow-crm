"use client";

import { useState, useEffect } from "react";
import { TeamTable } from "@/components/team/TeamTable";
import { InviteMemberDialog } from "@/components/team/InviteMemberDialog";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { TeamMemberSafe } from "@/lib/frontend-types";
import { AuthUser } from "@/lib/types";
import { getTeamMembers } from "@/app/actions/team";

interface TeamClientProps {
  initialMembers?: TeamMemberSafe[];
  currentUser: AuthUser;
}

export function TeamClient({ initialMembers, currentUser }: TeamClientProps) {
  const [members, setMembers] = useState<TeamMemberSafe[]>(initialMembers || []);

  useEffect(() => {
    const loadMembers = async () => {
      if (!initialMembers) {
        try {
          const teamMembers = await getTeamMembers();
          setMembers(teamMembers);
        } catch (error) {
          console.error("Failed to load team members:", error);
        }
      }
    };

    loadMembers();
  }, [initialMembers]);

  // Verificar se o usuário pode convidar membros
  const canInviteMembers = currentUser.role === "OWNER" || currentUser.role === "ADMIN";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestão de Equipe
          </h1>
          <p className="text-muted-foreground">
            Gerencie os membros da sua organização.
          </p>
        </div>
        
        {canInviteMembers && (
          <InviteMemberDialog>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Convidar Membro
            </Button>
          </InviteMemberDialog>
        )}
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{members.length} membro{members.length !== 1 ? "s" : ""}</span>
      </div>

      <TeamTable members={members} />
    </div>
  );
}
