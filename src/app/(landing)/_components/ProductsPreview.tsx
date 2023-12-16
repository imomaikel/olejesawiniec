'use client';
import { TEMP_PRODUCTS } from '@/utils/constans';
import { Button } from '@/components/ui/button';
import Product from '@/components/Product';

const ProductsPreview = () => {
	return (
		<div className='py-[115px] px-[35px] bg-gray-100'>
			<div className='w-full flex justify-center flex-col items-center'>
				<div className='mb-6'>
					<h3 className='text-primary tracking-wide font-normal'>
						Nasze Produkty
					</h3>
					<h2 className='text-5xl font-bold leading-[60px]'>
						Oleje Zimnotłoczone
					</h2>
				</div>
				<div className='grid gap-x-8 gap-y-16 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
					{TEMP_PRODUCTS.map((product) => (
						<Product
							key={product.label}
							id={product.label}
							description={product.description}
							image={product.image}
							label={product.label}
							price={product.price}
						/>
					))}
				</div>
				<div className='mt-16'>
					<Button size='2xl' className='rounded-full shadow-md shadow-primary'>
						Zobacz Wszystkie Produkty
					</Button>
				</div>
			</div>
		</div>
	);
};

export default ProductsPreview;
