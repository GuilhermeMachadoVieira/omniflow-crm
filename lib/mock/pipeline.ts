export type PipelineStage =
  | "new"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won";

export type Priority = "high" | "medium" | "low";

export interface PipelineOpportunity {
  id: string;
  companyName: string;
  value: number;
  priority: Priority;
  stage: PipelineStage;
}

export const PIPELINE_STAGES: { id: PipelineStage; label: string }[] = [
  { id: "new", label: "Novos Leads" },
  { id: "qualified", label: "Qualificação" },
  { id: "proposal", label: "Proposta" },
  { id: "negotiation", label: "Negociação" },
  { id: "won", label: "Fechado" },
];

export const MOCK_OPPORTUNITIES: PipelineOpportunity[] = [
  { id: "1", companyName: "Tech Solutions Ltda", value: 85000, priority: "high", stage: "new" },
  { id: "2", companyName: "Indústria Beta S.A.", value: 120000, priority: "medium", stage: "new" },
  { id: "3", companyName: "Comércio Digital", value: 45000, priority: "low", stage: "qualified" },
  { id: "4", companyName: "Logística Norte", value: 210000, priority: "high", stage: "qualified" },
  { id: "5", companyName: "Startup Inova", value: 32000, priority: "low", stage: "proposal" },
  { id: "6", companyName: "Grupo Alfa Corp", value: 180000, priority: "high", stage: "proposal" },
  { id: "7", companyName: "Serviços Pro", value: 67000, priority: "medium", stage: "negotiation" },
  { id: "8", companyName: "Distribuidora Central", value: 145000, priority: "high", stage: "negotiation" },
  { id: "9", companyName: "Consultoria Estratégica", value: 95000, priority: "medium", stage: "won" },
  { id: "10", companyName: "Retail Plus", value: 52000, priority: "low", stage: "won" },
  { id: "11", companyName: "Agropecuária Sul", value: 310000, priority: "high", stage: "new" },
  { id: "12", companyName: "Software House", value: 78000, priority: "medium", stage: "qualified" },
];
