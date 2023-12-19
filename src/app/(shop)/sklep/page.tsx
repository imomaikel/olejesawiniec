'use client';
import ProductControls from './_components/ProductControls';
import { Separator } from '@/components/ui/separator';
import ScrollButton from '@/components/ScrollButton';
import Products from './_components/Products';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const ShopPage = () => {
	return (
		<div className='flex flex-col min-h-screen border justify-between'>
			<div className='w-full max-w-screen-2xl mx-auto flex flex-col relative px-8 md:px-12'>
				<Navbar className='relative mt-4' textColor='black' topPadding={0} />

				<Separator className='my-4' />

				<div className='flex space-x-0 md:space-x-12 mb-24'>
					<div className='hidden md:flex flex-col space-y-6'>
						<ProductControls />
					</div>
					<div className='flex w-full'>
						<Products />
					</div>
				</div>
				<ScrollButton trackElementIdOrHeight={200} />
			</div>
			<Footer />
		</div>
	);
};

export default ShopPage;
