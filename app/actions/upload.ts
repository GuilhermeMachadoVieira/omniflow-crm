"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/database";
import { getCurrentUser } from "@/lib/nextauth-client";
import { uploadImage, deleteImage } from "@/lib/supabase";

export interface UploadImageResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadUserImage(file: File): Promise<UploadImageResult> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    // Upload para Supabase
    const uploadResult = await uploadImage(file, 'users', `user-${currentUser.id}`);
    
    if (uploadResult.error) {
      return { success: false, error: uploadResult.error };
    }

    // Deletar imagem anterior se existir
    if (currentUser.image && currentUser.image.startsWith('https://')) {
      const oldPath = currentUser.image.split('/').pop()?.split('?')[0];
      if (oldPath) {
        await deleteImage(`user-${currentUser.id}/${oldPath}`, 'users');
      }
    }

    // Atualizar no banco
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { image: uploadResult.url },
    });

    revalidatePath("/settings");
    return { success: true, url: uploadResult.url };
  } catch (error) {
    console.error("Error uploading user image:", error);
    return { success: false, error: "Erro ao fazer upload da imagem" };
  }
}

export async function deleteOrganizationLogo(): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.organizationId) {
      return { success: false, error: "Não autorizado" };
    }

    if (currentUser.role === "MEMBER") {
      return { success: false, error: "Permissão negada" };
    }

    const org = await prisma.organization.findUnique({
      where: { id: currentUser.organizationId },
      select: { logo: true },
    });

    if (org?.logo && org.logo.startsWith("https://")) {
      const path = org.logo.split("/").pop()?.split("?")[0];
      if (path) {
        await deleteImage(`org-${currentUser.organizationId}/${path}`, "users");
      }
    }

    await prisma.organization.update({
      where: { id: currentUser.organizationId },
      data: { logo: null },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error deleting organization logo:", error);
    return { success: false, error: "Erro ao deletar logo" };
  }
}

export async function uploadOrganizationLogo(file: File): Promise<UploadImageResult> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.organizationId) {
      return { success: false, error: "Não autorizado" };
    }

    // Verificar se tem permissão (OWNER ou ADMIN)
    if (currentUser.role === 'MEMBER') {
      return { success: false, error: "Permissão negada" };
    }

    // Upload para Supabase
    const uploadResult = await uploadImage(file, 'users', `org-${currentUser.organizationId}`);
    
    if (uploadResult.error) {
      return { success: false, error: uploadResult.error };
    }

    // Buscar logo atual para deletar
    const org = await prisma.organization.findUnique({
      where: { id: currentUser.organizationId },
      select: { logo: true },
    });

    if (org?.logo && org.logo.startsWith('https://')) {
      const oldPath = org.logo.split('/').pop()?.split('?')[0];
      if (oldPath) {
        await deleteImage(`org-${currentUser.organizationId}/${oldPath}`, 'users');
      }
    }

    // Atualizar no banco
    await prisma.organization.update({
      where: { id: currentUser.organizationId },
      data: { logo: uploadResult.url },
    });

    revalidatePath("/settings");
    return { success: true, url: uploadResult.url };
  } catch (error) {
    console.error("Error uploading organization logo:", error);
    return { success: false, error: "Erro ao fazer upload da logo" };
  }
}

export async function deleteUserImage(): Promise<{ success: boolean; error?: string }> {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    // Deletar imagem do Supabase se existir
    if (currentUser.image && currentUser.image.startsWith('https://')) {
      const path = currentUser.image.split('/').pop()?.split('?')[0];
      if (path) {
        await deleteImage(`user-${currentUser.id}/${path}`, 'users');
      }
    }

    // Remover do banco
    await prisma.user.update({
      where: { id: currentUser.id },
      data: { image: null },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error deleting user image:", error);
    return { success: false, error: "Erro ao deletar imagem" };
  }
}
