import { publicProcedure, router } from '../trpc';
import { panelRouter } from './panelRouter';
import { shopRouter } from './shopRouter';
import { z } from 'zod';

export const appRouter = router({
  panel: panelRouter,
  shop: shopRouter,

  getCategories: publicProcedure.query(async ({ ctx }) => {
    const { prisma } = ctx;

    const categories = await prisma.category.findMany({
      select: {
        label: true,
        id: true,
        _count: {
          select: {
            Product: {
              where: {
                enabled: true,
              },
            },
          },
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
  verifyCartItem: publicProcedure
    .input(
      z.object({
        currentQuantity: z.number(),
        variantId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { currentQuantity, variantId } = input;
      const { prisma } = ctx;

      const variant = await prisma.variant.findFirst({
        where: { id: variantId },
      });

      if (!variant) return 'Nieprawidłowy produkt.';

      const newQuantity = currentQuantity + 1;

      if (newQuantity <= variant.stock) {
        return true;
      }
      return 'Brak danej pojemności na magazynie';
    }),
});

export type AppRouter = typeof appRouter;
