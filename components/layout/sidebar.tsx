"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  Settings,
  Building2,
  Calendar,
  Phone,
} from "lucide-react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logout realizado com sucesso!");
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navigation = [
    {
      title: "Dashboard",
      href: "/",
      icon: Home,
      requiredRole: null,
    },
    {
      title: "Pipeline",
      href: "/pipeline",
      icon: Users,
      requiredRole: null,
    },
    {
      title: "Clientes",
      href: "/customers",
      icon: Building2,
      requiredRole: null,
    },
    {
      title: "Configurações",
      href: "/settings",
      icon: Settings,
      requiredRole: ["OWNER", "ADMIN"],
    },
  ];

  return (
    <div className="flex h-full w-64 flex-col">
      <div className="flex items-center gap-4 p-4 border-b">
        <Avatar className="h-10 w-10">
          {user?.image ? (
            <AvatarImage src={user.image} alt={user.nome} />
          ) : (
            <AvatarFallback className="text-lg">
              {getInitials(user?.nome || "U")}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <h2 className="text-lg font-semibold">{user?.orgName || "OmniFlow CRM"}</h2>
          <p className="text-sm text-muted-foreground">{user?.nome || "Usuário"}</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigation.map((item) => {
            const canViewItem = !item.requiredRole || (user && item.requiredRole.includes(user.role));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    isActive(item.href) ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground w-full text-left p-2 rounded-lg hover:bg-accent transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </button>
      </div>
    </div>
  );
}
