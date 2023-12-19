import { PopoverClose, PopoverTrigger } from '@radix-ui/react-popover';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { FaSortAlphaDown } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const SortProducts = () => {
	return (
		<div className='flex items-center space-x-1'>
			<span className='text-muted-foreground'>Sortuj według:</span>
			<span className='capitalize font-bold'>Popularność</span>
			<Popover>
				<PopoverTrigger asChild>
					<Button size='icon'>
						<FaSortAlphaDown className='h-6 w-6' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-[200px]'>
					<div className='space-y-2'>
						<div className='flex items-center space-x-2'>
							<Checkbox className='w-6 h-6' id='key1' />
							<Label htmlFor='key1'>Popularność</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<Checkbox className='w-6 h-6' id='key2' />
							<Label htmlFor='key2'>Alfabetycznie</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<Checkbox className='w-6 h-6' id='key3' />
							<Label htmlFor='key3'>Cena rosnąco</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<Checkbox className='w-6 h-6' id='key4' />
							<Label htmlFor='key4'>Cena malejąco</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<Checkbox className='w-6 h-6' id='key4' />
							<Label htmlFor='key4'>Nowości</Label>
						</div>
						<div className='flex items-center space-x-2'>
							<Checkbox className='w-6 h-6' id='key4' />
							<Label htmlFor='key4'>Opinie</Label>
						</div>
					</div>
					<div className='mt-3'>
						<PopoverClose asChild>
							<Button variant='ghost' className='w-full'>
								Zamknij
							</Button>
						</PopoverClose>
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
};

export default SortProducts;
