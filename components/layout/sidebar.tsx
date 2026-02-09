"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  KanbanSquare,
  Building2,
  Settings,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { logoutAction } from "@/app/actions/auth";
import { useCurrentUser } from "@/hooks/use-current-user";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pipeline", label: "Pipeline", icon: KanbanSquare },
  { href: "/customers", label: "Clientes", icon: Users },
];

const bottomItems = [
  { href: "/settings", label: "Configurações", icon: Settings, requiredRole: "ADMIN" as const },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useCurrentUser();

  async function handleLogout() {
    await logoutAction();
    router.push("/login");
    router.refresh();
  }

  // Verificar se o usuário tem permissão para ver o item
  const canViewItem = (item: typeof bottomItems[0]) => {
    if (!item.requiredRole) return true;
    if (!user) return false;
    
    // OWNER e ADMIN podem ver tudo
    return user.role === "OWNER" || user.role === "ADMIN";
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col border-r border-border bg-card shadow-sm">
      <div className="flex h-14 items-center gap-2 border-b border-border px-6">
        <Building2 className="h-7 w-7 text-primary" />
        <span className="font-semibold text-foreground">OmniFlow CRM</span>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <Separator />
      <nav className="p-3">
        {bottomItems.filter(canViewItem).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {item.label}
            </Link>
          );
        })}
        <form action={handleLogout}>
          <Button
            type="submit"
            variant="ghost"
            className="mt-1 w-full justify-start gap-3 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-5 w-5 shrink-0" />
            Sair
          </Button>
        </form>
      </nav>
    </aside>
  );
}
