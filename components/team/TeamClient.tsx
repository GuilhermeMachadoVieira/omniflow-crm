"use client";

import { useState, useEffect, Suspense } from "react";
import { TeamTable } from "@/components/team/TeamTable";
import { TeamHeader } from "@/components/team/TeamHeader";
import { LazyInviteMemberDialog } from "@/components/team/LazyInviteMemberDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
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
    // Só busca dados se não foram fornecidos inicialmente
    if (!initialMembers) {
      const loadMembers = async () => {
        try {
          const teamMembers = await getTeamMembers();
          if (teamMembers.success && teamMembers.data) {
            setMembers(teamMembers.data);
          }
        } catch (error) {
          console.error("Failed to load team members:", error);
        }
      };

      loadMembers();
    }
  }, [initialMembers]);

  // Verificar se o usuário pode convidar membros
  const canInviteMembers = currentUser.role === "OWNER" || currentUser.role === "ADMIN";

  return (
    <div className="space-y-6">
      <TeamHeader members={members} />
      
      {canInviteMembers && (
        <div className="flex justify-end">
          <Suspense fallback={null}>
            <LazyInviteMemberDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Convidar Membro
              </Button>
            </LazyInviteMemberDialog>
          </Suspense>
        </div>
      )}

      <TeamTable members={members} />
    </div>
  );
}
