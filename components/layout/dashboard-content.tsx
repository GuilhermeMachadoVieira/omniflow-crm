"use client";

import { useSidebar } from "@/components/providers/sidebar-provider";
import { cn } from "@/lib/utils";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div 
      className={cn(
        "flex flex-1 flex-col transition-all duration-300 min-h-screen overflow-hidden",
        "md:ml-64", // Margin quando sidebar está expandida
        isCollapsed && "md:ml-16" // Margin quando sidebar está recolhida
      )}
    >
      {children}
    </div>
  );
}
