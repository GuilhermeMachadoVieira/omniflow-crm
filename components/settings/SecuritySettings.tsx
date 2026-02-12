"use client";

import { useState, useTransition } from "react";
import { deleteAccount } from "@/app/actions/password";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertTriangle, Trash2, Shield, ShieldCheck, Crown } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SecuritySettingsProps {
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export function SecuritySettings({ user }: SecuritySettingsProps) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteForm, setDeleteForm] = useState({
    password: "",
    confirmation: "",
  });
  const router = useRouter();

  function handleDeleteAccount(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    if (deleteForm.confirmation !== "DELETAR") {
      toast.error('Você deve digitar "DELETAR" para confirmar');
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.append("password", deleteForm.password);
      formData.append("confirmation", deleteForm.confirmation);

      const result = await deleteAccount(formData);

      if (result.success) {
        toast.success("Conta deletada com sucesso!");
        // Redirecionar para página de registro após deleção
        setTimeout(() => {
          router.push("/register");
          router.refresh();
        }, 1000);
      } else {
        toast.error(result.error || "Erro ao deletar conta");
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações da Conta</CardTitle>
          <CardDescription>
            Informações básicas sobre sua conta e permissões.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                E-mail
              </Label>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">
                Tipo de Usuário
              </Label>
              <div className="flex items-center space-x-2">
                <p className="font-medium capitalize">
                  {getRoleLabel(user.role)}
                </p>
                {getRoleIcon(user.role)}
              </div>
            </div>
          </div>
          
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {user.role === "OWNER" && 
                "Como proprietário, você pode gerenciar todos os aspectos da organização, incluindo equipe e configurações."
              }
              {user.role === "ADMIN" && 
                "Como administrador, você pode gerenciar equipe e configurações básicas da organização."
              }
              {user.role === "MEMBER" && 
                "Como membro, você pode gerenciar clientes e atividades, mas não tem acesso a configurações da organização."
              }
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Segurança da Conta</CardTitle>
          <CardDescription>
            Gerencie as configurações de segurança da sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Alterar Senha</h4>
                <p className="text-sm text-muted-foreground">
                  Atualize sua senha regularmente para manter a conta segura.
                </p>
              </div>
              <Button variant="outline" asChild>
                <a href="/settings/password">Alterar Senha</a>
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">Autenticação de Dois Fatores</h4>
                <p className="text-sm text-muted-foreground">
                  Adicione uma camada extra de segurança à sua conta.
                </p>
              </div>
              <Button variant="outline" disabled>
                Em Breve
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20">
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
          <CardDescription>
            Ações irreversíveis que afetarão sua conta permanentemente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full">
                <Trash2 className="mr-2 h-4 w-4" />
                Deletar Conta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Deletar Conta Permanentemente</DialogTitle>
                <DialogDescription>
                  Esta ação não pode ser desfeita. Isso deletará permanentemente sua conta 
                  e todos os dados associados.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    {user.role === "OWNER" 
                      ? "Como proprietário, deletar sua conta também deletará toda a organização e dados de todos os membros."
                      : "Isso removerá permanentemente seu acesso à organização."
                    }
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={deleteForm.password}
                    onChange={(e) => setDeleteForm(prev => ({ 
                      ...prev, 
                      password: e.target.value 
                    }))}
                    placeholder="Digite sua senha para confirmar"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmation">Confirmação</Label>
                  <Input
                    id="confirmation"
                    value={deleteForm.confirmation}
                    onChange={(e) => setDeleteForm(prev => ({ 
                      ...prev, 
                      confirmation: e.target.value 
                    }))}
                    placeholder='Digite &quot;DELETAR&quot; para confirmar'
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Digite exatamente &quot;DELETAR&quot; para confirmar a exclusão
                  </p>
                </div>

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setShowDeleteDialog(false)}
                    disabled={isPending}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    variant="destructive" 
                    disabled={isPending}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deletando...
                      </>
                    ) : (
                      "Deletar Conta"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}
