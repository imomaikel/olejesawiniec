'use client';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

const ProductPhotos = () => {
	return (
		<div className='pt-[165px] px-9 pb-[165px] flex relative' id='photos'>
			<div className='w-full flex justify-center px-24'>
				<div className='space-y-8 max-w-md'>
					<h3 className='text-primary tracking-wide font-normal'>
						Ręcznie Wytwarzany Olej
					</h3>
					<h2 className='text-5xl font-bold leading-[60px]'>
						Wyjątkowość w Każdej Butelce
					</h2>
					<p>
						Każda butelka tego wyjątkowego produktu jest rezultatem ręcznej
						pracy i starannie wyselekcjonowanych składników, co gwarantuje
						najwyższą jakość i unikalny smak.
					</p>
					<Button
						className='rounded-full px-6 py-2 shadow-md shadow-primary'
						size='lg'
					>
						Więcej
					</Button>
				</div>
				<div className='flex gap-x-2'>
					<div>
						<Image
							alt='olej'
							src='/product1.jpg'
							height={1024}
							width={1024}
							className='w-max h-max'
						/>
					</div>
					<div>
						<Image
							alt='olej'
							src='/product1.jpg'
							height={1024}
							width={1024}
							className='w-max h-max'
						/>
					</div>
					<div>
						<Image
							alt='olej'
							src='/product1.jpg'
							height={1024}
							width={1024}
							className='w-max h-max'
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ProductPhotos;
