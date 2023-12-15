'use client';
import { container, slideIn, zoomOut } from '@/utils/motion';
import { motion } from 'framer-motion';
import { Button } from './ui/button';

const Hero = () => {
	return (
		<div className='bg-hero bg-no-repeat bg-cover bg-center flex items-center justify-center py-96 px-8relative'>
			<motion.div
				variants={zoomOut(0, 1)}
				initial='hidden'
				whileInView='show'
				className='w-full flex items-center justify-center flex-col max-w-2xl z-10'
			>
				<div className='text-center'>
					<h1 className='text-7xl font-bold uppercase text-white mb-10'>
						Oleje Sawiniec
					</h1>
					<p className='text-white text-center text-2xl font-medium leading-9'>
						Odkryj moc natury w naszych olejach zimnotłoczonych - wyjątkowe
						eliksiry zdrowia, pełne cennych składników odżywczych, które
						wspierają kondycję mózgu, skóry i układu krążenia.
					</p>
				</div>
				<div className='md:space-x-6 translate-y-14 mt-2 flex flex-col md:flex-row md:space-y-0 space-y-6'>
					<motion.div variants={slideIn('left', 'tween', 0, 1)}>
						<Button
							className='rounded-full dark bg-black text-[16px] hover:bg-primary transition-all shadow-md shadow-black/90 hover:shadow-primary/90'
							size='2xl'
							variant='secondary'
						>
							Zobacz Produkty
						</Button>
					</motion.div>
					<motion.div variants={slideIn('right', 'tween', 0, 1)}>
						<Button
							className='uppercase rounded-full text-[16px] hover:bg-black/90 transition-all shadow-md shadow-primary hover:shadow-black/90'
							size='2xl'
						>
							Właściwości Oleju
						</Button>
					</motion.div>
				</div>
			</motion.div>
			<div className='absolute w-full h-full bg-black/50 z-0' />
			<div className='absolute w-[300px] h-[500px] md:ml-20 rotate md:rotate-45 bg-gradient-to-r from-red-600 to-green-500 blur-[200px] opacity-50 md:opacity-70' />
		</div>
	);
};

export default Hero;
