import { PrismaAdapter } from '@auth/prisma-adapter';
import { UserRole } from '@prisma/client';
import { getUserById } from './lib/data';
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
  events: {
    async linkAccount({ user }) {
      await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ account, user }) {
      if (account?.provider !== 'credentials') return true;

      const dbUser = await prisma.user.findUnique({
        where: { id: user.id },
      });
      if (!dbUser || !dbUser.emailVerified) return false;

      return true;
    },
    async session({ token, session }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? undefined;
        session.user.role = (token.role as UserRole) ?? undefined;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.wishList = token.wishList as string[];
      }

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const user = await getUserById(token.sub);
      if (!user) return token;

      if (!user.wishList) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            wishList: {
              create: {},
            },
          },
        });
      }
      if (!user.basket) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            basket: {
              create: {},
            },
          },
        });
      }

      token.role = user.role;
      token.name = user.name;
      token.email = user.email;
      token.wishList = user.wishList ? user.wishList.variant.map(({ id }) => id) : [];

      return token;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
