'use client';
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { errorToast, successToast } from '@/lib/utils';
import ActionButton from '@/components/ActionButton';
import { trpc } from '@/components/providers/TRPC';
import { Product, Variant } from '@prisma/client';
import { Button } from '@/components/ui/button';
import ProductStatus from '../ProductStatus';
import { useRouter } from 'next/navigation';
import { FaTools } from 'react-icons/fa';
import { useState } from 'react';
import Link from 'next/link';

type TProductManager = {
	product: Product & {
		variants: Variant[];
	};
	refetch: () => void;
};
const ProductManager = ({ product, refetch }: TProductManager) => {
	const [isOpen, setIsOpen] = useState(false);
	const router = useRouter();

	const { mutate: changeState, isLoading } =
		trpc.panel.productState.useMutation({
			onSuccess: (data) => {
				data === true
					? successToast('Zmieniono status produktu!')
					: errorToast();
				refetch();
			},
			onError: () => errorToast(),
		});

	const { mutate: deleteProduct, isLoading: isDeleting } =
		trpc.panel.deleteProduct.useMutation({
			onSuccess: () => {
				successToast(`Usunięto produkt "${product.label}"`);
				router.push('/panel/produkty');
			},
			onError: () => {
				setIsOpen(false);
				errorToast();
			},
		});

	const productStatus = product.enabled ? 'enabled' : 'disabled';
	const isOutOfStock = !product.variants.some((variant) => variant.stock > 0);
	return (
		<div>
			<div className='flex'>
				<FaTools className='w-6 h-6 mr-2' />
				<h2 className='font-medium text-lg'>Zarządzanie produktem</h2>
			</div>
			{/* Product Status */}
			<div>
				<div className='flex flex-col md:flex-row items-center space-x-0 md:space-x-2 space-y-2 md:space-y-2'>
					<h3 className='font-bold text-lg md:mt-1.5'>
						Aktualny stan produktu
					</h3>
					<ProductStatus status={productStatus} />
					{isOutOfStock && <ProductStatus status='out of stock' />}
				</div>
				{/* Control Buttons */}
				<div className='mt-2 space-x-0 md:space-x-2 space-y-2 md:space-y-0 flex flex-col md:flex-row'>
					{productStatus === 'enabled' ? (
						<ActionButton
							variant='warning'
							onClick={() =>
								changeState({ newState: false, productId: product.id })
							}
							disabled={isLoading}
						>
							Wyłącz produkt
						</ActionButton>
					) : (
						<ActionButton
							onClick={() =>
								changeState({ newState: true, productId: product.id })
							}
							disabled={isLoading}
						>
							Włącz produkt
						</ActionButton>
					)}
					<ActionButton variant='destructive' onClick={() => setIsOpen(true)}>
						Usuń produkt
					</ActionButton>
					{product.enabled && (
						<Button asChild className='min-w-[220px]' variant='link'>
							<Link href={`/sklep/${product.link}`} target='_blank'>
								Zobacz produkt
							</Link>
						</Button>
					)}
				</div>
			</div>
			<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Czy jesteś pewien?</AlertDialogTitle>
						<AlertDialogDescription>
							Usunięcie produktu jest nieodwracalne. Czy na pewno chcesz to
							zrobić?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						{!isDeleting && (
							<Button variant='ghost' onClick={() => setIsOpen(false)}>
								Anuluj
							</Button>
						)}
						<Button
							variant='destructive'
							disabled={isDeleting}
							onClick={() =>
								deleteProduct({
									productId: product.id,
								})
							}
						>
							Usuń
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
};

export default ProductManager;
