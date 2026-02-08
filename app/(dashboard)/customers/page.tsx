"use client";

import { useState, useMemo, useCallback } from "react";
import { DataTable } from "@/components/customers/data-table";
import { getColumns } from "@/components/customers/columns";
import { CustomerDetailSheet } from "@/components/customers/customer-detail-sheet";
import { MOCK_CUSTOMERS } from "@/lib/mock/customers";
import type { Customer } from "@/lib/mock/customers";

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleViewDetails = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setSheetOpen(true);
  }, []);

  const columns = useMemo(
    () => getColumns(handleViewDetails),
    [handleViewDetails]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Gestão de Clientes
        </h1>
        <p className="text-muted-foreground">
          Consulte e gerencie seus clientes. Clique em uma linha ou em &quot;Ver
          Detalhes&quot; para abrir o perfil.
        </p>
      </div>

      <DataTable
        data={MOCK_CUSTOMERS}
        columns={columns}
        onRowClick={handleViewDetails}
      />

      <CustomerDetailSheet
        customer={selectedCustomer}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </div>
  );
}
