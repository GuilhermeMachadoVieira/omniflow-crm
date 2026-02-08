"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { PipelineOpportunity, Priority } from "@/lib/mock/pipeline";
import { cn } from "@/lib/utils";

const PRIORITY_LABELS: Record<Priority, string> = {
  high: "Alta",
  medium: "Média",
  low: "Baixa",
};

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "bg-destructive/10 text-destructive border border-destructive/20",
  medium: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
  low: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Card content only – used in DragOverlay so the preview is always visible */
export function BoardCardPreview({ opportunity }: { opportunity: PipelineOpportunity }) {
  return (
    <Card className="shadow-lg ring-2 ring-primary/20 cursor-grabbing">
      <CardHeader className="p-4 pb-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm leading-tight line-clamp-2">
            {opportunity.companyName}
          </p>
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
              PRIORITY_STYLES[opportunity.priority]
            )}
          >
            {PRIORITY_LABELS[opportunity.priority]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-lg font-semibold text-primary">
          {formatCurrency(opportunity.value)}
        </p>
      </CardContent>
    </Card>
  );
}

interface BoardCardProps {
  opportunity: PipelineOpportunity;
}

export function BoardCard({ opportunity }: BoardCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: opportunity.id,
    data: { opportunity },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab active:cursor-grabbing transition-shadow",
        isDragging && "opacity-0 pointer-events-none"
      )}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="p-4 pb-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm leading-tight line-clamp-2">
            {opportunity.companyName}
          </p>
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
              PRIORITY_STYLES[opportunity.priority]
            )}
          >
            {PRIORITY_LABELS[opportunity.priority]}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-lg font-semibold text-primary">
          {formatCurrency(opportunity.value)}
        </p>
      </CardContent>
    </Card>
  );
}
