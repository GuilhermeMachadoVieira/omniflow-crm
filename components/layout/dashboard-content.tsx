"use client";

import { useSidebar } from "@/components/providers/sidebar-provider";
import { cn } from "@/lib/utils";

export function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar();
  
  return (
    <div 
      className={cn(
        "flex flex-1 flex-col transition-all duration-300",
        "md:ml-64", // Margin quando sidebar está expandida
        isCollapsed && "md:ml-16" // Margin quando sidebar está recolhida
      )}
      style={{
        marginLeft: isCollapsed ? '4rem' : '16rem' // 64px / 16px = 4rem / 16rem
      }}
    >
      {children}
    </div>
  );
}
