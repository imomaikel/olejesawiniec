'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppRouter } from '../../server/routers/_app';
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { useState, ReactNode } from 'react';
import SuperJSON from 'superjson';

export const trpc = createTRPCReact<AppRouter>();

export function TRPCProvider({ children }: { children: ReactNode }) {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						networkMode:
							process.env.NODE_ENV === 'development' ? 'always' : 'online',
					},
					mutations: {
						networkMode:
							process.env.NODE_ENV === 'development' ? 'always' : 'online',
					},
				},
			})
	);
	const [trpcClient] = useState(() =>
		trpc.createClient({
			transformer: SuperJSON,
			links: [
				httpBatchLink({
					url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
					fetch(url, options) {
						return fetch(url, {
							...options,
							credentials: 'include',
						});
					},
				}),
			],
		})
	);

	return (
		<trpc.Provider client={trpcClient} queryClient={queryClient}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</trpc.Provider>
	);
}
