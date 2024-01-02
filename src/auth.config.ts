import Credentials from 'next-auth/providers/credentials';
import { SignInSchema } from './lib/validators/auth';
import Facebook from 'next-auth/providers/facebook';
import Google from 'next-auth/providers/google';
import type { NextAuthConfig } from 'next-auth';
import Apple from 'next-auth/providers/apple';
import { getUserByEmail } from './lib/auth';
import bcrypt from 'bcryptjs';

export default {
  providers: [
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Apple({
      clientId: process.env.APPLE_CLIENT_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET!,
    }),
    Credentials({
      async authorize(credentials) {
        const parseFields = SignInSchema.safeParse(credentials);
        if (!parseFields.success) return null;

        const { email, password } = parseFields.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) return user;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
