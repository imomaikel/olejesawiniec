import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// TODO Debounce

const TagsPage = () => {
	return (
		<div className='flex flex-col space-y-4'>
			{/* Current tags */}
			<div>
				<div>
					<h1 className='text-xl font-bold'>Aktualne tagi</h1>
					<p className='text-muted-foreground'>Kliknij na tag aby usunąć</p>
				</div>
				<div className='flex flex-wrap gap-1'>
					<Badge className='cursor-pointer hover:bg-destructive'>
						Witamina A
					</Badge>
					<Badge className='cursor-pointer hover:bg-destructive'>
						Witamina D
					</Badge>
					<Badge className='cursor-pointer hover:bg-destructive'>
						Witamina E
					</Badge>
					<Badge className='cursor-pointer hover:bg-destructive'>
						Witamina K
					</Badge>
				</div>
			</div>
			{/* Search  */}
			<div>
				<h1 className='text-xl font-bold'>Znajdź tag</h1>
				<p className='text-muted-foreground'>
					Wpisz nazwę aby sprawdzić, czy istnieje
				</p>
				<Input placeholder='Nazwa' />
			</div>
			{/* Add a new */}
			<div>
				<div>
					<h1 className='text-xl font-bold'>Dodaj nowy tag</h1>
				</div>
				<div className='flex space-x-2'>
					<Input placeholder='Nazwa nowego tagu' />
					<Button>Dodaj</Button>
				</div>
			</div>
		</div>
	);
};

export default TagsPage;
