'use client';
import ContentWrapper from '@/components/ContentWrapper';
import { Button } from '@/components/ui/button';
import { slideIn } from '@/utils/motion';
import { motion } from 'framer-motion';
import Image from 'next/image';
import SectionInfo from './SectionInfo';

const ProductPhotos = () => {
	return (
		<ContentWrapper
			className='flex-col xl:flex-row justify-center md:space-x-2'
			moreSpace
			id='zdjecia'
		>
			<motion.div
				initial='hidden'
				whileInView='show'
				viewport={{ once: true }}
				variants={slideIn('left', 'tween', 0, 0.75)}
				className='space-y-8 w-full mb-6 flex flex-col md:max-w-lg lg:max-w-sm lg:mr-6'
			>
				<SectionInfo
					smallTitle='Ręcznie Wytwarzany Olej'
					bigTitle='Wyjątkowość w Każdej Butelce'
					description='Każda butelka tego wyjątkowego produktu jest rezultatem ręcznej pracy i
					starannie wyselekcjonowanych składników, co gwarantuje najwyższą jakość
					i unikalny smak.'
					buttonText='Więcej'
				/>
			</motion.div>
			<div className='flex flex-col space-y-4 lg:space-y-0 lg:flex-row space-x-0 lg:space-x-3 max-w-7xl justify-center'>
				<motion.div
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					variants={slideIn('right', 'spring', 0.2, 1)}
					className='lg:pt-6'
				>
					<Image
						src='/product1.jpg'
						alt='produkt'
						width={0}
						height={0}
						sizes='100vw'
						className='w-full h-full object-cover rounded-md'
					/>
				</motion.div>
				<motion.div
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					variants={slideIn('right', 'spring', 0.4, 1)}
					className='lg:pt-24 lg:pb-4 lg:mb-4'
				>
					<Image
						src='/product1.jpg'
						alt='produkt'
						width={0}
						height={0}
						sizes='100vw'
						className='w-full h-full object-cover rounded-md'
					/>
				</motion.div>
				<motion.div
					initial='hidden'
					whileInView='show'
					viewport={{ once: true }}
					variants={slideIn('right', 'spring', 0.6, 1)}
					className='lg:pt-12 lg:pb-2'
				>
					<Image
						src='/product1.jpg'
						alt='produkt'
						width={0}
						height={0}
						sizes='100vw'
						className='w-full h-full object-cover rounded-md'
					/>
				</motion.div>
			</div>
		</ContentWrapper>
	);
};

export default ProductPhotos;
