'use client';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { FaTools, FaTrashAlt } from 'react-icons/fa';
import ActionButton from '@/components/ActionButton';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/components/providers/TRPC';
import PhotoManager from './controls/PhotoManager';
import VariantList from './controls/VariantList';
import { Button } from '@/components/ui/button';
import { TiChevronRight } from 'react-icons/ti';
import TagControl from './controls/TagControl';
import NewVariant from './controls/NewVariant';
import { Input } from '@/components/ui/input';
import { useRouter } from 'next/navigation';
import { IoOptions } from 'react-icons/io5';
import ProductStatus from './ProductStatus';
import { errorToast } from '@/lib/utils';

type TProductEditor = {
	productLink: string;
};
const ProductEditor = ({ productLink }: TProductEditor) => {
	const router = useRouter();

	const {
		data: product,
		isLoading: isProductLoading,
		refetch: _refetchProduct,
	} = trpc.panel.getProductInfo.useQuery(
		{ productLink },
		{
			onSuccess: (data) => {
				if (!data) {
					errorToast('Nie znaleziono produktu!');
					router.push('/panel/produkty');
				}
			},
			onError: () => {
				errorToast();
				router.push('/panel/produkty');
			},
			refetchOnWindowFocus: false,
		}
	);

	const {
		data: tags,
		isLoading: isTagLoading,
		refetch: _refetchTags,
	} = trpc.panel.getTagList.useQuery(undefined, {
		refetchOnWindowFocus: false,
	});

	const refetchProduct = () => _refetchProduct();
	const refetchTags = () => _refetchTags();

	if (isProductLoading || isTagLoading || !product || !tags) {
		return 'Loading...';
	}

	const productStatus = product.enabled ? 'enabled' : 'disabled';
	const isOutOfStock = !product.variants.some((variant) => variant.stock > 0);

	return (
		<>
			{/* Product name */}
			<div>
				<div className='flex mb-1'>
					<IoOptions className='w-6 h-6 mr-2' />
					<h2 className='font-medium text-lg'>Nazwa produktu</h2>
				</div>
				<Input value={product.label} disabled />
			</div>

			<Separator />

			{/* Product Controls */}
			{/* TODO */}
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
							<ActionButton variant='warning'>Wyłącz produkt</ActionButton>
						) : (
							<ActionButton>Włącz produkt</ActionButton>
						)}
						<ActionButton variant='destructive'>Usuń produkt</ActionButton>
					</div>
				</div>
			</div>

			<Separator />

			{/* Product tags */}
			<TagControl
				allTags={tags}
				productTags={product.tags}
				productId={product.id}
				refetchTag={refetchTags}
				refetchProduct={refetchProduct}
			/>

			<Separator />

			{/* Product variants */}
			<div>
				<div className='flex'>
					<IoOptions className='w-6 h-6 mr-2' />
					<h2 className='font-medium text-lg'>Opcje produktu</h2>
				</div>
				<VariantList refetchProduct={refetchProduct} product={product} />
				<NewVariant productId={product.id} refetchProduct={refetchProduct} />
			</div>

			<Separator />

			{/* Product images */}
			<PhotoManager product={product} refetch={refetchProduct} />

			<Separator />

			{/* Product details  */}
			<div>
				<div className='flex'>
					<IoOptions className='w-6 h-6 mr-2' />
					<h2 className='font-medium text-lg'>Właściwości produktu</h2>
				</div>
				<h3 className='mt-4 font-medium'>Aktualne właściwości</h3>
				<ul className='ml-6'>
					<li className='flex items-center'>
						<TiChevronRight className='w-6 h-6' />
						<span>Wspomaga prace serca</span>
						<FaTrashAlt className='w-6 h-6 cursor-pointer transition-colors hover:text-destructive ml-4' />
					</li>
				</ul>
				<div>
					<h3 className='mt-4 font-medium'>Dodaj nową właściwość</h3>
					<div className='flex items-center space-x-2'>
						<Input />
						<Button>Dodaj</Button>
					</div>
				</div>
			</div>

			<Separator />

			{/* Product description */}
			<div>
				<div className='flex'>
					<IoOptions className='w-6 h-6 mr-2' />
					<h2 className='font-medium text-lg'>Opis produktu</h2>
				</div>
				<Textarea rows={10}></Textarea>
			</div>

			<Separator />

			{/* Product nutrition facts */}
			<div>
				<div className='flex'>
					<IoOptions className='w-6 h-6 mr-2' />
					<h2 className='font-medium text-lg'>Wartości odżywcze</h2>
				</div>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Wartość odżywcza</TableHead>
							<TableHead>w 100g produktu</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell>Tłuszcz</TableCell>
							<TableCell>
								<Input placeholder='0g' />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>w tym:</TableCell>
							<TableCell></TableCell>
						</TableRow>
						<TableRow>
							<TableCell>kwasy tłuszczowe nasycone</TableCell>
							<TableCell>
								<Input placeholder='50g' />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>kwasy tłuszczowe jednonienasycone</TableCell>
							<TableCell>
								<Input placeholder='50g' />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>kwasy tłuszczowe wielonienasycone</TableCell>
							<TableCell>
								<Input placeholder='50g' />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Węglowodany</TableCell>
							<TableCell>
								<Input placeholder='50g' />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>w tym cukry</TableCell>
							<TableCell>
								<Input placeholder='50g' />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>błonnik</TableCell>
							<TableCell>
								<Input placeholder='50g' />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>białko</TableCell>
							<TableCell>
								<Input placeholder='50g' />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>sól</TableCell>
							<TableCell>
								<Input placeholder='50g' />
							</TableCell>
						</TableRow>
						<TableRow>
							<TableCell>Obliczona kaloryczność</TableCell>
							<TableCell>0kcal</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		</>
	);
};

export default ProductEditor;
