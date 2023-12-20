'use client';
import { errorToast, successToast } from '@/lib/utils';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { useEventListener } from 'usehooks-ts';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { IoOptions } from 'react-icons/io5';
import { useState } from 'react';

const NewProductPage = () => {
	const [productName, setProductName] = useState('');
	const router = useRouter();

	const { mutate: createProduct, isLoading: isCreating } =
		trpc.panel.createProduct.useMutation({
			onSuccess: ({ message, status }) => {
				if (status === 'success') {
					successToast('Produkt został utworzony!');
					router.push(message!);
				} else {
					errorToast(message);
				}
			},
			onError: ({ data }) => {
				errorToast(data?.zodErrorList);
			},
		});

	const handleSubmit = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !isCreating) createProduct({ productName });
	};
	useEventListener('keydown', handleSubmit);

	return (
		<div className='flex flex-col space-y-4'>
			<div>
				<h1 className='text-xl font-bold'>Dodawanie nowego produktu</h1>
			</div>
			<div className='flex flex-col space-y-6'>
				{/* Product name */}
				<div>
					<div className='flex'>
						<IoOptions className='w-6 h-6 mr-2' />
						<h2 className='font-medium text-lg'>Nazwa produktu</h2>
					</div>
					<div className='flex flex-col space-y-2'>
						<Input
							placeholder='Podaj nazwę nowego produktu...'
							disabled={isCreating}
							value={productName}
							onChange={(e) => setProductName(e.target.value)}
						/>
						<Button
							disabled={isCreating}
							onClick={() => createProduct({ productName })}
						>
							Dodaj
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default NewProductPage;
