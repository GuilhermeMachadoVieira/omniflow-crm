"use server";

import { redirect } from "next/navigation";
import { createAuthSession, destroyAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/database";

interface LoginData {
  email: string;
  password: string;
}

export async function loginAction(data: LoginData): Promise<{ success: boolean; error?: string }> {
  try {
    const { email, password } = data;

    // Buscar usuário com organização
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        organization: true,
      },
    });

    if (!user) {
      return { success: false, error: "E-mail ou senha incorretos" };
    }

    // Verificar senha
    const { verifyPassword } = await import("@/lib/auth");
    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: "E-mail ou senha incorretos" };
    }

    // Criar sessão de autenticação
    await createAuthSession({
      id: user.id,
      email: user.email,
      nome: user.nome,
      role: user.role,
      organizationId: user.organizationId,
      orgName: user.organization.name,
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Erro ao fazer login" };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    await destroyAuthSession();
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}
