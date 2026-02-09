import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, AuthUser, Role } from "@/lib/types";

/** Obtém o usuário atual no Server Side a partir do cookie. */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
    
    if (!authCookie?.value) {
      return null;
    }

    const user = JSON.parse(authCookie.value) as AuthUser;
    return user;
  } catch (error) {
    console.error("Error parsing auth cookie:", error);
    return null;
  }
}

/** Verifica se o usuário atual tem permissão (RBAC). */
export async function hasRole(requiredRole: Role): Promise<boolean> {
  const user = await getCurrentUser();
  if (!user) return false;

  const roleHierarchy = {
    OWNER: 3,
    ADMIN: 2,
    MEMBER: 1,
  };

  const userLevel = roleHierarchy[user.role] || 0;
  const requiredLevel = roleHierarchy[requiredRole];

  return userLevel >= requiredLevel;
}

/** Verifica se o usuário atual pode gerenciar equipe (OWNER ou ADMIN). */
export async function canManageTeam(): Promise<boolean> {
  return await hasRole('ADMIN');
}
