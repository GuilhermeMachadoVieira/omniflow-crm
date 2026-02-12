"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/database";
import { getCurrentUser } from "@/lib/nextauth-client";
import * as bcrypt from "bcrypt";
import { z } from "zod";
import { passwordSchema } from "@/lib/password-policy";
import { passwordChangeRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Senha atual é obrigatória"),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

const resetPasswordSchema = z.object({
  email: z.string().email("E-mail inválido"),
});

export async function changePassword(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    // Rate limiting baseado no IP
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 
               headersList.get('x-real-ip') || 
               'unknown';
    
    const rateLimitResult = passwordChangeRateLimit.check(ip);
    if (!rateLimitResult.success) {
      return { 
        success: false, 
        error: "Muitas tentativas. Tente novamente em 1 hora." 
      };
    }

    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    const rawData = {
      currentPassword: formData.get("currentPassword") as string,
      newPassword: formData.get("newPassword") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    const validatedData = changePasswordSchema.parse(rawData);

    // Buscar usuário atual com senha
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: { passwordHash: true },
    });

    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // Verificar senha atual
    const isCurrentPasswordValid = await bcrypt.compare(
      validatedData.currentPassword,
      user.passwordHash
    );

    if (!isCurrentPasswordValid) {
      return { success: false, error: "Senha atual incorreta" };
    }

    // Verificar se a nova senha é diferente da atual
    const isSamePassword = await bcrypt.compare(
      validatedData.newPassword,
      user.passwordHash
    );

    if (isSamePassword) {
      return { 
        success: false, 
        error: "A nova senha deve ser diferente da senha atual" 
      };
    }

    // Hash da nova senha
    const hashedNewPassword = await bcrypt.hash(validatedData.newPassword, 12);

    // Atualizar senha
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { passwordHash: hashedNewPassword },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error changing password:", error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Dados inválidos" 
      };
    }
    
    return { success: false, error: "Erro ao alterar senha" };
  }
}

export async function requestPasswordReset(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  message?: string;
}> {
  try {
    const rawData = {
      email: formData.get("email") as string,
    };

    const validatedData = resetPasswordSchema.parse(rawData);

    // Verificar se o usuário existe
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      include: { organization: true },
    });

    if (!user) {
      // Por segurança, não revelamos se o e-mail existe ou não
      return { 
        success: true, 
        message: "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha." 
      };
    }

    // TODO: Implementar sistema de reset de senha com tokens
    // Por enquanto, apenas retornamos sucesso
    return { 
      success: true, 
      message: "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha." 
    };
  } catch (error) {
    console.error("Error requesting password reset:", error);
    
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        error: error.errors[0]?.message || "Dados inválidos" 
      };
    }
    
    return { success: false, error: "Erro ao solicitar redefinição de senha" };
  }
}

export async function deleteAccount(formData: FormData): Promise<{
  success: boolean;
  error?: string;
}> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    const password = formData.get("password") as string;
    const confirmation = formData.get("confirmation") as string;

    if (!password) {
      return { success: false, error: "Senha é obrigatória" };
    }

    if (confirmation !== "DELETAR") {
      return { 
        success: false, 
        error: 'Você deve digitar "DELETAR" para confirmar' 
      };
    }

    // Buscar usuário para verificar senha
    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      include: { organization: true },
    });

    if (!user) {
      return { success: false, error: "Usuário não encontrado" };
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return { success: false, error: "Senha incorreta" };
    }

    // Verificar se é o único usuário da organização
    const userCount = await prisma.user.count({
      where: { organizationId: user.organizationId },
    });

    if (userCount === 1) {
      // Se for o único usuário, deletar a organização também
      await prisma.organization.delete({
        where: { id: user.organizationId },
      });
    } else {
      // Se houver outros usuários, apenas deletar o usuário
      await prisma.user.delete({
        where: { id: currentUser.id },
      });
    }

    // Redirecionar para página de registro
    // Isso será tratado no client-side
    return { success: true };
  } catch (error) {
    console.error("Error deleting account:", error);
    return { success: false, error: "Erro ao deletar conta" };
  }
}
