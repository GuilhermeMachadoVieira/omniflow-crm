import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TeamMemberSafe } from "@/lib/frontend-types";
import { getInitials } from "@/lib/utils";

interface TeamTableProps {
  members: TeamMemberSafe[];
}

export function TeamTable({ members }: TeamTableProps) {
  function getRoleColor(role: string) {
    switch (role) {
      case "OWNER":
        return "bg-purple-100 text-purple-800";
      case "ADMIN":
        return "bg-blue-100 text-blue-800";
      case "MEMBER":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getRoleLabel(role: string) {
    switch (role) {
      case "OWNER":
        return "Proprietário";
      case "ADMIN":
        return "Administrador";
      case "MEMBER":
        return "Membro";
      default:
        return role;
    }
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhum membro encontrado. Convide alguém para sua equipe!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Membro</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Cargo</TableHead>
            <TableHead className="text-right">Data de Entrada</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={member.nome} />
                    <AvatarFallback className="text-xs">
                      {getInitials(member.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{member.nome}</span>
                </div>
              </TableCell>
              <TableCell>{member.email}</TableCell>
              <TableCell>
                <Badge className={getRoleColor(member.role)}>
                  {getRoleLabel(member.role)}
                </Badge>
              </TableCell>
              <TableCell className="text-right text-muted-foreground">
                {new Date(member.createdAt).toLocaleDateString("pt-BR")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
