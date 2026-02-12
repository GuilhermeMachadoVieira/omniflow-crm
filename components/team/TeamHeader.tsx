import { Users } from "lucide-react";
import { TeamMemberSafe } from "@/lib/frontend-types";

interface TeamHeaderProps {
  members: TeamMemberSafe[];
}

export function TeamHeader({ members }: TeamHeaderProps) {
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
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{members.length} membro{members.length !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
