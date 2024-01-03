import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';
import { getUserById } from './lib/auth';
import authConfig from './auth.config';
import prisma from './lib/prisma';
import NextAuth from 'next-auth';

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  pages: {
    signIn: '/logowanie',
    error: '/logowanie?metoda=błąd',
  },
  callbacks: {
    async session({ token, session }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? undefined;
        session.user.role = (token.role as UserRole) ?? undefined;
        session.user.name = token.name;
        session.user.email = token.email;
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
