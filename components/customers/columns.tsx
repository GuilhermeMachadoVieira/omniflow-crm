"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Customer } from "@/lib/mock/customers";
import { formatCurrency, formatDate } from "@/lib/mock/customers";
import { Eye } from "lucide-react";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function getColumns(onViewDetails: (customer: Customer) => void): ColumnDef<Customer>[] {
  return [
    {
      accessorKey: "name",
      header: "Cliente",
      cell: ({ row }) => {
        const name = row.original.name;
        return (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.email}</span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge
            variant={status === "active" ? "default" : "secondary"}
            className={status === "inactive" ? "bg-muted text-muted-foreground" : ""}
          >
            {status === "active" ? "Ativo" : "Inativo"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "lastPurchase",
      header: "Última Compra",
      cell: ({ row }) => formatDate(row.original.lastPurchase),
    },
    {
      accessorKey: "totalRevenue",
      header: "Receita Total",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="font-medium tabular-nums">
          {formatCurrency(row.original.totalRevenue)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="h-8"
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(row.original);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          Ver Detalhes
        </Button>
      ),
    },
  ];
}
