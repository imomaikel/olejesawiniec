import { z } from 'zod';
import { publicProcedure, router } from '../trpc';
import { basketRouter } from './basketRouter';
import { panelRouter } from './panelRouter';
import { shopRouter } from './shopRouter';
import { handlePrismaError } from './errors';

export const appRouter = router({
  panel: panelRouter,
  shop: shopRouter,
  basket: basketRouter,

  getCategories: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const categories = await prisma.category.findMany({
      select: {
        label: true,
        id: true,
        _count: {
          select: {
            product: {
              where: {
                enabled: true,
              },
            },
          },
        },
      },
      orderBy: {
        product: {
          _count: 'desc',
        },
      },
    });

    return categories ?? null;
  }),
  getTagList: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const tags = await prisma.tag.findMany();

    return tags ?? null;
  }),
  signUpForNewsletter: publicProcedure
    .input(z.object({ email: z.string().email({ message: 'Podaj prawidłowy adres email.' }) }))
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      const { prisma } = ctx;

      try {
        await prisma.newsletter.create({
          data: {
            email,
          },
        });
        return { success: true };
      } catch (error) {
        if (handlePrismaError(error) === 'Object already exists') {
          return { error: true, message: 'Podany użytkownik jest już zapisany.' };
        }
        return { error: true };
      }
    }),
});

export type AppRouter = typeof appRouter;
