"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SettingsNavigationProps {
  currentPath?: string;
}

export function SettingsNavigation({ currentPath }: SettingsNavigationProps) {
  const pathname = usePathname();
  const activePath = currentPath || pathname;

  const tabs = [
    {
      href: "/settings",
      label: "Perfil",
      isActive: activePath === "/settings",
    },
    {
      href: "/settings/organization",
      label: "Organização",
      isActive: activePath === "/settings/organization",
    },
    {
      href: "/settings/appearance",
      label: "Aparência",
      isActive: activePath === "/settings/appearance",
    },
    {
      href: "/settings/security",
      label: "Segurança",
      isActive: activePath === "/settings/security",
    },
    {
      href: "/settings/team",
      label: "Equipe",
      isActive: activePath === "/settings/team",
    },
  ];

  return (
    <div className="grid grid-cols-5 gap-2 mb-6">
      {tabs.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={`px-3 py-2 rounded-lg border text-center text-sm transition-colors ${
            tab.isActive
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
