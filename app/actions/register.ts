"use server";

import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, AuthUser } from "@/lib/types";
import * as bcrypt from "bcrypt";

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
    // Import dinâmico do prisma apenas quando DATABASE_URL está disponível
    const { prisma } = await import("@/lib/db");
    
    const { nome, email, password, empresa } = data;

    // Validar dados básicos
    if (!nome || !email || !password || !empresa) {
      return { success: false, error: "Todos os campos são obrigatórios" };
    }

    if (password.length < 6) {
      return { success: false, error: "A senha deve ter pelo menos 6 caracteres" };
    }

    // Verificar se email já existe antes da transação
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

    // Criar usuário
    const hashedPassword = await bcrypt.hash(password, 10);
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

    // Criar objeto de autenticação e fazer login automático
    const authUser: AuthUser = {
      id: user.id,
      organizationId: organization.id,
      role: "OWNER",
      orgName: organization.name,
      nome: user.nome,
      email: user.email,
    };

    console.log("Setting auth cookie with:", authUser);

    // Salvar no cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(authUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    console.log("Registration successful, redirecting...");
    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Erro ao criar conta" };
  }
}
