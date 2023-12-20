import ShopProduct from '@/app/(shop)/sklep/_components/ShopProduct';
import { TEMP_PRODUCTS } from '@/utils/constans';

const PanelProductsPage = () => {
	return (
		<div className='flex flex-col space-y-4 w-full'>
			<div>
				<h1 className='text-xl font-bold'>Lista produktów</h1>
				<p className='text-muted-foreground'>
					Kliknij na produkt aby go edytować
				</p>
			</div>
			<div className='grid gap-5 2xl:gap-10 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
				{[
					...TEMP_PRODUCTS,
					...TEMP_PRODUCTS,
					...TEMP_PRODUCTS,
					...TEMP_PRODUCTS.slice(2),
				].map((product) => (
					<div key={product.label}>
						<ShopProduct
							id={product.label}
							image={product.image}
							label={product.label}
							price={product.price}
							editMode
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default PanelProductsPage;
