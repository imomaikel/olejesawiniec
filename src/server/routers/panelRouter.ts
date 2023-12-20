import { TRPCError } from '@trpc/server';
import { publicProcedure, router } from '../trpc';
import { handlePrismaError } from './errors';
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
					.min(3, { message: 'Tag jest za krótki.' })
					.max(15, { message: 'Tag jest za długi.' }),
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
		.input(z.object({ tagName: z.string().min(3).max(15) }))
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
});
