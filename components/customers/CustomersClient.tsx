"use client";

import { useState } from "react";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { CreateCustomerDialog } from "@/components/customers/CreateCustomerDialog";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
import { CustomerSafe } from "@/lib/frontend-types";

interface CustomersClientProps {
  initialCustomers: CustomerSafe[];
}

export function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const [customers, setCustomers] = useState<CustomerSafe[]>(initialCustomers);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Gestão de Clientes
          </h1>
          <p className="text-muted-foreground">
            Consulte e gerencie seus clientes. Clique em uma linha ou em &quot;Ver Detalhes&quot; para abrir o perfil.
          </p>
        </div>
        
        <CreateCustomerDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </CreateCustomerDialog>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Users className="h-4 w-4" />
        <span>{customers.length} cliente{customers.length !== 1 ? "s" : ""}</span>
      </div>

      <CustomerTable customers={customers} />
    </div>
  );
}
