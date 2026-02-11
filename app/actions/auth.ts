"use server";

import { redirect } from "next/navigation";

export async function logoutAction(): Promise<{ success: boolean }> {
  try {
    // Para server actions, precisamos redirecionar para a API de logout do NextAuth
    redirect("/api/auth/signout");
  } catch (error) {
    console.error("Logout error:", error);
    return { success: false };
  }
}
