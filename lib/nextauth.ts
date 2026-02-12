import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { authRateLimit, checkRateLimit } from "@/lib/rate-limit";

export const authOptions: NextAuthOptions = {
  /**
   * Mantemos compatibilidade com NEXTAUTH_SECRET e AUTH_SECRET
   * para garantir que o middleware e a API usem o mesmo segredo.
   */
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 horas
    updateAge: 60 * 60, // 1 hora para atualizar sessão
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        try {
          // Rate limiting para login (por e-mail)
          const rateLimitResult = checkRateLimit(authRateLimit, email);
          if (!rateLimitResult.success) {
            throw new Error(rateLimitResult.error || "Muitas tentativas de login");
          }

          const { prisma } = await import("@/lib/database");

          const user = await prisma.user.findUnique({
            where: { email },
            include: { organization: true },
          });

          if (!user) {
            return null;
          }

          const ok = await bcrypt.compare(password, user.passwordHash);

          if (!ok) {
            return null;
          }

          /**
           * Este objeto é o `user` recebido nos callbacks JWT/Session.
           * Manter o shape aqui consistente com `next-auth.d.ts`.
           */
          const result = {
            id: user.id,
            email: user.email,
            name: user.nome,
            image: user.image ?? null,
            role: user.role,
            organizationId: user.organizationId,
            orgName: user.organization.name,
            nome: user.nome,
          };

          return result;
        } catch (error) {
          console.error("Error in authorize:", error);
          throw new Error("Erro ao autenticar usuário");
        }
      },
    }),
  ],
  callbacks: {
    /**
     * JWT: chamado a cada request. Aqui persistimos no token
     * todos os dados necessários para reconstruir a sessão.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.email = (user as any).email;
        token.role = (user as any).role;
        token.organizationId = (user as any).organizationId;
        token.orgName = (user as any).orgName;
        token.nome = (user as any).nome;
        // propagamos imagem para não depender de session.user anterior
        token.image = (user as any).image ?? null;
      }

      return token;
    },
    /**
     * Session: monta o objeto `session.user` usado no frontend e nas server actions.
     * Garante que User, Session e AuthUser tenham shape consistente.
     */
    async session({ session, token }) {
      session.user = {
        ...(session.user ?? {}),
        id: (token.id as string) ?? "",
        email: (token.email as string) ?? "",
        nome: (token.nome as string) ?? (session.user?.name ?? ""),
        role: (token.role as any) ?? "MEMBER",
        organizationId: (token.organizationId as string) ?? "",
        orgName: (token.orgName as string) ?? "",
        image: (token.image as string | null | undefined) ?? session.user?.image ?? null,
        name: session.user?.name ?? null,
      };

      return session;
    },
  },
};
