import { cn } from '@/lib/utils';

type TContentWrapper = {
	children: React.ReactNode;
	className?: string;
};
const ContentWrapper = ({ children, className }: TContentWrapper) => {
	return (
		<div
			className={cn('w-full mx-auto max-w-screen-xl px-2 md:px-16', className)}
		>
			{children}
		</div>
	);
};

export default ContentWrapper;
