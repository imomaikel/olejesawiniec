'use client';
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet';
import { useEffect, useState } from 'react';
import { useCart } from '@/hooks/use-cart';

const ShoppingCart = () => {
	const { isOpen, onOpenChange } = useCart();
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => setIsMounted(true), []);

	if (!isMounted) return null;

	return (
		<Sheet onOpenChange={onOpenChange} open={isOpen}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Koszyk</SheetTitle>
					<SheetDescription>
						Produkty które zostały dodane do koszyka
					</SheetDescription>
				</SheetHeader>
			</SheetContent>
		</Sheet>
	);
};

export default ShoppingCart;
