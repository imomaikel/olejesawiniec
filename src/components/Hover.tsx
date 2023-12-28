import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';

type THover = {
	children: React.ReactNode;
	content: string;
	openDelay?: number;
	closeDelay?: number;
	className?: string;
};
const Hover = ({
	children,
	content,
	closeDelay = 200,
	openDelay = 100,
	className,
}: THover) => {
	return (
		<HoverCard closeDelay={closeDelay} openDelay={openDelay}>
			<HoverCardTrigger>{children}</HoverCardTrigger>
			<HoverCardContent className={cn('max-w-[125px] text-xs', className)}>
				{content}
			</HoverCardContent>
		</HoverCard>
	);
};

export default Hover;
