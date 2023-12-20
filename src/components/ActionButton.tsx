'use client';
import { ImSpinner9 } from 'react-icons/im';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

type TActionButton = {
	children: React.ReactNode;
	disabled?: boolean;
	variant?:
		| 'default'
		| 'destructive'
		| 'outline'
		| 'secondary'
		| 'link'
		| 'ghost';
	onClick?: () => void;
	size?: 'sm' | 'lg' | 'icon' | 'xl' | '2xl';
	className?: string;
};
const ActionButton = ({
	disabled,
	children,
	variant,
	onClick,
	className,
	size,
}: TActionButton) => {
	if (disabled) {
		return (
			<Button
				disabled
				variant={variant}
				className={cn('min-w-[220px]', className)}
				size={size}
			>
				<ImSpinner9 className='animate-spin mr-2' />
				Proszę czekać
			</Button>
		);
	}

	return (
		<Button
			variant={variant}
			onClick={onClick}
			className={cn('min-w-[220px]', className)}
			size={size}
		>
			{children}
		</Button>
	);
};

export default ActionButton;
