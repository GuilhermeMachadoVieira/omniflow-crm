"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  isHovered: boolean;
  setHovered: (hovered: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const setHovered = (hovered: boolean) => {
    if (hovered) {
      // Abrir com delay de 300ms
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
      }, 300);
    } else {
      // Fechar imediatamente
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      setIsHovered(false);
    }
  };

  // Estado efetivo: recolhida quando não está em hover
  const isCollapsed = !isHovered;

  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  return (
    <SidebarContext.Provider value={{ 
      isCollapsed, 
      isHovered,
      setHovered 
    }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
}
