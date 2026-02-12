import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/nextauth-client";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function SecuritySettingsPage() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie a segurança e privacidade da sua conta.
        </p>
      </div>

      <div className="space-y-6">
        {/* Navegação entre abas */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <Link
            href="/settings"
            className="px-4 py-2 rounded-lg border text-center bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Perfil
          </Link>
          <Link
            href="/settings/organization"
            className="px-4 py-2 rounded-lg border text-center bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Organização
          </Link>
          <Link
            href="/settings/security"
            className="px-4 py-2 rounded-lg border text-center bg-primary text-primary-foreground"
          >
            Segurança
          </Link>
          <Link
            href="/settings/team"
            className="px-4 py-2 rounded-lg border text-center bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Equipe
          </Link>
        </div>

        <SecuritySettings user={user} />
      </div>
    </div>
  );
}
