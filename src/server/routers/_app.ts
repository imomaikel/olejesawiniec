import { panelRouter } from './panelRouter';
import { shopRouter } from './shopRouter';
import { router } from '../trpc';

export const appRouter = router({
	panel: panelRouter,
	shop: shopRouter,
});

export type AppRouter = typeof appRouter;
