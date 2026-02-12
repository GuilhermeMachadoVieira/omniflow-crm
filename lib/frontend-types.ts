// Tipos seguros para frontend (serializáveis)
// Estes tipos garantem que os dados passados do Server para Client Components são serializáveis

export interface CustomerSafe {
  id: string;
  nome: string;
  email: string;
  image?: string | null;
  telefone?: string;
  empresa?: string;
  document?: string; // CPF/CNPJ
  address?: string; // Endereço completo
  source?: string; // Origem: Google, Indicação, Instagram, etc
  tags?: string[]; // Array de strings para segmentação
  notes?: string; // Observações gerais
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
  probability: number; // 0 a 100%
  expectedCloseDate?: string; // ISO string
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

// Tipos Prisma para as funções de sanitização
export type CustomerPrisma = {
  id: string;
  nome: string;
  email: string;
  image?: string | null;
  telefone?: string | null;
  empresa?: string | null;
  document?: string | null;
  address?: string | null;
  source?: string | null;
  tags?: string[];
  notes?: string | null;
  createdAt: Date;
  totalRevenue?: number;
  lastPurchaseDate?: Date | null;
  status?: string;
};

export type TeamMemberPrisma = {
  id: string;
  nome: string;
  email: string;
  role: string;
  createdAt: Date;
};

export type OpportunityPrisma = {
  id: string;
  title: string;
  value: number;
  priority: string;
  probability?: number;
  expectedCloseDate?: Date | null;
  columnId: string;
  customerId?: string;
  createdAt: Date;
};

export type PipelineColumnPrisma = {
  id: string;
  title: string;
  sortOrder: number;
  opportunities: OpportunityPrisma[];
};

// Funções de sanitização para converter dados do Prisma para tipos seguros
export function sanitizeCustomer(customer: any): CustomerSafe {
  return {
    id: customer.id,
    nome: customer.nome,
    email: customer.email,
    image: customer.image || null,
    telefone: customer.telefone || undefined,
    empresa: customer.empresa || undefined,
    document: customer.document || undefined,
    address: customer.address || undefined,
    source: customer.source || undefined,
    tags: customer.tags || undefined,
    notes: customer.notes || undefined,
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
    probability: opportunity.probability || 50,
    expectedCloseDate: opportunity.expectedCloseDate ? opportunity.expectedCloseDate.toISOString() : undefined,
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
