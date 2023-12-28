'use client';
import { TCartItem, useCart } from '@/hooks/use-cart';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { FaBottleDroplet } from 'react-icons/fa6';
import { BsCartDash } from 'react-icons/bs';
import { formatPrice } from '@/lib/utils';
import { BsDot } from 'react-icons/bs';
import { Button } from './ui/button';
import Image from 'next/image';
import Link from 'next/link';
import Hover from './Hover';

const CartItem = ({
	image,
	productLabel,
	productLink,
	quantity,
	variantCapacity,
	variantUnit,
	variantPrice,
	variantId,
}: TCartItem) => {
	const { removeProduct } = useCart();

	return (
		<div className='px-1 py-2 flex bg-gray-100 rounded-md relative space-x-1'>
			<div className='flex items-center justify-center'>
				{image ? (
					<Image src={image} width={64} height={64} alt='produkt' />
				) : (
					<FaBottleDroplet className='w-16 h-16' />
				)}
			</div>
			<div className='flex flex-1'>
				<div className='flex flex-col'>
					<span className='text-lg font-medium'>{productLabel}</span>
					<div className='flex items-center text-sm text-muted-foreground'>
						<span>
							{variantCapacity}
							{variantUnit}
						</span>
						<BsDot className='w-4 h-4' />
						<span>{formatPrice(variantPrice)}</span>
					</div>
					<div className='text-muted-foreground text-sm'>
						<span>{quantity} szt.</span>
					</div>
					<div>
						<Button asChild size='sm' variant='ghost' className='px-0 py-0'>
							<Link href={productLink}>
								Zobacz produkt
								<FaExternalLinkAlt className='ml-1 h-3 w-3' />
							</Link>
						</Button>
					</div>
				</div>
			</div>
			<Hover content='Usuń z koszyka'>
				<div
					className='bg-destructive/75 absolute right-0 top-0 h-full w-10 flex items-center justify-center rounded-tr-md rounded-br-md transition-colors hover:bg-destructive cursor-pointer'
					onClick={() => removeProduct(variantId)}
				>
					<BsCartDash className='h-6 w-6' />
				</div>
			</Hover>
		</div>
	);
};

export default CartItem;
