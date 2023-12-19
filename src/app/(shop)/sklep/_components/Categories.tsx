import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const Categories = () => {
	return (
		<div className='w-full md:w-[300px]'>
			<div className='flex items-center relative'>
				<div>
					<h3 className='whitespace-nowrap font-medium'>Kategorie</h3>
				</div>
				<div className='border flex-1 mx-2' />
			</div>
			<div className='space-y-2 mt-2'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<Checkbox className='w-6 h-6' id='key1' />
						<Label>Oleje</Label>
					</div>
					<div>
						<span>(10)</span>
					</div>
				</div>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<Checkbox className='w-6 h-6' id='key2' />
						<Label htmlFor='key2'>Mąki</Label>
					</div>
					<div>
						<span>(3)</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Categories;
