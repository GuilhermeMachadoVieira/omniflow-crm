"use client";

import { useState, useEffect, Suspense } from "react";
import { CustomerTableWithSelection } from "@/components/customers/CustomerTableWithSelection";
import { BulkActions } from "@/components/customers/BulkActions";
import { CustomerFilters } from "@/components/customers/CustomerFilters";
import { LazyCreateCustomerDialog } from "@/components/customers/LazyCreateCustomerDialog";
import { ExportButton } from "@/components/customers/ExportButton";
import { CustomerTableSkeleton } from "@/components/customers/CustomerTableSkeleton";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/ui/SearchInput";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Plus } from "lucide-react";
import { CustomerSafe } from "@/lib/frontend-types";
import { useCurrentUser } from "@/hooks/use-current-user";
import { getCustomers } from "@/app/actions/customers";

interface CustomersClientProps {
  initialCustomers?: CustomerSafe[];
  searchQuery?: string;
}

export function CustomersClient({ initialCustomers, searchQuery }: CustomersClientProps) {
  const [customers, setCustomers] = useState<CustomerSafe[]>(initialCustomers || []);
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [filters, setFilters] = useState({ search: searchQuery || "" });
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useCurrentUser();

  useEffect(() => {
    const loadCustomers = async () => {
      if (user) {
        setIsLoading(true);
        try {
          const filteredCustomers = await getCustomers(user.organizationId, filters.search);
          setCustomers(filteredCustomers);
        } catch (error) {
          console.error("Error loading customers:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadCustomers();
  }, [user, filters]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight mb-2">
            Gestão de Clientes
          </h1>
          <p className="text-muted-foreground mb-4">
            Consulte e gerencie seus clientes. Clique em uma linha ou em &quot;Ver Detalhes&quot; para abrir o perfil.
            {searchQuery && (
              <span className="ml-2 text-sm">
                Rencontrados para &quot;<strong>{searchQuery}</strong>&quot;
              </span>
            )}
          </p>
          <SearchInput placeholder="Buscar clientes..." />
        </div>
        
        <div className="flex items-center gap-2">
          {user && <ExportButton organizationId={user.organizationId} />}
          <Suspense fallback={null}>
            <LazyCreateCustomerDialog>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Cliente
              </Button>
            </LazyCreateCustomerDialog>
          </Suspense>
        </div>
      </div>

      {/* Filters */}
      <CustomerFilters onFiltersChange={setFilters} />

      {/* Loading State */}
      {isLoading ? (
        <CustomerTableSkeleton />
      ) : (
        <>
          {/* Bulk Actions */}
          <BulkActions 
            selectedIds={selectedCustomers}
            onClearSelection={() => setSelectedCustomers([])}
            organizationId={user?.organizationId || ""}
          />

          <CustomerTableWithSelection
            customers={customers}
            selectedCustomers={selectedCustomers}
            onSelectionChange={setSelectedCustomers}
          />
        </>
      )}
    </div>
  );
}
