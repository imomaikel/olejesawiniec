import {
	DISALLOWED_PRODUCT_NAMES,
	PRODUCT_NAME_REGEX,
	REPLACE_LETTERS,
} from '@/utils/constans';
import { PanelVariantProductValidator } from '@/lib/validators/panel';
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

const PRODUCT_NAME_MIN_LENGTH = 3;
const PRODUCT_NAME_MAX_LENGTH = 30;

const TAG_MIN_LENGTH = 2;
const TAG_MAX_LENGTH = 25;

export const panelRouter = router({
	createTag: publicProcedure
		.input(
			z.object({
				tagName: z
					.string()
					.min(TAG_MIN_LENGTH, { message: 'Tag jest za krótki.' })
					.max(TAG_MAX_LENGTH, { message: 'Tag jest za długi.' }),
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
		.input(
			z.object({ tagName: z.string().min(TAG_MIN_LENGTH).max(TAG_MAX_LENGTH) })
		)
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
					.min(PRODUCT_NAME_MIN_LENGTH, {
						message: 'Nazwa produktu jest za krótka.',
					})
					.max(PRODUCT_NAME_MAX_LENGTH, {
						message: 'Nazwa produktu jest za długa.',
					}),
			})
		)
		.mutation(async ({ ctx, input }) => {
			let { productName } = input;
			const { prisma } = ctx;

			REPLACE_LETTERS.forEach((letter) =>
				productName.replaceAll(letter.from, letter.to)
			);

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
	getProductInfo: publicProcedure
		.input(z.object({ productLink: z.string() }))
		.query(async ({ ctx, input }) => {
			const { productLink } = input;
			const { prisma } = ctx;

			try {
				const product = await prisma.product.findFirst({
					where: { link: productLink },
					include: {
						details: true,
						extraPhotos: true,
						nutritionFact: true,
						tags: true,
						variants: true,
					},
				});

				return product ?? null;
			} catch {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
			}
		}),
	appendTag: publicProcedure
		.input(
			z.object({
				productId: z.string(),
				tagId: z.number(),
				tagLabel: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { productId, tagId, tagLabel } = input;
			const { prisma } = ctx;

			let message, status: TPanelRouterResponse['status'];

			try {
				await prisma.product.update({
					where: {
						id: productId,

						tags: {
							none: {
								id: {
									equals: tagId,
								},
							},
						},
					},
					data: {
						tags: {
							connect: { id: tagId },
						},
					},
				});
				message = `Dodano tag "${tagLabel}"`;
				status = 'success';
			} catch (error: any) {
				status = 'error';
				const translateError = handlePrismaError(error);
				if (translateError === 'Object already exists') {
					message = `Tag "${tagLabel}" jest już dodany`;
				}
			}
			return {
				status,
				message,
			} as TPanelRouterResponse;
		}),
	detachTag: publicProcedure
		.input(
			z.object({
				productId: z.string(),
				tagId: z.number(),
				tagLabel: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { productId, tagId, tagLabel } = input;
			const { prisma } = ctx;

			try {
				await prisma.product.update({
					where: { id: productId },
					data: {
						tags: {
							disconnect: { id: tagId },
						},
					},
				});
				return `Usunięto tag "${tagLabel}"`;
			} catch {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
			}
		}),
	createVariant: publicProcedure
		.input(PanelVariantProductValidator)
		.mutation(async ({ ctx, input }) => {
			const { options, productId } = input;
			const { capacity, price, stock, unit } = options;
			const { prisma } = ctx;

			let message, status: TPanelRouterResponse['status'];

			try {
				await prisma.product.update({
					where: { id: productId },
					data: {
						variants: {
							create: { capacity, price, stock: stock ?? 0, unit },
						},
					},
				});
				status = 'success';
				message = `Dodano opcję "${capacity}${unit}"`;
			} catch (error: any) {
				status = 'error';
				const translateError = handlePrismaError(error);
				if (translateError === 'Object already exists') {
					message = `Opcja "${capacity}${unit}" już istnieje`;
				}
			}
			return {
				status,
				message,
			} as TPanelRouterResponse;
		}),
	removeVariant: publicProcedure
		.input(
			z.object({
				variantId: z.string(),
				productId: z.string(),
				capacityUnit: z.string(),
			})
		)
		.mutation(async ({ ctx, input }) => {
			const { capacityUnit, variantId } = input;
			const { prisma } = ctx;

			try {
				await prisma.variant.delete({
					where: { id: variantId },
				});
				return `Opcja "${capacityUnit}" została usunięta`;
			} catch (err) {
				throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' });
			}
		}),
	getAllProducts: publicProcedure.query(async ({ ctx }) => {
		const { prisma } = ctx;

		return await prisma.product.findMany({
			select: {
				link: true,
				mainPhoto: true,
				label: true,
				variants: true,
			},
		});
	}),
});
