"use server";

import { createAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/database";

interface RegisterData {
  nome: string;
  email: string;
  password: string;
  empresa: string;
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, 50);
}

export async function registerAction(data: RegisterData): Promise<{ success: boolean; error?: string }> {
  try {
    const { nome, email, password, empresa } = data;

    // Validar dados básicos
    if (!nome || !email || !password || !empresa) {
      return { success: false, error: "Todos os campos são obrigatórios" };
    }

    if (password.length < 6) {
      return { success: false, error: "A senha deve ter pelo menos 6 caracteres" };
    }

    // Verificar se email já existe
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Este e-mail já está cadastrado" };
    }

    // Criar organização primeiro
    const slug = generateSlug(empresa);
    const organization = await prisma.organization.create({
      data: {
        name: empresa,
        slug,
      },
    });

    // Hash da senha
    const { hashPassword } = await import("@/lib/auth");
    const hashedPassword = await hashPassword(password);

    // Criar usuário
    const user = await prisma.user.create({
      data: {
        nome,
        email,
        passwordHash: hashedPassword,
        role: "OWNER",
        organizationId: organization.id,
      },
    });

    // Criar colunas padrão do Pipeline
    const DEFAULT_COLUMNS = [
      { title: "Novos Leads", sortOrder: 0 },
      { title: "Qualificação", sortOrder: 1 },
      { title: "Proposta", sortOrder: 2 },
      { title: "Negociação", sortOrder: 3 },
      { title: "Fechado", sortOrder: 4 },
    ];

    await prisma.pipelineColumn.createMany({
      data: DEFAULT_COLUMNS.map((col: any) => ({
        ...col,
        organizationId: organization.id,
      })),
    });

    // Criar sessão de autenticação
    await createAuthSession({
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      organizationId: organization.id,
      orgName: organization.name,
    });

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Erro ao criar conta" };
  }
}
