'use client';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { useMobileNav } from '@/hooks/use-mobile-nav';
import { GiHamburgerMenu } from 'react-icons/gi';
import ContentWrapper from './ContentWrapper';
import { NAV_LINKS } from '@/utils/constans';
import { useCart } from '@/hooks/use-cart';
import { slideIn } from '@/utils/motion';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
	const { onOpen: onCartOpen } = useCart();
	const { onOpen: onMobileNavOpen } = useMobileNav();

	return (
		<ContentWrapper className='absolute left-[50%] -translate-x-[50%] py-4 max-w-screen-2xl z-10'>
			<motion.div
				variants={slideIn('bottom', 'spring', 0, 1)}
				initial='hidden'
				whileInView='show'
				className='flex md:justify-between items-center'
				viewport={{ once: true }}
			>
				<div
					className='flex md:hidden ml-4 mr-6'
					role='button'
					onClick={onMobileNavOpen}
				>
					<GiHamburgerMenu className='w-14 h-14 text-white cursor-pointer hover:text-primary transition-colors' />
				</div>
				<div className='cursor-pointer w-[271px] h-[107px] relative	mb-4'>
					<Link href='/'>
						<Image src='/signature.png' fill alt='podpis' />
					</Link>
				</div>
				<div className='text-white hidden md:flex items-center'>
					<ul className='flex space-x-2 lg:space-x-12'>
						{NAV_LINKS.map((entry) => (
							<li key={entry.label}>
								<Button variant='ghost' asChild>
									<Link href={entry.path}>{entry.label}</Link>
								</Button>
							</li>
						))}
					</ul>
					<div
						className='ml-6 flex items-center space-x-2 rounded-full border py-2 px-6 tracking-wide font-medium cursor-pointer transition-colors hover:border-primary'
						onClick={onCartOpen}
						role='button'
					>
						<div className='mt-1'>Koszyk</div>
						<div className='mt-1'>0</div>
						<HiOutlineShoppingBag className='h-6 w-6' />
					</div>
				</div>
			</motion.div>
		</ContentWrapper>
	);
};

export default Navbar;
