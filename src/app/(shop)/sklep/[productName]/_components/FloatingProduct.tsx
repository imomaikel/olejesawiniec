'use client';
import { IoStar, IoStarHalf, IoStarOutline } from 'react-icons/io5';
import { Separator } from '@/components/ui/separator';
import { FaCartPlus, FaHeart } from 'react-icons/fa';
import ImageSwiper from '@/components/ImageSwiper';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { formatPrice } from '@/lib/utils';

const MAX_STARS = 6;
const TEMP_PRODUCT_STARS = 4.5;

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
				setScrollY(maxHeight);
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

	const fullStars =
		TEMP_PRODUCT_STARS >= MAX_STARS
			? MAX_STARS
			: Math.floor(TEMP_PRODUCT_STARS);
	const notFullStars = MAX_STARS - fullStars;

	return (
		<div
			className='max-w-sm relative'
			style={{ transform: `translateY(${scrollY}px)` }}
		>
			{/* Title */}
			<div className='mb-1'>
				<h1 className='text-3xl font-bold'>{productName}</h1>
			</div>
			{/* Feedback */}
			<div className='flex items-center mb-1'>
				<div className='flex items-center mr-1'>
					{[...Array.from(Array(fullStars).keys())].map((index) => (
						<IoStar key={`star-${index}`} className='text-orange-400' />
					))}
					{[...Array.from(Array(notFullStars).keys())].map((index) => {
						if (TEMP_PRODUCT_STARS - fullStars >= 0.5 && index == 0)
							return <IoStarHalf className='text-orange-400' />;
						return (
							<IoStarOutline
								key={`star-${index + fullStars}`}
								className='opacity-75'
							/>
						);
					})}
				</div>
				<p className='text-muted-foreground text-xs pt-1'>
					na podstawie 2 ocen
				</p>
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
