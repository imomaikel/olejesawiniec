import { publicProcedure, router } from '../trpc';
import { panelRouter } from './panelRouter';
import { shopRouter } from './shopRouter';

export const appRouter = router({
	panel: panelRouter,
	shop: shopRouter,

	getCategories: publicProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx;

		const categories = await prisma.category.findMany();

		return categories ?? null;
	}),
});

export type AppRouter = typeof appRouter;
