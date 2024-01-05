import { TRPCError, initTRPC } from '@trpc/server';
import { Context } from './context';
import prisma from '../lib/prisma';
import SuperJSON from 'superjson';
import { ZodError } from 'zod';
import { auth } from '@/auth';

const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter(opts) {
    const { shape, error } = opts;
    const errorList = error.code === 'BAD_REQUEST' && error.cause instanceof ZodError ? error.cause.flatten() : null;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: errorList,
        zodErrorList: errorList ? Object.values(errorList.fieldErrors).flat().join(' ') : undefined,
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

const panelAuth = middleware(async ({ next }) => {
  const session = await auth();
  const role = session?.user.role;

  if (!(role === 'ADMIN' || role === 'SUPPORT')) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      prisma,
    },
  });
});

const loggedIn = middleware(async ({ next }) => {
  const session = await auth();

  if (!session?.user.id) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      prisma,
      user: session.user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure.use(prismaContext);
export const panelProcedure = t.procedure.use(panelAuth);
export const loggedInProcedure = t.procedure.use(loggedIn);
