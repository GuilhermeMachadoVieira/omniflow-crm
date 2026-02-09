"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, User, Crown, Shield, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { inviteMember } from "@/app/actions/team";
import { AuthUser, Role } from "@/lib/types";
import { Loader2 } from "lucide-react";

const inviteSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Informe um e-mail válido"),
  role: z.enum(["OWNER", "ADMIN", "MEMBER"]),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface TeamMember {
  id: string;
  nome: string;
  email: string;
  role: Role;
  createdAt: Date;
}

interface TeamManagementClientProps {
  members: TeamMember[];
  currentUser: AuthUser;
}

const ROLE_CONFIG = {
  OWNER: {
    label: "Proprietário",
    icon: Crown,
    color: "bg-purple-100 text-purple-800 border-purple-200",
  },
  ADMIN: {
    label: "Administrador",
    icon: Shield,
    color: "bg-blue-100 text-blue-800 border-blue-200",
  },
  MEMBER: {
    label: "Membro",
    icon: Users,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  },
};

export function TeamManagementClient({
  members,
  currentUser,
}: TeamManagementClientProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const canManageTeam = currentUser.role === "OWNER" || currentUser.role === "ADMIN";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { nome: "", email: "", role: "MEMBER" },
  });

  const selectedRole = watch("role");

  async function onSubmit(data: InviteFormData) {
    setIsLoading(true);
    try {
      const result = await inviteMember(data);
      if (result.success) {
        setIsDialogOpen(false);
        reset();
        window.location.reload(); // Simple refresh for now
      } else {
        alert(result.error || "Erro ao convidar membro");
      }
    } catch (error) {
      alert("Erro ao convidar membro");
    } finally {
      setIsLoading(false);
    }
  }

  function getRoleBadge(role: Role) {
    const config = ROLE_CONFIG[role] || ROLE_CONFIG.MEMBER;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="mr-1 h-3 w-3" />
        {config.label}
      </Badge>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie os membros da sua organização
          </p>
        </div>
        
        {canManageTeam && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Membro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Convidar novo membro</DialogTitle>
                <DialogDescription>
                  Adicione um novo membro à sua equipe. Ele receberá um e-mail
                  com as instruções de acesso.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="nome">Nome completo</Label>
                    <Input
                      id="nome"
                      placeholder="João Silva"
                      {...register("nome")}
                      disabled={isLoading}
                    />
                    {errors.nome && (
                      <p className="text-sm text-destructive">
                        {errors.nome.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="joao@exemplo.com"
                      {...register("email")}
                      disabled={isLoading}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="role">Cargo</Label>
                    <Select
                      value={selectedRole}
                      onValueChange={(value) => setValue("role", value as Role)}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um cargo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">Membro</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                        {currentUser.role === "OWNER" && (
                          <SelectItem value="OWNER">Proprietário</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-sm text-destructive">
                        {errors.role.message}
                      </p>
                    )}
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    disabled={isLoading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Convidando...
                      </>
                    ) : (
                      "Convidar"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Cargo</TableHead>
              <TableHead className="text-right">Entrou em</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <User className="h-4 w-4" />
                    </div>
                    {member.nome}
                  </div>
                </TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{getRoleBadge(member.role)}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">
                  {new Date(member.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {!canManageTeam && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            Apenas administradores podem convidar novos membros para a equipe.
          </p>
        </div>
      )}
    </div>
  );
}
