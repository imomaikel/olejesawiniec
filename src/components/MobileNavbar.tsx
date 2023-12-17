'use client';
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { HiOutlineShoppingBag } from 'react-icons/hi2';
import { useMobileNav } from '@/hooks/use-mobile-nav';
import { NAV_LINKS } from '@/utils/constans';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/use-cart';
import { Button } from './ui/button';
import Link from 'next/link';

const MobileNavbar = () => {
	const [isMounted, setIsMounted] = useState(false);
	const { isOpen, onOpenChange } = useMobileNav();
	const { onOpen: onCartOpen } = useCart();

	useEffect(() => setIsMounted(true), []);

	if (!isMounted) return null;

	return (
		<Sheet onOpenChange={onOpenChange} open={isOpen}>
			<SheetContent side='left'>
				<SheetHeader>
					<SheetTitle>Menu</SheetTitle>
				</SheetHeader>
				<div>
					<div
						className='flex my-6 items-center rounded-full border py-2 px-6 tracking-wide font-medium cursor-pointer transition-colors hover:border-primary justify-between'
						onClick={() => {
							onOpenChange();
							onCartOpen();
						}}
						role='button'
					>
						<div className='flex'>
							<div className='mt-1 mr-2'>Koszyk</div>
							<div className='mt-1'>0</div>
						</div>
						<HiOutlineShoppingBag className='h-6 w-6' />
					</div>
					<ul className='space-y-3'>
						{NAV_LINKS.map((entry) => (
							<li key={entry.label}>
								<Button variant='ghost' asChild className='w-full'>
									<Link href={entry.path}>{entry.label}</Link>
								</Button>
							</li>
						))}
					</ul>
				</div>
			</SheetContent>
		</Sheet>
	);
};

export default MobileNavbar;
