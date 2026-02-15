"use client";

import { useDroppable } from "@dnd-kit/core";
import { BoardCard } from "./BoardCard";
import { OpportunitySafe } from "@/lib/frontend-types";
import { cn } from "@/lib/utils";

interface BoardColumnProps {
  stageId: string;
  title: string;
  opportunities: OpportunitySafe[];
  total?: number;
}

export function BoardColumn({
  stageId,
  title,
  opportunities,
  total,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stageId,
  });

  // Calcular total se não for fornecido
  const columnTotal = total ?? opportunities.reduce((sum, opp) => sum + Number(opp.value), 0);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-64 shrink-0 flex-col rounded-lg border border-border bg-muted/50 p-3 transition-colors h-full",
        isOver && "bg-muted ring-2 ring-primary/30"
      )}
    >
      <div className="flex items-center justify-between mb-3 flex-shrink-0">
        <h3 className="font-medium text-sm text-foreground">{title}</h3>
        <span className="text-sm font-semibold text-primary">
          {formatCurrency(columnTotal)}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
        {opportunities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Nenhuma oportunidade
          </div>
        ) : (
          opportunities.map((opportunity) => (
            <BoardCard key={opportunity.id} opportunity={opportunity} />
          ))
        )}
      </div>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
