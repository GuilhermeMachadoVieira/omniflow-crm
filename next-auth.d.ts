import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      nome: string;
      role: "OWNER" | "ADMIN" | "MEMBER";
      organizationId: string;
      orgName: string;
      image?: string | null;
      name?: string | null;
    };
  }

  interface User {
    id: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    organizationId: string;
    orgName: string;
    nome: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "OWNER" | "ADMIN" | "MEMBER";
    organizationId?: string;
    orgName?: string;
    nome?: string;
  }
}
