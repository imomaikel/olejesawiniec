'use client';
import ProductControls from './_components/ProductControls';
import ScrollButton from '@/components/ScrollButton';
import Products from './_components/Products';

const ShopPage = () => {
	return (
		<>
			<div className='flex space-x-0 md:space-x-12 mb-24'>
				<div className='hidden md:flex flex-col space-y-6'>
					<ProductControls />
				</div>
				<div className='flex w-full'>
					<Products />
				</div>
			</div>
			<ScrollButton trackElementIdOrHeight={200} />
		</>
	);
};

export default ShopPage;
