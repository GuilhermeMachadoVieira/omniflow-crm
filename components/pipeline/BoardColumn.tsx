"use client";

import { useDroppable } from "@dnd-kit/core";
import { BoardCard } from "./BoardCard";
import type { PipelineOpportunity, PipelineStage } from "@/lib/mock/pipeline";
import { cn } from "@/lib/utils";

interface BoardColumnProps {
  stageId: PipelineStage;
  title: string;
  opportunities: PipelineOpportunity[];
}

export function BoardColumn({
  stageId,
  title,
  opportunities,
}: BoardColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: stageId,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-64 shrink-0 flex-col rounded-lg border border-border bg-muted/50 p-3 transition-colors",
        isOver && "bg-muted ring-2 ring-primary/30"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        <span className="rounded-full bg-muted-foreground/20 px-2 py-0.5 text-xs text-muted-foreground">
          {opportunities.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto">
        {opportunities.map((opp) => (
          <BoardCard key={opp.id} opportunity={opp} />
        ))}
      </div>
    </div>
  );
}
