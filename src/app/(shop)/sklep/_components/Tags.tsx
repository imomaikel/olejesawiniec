import { Badge } from '@/components/ui/badge';

const Tags = () => {
	return (
		<div className='w-full md:w-[300px]'>
			<div className='flex items-center relative'>
				<div>
					<h3 className='whitespace-nowrap font-medium'>Właściwości</h3>
				</div>
				<div className='border flex-1 mx-2' />
			</div>
			<div className='flex flex-wrap gap-x-1 gap-y-2 mt-2'>
				<Badge className='rounded-full cursor-pointer' variant='secondary'>
					Witamina D
				</Badge>
				<Badge className='rounded-full cursor-pointer' variant='secondary'>
					Na wątrobe
				</Badge>
				<Badge className='rounded-full cursor-pointer' variant='secondary'>
					Na serce
				</Badge>
				<Badge className='rounded-full cursor-pointer' variant='secondary'>
					Na mózg
				</Badge>
				<Badge className='rounded-full cursor-pointer' variant='secondary'>
					Witamina A
				</Badge>
				<Badge className='rounded-full cursor-pointer' variant='secondary'>
					Na kości
				</Badge>
			</div>
		</div>
	);
};

export default Tags;
