import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// Debug environment variables
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  debug: process.env.NODE_ENV === 'development',
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

        if (!email || !password) return null;

        const { prisma } = await import("@/lib/database");

        const user = await prisma.user.findUnique({
          where: { email },
          include: { organization: true },
        });

        if (!user) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.nome,
          image: user.image ?? undefined,
          role: user.role,
          organizationId: user.organizationId,
          orgName: user.organization.name,
          nome: user.nome,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.orgName = user.orgName;
        token.nome = user.nome;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...(session.user ?? {}),
        id: token.id ?? "",
        email: token.email ?? "",
        nome: token.nome ?? "",
        role: token.role ?? "MEMBER",
        organizationId: token.organizationId ?? "",
        orgName: token.orgName ?? "",
        image: session.user?.image ?? null,
      };
      return session;
    },
  },
};
