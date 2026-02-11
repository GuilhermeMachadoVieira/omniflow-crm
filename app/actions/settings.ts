"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/database";
import { getCurrentUser } from "@/lib/nextauth-client";
import { z } from "zod";

const profileSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório"),
});

const organizationSchema = z.object({
  name: z.string().min(1, "Nome da organização é obrigatório"),
});

export async function updateProfile(formData: FormData) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    const rawData = {
      nome: formData.get("nome") as string,
    };

    const validatedData = profileSchema.parse(rawData);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        nome: validatedData.nome,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, error: "Erro ao atualizar perfil" };
  }
}

export async function updateOrganization(formData: FormData) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    const rawData = {
      name: formData.get("name") as string,
    };

    const validatedData = organizationSchema.parse(rawData);

    await prisma.organization.update({
      where: {
        id: currentUser.organizationId,
      },
      data: {
        name: validatedData.name,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating organization:", error);
    return { success: false, error: "Erro ao atualizar organização" };
  }
}

export async function updateProfileImage(imageData: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        image: imageData,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating profile image:", error);
    return { success: false, error: "Erro ao atualizar avatar" };
  }
}

export async function updateOrganizationLogo(logoData: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.id) {
      return { success: false, error: "Não autorizado" };
    }

    await prisma.organization.update({
      where: {
        id: currentUser.organizationId,
      },
      data: {
        logo: logoData,
      },
    });

    revalidatePath("/settings");
    return { success: true };
  } catch (error) {
    console.error("Error updating organization logo:", error);
    return { success: false, error: "Erro ao atualizar logo" };
  }
}
