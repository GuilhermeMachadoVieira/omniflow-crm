"use client";

import { useState, useTransition } from "react";
import { updateProfile, updateOrganization, updateProfileImage, updateOrganizationLogo } from "@/app/actions/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ImageUpload } from "@/components/settings/ImageUpload";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface SettingsClientProps {
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

export function SettingsClient({ user, organization }: SettingsClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  // Form states
  const [profileForm, setProfileForm] = useState({
    nome: user.nome,
  });
  const [orgForm, setOrgForm] = useState({
    name: organization.name,
  });
  const [userImage, setUserImage] = useState(user.image);
  const [orgLogo, setOrgLogo] = useState(organization.logo);

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

  async function handleOrgLogoChange(newUrl?: string) {
    if (!newUrl) return;
    
    startTransition(async () => {
      const result = await updateOrganizationLogo(newUrl);
      if (result.success) {
        setOrgLogo(newUrl);
        toast.success("Logo atualizado com sucesso!");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao atualizar logo");
      }
    });
  }

  async function handleUpdateOrganization(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    startTransition(async () => {
      const formData = new FormData();
      formData.append("name", orgForm.name);

      const result = await updateOrganization(formData);

      if (result.success) {
        toast.success("Organização atualizada com sucesso!");
        router.refresh();
      } else {
        toast.error(result.error || "Erro ao atualizar organização");
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
        {/* Tabs temporariamente desabilitadas até implementarmos os componentes */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-lg border ${activeTab === "profile" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            Perfil
          </button>
          <button
            onClick={() => setActiveTab("organization")}
            className={`px-4 py-2 rounded-lg border ${activeTab === "organization" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            Organização
          </button>
          <button
            onClick={() => setActiveTab("appearance")}
            className={`px-4 py-2 rounded-lg border ${activeTab === "appearance" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
          >
            Aparência
          </button>
        </div>

        {activeTab === "profile" && (
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
        )}

        {activeTab === "organization" && (
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Organização</CardTitle>
              <CardDescription>
                Atualize as informações da sua empresa.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleUpdateOrganization} className="space-y-4">
                <div className="space-y-4">
                  <Label>Logo da Organização</Label>
                  <ImageUpload 
                    currentImage={orgLogo} 
                    onImageChange={handleOrgLogoChange}
                    type="organization"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="orgName">Nome da Empresa</Label>
                  <Input
                    id="orgName"
                    value={orgForm.name}
                    onChange={(e) => setOrgForm(prev => ({ ...prev, name: e.target.value }))}
                    disabled={isPending}
                  />
                </div>

                <Button type="submit" disabled={isPending}>
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    "Salvar Organização"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {activeTab === "appearance" && (
          <Card>
            <CardHeader>
              <CardTitle>Aparência</CardTitle>
              <CardDescription>
                Personalize o visual do sistema.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Tema</h3>
                  <p className="text-sm text-muted-foreground">
                    Escolha entre o modo claro e escuro.
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
