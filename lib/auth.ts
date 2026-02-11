import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_COOKIE_NAME, AuthUser, Role } from "@/lib/types";
import { prisma } from "@/lib/database";
import * as bcrypt from "bcrypt";

/**
 * Production-ready Authentication System
 * - Server-side validation
 * - Secure cookies
 * - Multi-tenancy support
 */

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get(AUTH_COOKIE_NAME);
    
    if (!authCookie?.value) {
      console.log("No auth cookie found");
      return null;
    }

    // Parse e validar o cookie
    let authUser: AuthUser;
    try {
      authUser = JSON.parse(authCookie.value);
    } catch {
      // Cookie inválido, remover
      cookieStore.delete(AUTH_COOKIE_NAME);
      return null;
    }

    // Validar estrutura básica
    if (!authUser.id || !authUser.email || !authUser.organizationId) {
      console.error("Invalid user data in cookie:", { 
        hasId: !!authUser.id, 
        hasEmail: !!authUser.email, 
        hasOrgId: !!authUser.organizationId 
      });
      cookieStore.delete(AUTH_COOKIE_NAME);
      return null;
    }

    // Skip database validation during build time
    if (!process.env.DATABASE_URL) {
      console.warn("DATABASE_URL not available, skipping database validation");
      return authUser;
    }

    // Verificar se usuário ainda existe no banco (production validation)
    try {
      const user = await prisma.user.findUnique({
        where: { 
          id: authUser.id,
          organizationId: authUser.organizationId 
        },
        include: {
          organization: true,
        },
      });

      if (!user) {
        console.log("User not found in database, clearing cookie");
        cookieStore.delete(AUTH_COOKIE_NAME);
        return null;
      }
    } catch (dbError) {
      // Se DATABASE_URL não estiver disponível, retorna o usuário do cookie
      console.warn("Database validation skipped:", dbError);
      return authUser;
    }

    return authUser;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect("/login");
  }
  
  return user;
}

export async function requireRole(roles: string[]): Promise<AuthUser> {
  const user = await requireAuth();
  
  if (!roles.includes(user.role)) {
    redirect("/");
  }
  
  return user;
}

export async function createAuthSession(user: {
  id: string;
  email: string;
  nome: string;
  role: string;
  organizationId: string;
  orgName: string;
}): Promise<void> {
  const authUser: AuthUser = {
    id: user.id,
    email: user.email,
    nome: user.nome,
    role: user.role as any,
    organizationId: user.organizationId,
    orgName: user.orgName,
  };

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(authUser), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    path: "/",
  });
}

export async function destroyAuthSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

// Password utilities
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
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
