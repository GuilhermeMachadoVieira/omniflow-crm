"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { InviteMemberData } from "@/lib/types";
import { TeamMemberSafe, sanitizeTeamMember } from "@/lib/frontend-types";
import * as bcrypt from "bcrypt";

export async function inviteMember(data: InviteMemberData): Promise<{ success: boolean; error?: string }> {
  try {
    // Verificar se o usuário atual pode gerenciar equipe
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "Não autorizado" };
    }

    const canManage = currentUser.role === 'OWNER' || currentUser.role === 'ADMIN';
    if (!canManage) {
      return { success: false, error: "Sem permissão para gerenciar equipe" };
    }

    const { nome, email, role } = data;

    // Verificar se o usuário já existe na organização
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        organizationId: currentUser.organizationId,
      },
    });

    if (existingUser) {
      return { success: false, error: "Este e-mail já está cadastrado na organização" };
    }

    // Verificar se já existe um OWNER (só pode ter um)
    if (role === 'OWNER') {
      const existingOwner = await prisma.user.findFirst({
        where: {
          role: 'OWNER',
          organizationId: currentUser.organizationId,
        },
      });

      if (existingOwner) {
        return { success: false, error: "Já existe um proprietário nesta organização" };
      }
    }

    // Criar senha temporária
    const tempPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Criar usuário
    await prisma.user.create({
      data: {
        nome,
        email,
        passwordHash: hashedPassword,
        role,
        organizationId: currentUser.organizationId,
      },
    });

    // Revalidar cache
    revalidatePath("/settings/team");

    return { success: true };
  } catch (error) {
    console.error("Error inviting member:", error);
    return { success: false, error: "Erro ao convidar membro" };
  }
}

export async function getTeamMembers(): Promise<TeamMemberSafe[]> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return [];
    }

    // Buscar membros da organização
    const members = await prisma.user.findMany({
      where: {
        organizationId: currentUser.organizationId,
      },
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    // Sanitizar dados para frontend
    return members.map(sanitizeTeamMember);
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}
