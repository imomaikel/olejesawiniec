import { SignUpSchema } from '@/lib/validators/auth';
import { publicProcedure, router } from '../trpc';
import { loginUser } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export const authRouter = router({
  signUp: publicProcedure.input(SignUpSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;
    const { prisma } = ctx;

    const alreadyExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (alreadyExist) {
      return { error: 'Podany adres email jest zajęty.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
        },
      });
    } catch {
      return { error: 'Wystąpił błąd' };
    }

    try {
      const status = await loginUser({ email, password });
      if (status?.error) {
        return { error: status.error };
      } else {
        return { status: 'Konto założone', redirect: true };
      }
    } catch {}

    return { success: 'Konto założone!' };
  }),
});

// TODO email verification & redirect
