import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

// Debug environment variables
console.log('NEXTAUTH_SECRET exists:', !!process.env.NEXTAUTH_SECRET);
console.log('AUTH_SECRET exists:', !!process.env.AUTH_SECRET);
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
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
        console.log('=== AUTHORIZE DEBUG ===');
        console.log('Credentials received:', { email: credentials?.email, hasPassword: !!credentials?.password });
        
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          console.log('Missing email or password');
          return null;
        }

        try {
          const { prisma } = await import("@/lib/database");
          console.log('Database connected');

          const user = await prisma.user.findUnique({
            where: { email },
            include: { organization: true },
          });

          console.log('User found:', !!user);
          if (!user) {
            console.log('No user found for email:', email);
            return null;
          }

          console.log('Comparing passwords...');
          const ok = await bcrypt.compare(password, user.passwordHash);
          console.log('Password match:', ok);
          
          if (!ok) {
            console.log('Password does not match');
            return null;
          }

          const result = {
            id: user.id,
            email: user.email,
            name: user.nome,
            image: user.image ?? undefined,
            role: user.role,
            organizationId: user.organizationId,
            orgName: user.organization.name,
            nome: user.nome,
          };
          
          console.log('Authorization successful for:', result.email);
          return result;
        } catch (error) {
          console.error('Error in authorize:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      console.log('=== JWT CALLBACK ===');
      console.log('Token:', token);
      console.log('User:', user);
      
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.organizationId = user.organizationId;
        token.orgName = user.orgName;
        token.nome = user.nome;
        console.log('JWT token updated with user data');
      }
      return token;
    },
    async session({ session, token }) {
      console.log('=== SESSION CALLBACK ===');
      console.log('Session:', session);
      console.log('Token:', token);
      
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
      console.log('Final session user:', session.user);
      return session;
    },
  },
};
