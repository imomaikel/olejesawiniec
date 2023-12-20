'use client';
import { ElementRef, useEffect, useRef, useState } from 'react';
import { errorToast, successToast } from '@/lib/utils';
import { trpc } from '@/components/providers/TRPC';
import { Button } from '@/components/ui/button';
import { useEventListener } from 'usehooks-ts';
import { Input } from '@/components/ui/input';

type TAddTag = {
	onAdd: () => void;
};
const AddTag = ({ onAdd }: TAddTag) => {
	const ref = useRef<ElementRef<'input'>>(null);
	const [tagName, setTagName] = useState('');

	const { mutate: addNewTag, isLoading } = trpc.panel.createTag.useMutation({
		onSuccess: ({ status, message }) => {
			if (status === 'success') {
				successToast(message!);
				onAdd();
			} else {
				errorToast(message);
			}
		},
		onError: ({ data }) => {
			errorToast(data?.zodErrorList);
		},
	});

	useEffect(() => {
		if (!isLoading) {
			ref.current?.focus();
			ref.current?.select();
		}
	}, [isLoading]);

	const handleSubmit = (e: KeyboardEvent) => {
		if (e.key === 'Enter' && !isLoading) addNewTag({ tagName });
	};
	useEventListener('keydown', handleSubmit);

	return (
		<div>
			<div>
				<h1 className='text-xl font-bold'>Dodaj nowy tag</h1>
			</div>
			<div className='flex space-x-2'>
				<Input
					className='max-w-xs w-full'
					placeholder='Nazwa nowego tagu'
					value={tagName}
					disabled={isLoading}
					onChange={(e) => setTagName(e.target.value)}
					ref={ref}
				/>
				<Button disabled={isLoading} onClick={() => addNewTag({ tagName })}>
					Dodaj
				</Button>
			</div>
		</div>
	);
};

export default AddTag;
