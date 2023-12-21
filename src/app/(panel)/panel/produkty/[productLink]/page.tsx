'use client';
import ProductEditor from '../../_components/ProductEditor';
import { useParams } from 'next/navigation';

const EditProductPage = () => {
	const { productLink } = useParams<{
		productLink: string;
	}>();

	return (
		<div className='flex flex-col space-y-4'>
			<div>
				<h1 className='text-xl font-bold'>Edytowanie produktu</h1>
			</div>
			<div className='flex flex-col space-y-6'>
				<ProductEditor productLink={productLink} />
			</div>
		</div>
	);
};

export default EditProductPage;
