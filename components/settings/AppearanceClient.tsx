"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";

interface AppearanceClientProps {
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

export function AppearanceClient({ user, organization }: AppearanceClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Personalize o visual do sistema.
        </p>
      </div>

      <div className="space-y-6">
        <SettingsNavigation currentPath="/settings/appearance" />

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
      </div>
    </div>
  );
}
