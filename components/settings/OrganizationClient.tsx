"use client";

import { useState, useTransition } from "react";
import { updateOrganization, updateOrganizationLogo } from "@/app/actions/settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/settings/ImageUpload";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface OrganizationClientProps {
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

export function OrganizationClient({ user, organization }: OrganizationClientProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Form states
  const [orgForm, setOrgForm] = useState({
    name: organization.name,
  });
  const [orgLogo, setOrgLogo] = useState(organization.logo);

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
        <div className="flex items-center gap-2 mb-2">
          <Link 
            href="/settings" 
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Configurações
          </Link>
          <span className="text-muted-foreground text-sm">/</span>
          <h1 className="text-2xl font-semibold tracking-tight">Organização</h1>
        </div>
        <p className="text-muted-foreground">
          Atualize as informações da sua empresa.
        </p>
      </div>

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
    </div>
  );
}
