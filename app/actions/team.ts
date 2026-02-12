"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/database";
import { getCurrentUser, hasRole } from "@/lib/nextauth-client";
import { z } from "zod";
import * as bcrypt from "bcrypt";

const inviteMemberSchema = z.object({
  email: z.string().email("E-mail inválido"),
  nome: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  role: z.enum(["ADMIN", "MEMBER"]),
});

const updateMemberRoleSchema = z.object({
  userId: z.string().uuid("ID de usuário inválido"),
  role: z.enum(["ADMIN", "MEMBER"]),
});

const removeMemberSchema = z.object({
  userId: z.string().uuid("ID de usuário inválido"),
});

export async function inviteMember(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    // Verificar se pode gerenciar equipe
    const canManage = await hasRole('ADMIN');
    if (!canManage) {
      return { success: false, error: "Sem permissão para gerenciar equipe" };
    }

    const rawData = {
      email: formData.get("email") as string,
      nome: formData.get("nome") as string,
      role: formData.get("role") as string,
    };

    const validatedData = inviteMemberSchema.parse(rawData);

    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { success: false, error: "Este e-mail já está cadastrado no sistema" };
    }

    // Gerar senha temporária
    const tempPassword = Math.random().toString(36).slice(-8) + "A1!";
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    // Criar novo usuário
    const newUser = await prisma.user.create({
      data: {
        nome: validatedData.nome,
        email: validatedData.email,
        passwordHash: hashedPassword,
        role: validatedData.role as "ADMIN" | "MEMBER",
        organizationId: currentUser.organizationId,
      },
    });

    // TODO: Implementar sistema de convite por e-mail
    console.log(`Usuário convidado: ${validatedData.email}, senha temporária: ${tempPassword}`);

    revalidatePath("/settings/team");
    return { success: true };
  } catch (error) {
    console.error("Error inviting member:", error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Dados inválidos" 
      };
    }
    
    return { success: false, error: "Erro ao convidar membro" };
  }
}

export async function updateMemberRole(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    // Verificar se pode gerenciar equipe
    const canManage = await hasRole('ADMIN');
    if (!canManage) {
      return { success: false, error: "Sem permissão para gerenciar equipe" };
    }

    const rawData = {
      userId: formData.get("userId") as string,
      role: formData.get("role") as string,
    };

    const validatedData = updateMemberRoleSchema.parse(rawData);

    // Verificar se o usuário pertence à mesma organização
    const targetUser = await prisma.user.findFirst({
      where: {
        id: validatedData.userId,
        organizationId: currentUser.organizationId,
      },
    });

    if (!targetUser) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // Impedir que um OWNER modifique seu próprio role
    if (targetUser.id === currentUser.id && currentUser.role === "OWNER") {
      return { success: false, error: "Não é possível alterar o próprio role de proprietário" };
    }

    // Impedir que um ADMIN modifique um OWNER
    if (currentUser.role === "ADMIN" && targetUser.role === "OWNER") {
      return { success: false, error: "Administradores não podem modificar proprietários" };
    }

    // Atualizar role
    await prisma.user.update({
      where: { id: validatedData.userId },
      data: { role: validatedData.role as "ADMIN" | "MEMBER" },
    });

    revalidatePath("/settings/team");
    return { success: true };
  } catch (error) {
    console.error("Error updating member role:", error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Dados inválidos" 
      };
    }
    
    return { success: false, error: "Erro ao atualizar permissões" };
  }
}

export async function removeMember(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    // Verificar se pode gerenciar equipe
    const canManage = await hasRole('ADMIN');
    if (!canManage) {
      return { success: false, error: "Sem permissão para gerenciar equipe" };
    }

    const rawData = {
      userId: formData.get("userId") as string,
    };

    const validatedData = removeMemberSchema.parse(rawData);

    // Verificar se o usuário pertence à mesma organização
    const targetUser = await prisma.user.findFirst({
      where: {
        id: validatedData.userId,
        organizationId: currentUser.organizationId,
      },
    });

    if (!targetUser) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // Impedir que um usuário se remova
    if (targetUser.id === currentUser.id) {
      return { success: false, error: "Não é possível remover seu próprio usuário" };
    }

    // Impedir que um ADMIN remova um OWNER
    if (currentUser.role === "ADMIN" && targetUser.role === "OWNER") {
      return { success: false, error: "Administradores não podem remover proprietários" };
    }

    // Verificar se é o último OWNER da organização
    if (targetUser.role === "OWNER") {
      const ownerCount = await prisma.user.count({
        where: {
          organizationId: currentUser.organizationId,
          role: "OWNER",
        },
      });

      if (ownerCount <= 1) {
        return { 
          success: false, 
          error: "Não é possível remover o último proprietário da organização" 
        };
      }
    }

    // Remover usuário
    await prisma.user.delete({
      where: { id: validatedData.userId },
    });

    revalidatePath("/settings/team");
    return { success: true };
  } catch (error) {
    console.error("Error removing member:", error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Dados inválidos" 
      };
    }
    
    return { success: false, error: "Erro ao remover membro" };
  }
}

export async function getTeamMembers(): Promise<{
  success: boolean;
  data?: any[];
  error?: string;
}> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    const members = await prisma.user.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return { success: true, data: members };
  } catch (error) {
    console.error("Error fetching team members:", error);
    return { success: false, error: "Erro ao buscar membros da equipe" };
  }
}
