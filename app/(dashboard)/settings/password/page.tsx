import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/nextauth-client";
import { PasswordChange } from "@/components/settings/PasswordChange";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function PasswordSettingsPage() {
  const user = await getCurrentUser();
  if (!user || !user.id) {
    redirect("/login");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie sua senha e segurança da conta.
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
            href="/settings/password"
            className="px-4 py-2 rounded-lg border text-center bg-primary text-primary-foreground"
          >
            Senha
          </Link>
          <Link
            href="/settings/team"
            className="px-4 py-2 rounded-lg border text-center bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Equipe
          </Link>
        </div>

        <PasswordChange />

        <Card>
          <CardHeader>
            <CardTitle>Dicas de Segurança</CardTitle>
            <CardDescription>
              Mantenha sua conta segura com estas práticas recomendadas.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">✅ Boas Práticas</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Use senhas únicas para cada serviço</li>
                  <li>• Altere sua senha regularmente</li>
                  <li>• Não compartilhe suas credenciais</li>
                  <li>• Use senhas longas e complexas</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">❌ Evite</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Datas de nascimento ou nomes</li>
                  <li>• Sequências como "123456"</li>
                  <li>• Palavras comuns como "senha"</li>
                  <li>• Reutilizar senhas antigas</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
