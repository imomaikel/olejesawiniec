'use client';
import { Checkbox } from '@/components/ui/checkbox';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/components/providers/TRPC';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const Categories = () => {
	const { data: categories, isLoading } = trpc.getCategories.useQuery(
		undefined,
		{
			refetchOnWindowFocus: false,
		}
	);

	const categoriesExist = !isLoading && categories && categories.length >= 1;

	if (isLoading) return <Categories.Skeleton />;

	return (
		<div
			className={cn(
				'w-full md:w-[300px] relative z-10',
				!categoriesExist && 'hidden'
			)}
		>
			<div className='flex items-center relative'>
				<div>
					<h3 className='whitespace-nowrap font-medium'>Kategorie</h3>
				</div>
				<div className='border flex-1 mx-2' />
			</div>
			<div className='space-y-2 mt-2'>
				{categories?.map(({ id, label }) => (
					<div className='flex items-center justify-between' key={id}>
						<div className='flex items-center space-x-3'>
							<Checkbox className='w-6 h-6' id='key1' />
							<Label>{label}</Label>
						</div>
						<div>
							<span>(???)</span>
						</div>
					</div>
				))}
			</div>
			<div className='w-full h-full absolute bg-gradient-to-r from-teal-200 to-lime-200 -z-10 inset-0 blur-[125px]' />
		</div>
	);
};

Categories.Skeleton = function ShowSkeleton() {
	return (
		<div className='w-full md:w-[300px] relative z-10'>
			<div className='flex items-center relative'>
				<div>
					<Skeleton className='w-32 h-6' />
				</div>
				<div className='border flex-1 mx-2' />
			</div>
			<div className='space-y-2 mt-2'>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<Skeleton className='w-6 h-6' />
						<Skeleton className='w-12 h-[14px]' />
					</div>
					<div>
						<Skeleton className='w-7 h-6' />
					</div>
				</div>
				<div className='flex items-center justify-between'>
					<div className='flex items-center space-x-3'>
						<Skeleton className='w-6 h-6' />
						<Skeleton className='w-12 h-[14px]' />
					</div>
					<div>
						<Skeleton className='w-7 h-6' />
					</div>
				</div>
			</div>
			<div className='w-full h-full absolute bg-gradient-to-r from-teal-200 to-lime-200 -z-10 inset-0 blur-[125px]' />
		</div>
	);
};

export default Categories;
