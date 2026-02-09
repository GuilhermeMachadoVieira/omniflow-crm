// Tipos e Enums puros - sem imports de next/headers ou prisma
// Pode ser importado por qualquer arquivo (client ou server)

export const AUTH_COOKIE_NAME = "omniflow-auth";

export interface AuthUser {
  userId: string;
  organizationId: string;
  role: "OWNER" | "ADMIN" | "MEMBER";
  orgName: string;
  nome: string;
  email: string;
}

export type Role = "OWNER" | "ADMIN" | "MEMBER";

export interface InviteMemberData {
  nome: string;
  email: string;
  role: Role;
}

export interface TeamMember {
  id: string;
  nome: string;
  email: string;
  role: Role;
  createdAt: Date;
}
