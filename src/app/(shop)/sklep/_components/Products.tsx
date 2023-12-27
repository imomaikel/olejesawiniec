'use client';
import { trpc } from '@/components/providers/TRPC';
import { REPLACE_LETTERS } from '@/utils/constans';
import { useSearchParams } from 'next/navigation';
import SortProducts from './SortProducts';
import ShopProduct from './ShopProduct';

const Products = () => {
	const searchParams = useSearchParams();

	const categories = searchParams.getAll('kategoria');
	const filterValue = searchParams.get('nazwa');
	const tags = searchParams.getAll('tag');

	let filter = filterValue?.replace(/ /gi, '');
	if (filter) {
		REPLACE_LETTERS.forEach(
			(letter) => (filter = filter!.replaceAll(letter.from, letter.to))
		);
	}

	const { data: products, isLoading } = trpc.shop.getEnabledProducts.useQuery(
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
				{isLoading &&
					[...Array.from(Array(9).keys())].map((index) => (
						<ShopProduct.Skeleton key={`skeleton-${index}`} />
					))}
				{products &&
					products?.length >= 1 &&
					products
						.filter(({ link }) =>
							link
								.toLowerCase()
								.replace(/-/gi, '')
								.includes(filter ?? '')
						)
						.filter((product) => {
							if (tags.length <= 0) return true;
							if (!product.tags) return false;

							if (product.tags.some((entry) => tags.includes(entry.label)))
								return true;
							return false;
						})
						.filter((product) => {
							if (categories.length <= 0) return true;

							if (categories.includes(product.category.label)) return true;
							return false;
						})
						.map((product) => {
							const { label, link, mainPhoto, variants } = product;
							variants.sort((a, b) => b.price - a.price);
							if (!variants[0]) return;
							const lowestPrice = variants[0].price;
							return (
								<ShopProduct
									label={label}
									image={mainPhoto ?? ''}
									link={link}
									key={link}
									price={lowestPrice}
								/>
							);
						})}
				{!isLoading &&
					(!products || products.length <= 0) &&
					'Brak dostępnych produktów'}
			</div>
		</div>
	);
};

export default Products;
