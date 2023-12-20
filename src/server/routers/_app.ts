import { panelRouter } from './panelRouter';
import { router } from '../trpc';

export const appRouter = router({
	panel: panelRouter,
});

export type AppRouter = typeof appRouter;
