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
import { BoardColumn } from "@/components/pipeline/BoardColumn";
import { BoardCardPreview } from "@/components/pipeline/BoardCard";
import {
  PIPELINE_STAGES,
  MOCK_OPPORTUNITIES,
  type PipelineOpportunity,
  type PipelineStage,
} from "@/lib/mock/pipeline";

function getOpportunitiesByStage(
  opportunities: PipelineOpportunity[],
  stage: PipelineStage
) {
  return opportunities.filter((opp) => opp.stage === stage);
}

export default function PipelinePage() {
  const [opportunities, setOpportunities] =
    useState<PipelineOpportunity[]>(MOCK_OPPORTUNITIES);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over?.id) return;

    const newStage = over.id as PipelineStage;
    const validStages: PipelineStage[] = [
      "new",
      "qualified",
      "proposal",
      "negotiation",
      "won",
    ];
    if (!validStages.includes(newStage)) return;

    const opportunityId = String(active.id);
    setOpportunities((prev) =>
      prev.map((opp) =>
        opp.id === opportunityId ? { ...opp, stage: newStage } : opp
      )
    );
  }, []);

  const activeOpportunity = activeId
    ? opportunities.find((o) => o.id === activeId)
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Pipeline</h1>
        <p className="text-muted-foreground">
          Arraste os cards entre as colunas para atualizar o estágio do negócio.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_STAGES.map(({ id, label }) => (
            <BoardColumn
              key={id}
              stageId={id}
              title={label}
              opportunities={getOpportunitiesByStage(opportunities, id)}
            />
          ))}
        </div>

        <DragOverlay>
          {activeOpportunity ? (
            <div className="w-64 rotate-2 scale-105">
              <BoardCardPreview opportunity={activeOpportunity} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
