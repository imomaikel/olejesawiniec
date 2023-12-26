'use client';
import { errorToast, successToast } from '@/lib/utils';
import { trpc } from '@/components/providers/TRPC';
import { BiSolidCategory } from 'react-icons/bi';
import { Button } from '@/components/ui/button';
import { useEventListener } from 'usehooks-ts';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { IoOptions } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';
import { useState } from 'react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

const NewProductPage = () => {
	const [productName, setProductName] = useState('');
	const [newCategory, setNewCategory] = useState('');
	const [selectedCategory, setSelectedCategory] = useState('');

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

	const {
		data: categories,
		isLoading,
		refetch,
	} = trpc.panel.getCategories.useQuery(undefined, {
		refetchOnWindowFocus: false,
	});

	const { mutate: createCategory, isLoading: isCategoryCreating } =
		trpc.panel.createCategory.useMutation({
			onSuccess: (label) => {
				if (!label) return errorToast();
				successToast(`Dodano kategorię "${label}"`);
				refetch();
			},
			onError: () => errorToast(),
		});

	const handleSubmit = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !isCreating)
			createProduct({ productName, categoryLabel: selectedCategory });
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
					</div>
				</div>
				<div>
					<div className='flex'>
						<IoOptions className='w-6 h-6 mr-2' />
						<h2 className='font-medium text-lg'>Kategoria produktu</h2>
					</div>
					<div className='flex flex-col space-y-2'>
						<Select
							onValueChange={(categoryName) =>
								setSelectedCategory(categoryName)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder='Wybierz kategorie' />
							</SelectTrigger>
							<SelectContent>
								{categories
									? categories.map((category) => (
											<SelectItem key={category.label} value={category.label}>
												{category.label}
											</SelectItem>
									  ))
									: 'Brak utworzonych kategorii'}
							</SelectContent>
						</Select>
					</div>
				</div>
				<div>
					<div className='flex'>
						<BiSolidCategory className='w-6 h-6 mr-2' />
						<h2 className='font-medium text-lg'>Nowa kategoria</h2>
					</div>
					<div className='flex space-x-1'>
						<Input
							placeholder='Podaj nazwę nowej kategorii...'
							disabled={isCreating}
							value={newCategory}
							onChange={(e) => setNewCategory(e.target.value)}
						/>
						<Button
							size='icon'
							onClick={() => createCategory({ label: newCategory })}
						>
							<FaPlus className='w-4 h-4' />
						</Button>
					</div>
				</div>
				<Button
					disabled={isCreating}
					onClick={() =>
						createProduct({ productName, categoryLabel: selectedCategory })
					}
				>
					Utwórz
				</Button>
			</div>
		</div>
	);
};

export default NewProductPage;
