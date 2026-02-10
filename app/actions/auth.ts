"use server";

import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import * as bcrypt from "bcrypt";
import { AUTH_COOKIE_NAME, AuthUser } from "@/lib/types";

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
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: "E-mail ou senha incorretos" };
    }

    // Criar objeto de autenticação
    const authUser: AuthUser = {
      id: user.id,
      organizationId: user.organizationId,
      role: user.role,
      orgName: user.organization.name,
      nome: user.nome,
      email: user.email,
    };

    // Salvar no cookie
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(authUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Erro ao fazer login" };
  }
}

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}
