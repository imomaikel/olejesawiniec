'use client';
import { motion, useAnimationControls } from 'framer-motion';
import { formatPrice } from '@/lib/utils';
import { slideIn } from '@/utils/motion';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';

type TProduct = {
	id: string;
	label: string;
	image: string;
	price: number;
	description: string[];
};
const Product = ({ id, description, image, label, price }: TProduct) => {
	const controls = useAnimationControls();
	const handleOpen = () => {
		document.body.style.overflowY = 'hidden';
		controls.start('show');
	};
	const handleClose = () => {
		document.body.style.overflowY = 'auto';
		controls.start('hidden');
	};

	return (
		<>
			<div className='shadow-2xl group overflow-hidden bg-white rounded-xl'>
				<div className='w-[300px] h-[300px] relative flex flex-col items-center'>
					<Image
						src={image}
						alt='produkt'
						fill
						className='group-hover:-translate-x-1/4 transition-transform'
					/>
					<div className='absolute right-2 p-6 hidden group-hover:flex flex-col'>
						<div className='space-y-4 opacity-0 group-hover:opacity-100 transition-all'>
							<div>
								<Button className='w-full' asChild>
									<Link href={`/olej-${id}`}>Właściwości</Link>
								</Button>
							</div>
							<div>
								<Button className='w-full' onClick={handleOpen}>
									Szczegóły
								</Button>
							</div>
							<div>
								<Button className='w-full'>Do koszyka</Button>
							</div>
						</div>
					</div>
				</div>
				<div className='py-2 px-4 text-center flex justify-between'>
					<span className='font-medium'>{label}</span>
					<div className='border flex flex-1 h-[1px] my-auto mx-4' />
					<span className='text-primary font-bold'>{formatPrice(price)}</span>
				</div>
			</div>
			<motion.div
				variants={slideIn('top', 'spring', 0, 0.75)}
				className='fixed left-0 top-0 z-20 w-screen h-screen'
				initial='hidden'
				animate={controls}
			>
				<div className='absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-6 border-2 rounded-lg bg-background'>
					<div className='flex'>
						<div className='w-[300px] max-w-[300px] max-h-[300px] h-[300px]'>
							<Image alt='olej' src={image} width={300} height={300} />
						</div>
						<div className='h-[300px] w-[1px] bg-black/20' />
						<div className='flex flex-col px-6 space-y-2'>
							<div className='text-2xl font-medium'>{label}</div>
							<div className='text-primary text-3xl font-bold'>
								{formatPrice(price)}
							</div>
							<ul>
								{description.map((entry) => (
									<li key={entry}>{entry}</li>
								))}
							</ul>
							<div className='flex space-x-4'>
								<Button className='w-full rounded-full py-4'>
									Dodaj do koszyka
								</Button>
								<Button
									className='flex flex-0.5'
									variant='ghost'
									onClick={handleClose}
								>
									Zamknij
								</Button>
							</div>
						</div>
					</div>
				</div>
				<motion.div
					className='relative w-full h-full bg-background/60 backdrop-blur-sm'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 2, duration: 5, ease: 'easeOut' }}
					onClick={handleClose}
				/>
			</motion.div>
		</>
	);
};

export default Product;
