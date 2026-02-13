import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/nextauth-client";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { SettingsNavigation } from "@/components/settings/SettingsNavigation";

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
        <SettingsNavigation currentPath="/settings/security" />

        <SecuritySettings user={user} />
      </div>
    </div>
  );
}
