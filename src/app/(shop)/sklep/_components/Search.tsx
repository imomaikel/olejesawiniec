'use client';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';

const Search = () => {
	const searchParams = useSearchParams();
	const pathname = usePathname();
	const router = useRouter();

	const handleSearch = (value: string) => {
		const params = new URLSearchParams(searchParams);
		if (value) {
			params.set('szukaj', value);
		} else {
			params.delete('szukaj');
		}
		router.replace(`${pathname}?${params.toString()}`);
	};

	return (
		<div className='w-full md:w-[300px] relative z-10'>
			<div className='flex items-center relative'>
				<div>
					<h3 className='whitespace-nowrap font-medium'>Szukaj produktu</h3>
				</div>
				<div className='border flex-1 mx-2' />
			</div>
			<div className='my-2'>
				<Input
					placeholder='Wpisz nazwe produktu...'
					onChange={(e) => handleSearch(e.target.value)}
					defaultValue={searchParams.get('szukaj')?.toString()}
				/>
			</div>
			<div className='w-full h-full absolute bg-gradient-to-r from-teal-200 to-lime-200 -z-10 inset-0 blur-[125px]' />
		</div>
	);
};

export default Search;
