"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/database";
import { getCurrentUser } from "@/lib/nextauth-client";
import { PipelineColumnSafe, sanitizePipelineColumn } from "@/lib/frontend-types";

export async function updateOpportunityStage(
  opportunityId: string,
  newColumnId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Não autorizado" };
    }

    // Verificar se a oportunidade existe e pertence à organização do usuário
    const opportunity = await prisma.opportunity.findFirst({
      where: { 
        id: opportunityId,
        organizationId: currentUser.organizationId 
      },
    });

    if (!opportunity) {
      return { success: false, error: "Oportunidade não encontrada" };
    }

    // Atualizar o estágio da oportunidade
    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: {
        columnId: newColumnId,
      },
    });

    // Revalidar cache
    revalidatePath("/pipeline");

    return { success: true };
  } catch (error) {
    console.error("Error updating opportunity stage:", error);
    return { success: false, error: "Erro ao atualizar oportunidade" };
  }
}

export async function createOpportunity(data: {
  title: string;
  value: number;
  priority: "HIGH" | "MEDIUM" | "LOW";
  probability: number;
  expectedCloseDate?: Date;
  customerId: string;
  columnId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Não autorizado" };
    }

    const { title, value, priority, probability, expectedCloseDate, customerId, columnId } = data;

    // Verificar se o cliente existe na organização
    const customer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        organizationId: currentUser.organizationId,
      },
    });

    if (!customer) {
      return { success: false, error: "Cliente não encontrado" };
    }

    // Criar oportunidade
    await prisma.opportunity.create({
      data: {
        title,
        value: value,
        priority,
        probability,
        expectedCloseDate,
        columnId,
        organizationId: currentUser.organizationId,
      },
    });

    // Revalidar cache
    revalidatePath("/pipeline");

    return { success: true };
  } catch (error) {
    console.error("Error creating opportunity:", error);
    return { success: false, error: "Erro ao criar oportunidade" };
  }
}

export async function deleteOpportunity(opportunityId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Não autorizado" };
    }

    // Verificar se a oportunidade pertence à organização do usuário
    const existingOpportunity = await prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        column: {
          organizationId: currentUser.organizationId,
        },
      },
    });

    if (!existingOpportunity) {
      return { success: false, error: "Oportunidade não encontrada" };
    }

    // Excluir oportunidade
    await prisma.opportunity.delete({
      where: {
        id: opportunityId,
      },
    });

    // Revalidar cache
    revalidatePath("/pipeline");

    return { success: true };
  } catch (error) {
    console.error("Error deleting opportunity:", error);
    return { success: false, error: "Erro ao excluir oportunidade" };
  }
}

export async function updateOpportunity(opportunityId: string, data: {
  title?: string;
  value?: number;
  priority?: string;
  probability?: number;
  expectedCloseDate?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Não autorizado" };
    }

    // Verificar se a oportunidade existe e pertence à organização do usuário
    const existingOpportunity = await prisma.opportunity.findFirst({
      where: {
        id: opportunityId,
        organizationId: currentUser.organizationId,
      },
    });

    if (!existingOpportunity) {
      return { success: false, error: "Oportunidade não encontrada" };
    }

    // Atualizar oportunidade
    await prisma.opportunity.update({
      where: { id: opportunityId },
      data: {
        ...(data.title && { title: data.title }),
        ...(data.value && { value: data.value }),
        ...(data.priority && { priority: data.priority as any }),
        ...(data.probability && { probability: data.probability }),
        ...(data.expectedCloseDate && { expectedCloseDate: new Date(data.expectedCloseDate) }),
      },
    });

    // Revalidar cache
    revalidatePath("/pipeline");

    return { success: true };
  } catch (error) {
    console.error("Error updating opportunity:", error);
    return { success: false, error: "Erro ao atualizar oportunidade" };
  }
}

export async function getPipelineData(organizationId: string, query?: string, priorityFilter?: string): Promise<PipelineColumnSafe[]> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }

    // Construir where clause para busca
    const whereClause: any = {
      organizationId: currentUser.organizationId,
    };

    // Construir where clause para oportunidades
    const opportunityWhere: any = {};

    // Se houver query, adicionar filtro nas oportunidades
    if (query && query.trim()) {
      opportunityWhere.OR = [
        { title: { contains: query, mode: 'insensitive' } },
      ];
    }

    // Se houver filtro de prioridade, adicionar filtro
    if (priorityFilter && priorityFilter.trim()) {
      opportunityWhere.priority = priorityFilter;
    }

    // Se houver filtros de oportunidades, adicionar ao whereClause
    if (Object.keys(opportunityWhere).length > 0) {
      whereClause.opportunities = {
        some: opportunityWhere,
      };
    }

    // Buscar colunas do pipeline
    const columns = await prisma.pipelineColumn.findMany({
      where: whereClause,
      include: {
        opportunities: {
          where: Object.keys(opportunityWhere).length > 0 ? opportunityWhere : undefined,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    // Sanitizar dados para frontend
    return columns.map(sanitizePipelineColumn);
  } catch (error) {
    console.error("Error fetching pipeline data:", error);
    return [];
  }
}
