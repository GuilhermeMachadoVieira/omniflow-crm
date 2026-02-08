"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Customer } from "@/lib/mock/customers";
import { formatCurrency, formatDate } from "@/lib/mock/customers";
import {
  Mail,
  Phone,
  Building2,
  Calendar,
  DollarSign,
  MessageSquare,
  PhoneCall,
  Mail as MailIcon,
  CalendarDays,
} from "lucide-react";
import { cn } from "@/lib/utils";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

const CONTACT_TYPE_CONFIG = {
  email: { icon: MailIcon, label: "E-mail" },
  call: { icon: PhoneCall, label: "Ligação" },
  meeting: { icon: CalendarDays, label: "Reunião" },
  note: { icon: MessageSquare, label: "Nota" },
};

interface CustomerDetailSheetProps {
  customer: Customer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailSheet({
  customer,
  open,
  onOpenChange,
}: CustomerDetailSheetProps) {
  if (!customer) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes do Cliente</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {/* Perfil */}
          <div className="flex flex-col items-center gap-3 text-center">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="bg-primary/10 text-primary text-2xl font-medium">
                {getInitials(customer.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-lg">{customer.name}</p>
              <Badge
                variant={customer.status === "active" ? "default" : "secondary"}
                className={cn(
                  "mt-1",
                  customer.status === "inactive" &&
                    "bg-muted text-muted-foreground"
                )}
              >
                {customer.status === "active" ? "Ativo" : "Inativo"}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">E-mail:</span>
              <a
                href={`mailto:${customer.email}`}
                className="truncate font-medium text-primary hover:underline"
              >
                {customer.email}
              </a>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Telefone:</span>
                <span className="font-medium">{customer.phone}</span>
              </div>
            )}
            {customer.company && (
              <div className="flex items-center gap-3 text-sm">
                <Building2 className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Empresa:</span>
                <span className="font-medium">{customer.company}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">Última compra:</span>
              <span className="font-medium">
                {formatDate(customer.lastPurchase)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <DollarSign className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">Receita total:</span>
              <span className="font-semibold text-primary">
                {formatCurrency(customer.totalRevenue)}
              </span>
            </div>
          </div>

          <Separator />

          {/* Histórico de contatos */}
          <div>
            <h4 className="font-semibold text-sm mb-3">Histórico de Contatos</h4>
            <ul className="space-y-3">
              {customer.contactHistory.length === 0 ? (
                <li className="text-sm text-muted-foreground">
                  Nenhum contato registrado.
                </li>
              ) : (
                customer.contactHistory.map((entry) => {
                  const config = CONTACT_TYPE_CONFIG[entry.type];
                  const Icon = config.icon;
                  return (
                    <li
                      key={entry.id}
                      className="flex gap-3 rounded-lg border border-border bg-muted/30 p-3 text-sm"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{config.label}</p>
                        <p className="text-muted-foreground">
                          {entry.description}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {formatDate(entry.date)}
                        </p>
                      </div>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
