import ProductCreator from '../../_components/ProductCreator';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { IoOptions } from 'react-icons/io5';

// TODO: The product name can not have the same name as the panel sidebar path

const NewProductPage = () => {
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
					<Input placeholder='Podaj nazwę nowego produktu...' />
				</div>

				<Separator />

				<ProductCreator mode='add' />
			</div>
		</div>
	);
};

export default NewProductPage;
