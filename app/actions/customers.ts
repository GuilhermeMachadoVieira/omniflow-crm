"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/database";
import { getCurrentUser } from "@/lib/nextauth-client";
import { CustomerSafe, sanitizeCustomer } from "@/lib/frontend-types";
import { revalidateCache, CACHE_TAGS, CACHE_DURATIONS } from "@/lib/cache";
import { Prisma } from "@prisma/client";

export interface CreateCustomerData {
  nome: string;
  email: string;
  image?: string | null;
  telefone?: string;
  empresa?: string;
  document?: string;
  address?: string;
  source?: string;
  tags?: string[];
  notes?: string;
}

export async function createCustomer(data: CreateCustomerData): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    const { nome, email, image, telefone, empresa, document, address, source, tags, notes } = data;

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
        image,
        telefone,
        empresa,
        document,
        address,
        source,
        tags,
        notes,
        userId: currentUser.id,
        organizationId: currentUser.organizationId,
      },
    });

    // Revalidar cache específico
    revalidateCache.customers(currentUser.organizationId);
    revalidatePath("/customers");

    return { success: true };
  } catch (error) {
    console.error("Error creating customer:", error);
    return { success: false, error: "Erro ao criar cliente" };
  }
}

export async function getCustomers(organizationId: string, query?: string): Promise<CustomerSafe[]> {
  try {
    const whereClause: Prisma.CustomerWhereInput = {
      organizationId,
    };

    // Adicionar filtro de busca se query for fornecida
    if (query && query.trim()) {
      whereClause.OR = [
        { nome: { contains: query, mode: "insensitive" } },
        { email: { contains: query, mode: "insensitive" } },
        { empresa: { contains: query, mode: "insensitive" } },
        { document: { contains: query, mode: "insensitive" } },
        { source: { contains: query, mode: "insensitive" } },
        { tags: { hasSome: [query] } },
      ];
    }

    const customers = await prisma.customer.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
    });

    return customers.map(sanitizeCustomer);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return [];
  }
}

export async function updateCustomer(customerId: string, data: {
  nome: string;
  email: string;
  image?: string | null;
  telefone?: string;
  empresa?: string;
  document?: string;
  address?: string;
  source?: string;
  tags: string[];
  notes?: string;
}) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    // Verificar se o cliente pertence à organização do usuário
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        organizationId: currentUser.organizationId,
      },
    });

    if (!existingCustomer) {
      return { success: false, error: "Cliente não encontrado" };
    }

    // Atualizar cliente
    await prisma.customer.update({
      where: {
        id: customerId,
      },
      data: {
        nome: data.nome,
        email: data.email,
        image: data.image,
        telefone: data.telefone,
        empresa: data.empresa,
        document: data.document,
        address: data.address,
        source: data.source,
        tags: data.tags,
        notes: data.notes,
      },
    });

    // Revalidar cache
    revalidatePath("/customers");
    revalidatePath(`/customers/${customerId}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating customer:", error);
    return { success: false, error: "Erro ao atualizar cliente" };
  }
}

export async function exportCustomers(organizationId: string): Promise<{ success: boolean; data?: string; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.organizationId !== organizationId) {
      return { success: false, error: "Não autorizado" };
    }

    const customers = await prisma.customer.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Criar CSV
    const headers = [
      "Nome",
      "Email", 
      "Telefone",
      "Empresa",
      "Documento",
      "Endereço",
      "Origem",
      "Tags",
      "Notas",
      "Status",
      "Data de Cadastro"
    ];

    const csvContent = [
      headers.join(","),
      ...customers.map((customer: any) => [
        `"${customer.nome.replace(/"/g, '""')}"`,
        `"${customer.email}"`,
        `"${customer.telefone || ""}"`,
        `"${customer.empresa || ""}"`,
        `"${customer.document || ""}"`,
        `"${customer.address || ""}"`,
        `"${customer.source || ""}"`,
        `"${(customer.tags || []).join(";")}"`,
        `"${customer.notes || ""}"`,
        `"${customer.status}"`,
        `"${customer.createdAt.toISOString().split('T')[0]}"`
      ].join(","))
    ].join("\n");

    return { success: true, data: csvContent };
  } catch (error) {
    console.error("Error exporting customers:", error);
    return { success: false, error: "Erro ao exportar clientes" };
  }
}

export async function deleteCustomer(customerId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    // Verificar se o cliente pertence à organização do usuário
    const existingCustomer = await prisma.customer.findFirst({
      where: {
        id: customerId,
        organizationId: currentUser.organizationId,
      },
    });

    if (!existingCustomer) {
      return { success: false, error: "Cliente não encontrado" };
    }

    // Excluir cliente (cascade excluirá oportunidades e atividades relacionadas)
    await prisma.customer.delete({
      where: {
        id: customerId,
      },
    });

    // Revalidar cache
    revalidatePath("/customers");
    revalidatePath(`/customers/${customerId}`);

    return { success: true };
  } catch (error) {
    console.error("Error deleting customer:", error);
    return { success: false, error: "Erro ao excluir cliente" };
  }
}
