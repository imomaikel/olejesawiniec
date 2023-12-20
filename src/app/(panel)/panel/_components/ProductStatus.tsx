import {
	IoMdEyeOff,
	IoMdCloseCircle,
	IoMdCheckmarkCircle,
} from 'react-icons/io';
import { Badge, BadgeProps } from '@/components/ui/badge';
import { FaCircleQuestion } from 'react-icons/fa6';

type TProductStatus = {
	status: 'enabled' | 'disabled' | 'out of stock' | 'create mode';
};
const ProductStatus = ({ status }: TProductStatus) => {
	let variant: BadgeProps['variant'] = 'default';
	let message, Icon;

	if (status === 'create mode') {
		// product does not exist
		message = 'produkt nie istnieje';
		Icon = FaCircleQuestion;
		variant = 'destructive';
	} else if (status === 'disabled') {
		// product is hidden
		message = 'produkt jest ukryty';
		Icon = IoMdEyeOff;
		variant = 'warning';
	} else if (status === 'enabled') {
		// product is visible to customers
		message = 'produkt jest widoczny';
		Icon = IoMdCheckmarkCircle;
		variant = 'default';
	} else if (status === 'out of stock') {
		message = 'brak na magazynie';
		Icon = IoMdCloseCircle;
		variant = 'destructive';
	}

	if (!message) return null;

	return (
		<Badge className='flex items-center' variant={variant}>
			{<Icon className='w-4 h-4 mr-2' />}
			<span className='uppercase font-bold tracking-wider py-0.5 mt-0.5'>
				{message}
			</span>
		</Badge>
	);
};

export default ProductStatus;
