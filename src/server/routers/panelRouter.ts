import { DISALLOWED_PRODUCT_NAMES, PRODUCT_NAME_REGEX } from '@/utils/constans';
import { publicProcedure, router } from '../trpc';
import { handlePrismaError } from './errors';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

type TErrorStatus = {
	status: 'error';
	message?: string;
};
type TSuccessStatus = {
	status: 'success';
	message?: string;
};
type TPanelRouterResponse = TErrorStatus | TSuccessStatus;

export const panelRouter = router({
	createTag: publicProcedure
		.input(
			z.object({
				tagName: z
					.string()
					.min(2, { message: 'Tag jest za krótki.' })
					.max(25, { message: 'Tag jest za długi.' }),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { tagName } = input;
			const { prisma } = ctx;

			let message, status: TPanelRouterResponse['status'];

			try {
				await prisma.tag.create({
					data: {
						label: tagName,
					},
				});
				status = 'success';
				message = `Tag "${tagName}" został utworzony.`;
			} catch (error: any) {
				const translateError = handlePrismaError(error);
				if (translateError === 'Object already exists')
					message = 'Tag już istnieje.';
				status = 'error';
			}

			return {
				message,
				status,
			} as TPanelRouterResponse;
		}),
	removeTag: publicProcedure
		.input(z.object({ tagName: z.string().min(2).max(25) }))
		.mutation(async ({ ctx, input }) => {
			const { tagName } = input;
			const { prisma } = ctx;

			try {
				await prisma.tag.delete({
					where: {
						label: tagName,
					},
				});
				return `Tag "${tagName}" został usunięty.`;
			} catch {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
			}
		}),
	getTagList: publicProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx;

		try {
			const tags = await prisma.tag.findMany();

			return tags;
		} catch {
			throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
		}
	}),
	createProduct: publicProcedure
		.input(
			z.object({
				productName: z
					.string()
					.min(3, { message: 'Nazwa produktu jest za krótka.' })
					.max(30, { message: 'Nazwa produktu jest za długa.' }),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { prisma } = ctx;
			const { productName } = input;

			try {
				let message, status: TPanelRouterResponse['status'];

				const isValid = PRODUCT_NAME_REGEX.test(productName);
				if (!isValid || DISALLOWED_PRODUCT_NAMES.includes(productName)) {
					message = 'Nieprawidłowa nazwa produktu.';
					status = 'error';
				} else {
					const link = productName.toLowerCase().replace(/ /gi, '-');
					let query;
					try {
						query = await prisma.product.create({
							data: {
								label: productName,
								link,
							},
						});
					} catch (error: any) {
						const translateError = handlePrismaError(error);
						if (translateError === 'Object already exists')
							message = `Produkt "${productName}" już istnieje.`;
					}
					if (query?.link) {
						(message = query.link), (status = 'success');
					} else {
						status = 'error';
					}
				}
				return {
					status,
					message,
				} as TPanelRouterResponse;
			} catch {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
			}
		}),
});
