import { AuthValidator } from '@/lib/validators/auth';
import { publicProcedure, router } from '../trpc';
import bcrypt from 'bcryptjs';

export const authRouter = router({
  signUp: publicProcedure.input(AuthValidator).mutation(async ({ ctx, input }) => {
    const { email, password } = input;
    const { prisma } = ctx;

    const alreadyExist = await prisma.user.findUnique({
      where: { email: email },
    });

    if (alreadyExist) {
      return { error: 'Podany adres email jest zajęty.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { success: 'Konto założone!' };

    // TODO verification mail with token
  }),
});
