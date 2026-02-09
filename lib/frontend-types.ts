// Tipos seguros para frontend (serializáveis)
// Estes tipos garantem que os dados passados do Server para Client Components são serializáveis

export interface CustomerSafe {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  createdAt: string; // ISO string
  totalRevenue?: number; // Number instead of Decimal
  lastPurchaseDate?: string; // ISO string
  status?: string;
}

export interface TeamMemberSafe {
  id: string;
  nome: string;
  email: string;
  role: string;
  createdAt: string; // ISO string
}

export interface OpportunitySafe {
  id: string;
  title: string;
  value: number; // Number instead of Decimal
  priority: string;
  columnId: string;
  customerId?: string;
  createdAt: string; // ISO string
}

export interface PipelineColumnSafe {
  id: string;
  title: string;
  sortOrder: number;
  opportunities: OpportunitySafe[];
}

// Funções de sanitização para converter dados do Prisma para tipos seguros
export function sanitizeCustomer(customer: any): CustomerSafe {
  return {
    id: customer.id,
    nome: customer.nome,
    email: customer.email,
    telefone: customer.telefone || undefined,
    empresa: customer.empresa || undefined,
    createdAt: customer.createdAt.toISOString(),
    totalRevenue: customer.totalRevenue ? Number(customer.totalRevenue) : undefined,
    lastPurchaseDate: customer.lastPurchaseDate ? customer.lastPurchaseDate.toISOString() : undefined,
    status: customer.status || undefined,
  };
}

export function sanitizeTeamMember(member: any): TeamMemberSafe {
  return {
    id: member.id,
    nome: member.nome,
    email: member.email,
    role: member.role,
    createdAt: member.createdAt.toISOString(),
  };
}

export function sanitizeOpportunity(opportunity: any): OpportunitySafe {
  return {
    id: opportunity.id,
    title: opportunity.title,
    value: Number(opportunity.value),
    priority: opportunity.priority,
    columnId: opportunity.columnId,
    customerId: opportunity.customerId || undefined,
    createdAt: opportunity.createdAt.toISOString(),
  };
}

export function sanitizePipelineColumn(column: any): PipelineColumnSafe {
  return {
    id: column.id,
    title: column.title,
    sortOrder: column.sortOrder,
    opportunities: column.opportunities.map(sanitizeOpportunity),
  };
}
