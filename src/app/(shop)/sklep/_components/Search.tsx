import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const Search = () => {
	return (
		<div className='w-full md:w-[300px] relative z-10'>
			<div className='flex items-center relative'>
				<div>
					<h3 className='whitespace-nowrap font-medium'>Szukaj produktu</h3>
				</div>
				<div className='border flex-1 mx-2' />
			</div>
			<div className='my-2'>
				<Input placeholder='Wpisz nazwe produktu...' />
			</div>
			<div>
				<Button size='lg' className='w-full rounded-full'>
					Szukaj
				</Button>
			</div>
			<div className='w-full h-full absolute bg-gradient-to-r from-teal-200 to-lime-200 -z-10 inset-0 blur-[125px]' />
		</div>
	);
};

export default Search;
