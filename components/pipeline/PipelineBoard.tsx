"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { BoardColumn } from "./BoardColumn";
import { BoardCardPreview } from "./BoardCard";
import { updateOpportunityStage } from "@/app/actions/pipeline";
import { PipelineColumnSafe, OpportunitySafe } from "@/lib/frontend-types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PipelineBoardProps {
  columns: PipelineColumnSafe[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function PipelineBoard({ columns: initialColumns }: PipelineBoardProps) {
  const [columns, setColumns] = useState<PipelineColumnSafe[]>(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Função para encontrar uma oportunidade em qualquer coluna
  const findOpportunity = useCallback((opportunityId: string): OpportunitySafe | undefined => {
    return columns
      .flatMap((col) => col.opportunities)
      .find((opp) => opp.id === opportunityId);
  }, [columns]);

  // Função para mover oportunidade entre colunas (optimistic update)
  const moveOpportunity = useCallback((opportunityId: string, newColumnId: string) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const opportunity = newColumns
        .flatMap((col) => col.opportunities)
        .find((opp) => opp.id === opportunityId);

      if (!opportunity) return prevColumns;

      // Remover da coluna antiga
      const sourceColumn = newColumns.find((col) => 
        col.opportunities.some((opp) => opp.id === opportunityId)
      );
      if (sourceColumn) {
        sourceColumn.opportunities = sourceColumn.opportunities.filter(
          (opp) => opp.id !== opportunityId
        );
      }

      // Adicionar à nova coluna
      const targetColumn = newColumns.find((col) => col.id === newColumnId);
      if (targetColumn) {
        targetColumn.opportunities = [...targetColumn.opportunities, opportunity];
      }

      return newColumns;
    });
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const opportunityId = active.id as string;
    const newColumnId = over.id as string;

    // Verificar se realmente mudou de coluna
    const opportunity = findOpportunity(opportunityId);
    if (!opportunity || opportunity.columnId === newColumnId) {
      setActiveId(null);
      return;
    }

    // Optimistic UI: atualizar imediatamente
    moveOpportunity(opportunityId, newColumnId);
    setActiveId(null);

    try {
      // Persistir no banco
      const result = await updateOpportunityStage(opportunityId, newColumnId);
      
      if (!result.success) {
        // Reverter em caso de erro
        moveOpportunity(opportunityId, opportunity.columnId);
        toast.error(result.error || "Erro ao mover oportunidade");
      } else {
        // Sucesso silencioso (UI já foi atualizada)
        router.refresh();
      }
    } catch (error) {
      // Reverter em caso de erro
      moveOpportunity(opportunityId, opportunity.columnId);
      toast.error("Erro ao mover oportunidade");
    }
  }, [findOpportunity, moveOpportunity, router]);

  // Calcular totais por coluna
  const getColumnTotal = useCallback((opportunities: OpportunitySafe[]) => {
    return opportunities.reduce((sum, opp) => sum + Number(opp.value), 0);
  }, []);

  // Find active opportunity for drag overlay
  const activeOpportunity: OpportunitySafe | undefined = activeId
    ? columns
        .flatMap((col) => col.opportunities)
        .find((opp) => opp.id === activeId)
    : undefined;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full flex flex-col">
        <div className="flex-1 overflow-x-auto overflow-y-hidden pb-6">
          <div className="flex gap-6 h-full min-w-max">
            {columns.map((column) => (
              <BoardColumn
                key={column.id}
                stageId={column.id}
                title={column.title}
                opportunities={column.opportunities}
                total={getColumnTotal(column.opportunities)}
              />
            ))}
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeOpportunity ? (
          <BoardCardPreview opportunity={activeOpportunity} />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
