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
  organizationId: string;
  initialSearchQuery?: string;
  initialPriorityFilter?: string;
}

export function PipelinePageClient({ organizationId, initialSearchQuery, initialPriorityFilter }: PipelinePageClientProps) {
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
        const data = await getPipelineData(organizationId, undefined, filters.priority);
        setColumns(data);
      } catch (error) {
        console.error("Failed to load pipeline data:", error);
        toast.error("Erro ao carregar dados do pipeline");
      } finally {
        setIsLoading(false);
      }
    };

    loadPipelineData();
  }, [organizationId, filters]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  const handleOpportunityCreated = () => {
    getPipelineData(organizationId, undefined, filters.priority).then(setColumns);
    setShowCreateDialog(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Pipeline de Vendas
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas oportunidades de negócio em cada etapa do funil.
            </p>
          </div>
          
          <div className="flex flex-shrink-0 gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtros</span>
            </Button>
            
            <Button
              onClick={() => setShowCreateDialog(true)}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Oportunidade</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="flex-shrink-0">
          <PipelineFilters
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </div>
      )}

      {/* Pipeline Board Container */}
      <div className="flex-1 min-h-0 bg-background rounded-lg border overflow-hidden">
        <div className="h-full p-6 overflow-hidden">
          <PipelineBoard columns={columns} />
        </div>
      </div>

      {/* Dialog de Criação */}
      <CreateOpportunityDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={handleOpportunityCreated}
        columns={columns}
        organizationId={organizationId}
      />
    </div>
  );
}
