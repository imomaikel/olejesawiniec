'use client';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { useMobileNav } from '@/hooks/use-mobile-nav';
import { GiHamburgerMenu } from 'react-icons/gi';
import { NAV_LINKS } from '@/utils/constans';
import { useCart } from '@/hooks/use-cart';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
	const { onOpen: onCartOpen } = useCart();
	const { onOpen: onMobileNavOpen } = useMobileNav();

	return (
		<div className='w-full absolute z-20'>
			<motion.div
				initial={{
					y: -200,
					opacity: 0,
				}}
				animate={{
					opacity: 1,
					y: 0,
				}}
				transition={{
					duration: 0.75,
					type: 'tween',
				}}
				viewport={{ once: true }}
				className='w-full min-h-fit max-w-7xl mx-auto pt-6 flex md:justify-between px-10 lg:px-20'
			>
				<div
					className='flex md:hidden ml-4 mr-6 items-center'
					role='button'
					onClick={onMobileNavOpen}
				>
					<GiHamburgerMenu className='w-12 h-12 text-white cursor-pointer hover:text-primary transition-colors' />
				</div>
				<div className='relative'>
					<Link href='/'>
						<Image
							src='/signature.png'
							className='object-contain object-center'
							width={271}
							height={107}
							alt='podpis'
						/>
					</Link>
				</div>
				<div className='items-center text-white hidden md:flex'>
					<ul className='flex space-x-5'>
						{NAV_LINKS.map((entry) => (
							<motion.li
								initial={{
									x: -100,
									opacity: 0,
								}}
								animate={{
									x: 0,
									opacity: 1,
								}}
								key={entry.label}
							>
								<Button variant='ghost' asChild>
									<Link href={entry.path}>{entry.label}</Link>
								</Button>
							</motion.li>
						))}
					</ul>
					<div
						className='ml-6 flex h-min items-center space-x-2 rounded-full border py-2 px-6 tracking-wide font-medium cursor-pointer transition-colors hover:border-primary'
						onClick={onCartOpen}
						role='button'
					>
						<div className='mt-1'>Koszyk</div>
						<div className='mt-1'>0</div>
						<HiOutlineShoppingBag className='h-6 w-6' />
					</div>
				</div>
			</motion.div>
		</div>
	);
};

export default Navbar;
