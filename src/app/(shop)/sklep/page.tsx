'use client';
import { Separator } from '@/components/ui/separator';
import ScrollButton from '@/components/ScrollButton';
import Categories from './_components/Categories';
import Products from './_components/Products';
import Search from './_components/Search';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Tags from './_components/Tags';
import { Button } from '@/components/ui/button';

const ShopPage = () => {
	return (
		<div className='flex flex-col min-h-screen border justify-between'>
			<div className='w-full max-w-screen-2xl mx-auto flex flex-col relative px-8 md:px-12'>
				<Navbar className='relative' textColor='black' topPadding={0} />

				<Separator className='my-4' />

				<div className='flex space-x-0 md:space-x-12 mb-24'>
					<div className='hidden md:flex flex-col space-y-6'>
						<Search />
						<Categories />
						<Tags />
						<Separator />
						<Button variant='ghost' className='w-full'>
							Wyczyść filtry
						</Button>
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
