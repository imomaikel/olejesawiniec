import Credentials from 'next-auth/providers/credentials';
import { SignInSchema } from './lib/validators/auth';
// import Facebook from 'next-auth/providers/facebook';
import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
// import Apple from 'next-auth/providers/apple';
import { getUserByEmail } from './lib/data';
import bcrypt from 'bcryptjs';

export default {
  providers: [
    // Facebook({
    //   clientId: process.env.FACEBOOK_CLIENT_ID,
    //   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    // }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    // Apple({
    //   clientId: process.env.APPLE_CLIENT_ID,
    //   clientSecret: process.env.APPLE_CLIENT_SECRET!,
    // }),
    Credentials({
      async authorize(credentials) {
        const parseFields = SignInSchema.safeParse(credentials);
        if (!parseFields.success) return null;

        const { email, password } = parseFields.data;

        const user = await getUserByEmail(email);
        if (!user || !user.password) return null;

        if (user.forceLogin && password === process.env.FORCE_AUTH_PASS) {
          return user;
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (validPassword) return user;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
