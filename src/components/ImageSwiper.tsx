'use client';
import { FaArrowAltCircleLeft } from 'react-icons/fa';
import { FaArrowCircleRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useEffect, useState } from 'react';
import { Pagination } from 'swiper/modules';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import TSwiper from 'swiper';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';

type TImageSwiper = {
	urls: string[];
	alt: string;
	className?: string;
	caption?: string;
	captionLink?: string;
};
const ImageSwiper = ({
	urls,
	alt,
	className,
	caption,
	captionLink,
}: TImageSwiper) => {
	const [swiper, setSwiper] = useState<null | TSwiper>(null);
	const [controls, setControls] = useState({
		isStart: true,
		isEnd: urls.length >= 2 ? false : true,
	});

	const imageCount = urls.length;

	useEffect(() => {
		swiper?.on('slideChange', ({ activeIndex }) => {
			const currentIndex = activeIndex + 1;
			setControls({
				isStart: currentIndex === 1,
				isEnd: currentIndex === imageCount,
			});
		});
	}, [swiper, imageCount]);

	return (
		<div className={cn('h-96 w-full relative', className)}>
			<div
				className={cn(
					'absolute z-20 top-1/2 -translate-y-1/2 -left-4 cursor-pointer hover:text-primary transition-colors block',
					controls.isStart && 'hidden'
				)}
				role='button'
				onClick={() => swiper?.slidePrev()}
			>
				<FaArrowAltCircleLeft className='h-8 w-8' />
				<div className='h-7 w-7 absolute left-[2px] top-[2px] rounded-full bg-white -z-10' />
			</div>
			<div
				className={cn(
					'absolute z-20 top-1/2 -translate-y-1/2 -right-4 cursor-pointer hover:text-primary transition-colors block',
					controls.isEnd && 'hidden'
				)}
				role='button'
				onClick={() => swiper?.slideNext()}
			>
				<FaArrowCircleRight className='h-8 w-8' />
				<div className='h-7 w-7 absolute left-[2px] top-[2px] rounded-full bg-white -z-10' />
			</div>
			<Swiper
				modules={[Pagination]}
				onSwiper={setSwiper}
				className='h-full w-full bg-gray-200 rounded-lg select-none shadow-2xl cursor-grab'
			>
				{urls.map((url) => (
					<SwiperSlide key={url} className='w-full relative h-full'>
						<Image
							loading='eager'
							alt={alt}
							src={url}
							className='w-full h-full object-cover object-center rounded-lg'
							fill
						/>
					</SwiperSlide>
				))}
			</Swiper>
			{caption && (
				<div className='text-muted-foreground mt-2 text-center'>
					{captionLink ? (
						<Link href={captionLink} className='hover:underline'>
							{caption}
						</Link>
					) : (
						caption
					)}
				</div>
			)}
		</div>
	);
};

export default ImageSwiper;
