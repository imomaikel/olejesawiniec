'use client';
import { Separator } from '@/components/ui/separator';
import { FaCartPlus, FaHeart } from 'react-icons/fa';
import ImageSwiper from '@/components/ImageSwiper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';

type TProductVariant = {
	price: number;
	size: number;
	unit: string;
};
type TFloatingProduct = {
	productName: string;
	imageUrls: string[];
	tags?: string[];
	selectedSize: number;
	selectedPrice: number;
	variants: TProductVariant[];
};
const FloatingProduct = ({
	imageUrls,
	productName,
	tags,
	selectedPrice,
}: TFloatingProduct) => {
	const [scrollY, setScrollY] = useState(0);

	useEffect(() => {
		const footerHeight = document.getElementById('footer')?.offsetHeight;
		if (!footerHeight) return;
		const maxHeight = window.innerHeight - footerHeight + 84;

		const handleScroll = () => {
			if (window.innerWidth < 768) return;
			if (window.scrollY >= maxHeight) {
				if (maxHeight !== scrollY) setScrollY(maxHeight);
				return;
			}
			setScrollY(window.scrollY);
		};
		handleScroll();

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<div
			className='max-w-sm relative'
			style={{ transform: `translateY(${scrollY}px)` }}
		>
			{/* Title */}
			<div className='mb-1'>
				<h1 className='text-3xl font-bold'>{productName}</h1>
			</div>
			{/* Image */}
			<div>
				<ImageSwiper alt='olej' urls={imageUrls} fullSizeOnClick />
			</div>
			{/* Tags */}
			<div className='flex flex-wrap gap-1 mt-3 items-center justify-center'>
				{tags && tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}
			</div>
			<Separator className='my-4' />
			{/* Actions */}
			<div className='space-y-3'>
				<Button
					size='xl'
					className='w-full rounded-full font-bold transition-transform hover:scale-110'
				>
					<FaCartPlus className='h-8 w-8 mr-4' />
					Dodaj do koszyka ({formatPrice(selectedPrice)})
				</Button>
				<Button
					size='lg'
					className='w-full rounded-full font-bold'
					variant='pink'
				>
					<FaHeart className='h-6 w-6 mr-4' />
					Dodaj do listy życzeń
				</Button>
			</div>
		</div>
	);
};

export default FloatingProduct;
