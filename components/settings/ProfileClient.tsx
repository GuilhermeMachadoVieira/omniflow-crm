"use client";

import { useState, useTransition } from "react";
import { updateProfile, updateProfileImage } from "@/app/actions/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/settings/ImageUpload";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProfileClientProps {
  user: {
    id: string;
    nome: string;
    email: string;
    image?: string | null;
    role: string;
  };
  organization: {
    id: string;
    name: string;
    logo?: string | null;
    slug: string;
  };
}

export function ProfileClient({ user, organization }: ProfileClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Form states
  const [profileForm, setProfileForm] = useState({
    nome: user.nome,
  });
  const [userImage, setUserImage] = useState(user.image);

  async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.append("nome", profileForm.nome);

      const result = await updateProfile(formData);

      if (result.success) {
        toast.success("Perfil atualizado com sucesso!");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao atualizar perfil");
      }
    });
  }

  async function handleProfileImageChange(newUrl?: string) {
    if (!newUrl) return;
    
    startTransition(async () => {
      const result = await updateProfileImage(newUrl);
      if (result.success) {
        setUserImage(newUrl);
        toast.success("Avatar atualizado com sucesso!");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao atualizar avatar");
      }
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie seu perfil e configurações da organização.
        </p>
      </div>

      <div className="space-y-6">
        {/* Navegação entre abas */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          <Link
            href="/settings"
            className="px-3 py-2 rounded-lg border text-center bg-primary text-primary-foreground"
          >
            Perfil
          </Link>
          <Link
            href="/settings/organization"
            className="px-3 py-2 rounded-lg border text-center bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Organização
          </Link>
          <Link
            href="/settings/appearance"
            className="px-3 py-2 rounded-lg border text-center bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Aparência
          </Link>
          <Link
            href="/settings/security"
            className="px-3 py-2 rounded-lg border text-center bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Segurança
          </Link>
          <Link
            href="/settings/team"
            className="px-3 py-2 rounded-lg border text-center bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Equipe
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Perfil do Usuário</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-4">
                <Label>Avatar do Perfil</Label>
                <ImageUpload 
                  currentImage={userImage} 
                  onImageChange={handleProfileImageChange}
                  type="user"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input
                    id="nome"
                    value={profileForm.nome}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, nome: e.target.value }))}
                    disabled={isPending}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Atualizando...
                  </>
                ) : (
                  "Salvar Perfil"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
