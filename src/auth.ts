import { PrismaAdapter } from '@auth/prisma-adapter';
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
  // TODO
  callbacks: {},
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  ...authConfig,
});
