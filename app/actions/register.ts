"use server";

import { prisma } from "@/lib/database";
import * as bcrypt from "bcrypt";
import { z } from "zod";
import { passwordSchema } from "@/lib/password-policy";

interface RegisterData {
  nome: string;
  email: string;
  password: string;
  empresa: string;
}

const registerSchema = z.object({
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("Informe um e-mail válido"),
  password: passwordSchema,
  empresa: z.string().min(2, "Nome da empresa deve ter pelo menos 2 caracteres"),
});

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
    const result = registerSchema.safeParse(data);
    if (!result.success) {
      return { success: false, error: result.error.issues[0].message };
    }

    const { nome, email, password, empresa } = data;

    // Verificar se email já existe
    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "Este e-mail já está cadastrado" };
    }

    // Criar organização primeiro, garantindo slug único
    const baseSlug = generateSlug(empresa);
    let slug = baseSlug;
    let suffix = 1;

    // Evita falha de registro por colisão de slug entre organizações
    // (ex.: duas empresas com nomes iguais).
    // Loop simples com limite razoável de tentativas.
    // Isso blinda o fluxo de Registro contra erros 500 por conflito único.
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const existingOrg = await prisma.organization.findUnique({
        where: { slug },
      });

      if (!existingOrg) {
        break;
      }

      slug = `${baseSlug}-${suffix}`;
      suffix += 1;
    }

    const organization = await prisma.organization.create({
      data: {
        name: empresa,
        slug,
      },
    });

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 12);

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

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    
    return { success: false, error: "Erro ao criar conta" };
  }
}
