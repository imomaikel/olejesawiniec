import * as trpcNext from '@trpc/server/adapters/next';

interface CreateContextOptions {}

export async function createContextInner(_opts: CreateContextOptions) {
	return {};
}

export type Context = Awaited<ReturnType<typeof createContextInner>>;

export async function createContext(
	opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
	return await createContextInner(opts);
}
