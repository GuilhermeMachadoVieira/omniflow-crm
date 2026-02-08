export const kpiMock = {
  totalRevenue: {
    value: 2847500,
    change: 12.5,
    period: "vs mês anterior",
  },
  newLeads: {
    value: 148,
    change: 8.2,
    period: "vs mês anterior",
  },
  conversionRate: {
    value: 24.8,
    change: 2.1,
    period: "vs mês anterior",
  },
};

export const salesEvolutionMock = [
  { month: "Jul", value: 420 },
  { month: "Ago", value: 580 },
  { month: "Set", value: 510 },
  { month: "Out", value: 720 },
  { month: "Nov", value: 890 },
  { month: "Dez", value: 940 },
  { month: "Jan", value: 1120 },
];

export type ActivityType =
  | "lead_created"
  | "deal_won"
  | "deal_lost"
  | "contact_updated"
  | "meeting_scheduled"
  | "proposal_sent";

export interface RecentActivity {
  id: string;
  type: ActivityType;
  description: string;
  entity: string;
  user: string;
  timestamp: Date;
}

export const recentActivitiesMock: RecentActivity[] = [
  {
    id: "1",
    type: "deal_won",
    description: "Negócio fechado",
    entity: "TechCorp Ltda",
    user: "Maria Silva",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "2",
    type: "lead_created",
    description: "Novo lead adicionado",
    entity: "Inova Solutions",
    user: "João Santos",
    timestamp: new Date(Date.now() - 1000 * 60 * 32),
  },
  {
    id: "3",
    type: "proposal_sent",
    description: "Proposta enviada",
    entity: "Global Systems",
    user: "Ana Costa",
    timestamp: new Date(Date.now() - 1000 * 60 * 58),
  },
  {
    id: "4",
    type: "meeting_scheduled",
    description: "Reunião agendada",
    entity: "DataFlow Inc",
    user: "Pedro Oliveira",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: "5",
    type: "contact_updated",
    description: "Contato atualizado",
    entity: "CloudBase SA",
    user: "Maria Silva",
    timestamp: new Date(Date.now() - 1000 * 60 * 185),
  },
  {
    id: "6",
    type: "deal_lost",
    description: "Negócio perdido",
    entity: "StartupX",
    user: "João Santos",
    timestamp: new Date(Date.now() - 1000 * 60 * 240),
  },
];

function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Agora";
  if (diffMins < 60) return `${diffMins} min atrás`;
  if (diffHours < 24) return `${diffHours}h atrás`;
  if (diffDays === 1) return "Ontem";
  return `${diffDays} dias atrás`;
}

export function getRelativeTime(activity: RecentActivity): string {
  return formatRelativeTime(activity.timestamp);
}
