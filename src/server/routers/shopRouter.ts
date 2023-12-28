import { publicProcedure, router } from '../trpc';
import { z } from 'zod';

export const shopRouter = router({
	getProduct: publicProcedure
		.input(z.object({ productName: z.string() }))
		.query(async ({ ctx, input }) => {
			const { productName } = input;
			const { prisma } = ctx;

			const product = await prisma.product.findFirst({
				where: { link: productName, enabled: true },
				include: {
					details: true,
					extraPhotos: true,
					nutritionFact: true,
					tags: true,
					variants: true,
					opinions: true,
					ratings: {
						select: { id: true },
					},
				},
			});

			//  TODO Calculate rating

			return product ?? null;
		}),
	getEnabledProducts: publicProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx;

		const products = await prisma.product.findMany({
			where: { enabled: true },
			include: {
				variants: true,
				tags: true,
				Category: true,
			},
		});
		return products ?? null;
	}),
});
