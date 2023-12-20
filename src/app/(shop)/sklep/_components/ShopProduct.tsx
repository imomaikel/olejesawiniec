'use client';
import { Skeleton } from '@/components/ui/skeleton';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type TShopProduct = {
	id: string;
	label: string;
	image: string;
	price: number;
	editMode?: boolean;
};
const ShopProduct = ({ id, image, label, price, editMode }: TShopProduct) => {
	const productLink = editMode ? `/panel/produkty/${id}` : `/sklep/${id}`;

	return (
		<Link href={productLink}>
			<div className='shadow-2xl overflow-hidden bg-white rounded-xl hover:scale-105 transition-transform cursor-pointer ring-1 ring-primary/10 z-20 hover:z-10 relative'>
				<div className='w-auto h-[300px] relative flex flex-col items-center'>
					<Image
						src={image}
						alt='produkt'
						loading='eager'
						fill
						className='object-contain object-center'
					/>
				</div>
				<div className='py-2 px-4 text-center flex flex-col  justify-between'>
					<span className='font-medium tracking-wide mb-1'>{label}</span>
					{!editMode && (
						<span className='text-primary font-bold'>{formatPrice(price)}</span>
					)}
				</div>
			</div>
		</Link>
	);
};

ShopProduct.Skeleton = function ShowSkeleton() {
	return (
		<div className='shadow-2xl overflow-hidden bg-white rounded-xl hover:scale-105 transition-transform cursor-pointer ring-1 ring-primary/10 z-20 hover:z-10 relative'>
			<Skeleton className='w-auto h-[300px] relative flex flex-col items-center' />
			<div className='py-2 px-4 text-center flex flex-col  justify-between'>
				<Skeleton className='h-6 w-3/4 mx-auto mb-1' />
				<Skeleton className='h-6 w-1/4 mx-auto' />
			</div>
		</div>
	);
};

export default ShopProduct;
