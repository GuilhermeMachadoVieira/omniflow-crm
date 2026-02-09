"use client";

import { useState } from "react";
import { PipelineBoard } from "@/components/pipeline/PipelineBoard";
import { CreateOpportunityDialog } from "@/components/pipeline/CreateOpportunityDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PipelineColumnSafe } from "@/lib/frontend-types";
import { CustomerSafe } from "@/lib/frontend-types";

interface PipelineClientProps {
  initialColumns: PipelineColumnSafe[];
  initialCustomers: CustomerSafe[];
}

export function PipelineClient({ initialColumns, initialCustomers }: PipelineClientProps) {
  const [columns, setColumns] = useState<PipelineColumnSafe[]>(initialColumns);
  const [customers] = useState<CustomerSafe[]>(initialCustomers);

  const handleCreateComplete = () => {
    // A lista será atualizada pelo router.refresh() no dialog
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
          <p className="text-muted-foreground">
            Arraste os cards entre as colunas para atualizar o estágio do negócio.
          </p>
        </div>
        
        <CreateOpportunityDialog 
          onCreateComplete={handleCreateComplete}
          initialColumnId={columns[0]?.id}
          customers={customers}
          columns={columns}
        >
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Oportunidade
          </Button>
        </CreateOpportunityDialog>
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
