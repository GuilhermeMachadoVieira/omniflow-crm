"use client";

import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { OpportunitySafe } from "@/lib/frontend-types";
import { cn } from "@/lib/utils";
import { OpportunityCardMenu } from "./OpportunityCardMenu";

const PRIORITY_LABELS: Record<string, string> = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
};

const PRIORITY_STYLES: Record<string, string> = {
  HIGH: "bg-destructive/10 text-destructive border border-destructive/20",
  MEDIUM: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20",
  LOW: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/** Card content only – used in DragOverlay so the preview is always visible */
export function BoardCardPreview({ opportunity }: { opportunity: OpportunitySafe }) {
  return (
    <Card className="shadow-lg ring-2 ring-primary/20 cursor-grabbing">
      <CardHeader className="p-4 pb-1">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm leading-tight line-clamp-2">
            {opportunity.title}
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
          {formatCurrency(Number(opportunity.value))}
        </p>
      </CardContent>
    </Card>
  );
}

interface BoardCardProps {
  opportunity: OpportunitySafe;
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

  const priorityColor = PRIORITY_STYLES[opportunity.priority] || PRIORITY_STYLES.MEDIUM;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "cursor-grab transition-shadow hover:shadow-md",
        isDragging && "opacity-50"
      )}
      {...attributes}
      {...listeners}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-sm leading-tight line-clamp-2 flex-1">
            {opportunity.title}
          </p>
          <div className="flex items-center gap-1">
            <span
              className={cn(
                "shrink-0 rounded-md px-2 py-0.5 text-xs font-medium",
                priorityColor
              )}
            >
              {PRIORITY_LABELS[opportunity.priority]}
            </span>
            <OpportunityCardMenu opportunity={opportunity} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-lg font-semibold text-primary">
          {formatCurrency(Number(opportunity.value))}
        </p>
      </CardContent>
    </Card>
  );
}
