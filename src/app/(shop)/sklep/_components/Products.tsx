'use client';
import { TEMP_PRODUCTS } from '@/utils/constans';
import SortProducts from './SortProducts';
import ShopProduct from './ShopProduct';
import { motion } from 'framer-motion';
import React from 'react';

const Products = () => {
	return (
		<div className='flex flex-col w-full space-y-8'>
			<div className='flex items-center justify-between flex-col md:flex-row'>
				<h1 className='text-4xl font-bold'>Nasze Produkty</h1>
				<SortProducts />
			</div>
			<div className='grid gap-5 2xl:gap-10 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 '>
				{[
					...TEMP_PRODUCTS,
					...TEMP_PRODUCTS,
					...TEMP_PRODUCTS,
					...TEMP_PRODUCTS.slice(2),
				].map((product) => (
					<motion.div
						initial={{
							x: 100,
							opacity: 0,
						}}
						whileInView={{
							x: 0,
							opacity: 1,
						}}
						viewport={{ once: true, amount: 0.25 }}
						key={product.label}
					>
						<ShopProduct
							id={product.label}
							image={product.image}
							label={product.label}
							price={product.price}
						/>
					</motion.div>
				))}
			</div>
		</div>
	);
};

export default Products;
