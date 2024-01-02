import { publicProcedure, router } from '../trpc';
import { panelRouter } from './panelRouter';
import { shopRouter } from './shopRouter';

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
});

export type AppRouter = typeof appRouter;
