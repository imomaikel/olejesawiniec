'use client';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FloatingProduct from './_components/FloatingProduct';
import { TiChevronRight } from 'react-icons/ti';
import { Badge } from '@/components/ui/badge';
import { IoWarning } from 'react-icons/io5';
import { formatPrice } from '@/lib/utils';
import { useState } from 'react';

const TEMP_VARIANS = [
	{
		price: 20,
		size: 100,
		unit: 'ml',
	},
	{
		price: 25,
		size: 200,
		unit: 'ml',
	},
	{
		price: 50,
		size: 500,
		unit: 'ml',
	},
];

const ProductPage = () => {
	const [selectedVariant, setSelectedVariant] = useState({
		price: TEMP_VARIANS[0].price,
		size: TEMP_VARIANS[0].size,
		unit: TEMP_VARIANS[0].unit,
	});

	return (
		<div className='flex justify-center relative flex-col md:flex-row mb-24 space-y-12 md:space-y-0'>
			<FloatingProduct
				productName='Olej z dynii'
				variants={TEMP_VARIANS}
				selectedPrice={selectedVariant.price}
				selectedSize={selectedVariant.size}
				tags={[
					'Na kości',
					'Na wątrobe',
					'Witamina A',
					'Witamina D',
					'Witamina E',
					'Na skóre',
				]}
				imageUrls={['/oil.png', '/product1.jpg', '/product2.jpg']}
			/>
			<div className='mx-24 hidden md:block' />
			<div className='w-full max-w-lg relative'>
				{/* Title */}
				<div className='mb-1'>
					<h1 className='text-3xl font-bold'>Szczegóły produktu</h1>
				</div>

				{/* No Stock */}
				<Alert variant='destructive' className='my-2'>
					<IoWarning className='h-8 w-8' />
					<AlertTitle className='ml-2'>Uwaga!</AlertTitle>
					<AlertDescription className='ml-2'>
						Rozmiary na czerwono nie są aktualnie dostępne. Możesz dodać do
						listy życzeń i otrzymać e-mail gdy będzie dostępny ponownie.
					</AlertDescription>
				</Alert>
				{/* Low Stock */}
				<Alert variant='warning' className='my-2'>
					<IoWarning className='h-8 w-8' />
					<AlertTitle className='ml-2'>Uwaga!</AlertTitle>
					<AlertDescription className='ml-2'>
						Rozmiary na pomarańczowo są na wyczerpaniu.
					</AlertDescription>
				</Alert>

				{/* Size */}
				<div className='mt-2 flex md:flex-row flex-col items-center space-x-2'>
					<div className='tracking-wide font-medium'>
						Dostępne w pojemnościach
					</div>
					<div className='space-x-2'>
						{TEMP_VARIANS.map((variant) => (
							<Badge
								key={`${variant.price}${variant.size}`}
								className='cursor-pointer'
								onClick={() =>
									setSelectedVariant({
										price: variant.price,
										size: variant.size,
										unit: variant.unit,
									})
								}
							>
								{`${variant.size}${variant.unit}`}
							</Badge>
						))}
					</div>
				</div>
				{/* Price */}
				<div className='mt-4 relative'>
					<div className='flex items-center space-x-2'>
						<span className='text-2xl font-medium'>Wybrana pojemność</span>
						<Badge>
							{selectedVariant.size}
							{selectedVariant.unit}
						</Badge>
					</div>
					<div className='relative flex items-center space-x-2'>
						<span className='text-2xl font-medium'>Cena</span>
						<span className='font-bold text-2xl text-primary'>
							{formatPrice(selectedVariant.price)}
						</span>
						<div className='absolute h-1/2 inset-0 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 w-3/5 blur-[35px] -z-10' />
					</div>
				</div>
				{/* Detailed informations */}
				<div className='mt-6'>
					<h1 className='text-3xl font-bold'>Właściwości</h1>
					<ul className='ml-6'>
						<li className='flex items-center'>
							<TiChevronRight className='w-6 h-6' />
							<span>Wspomaga zdrowie watroby</span>
						</li>
						<li className='flex items-center'>
							<TiChevronRight className='w-6 h-6' />
							<span>Reguluje poziom cukru we krwi</span>
						</li>
						<li className='flex items-center'>
							<TiChevronRight className='w-6 h-6' />
							<span>Obniża poziom cholesterolu</span>
						</li>
						<li className='flex items-center'>
							<TiChevronRight className='w-6 h-6' />
							<span>Działa przeciwnowotworowo</span>
						</li>
						<li className='flex items-center'>
							<TiChevronRight className='w-6 h-6' />
							<span>Działa przeciwzapalnie</span>
						</li>
						<li className='flex items-center'>
							<TiChevronRight className='w-6 h-6' />
							<span>Wspomaga układ odpornościowy</span>
						</li>
					</ul>
				</div>
				{/* Description */}
				<div className='mt-6'>
					<h1 className='text-3xl font-bold'>Opis produktu</h1>
					<ul>
						<li className='flex space-x-2'>
							<span className='font-medium'>Zastosowanie:</span>
							<span className='text-muted-foreground'>lorem ipsum</span>
						</li>
						<li className='flex space-x-2'>
							<span className='font-medium'>Kraj pochodzenia:</span>
							<span className='text-muted-foreground'>lorem ipsum</span>
						</li>
						<li className='flex space-x-2'>
							<span className='font-medium'>Przechowywanie:</span>
							<span className='text-muted-foreground'>lorem ipsum</span>
						</li>
						<li className='flex space-x-2'>
							<span className='font-medium'>Opakowanie:</span>
							<span className='text-muted-foreground'>lorem ipsum</span>
						</li>
						<li className='flex space-x-2'>
							<span className='font-medium'>
								Termin przydatności do spożycia:
							</span>
							<span className='text-muted-foreground'>lorem ipsum</span>
						</li>
						<li className='flex space-x-2'>
							<span className='font-medium'>Producent:</span>
							<span className='text-muted-foreground'>lorem ipsum</span>
						</li>
					</ul>
				</div>
				{/* Nutrition facts */}
				<div className='mt-4'>
					<h1 className='text-3xl font-bold'>Wartości odżywcze</h1>
					<Table className='mt-2'>
						<TableHeader>
							<TableRow>
								<TableHead>Wartość odżywcza</TableHead>
								<TableHead>w 100g produktu</TableHead>
								<TableHead>W porcji: 3 łyżeczki (12g)</TableHead>
								<TableHead>%RWS* w porcji</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<TableRow>
								<TableCell>Tłuszcz</TableCell>
								<TableCell>100g</TableCell>
								<TableCell>10g</TableCell>
								<TableCell>10%</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>w tym:</TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
								<TableCell></TableCell>
							</TableRow>
							<TableRow>
								<TableCell>kwasy tłuszczowe nasycone</TableCell>
								<TableCell>100kJ/100kcal</TableCell>
								<TableCell>10kJ/10kcal</TableCell>
								<TableCell>1%</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>kwasy tłuszczowe jednonienasycone</TableCell>
								<TableCell>100kJ/100kcal</TableCell>
								<TableCell>10kJ/10kcal</TableCell>
								<TableCell>1%</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>kwasy tłuszczowe wielonienasycone</TableCell>
								<TableCell>100kJ/100kcal</TableCell>
								<TableCell>10kJ/10kcal</TableCell>
								<TableCell>1%</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>Węglowodany</TableCell>
								<TableCell>100kJ/100kcal</TableCell>
								<TableCell>10kJ/10kcal</TableCell>
								<TableCell>1%</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>w tym cukry</TableCell>
								<TableCell>100kJ/100kcal</TableCell>
								<TableCell>10kJ/10kcal</TableCell>
								<TableCell>1%</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>błonnik</TableCell>
								<TableCell>100kJ/100kcal</TableCell>
								<TableCell>10kJ/10kcal</TableCell>
								<TableCell>1%</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>białko</TableCell>
								<TableCell>100kJ/100kcal</TableCell>
								<TableCell>10kJ/10kcal</TableCell>
								<TableCell>1%</TableCell>
							</TableRow>
							<TableRow>
								<TableCell>sól</TableCell>
								<TableCell>100kJ/100kcal</TableCell>
								<TableCell>10kJ/10kcal</TableCell>
								<TableCell>1%</TableCell>
							</TableRow>
						</TableBody>
					</Table>
				</div>
				<div className='absolute h-full w-[1px] bg-black/40 -left-24 top-0 hidden md:block' />
			</div>
		</div>
	);
};

export default ProductPage;
