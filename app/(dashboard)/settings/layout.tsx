import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/nextauth-client";

export const dynamic = 'force-dynamic';

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  
  // Verificar se o usuário tem permissão para acessar configurações
  if (!user || (user.role !== "OWNER" && user.role !== "ADMIN")) {
    redirect("/");
  }

  return <>{children}</>;
}
