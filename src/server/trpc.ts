import { initTRPC } from '@trpc/server';
import { Context } from './context';
import prisma from '../lib/prisma';
import SuperJSON from 'superjson';
import { ZodError } from 'zod';

const t = initTRPC.context<Context>().create({
	transformer: SuperJSON,
	errorFormatter(opts) {
		const { shape, error } = opts;
		const errorList =
			error.code === 'BAD_REQUEST' && error.cause instanceof ZodError
				? error.cause.flatten()
				: null;
		return {
			...shape,
			data: {
				...shape.data,
				zodError: errorList,
				zodErrorList: errorList
					? Object.values(errorList.fieldErrors).flat().join(' ')
					: undefined,
			},
		};
	},
});
export const middleware = t.middleware;

const prismaContext = middleware(({ next }) => {
	return next({
		ctx: {
			prisma,
		},
	});
});

export const router = t.router;
export const publicProcedure = t.procedure.use(prismaContext);
