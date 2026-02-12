"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";

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
        <div className="flex items-center gap-2 mb-2">
          <Link 
            href="/settings" 
            className="text-muted-foreground hover:text-foreground text-sm"
          >
            Configurações
          </Link>
          <span className="text-muted-foreground text-sm">/</span>
          <h1 className="text-2xl font-semibold tracking-tight">Aparência</h1>
        </div>
        <p className="text-muted-foreground">
          Personalize o visual do sistema.
        </p>
      </div>

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
  );
}
