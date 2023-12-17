import { cn } from '@/lib/utils';

type TContentWrapper = {
	children: React.ReactNode;
	className?: string;
	id?: string;
	moreSpace?: boolean;
};
const ContentWrapper = ({
	children,
	className,
	id,
	moreSpace,
}: TContentWrapper) => {
	return (
		<div
			className={cn(
				'py-24 px-8 md:px-12 flex relative max-w-[1920px] mx-auto',
				className,
				moreSpace && 'py-36'
			)}
			id={id}
		>
			{children}
		</div>
	);
};

export default ContentWrapper;
