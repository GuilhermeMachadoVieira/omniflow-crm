"use client";

import { useState, useEffect } from "react";
import { CustomerTable } from "./CustomerTable";
import { CustomersFilters } from "./CustomersFilters";
import { CreateCustomerDialog } from "./CreateCustomerDialog";
import { getCustomers, exportCustomers } from "@/app/actions/customers";
import { CustomerSafe } from "@/lib/frontend-types";
import { Button } from "@/components/ui/button";
import { Plus, Filter, Download, Search } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

interface CustomersPageClientProps {
  initialSearchQuery?: string;
}

export function CustomersPageClient({ initialSearchQuery }: CustomersPageClientProps) {
  const [customers, setCustomers] = useState<CustomerSafe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [filters, setFilters] = useState({
    query: "",
    status: "",
    source: "",
  });
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");

  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const data = await getCustomers("", searchQuery);
        setCustomers(data);
      } catch (error) {
        console.error("Failed to load customers:", error);
        toast.error("Erro ao carregar clientes");
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, [searchQuery]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleCustomerCreated = () => {
    // Recarregar dados quando um cliente for criado
    getCustomers("", searchQuery).then(setCustomers);
    setShowCreateDialog(false);
    toast.success("Cliente criado com sucesso!");
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const result = await exportCustomers("");
      if (result.success && result.data) {
        // Criar blob e download
        const blob = new Blob([result.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `customers_${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success("Clientes exportados com sucesso!");
      } else {
        toast.error(result.error || "Erro ao exportar clientes");
      }
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Erro ao exportar clientes");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Clientes
          </h1>
          <p className="text-muted-foreground">
            Gerencie sua base de clientes e relacionamentos.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting || customers.length === 0}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "Exportando..." : "Exportar"}
          </Button>
          
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Novo Cliente
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar clientes..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <CustomersFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Customers Table */}
      <div className="bg-background rounded-lg border p-6">
        <CustomerTable customers={customers} />
      </div>

      {/* Dialog de Criação */}
      <CreateCustomerDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleCustomerCreated}
      />
    </div>
  );
}
