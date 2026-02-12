"use client";

import { useState, useTransition, useEffect } from "react";
import { inviteMember, updateMemberRole, removeMember, getTeamMembers } from "@/app/actions/team";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, UserPlus, Shield, ShieldCheck, Trash2, Crown } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface TeamMember {
  id: string;
  nome: string;
  email: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  image?: string | null;
  createdAt: string;
}

export function TeamManagement() {
  const [isPending, startTransition] = useTransition();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    nome: "",
    email: "",
    role: "MEMBER" as "ADMIN" | "MEMBER",
  });

  useEffect(() => {
    loadTeamMembers();
  }, []);

  async function loadTeamMembers() {
    startTransition(async () => {
      const result = await getTeamMembers();
      if (result.success && result.data) {
        setMembers(result.data);
      } else {
        toast.error(result.error || "Erro ao carregar equipe");
      }
    });
  }

  function handleInviteMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    startTransition(async () => {
      const formData = new FormData();
      formData.append("nome", inviteForm.nome);
      formData.append("email", inviteForm.email);
      formData.append("role", inviteForm.role);

      const result = await inviteMember(formData);

      if (result.success) {
        toast.success("Membro convidado com sucesso!");
        setInviteForm({ nome: "", email: "", role: "MEMBER" });
        setShowInviteDialog(false);
        loadTeamMembers();
      } else {
        toast.error(result.error || "Erro ao convidar membro");
      }
    });
  }

  function handleUpdateRole(userId: string, newRole: "ADMIN" | "MEMBER") {
    startTransition(async () => {
      const formData = new FormData();
      formData.append("userId", userId);
      formData.append("role", newRole);

      const result = await updateMemberRole(formData);

      if (result.success) {
        toast.success("Permissões atualizadas com sucesso!");
        loadTeamMembers();
      } else {
        toast.error(result.error || "Erro ao atualizar permissões");
      }
    });
  }

  function handleRemoveMember(userId: string, memberName: string) {
    if (!confirm(`Tem certeza que deseja remover ${memberName} da equipe?`)) {
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("userId", userId);

      const result = await removeMember(formData);

      if (result.success) {
        toast.success("Membro removido com sucesso!");
        loadTeamMembers();
      } else {
        toast.error(result.error || "Erro ao remover membro");
      }
    });
  }

  function getRoleIcon(role: string) {
    switch (role) {
      case "OWNER":
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case "ADMIN":
        return <ShieldCheck className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4 text-gray-500" />;
    }
  }

  function getRoleLabel(role: string) {
    switch (role) {
      case "OWNER":
        return "Proprietário";
      case "ADMIN":
        return "Administrador";
      default:
        return "Membro";
    }
  }

  function getInitials(name: string): string {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Equipe</CardTitle>
              <CardDescription>
                Gerencie os membros da sua organização.
              </CardDescription>
            </div>
            <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Convidar Membro
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Convidar Novo Membro</DialogTitle>
                  <DialogDescription>
                    Envie um convite para uma nova pessoa entrar na sua equipe.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleInviteMember} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome Completo</Label>
                    <Input
                      id="nome"
                      value={inviteForm.nome}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, nome: e.target.value }))}
                      placeholder="João Silva"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={inviteForm.email}
                      onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="joao@exemplo.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Função</Label>
                    <Select
                      value={inviteForm.role}
                      onValueChange={(value: "ADMIN" | "MEMBER") => 
                        setInviteForm(prev => ({ ...prev, role: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MEMBER">Membro</SelectItem>
                        <SelectItem value="ADMIN">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setShowInviteDialog(false)}
                      disabled={isPending}
                    >
                      Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                      {isPending ? (
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
          </div>
        </CardHeader>
        <CardContent>
          {isPending && members.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                Nenhum membro encontrado. Convide alguém para entrar na sua equipe!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={member.image || undefined} />
                      <AvatarFallback>
                        {getInitials(member.nome)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium">{member.nome}</p>
                        {getRoleIcon(member.role)}
                      </div>
                      <p className="text-sm text-muted-foreground">{member.email}</p>
                      <p className="text-xs text-muted-foreground">
                        {getRoleLabel(member.role)} • Entrou em{" "}
                        {new Date(member.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {member.role !== "OWNER" && (
                      <Select
                        value={member.role}
                        onValueChange={(value: "ADMIN" | "MEMBER") => 
                          handleUpdateRole(member.id, value)
                        }
                        disabled={isPending}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MEMBER">Membro</SelectItem>
                          <SelectItem value="ADMIN">Administrador</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                    
                    {member.role !== "OWNER" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id, member.nome)}
                        disabled={isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <strong>Proprietário:</strong> Controle total da organização. 
          <strong> Administrador:</strong> Pode gerenciar equipe e configurações. 
          <strong> Membro:</strong> Pode gerenciar clientes e atividades.
        </AlertDescription>
      </Alert>
    </div>
  );
}
