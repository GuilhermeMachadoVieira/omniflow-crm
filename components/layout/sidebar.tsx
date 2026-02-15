"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Users, Settings, Building2, Calendar, Phone } from "lucide-react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { cn, getInitials } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

export function Sidebar() {
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const { isCollapsed, setHovered } = useSidebar();

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

  interface NavigationItem {
  title: string;
  href: string;
  icon: any;
  requiredRole: string[] | null;
  subItems?: NavigationItem[];
}

const navigation: NavigationItem[] = [
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
    <div 
      className={cn(
        "flex h-screen flex-col z-40 transition-all duration-300 ease-in-out bg-card border-r border-border",
        isCollapsed ? "w-16" : "w-64"
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center gap-4 p-4 border-b shrink-0">
        <div className={cn(
          "flex items-center gap-3 transition-all duration-300",
          isCollapsed && "justify-center"
        )}>
          <Avatar className="h-10 w-10 flex-shrink-0">
            {user?.image ? (
              <AvatarImage src={user.image} alt={user.nome} />
            ) : (
              <AvatarFallback className="text-lg">
                {getInitials(user?.nome || "U")}
              </AvatarFallback>
            )}
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0 animate-fade-in">
              <h2 className="text-lg font-semibold truncate">{user?.orgName || "OmniFlow CRM"}</h2>
              <p className="text-sm text-muted-foreground truncate">{user?.nome || "Usuário"}</p>
            </div>
          )}
        </div>
      </div>

      <nav className={cn(
        "flex-1 overflow-y-auto transition-all duration-300",
        isCollapsed ? "px-2 py-4" : "px-4 py-6"
      )}>
        <ul className="space-y-2">
          {navigation.map((item) => {
            const canViewItem = !item.requiredRole || (user && item.requiredRole.includes(user.role));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center rounded-lg text-sm font-medium transition-all duration-normal",
                    isCollapsed 
                      ? "justify-center px-2 py-3" 
                      : "gap-3 px-3 py-2.5",
                    isActive(item.href) 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-muted-foreground hover:bg-accent hover:text-foreground hover:translate-x-1",
                    !canViewItem && "opacity-50 cursor-not-allowed hover:translate-x-0"
                  )}
                  title={isCollapsed ? item.title : undefined}
                >
                  {isActive(item.href) && (
                    <div className={cn(
                      "absolute top-1/2 h-4 w-1 -translate-y-1/2 bg-primary-foreground rounded-r-full",
                      isCollapsed ? "left-0" : "left-0"
                    )} />
                  )}
                  <item.icon className={cn(
                    "transition-transform duration-normal group-hover:scale-110 flex-shrink-0",
                    isCollapsed ? "h-5 w-5" : "h-5 w-5"
                  )} />
                  {!isCollapsed && (
                    <span className="transition-colors duration-normal truncate">{item.title}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className={cn(
        "mt-auto border-t shrink-0 transition-all duration-300",
        isCollapsed ? "p-2" : "p-4"
      )}>
        <button
          onClick={handleLogout}
          className={cn(
            "group flex items-center text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-accent transition-all duration-normal hover:translate-x-1 active:scale-95 w-full",
            isCollapsed 
              ? "justify-center px-2 py-3" 
              : "gap-3 p-2 text-left"
          )}
          title={isCollapsed ? "Sair" : undefined}
        >
          <LogOut className={cn(
            "transition-transform duration-normal group-hover:scale-110 group-hover:rotate-12 flex-shrink-0",
            isCollapsed ? "h-5 w-5" : "h-5 w-5"
          )} />
          {!isCollapsed && (
            <span className="transition-colors duration-normal">Sair</span>
          )}
        </button>
      </div>
    </div>
  );
}
