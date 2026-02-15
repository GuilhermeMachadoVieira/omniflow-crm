"use client";

import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/providers/sidebar-provider";

interface HeaderProps {
  title?: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Header({ title, description, className, children }: HeaderProps) {
  const { isCollapsed } = useSidebar();
  
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex h-14 shrink-0 items-center gap-4 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80 transition-all duration-normal",
        className
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        {title && (
          <div className="flex flex-col animate-slide-up min-w-0">
            <h1 className="text-lg font-semibold text-foreground transition-colors duration-normal truncate">{title}</h1>
            {description && (
              <p className="text-xs text-muted-foreground transition-colors duration-normal truncate">{description}</p>
            )}
          </div>
        )}
        {children}
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors duration-normal" />
          <Input
            placeholder="Buscar..."
            className="w-48 lg:w-64 pl-9 transition-all duration-normal focus:w-56 lg:focus:w-72 focus:shadow-sm"
          />
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          aria-label="Notificações"
          className="transition-all duration-normal hover:scale-110 active:scale-95"
        >
          <Bell className="h-5 w-5 transition-transform duration-normal hover:rotate-12" />
        </Button>
      </div>
    </header>
  );
}
