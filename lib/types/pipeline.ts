import { PipelineColumn, Opportunity, Priority } from "@prisma/client";

export type PipelineColumnWithOpportunities = PipelineColumn & {
  opportunities: Opportunity[];
};

export type PipelineOpportunity = Opportunity;

export type PipelineStage = string; // Will be derived from column id

export type { Priority };

export const PRIORITY_LABELS: Record<Priority, string> = {
  HIGH: "Alta",
  MEDIUM: "Média",
  LOW: "Baixa",
};
