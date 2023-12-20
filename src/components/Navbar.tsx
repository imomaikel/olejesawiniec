'use client';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { useMobileNav } from '@/hooks/use-mobile-nav';
import { GiHamburgerMenu } from 'react-icons/gi';
import { usePathname } from 'next/navigation';
import { NAV_LINKS } from '@/utils/constans';
import { useCart } from '@/hooks/use-cart';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

type TNavbar = {
	className?: string;
	textColor?: 'white' | 'black';
	topPadding?: number;
};
const Navbar = ({ className, textColor, topPadding }: TNavbar) => {
	const { onOpen: onMobileNavOpen } = useMobileNav();
	const { onOpen: onCartOpen } = useCart();
	const pathname = usePathname();

	const signatureImageUrl = pathname.startsWith('/sklep/')
		? '/sklep'
		: pathname.startsWith('/panel')
		? '/panel'
		: '/';

	return (
		<div className={cn('w-full absolute z-20', className)}>
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
					duration: 0.5,
					type: 'tween',
				}}
				viewport={{ once: true }}
				className={cn(
					'w-full min-h-fit max-w-7xl mx-auto flex justify-between lg:px-20',
					topPadding !== undefined ? `pt-${topPadding}` : 'pt-6'
				)}
			>
				<div
					className='flex md:hidden items-center'
					role='button'
					onClick={onMobileNavOpen}
				>
					<GiHamburgerMenu
						className={cn(
							'w-12 h-12 cursor-pointer hover:text-primary transition-colors',
							textColor === 'black' ? 'text-black' : 'text-white'
						)}
					/>
				</div>
				<div className='relative'>
					<Link href={signatureImageUrl}>
						<Image
							src={
								textColor === 'black' ? '/signatureBlack.png' : '/signature.png'
							}
							className='object-contain object-center'
							width={271}
							loading='eager'
							height={107}
							alt='podpis'
						/>
					</Link>
				</div>
				<div
					className={cn(
						'items-center text-white hidden md:flex',
						textColor === 'black' ? 'text-black' : 'text-white'
					)}
				>
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
