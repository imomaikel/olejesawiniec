'use client';
import { trpc } from '@/components/providers/TRPC';
import SortProducts from './SortProducts';
import ShopProduct from './ShopProduct';

const Products = () => {
	// TODO Change router
	const { data: products, isLoading } = trpc.panel.getAllProducts.useQuery(
		undefined,
		{
			refetchOnWindowFocus: false,
		}
	);

	return (
		<div className='flex flex-col w-full space-y-8'>
			<div className='flex items-center justify-between flex-col md:flex-row'>
				<h1 className='text-4xl font-bold'>Nasze Produkty</h1>
				<SortProducts />
			</div>
			<div className='grid gap-5 2xl:gap-10 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 '>
				{isLoading
					? 'Ładowanie'
					: products
					? products.map((product) => {
							const { label, link, mainPhoto, variants } = product;
							variants.sort((a, b) => b.price - a.price);
							if (!variants[0]) return;
							const lowestPrice = variants[0].price;
							console.log(label);
							return (
								<ShopProduct
									label={label}
									image={mainPhoto ?? ''}
									link={link}
									key={link}
									price={lowestPrice}
								/>
							);
					  })
					: 'Brak produktów'}
			</div>
		</div>
	);
};

export default Products;
