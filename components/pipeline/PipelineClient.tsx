"use client";

import { useState } from "react";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { CreateOpportunityDialog } from "@/components/pipeline/CreateOpportunityDialog";
import { Button } from "@/components/ui/button";
import { FilterSelect } from "@/components/ui/filter-select";
import { Plus } from "lucide-react";
import { PipelineColumnSafe } from "@/lib/frontend-types";
import { CustomerSafe } from "@/lib/frontend-types";
import { useRouter, useSearchParams } from "next/navigation";

interface PipelineClientProps {
  initialColumns: PipelineColumnSafe[];
  initialCustomers: CustomerSafe[];
  searchQuery?: string;
  priorityFilter?: string;
}

export function PipelineClient({ initialColumns, initialCustomers, searchQuery, priorityFilter }: PipelineClientProps) {
  const [columns, setColumns] = useState<PipelineColumnSafe[]>(initialColumns);
  const [customers] = useState<CustomerSafe[]>(initialCustomers);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCreateComplete = () => {
    // A lista será atualizada pelo router.refresh() no dialog
  };

  const handlePriorityChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("priority", value);
    } else {
      params.delete("priority");
    }
    router.push(`/pipeline?${params.toString()}`);
  };

  const priorityOptions = [
    { value: "HIGH", label: "Alta" },
    { value: "MEDIUM", label: "Média" },
    { value: "LOW", label: "Baixa" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">
            Arraste os cards entre as colunas para atualizar o estágio do negócio.
            {searchQuery && (
              <span className="ml-2 text-sm">
                Filtrando oportunidades: <strong>&quot;{searchQuery}&quot;</strong>
              </span>
            )}
            {priorityFilter && (
              <span className="ml-2 text-sm">
                Prioridade: <strong>{priorityOptions.find(opt => opt.value === priorityFilter)?.label}</strong>
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <FilterSelect
            value={priorityFilter}
            onValueChange={handlePriorityChange}
            placeholder="Prioridade"
            options={priorityOptions}
            className="w-32"
          />
          <CreateOpportunityDialog 
            customers={customers} 
            columns={columns}
            onCreateComplete={handleCreateComplete}
          >
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Oportunidade
            </Button>
          </CreateOpportunityDialog>
        </div>
      </div>

      {columns.length > 0 ? (
        <PipelineBoard columns={columns} />
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto max-w-sm">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-lg font-medium mb-2">Nenhuma coluna encontrada</h3>
            <p className="text-muted-foreground">
              Configure as colunas do seu pipeline para começar a gerenciar oportunidades.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
