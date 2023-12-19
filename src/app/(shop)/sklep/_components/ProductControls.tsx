import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import Categories from './Categories';
import Search from './Search';
import Tags from './Tags';

const ProductControls = () => {
	return (
		<>
			<Search />
			<Categories />
			<Tags />
			<Separator />
			<Button variant='ghost' className='w-full'>
				Wyczyść filtry
			</Button>
		</>
	);
};

export default ProductControls;
