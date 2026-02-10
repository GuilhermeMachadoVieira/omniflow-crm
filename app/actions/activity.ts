"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const activitySchema = z.object({
  customerId: z.string().min(1, "ID do cliente é obrigatório"),
  type: z.enum(["NOTE", "CALL", "EMAIL", "MEETING"]),
  content: z.string().min(1, "Conteúdo é obrigatório"),
});

export async function createActivityAction(formData: FormData) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    // Extrair dados do FormData
    const rawData = {
      customerId: formData.get("customerId") as string,
      type: formData.get("type") as string,
      content: formData.get("content") as string,
    };

    // Validar com Zod
    const validatedData = activitySchema.parse(rawData);

    // Verificar se o cliente pertence à organização do usuário
    const customer = await prisma.customer.findFirst({
      where: {
        id: validatedData.customerId,
        organizationId: currentUser.organizationId,
      },
    });

    if (!customer) {
      return { success: false, error: "Cliente não encontrado" };
    }

    // Criar atividade
    await prisma.activity.create({
      data: {
        type: validatedData.type,
        content: validatedData.content,
        customerId: validatedData.customerId,
        userId: currentUser.id,
        organizationId: currentUser.organizationId,
      },
    });

    // Revalidar cache da página do cliente
    revalidatePath(`/customers/${validatedData.customerId}`);

    return { success: true };
  } catch (error) {
    console.error("Error creating activity:", error);
    return { success: false, error: "Erro ao criar atividade" };
  }
}
