"use client";

import { useState } from "react";
import { Menu, X, Home, Users, Building2, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getInitials } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

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

export function MobileSidebar() {
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut({ redirect: false });
      toast.success("Logout realizado com sucesso!");
      router.push("/login");
      router.refresh();
      setIsOpen(false);
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Botão para abrir menu mobile */}
      <Button
        variant="ghost"
        size="sm"
        className="md:hidden fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Overlay e Sidebar Mobile */}
      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Sidebar Mobile */}
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-background md:hidden">
            <div className="flex h-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    {user?.image ? (
                      <AvatarImage 
                        src={user.image} 
                        alt={user.nome} 
                        className="h-full w-full object-cover rounded-full"
                      />
                    ) : (
                      <AvatarFallback className="h-10 w-10">
                        {getInitials(user?.nome || "Usuário")}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div>
                    <h2 className="text-lg font-semibold">{user?.orgName || "OmniFlow CRM"}</h2>
                    <p className="text-sm text-muted-foreground">{user?.nome || "Usuário"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-muted rounded-md"
                  aria-label="Fechar menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6 overflow-y-auto">
                <ul className="space-y-2">
                  {navigation.map((item) => {
                    const canViewItem = !item.requiredRole || (user && item.requiredRole.includes(user.role));
                    
                    if (!canViewItem) return null;

                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                            isActive(item.href) 
                              ? "bg-accent text-accent-foreground" 
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Logout Section */}
              <div className="mt-auto p-4 border-t shrink-0">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground w-full text-left p-2 rounded-lg hover:bg-accent transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
