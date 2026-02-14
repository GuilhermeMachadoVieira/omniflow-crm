"use client";

import { useState, useEffect } from "react";
import { PipelineBoard } from "./PipelineBoard";
import { PipelineFilters } from "./PipelineFilters";
import { CreateOpportunityDialog } from "./CreateOpportunityDialog";
import { getPipelineData } from "@/app/actions/pipeline";
import { PipelineColumnSafe } from "@/lib/frontend-types";
import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";

interface PipelinePageClientProps {
  initialSearchQuery?: string;
  initialPriorityFilter?: string;
}

export function PipelinePageClient({ initialSearchQuery, initialPriorityFilter }: PipelinePageClientProps) {
  const [columns, setColumns] = useState<PipelineColumnSafe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [filters, setFilters] = useState({
    query: initialSearchQuery || "",
    priority: initialPriorityFilter || "",
  });

  useEffect(() => {
    const loadPipelineData = async () => {
      try {
        const data = await getPipelineData("", filters.priority);
        setColumns(data);
      } catch (error) {
        console.error("Failed to load pipeline data:", error);
        toast.error("Erro ao carregar dados do pipeline");
      } finally {
        setIsLoading(false);
      }
    };

    loadPipelineData();
  }, [filters]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleOpportunityCreated = () => {
    // Recarregar dados quando uma oportunidade for criada
    getPipelineData("", filters.priority).then(setColumns);
    setShowCreateDialog(false);
    toast.success("Oportunidade criada com sucesso!");
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
            Pipeline de Vendas
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas oportunidades de negócio em cada etapa do funil.
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
            onClick={() => setShowCreateDialog(true)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Oportunidade
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <PipelineFilters
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      )}

      {/* Pipeline Board */}
      <div className="bg-background rounded-lg border p-6">
        <PipelineBoard columns={columns} />
      </div>

      {/* Dialog de Criação */}
      <CreateOpportunityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleOpportunityCreated}
        columns={columns}
      />
    </div>
  );
}
