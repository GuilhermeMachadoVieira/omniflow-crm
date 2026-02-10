import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Evitar acesso ao banco durante build estático ou quando DATABASE_URL não está disponível
  if (!process.env.DATABASE_URL) {
    return <div>Carregando...</div>;
  }

  const user = await getCurrentUser();
  
  // Verificar se o usuário tem permissão para acessar configurações
  if (!user || (user.role !== "OWNER" && user.role !== "ADMIN")) {
    redirect("/");
  }

  return <>{children}</>;
}
