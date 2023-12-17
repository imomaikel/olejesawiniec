import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type TSectionInfo = {
	smallTitle: string;
	bigTitle: string;
	description?: string;
	buttonText?: string;
	className?: string;
};
const SectionInfo = ({
	bigTitle,
	smallTitle,
	buttonText,
	description,
	className,
}: TSectionInfo) => {
	return (
		<div
			className={cn(
				'w-full flex flex-col justify-center items-center relative z-10',
				className
			)}
		>
			<div className=' relative z-10'>
				<h3 className='text-primary tracking-wide font-normal mb-2'>
					{smallTitle}
				</h3>
				<h2 className='text-4xl md:text-5xl font-bold whitespace-pre-wrap !leading-[65px]'>
					{bigTitle}
				</h2>
			</div>
			{description && <p className='my-4 relative z-10'>{description}</p>}
			{buttonText && (
				<div className='max-w-sm mr-auto'>
					<Button
						className='rounded-full px-6 py-2 shadow-md shadow-primary w-[200px] relative z-10'
						size='2xl'
					>
						{buttonText}
					</Button>
				</div>
			)}
			<div className='bg-gradient-to-r from-yellow-200 via-green-200 to-green-500 absolute w-3/4 h-3/4 blur-[175px] z-0' />
		</div>
	);
};

export default SectionInfo;
