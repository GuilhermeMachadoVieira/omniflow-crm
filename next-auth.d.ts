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
      /**
       * Campo padrão do NextAuth; mantido por compatibilidade.
       */
      name?: string | null;
    };
  }

  /**
   * Shape do usuário retornado por `authorize` (CredentialsProvider)
   * e recebido nos callbacks JWT/Session.
   */
  interface User {
    id: string;
    email: string;
    role: "OWNER" | "ADMIN" | "MEMBER";
    organizationId: string;
    orgName: string;
    nome: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    role?: "OWNER" | "ADMIN" | "MEMBER";
    organizationId?: string;
    orgName?: string;
    nome?: string;
    image?: string | null;
  }
}
