"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
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

    // Verificar se a oportunidade existe
    const opportunity = await prisma.opportunity.findUnique({
      where: { id: opportunityId },
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
  customerId: string;
  columnId: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Não autorizado" };
    }

    const { title, value, customerId, columnId } = data;

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
        priority: "MEDIUM",
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

export async function getPipelineData(): Promise<PipelineColumnSafe[]> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }

    // Buscar colunas do pipeline
    const columns = await prisma.pipelineColumn.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },
      include: {
        opportunities: {
          where: {
            organizationId: currentUser.organizationId,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    // Sanitizar dados para frontend
    return columns.map(sanitizePipelineColumn);
  } catch (error) {
    console.error("Error fetching pipeline data:", error);
    return [];
  }
}
