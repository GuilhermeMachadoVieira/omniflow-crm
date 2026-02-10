"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCurrentUser } from "@/hooks/use-current-user";
import { usePathname } from "next/navigation";
import Link from "next/link";

const navigation = [
  {
    title: "Dashboard",
    href: "/",
    icon: "📊",
    requiredRole: null,
  },
  {
    title: "Pipeline",
    href: "/pipeline",
    icon: "📋",
    requiredRole: null,
  },
  {
    title: "Clientes",
    href: "/customers",
    icon: "👥",
    requiredRole: null,
  },
  {
    title: "Configurações",
    href: "/settings",
    icon: "⚙️",
    requiredRole: ["OWNER", "ADMIN"],
  },
];

export function MobileSidebar() {
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
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
              <div className="flex items-center justify-between p-4 border-b">
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
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation */}
              <nav className="flex-1 px-4 py-6">
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
                          <span className="text-lg">{item.icon}</span>
                          {item.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </div>
          </div>
        </>
      )}
    </>
  );
}
