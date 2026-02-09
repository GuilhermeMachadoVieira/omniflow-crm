"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { CustomerSafe, sanitizeCustomer } from "@/lib/frontend-types";

export interface CreateCustomerData {
  nome: string;
  email: string;
  telefone: string;
  empresa: string;
}

export async function createCustomer(data: CreateCustomerData): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Não autorizado" };
    }

    const { nome, email, telefone, empresa } = data;

    // Verificar se já existe cliente com este e-mail na organização
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        email,
        organizationId: currentUser.organizationId,
      },
    });

    if (existingCustomer) {
      return { success: false, error: "Já existe um cliente com este e-mail" };
    }

    // Criar cliente
    await prisma.customer.create({
      data: {
        nome,
        email,
        telefone,
        empresa,
        userId: currentUser.userId,
        organizationId: currentUser.organizationId,
      },
    });

    // Revalidar cache
    revalidatePath("/customers");

    return { success: true };
  } catch (error) {
    console.error("Error creating customer:", error);
    return { success: false, error: "Erro ao criar cliente" };
  }
}

export async function getCustomers(): Promise<CustomerSafe[]> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }

    const customers = await prisma.customer.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Sanitizar dados para frontend
    return customers.map(sanitizeCustomer);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}
