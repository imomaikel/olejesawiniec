'use client';
import { Separator } from '@/components/ui/separator';
import SortProducts from './_components/SortProducts';
import Categories from './_components/Categories';
import Search from './_components/Search';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const ShopPage = () => {
	return (
		<>
			<div className='w-full max-w-screen-2xl mx-auto flex flex-col relative px-8 md:px-12'>
				<Navbar className='relative' textColor='black' topPadding={0} />

				<Separator className='my-4' />

				<Search />
				<Categories />
				<SortProducts />
			</div>
			<Footer />
		</>
	);
};

export default ShopPage;
