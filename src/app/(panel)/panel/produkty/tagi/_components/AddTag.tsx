'use client';
import { ElementRef, useEffect, useRef, useState } from 'react';
import { cn, errorToast, successToast } from '@/lib/utils';
import ActionButton from '@/components/ActionButton';
import { trpc } from '@/components/providers/TRPC';
import { useEventListener } from 'usehooks-ts';
import { Input } from '@/components/ui/input';

type TAddTag = {
  onAdd: () => void;
  singleMode?: boolean;
};
const AddTag = ({ onAdd, singleMode }: TAddTag) => {
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
    if (!isLoading && !singleMode) {
      ref.current?.focus();
      ref.current?.select();
    }
  }, [isLoading, singleMode]);

  const handleSubmit = (e: KeyboardEvent) => {
    if (singleMode) return;
    if (e.key === 'Enter' && !isLoading) addNewTag({ tagName });
  };
  useEventListener('keydown', handleSubmit);

  return (
    <div>
      <div>
        <h1 className={cn('text-xl font-bold', singleMode && 'font-medium text-base mt-2')}>Dodaj nowy tag</h1>
      </div>
      <div className="flex space-x-2">
        <Input
          className="max-w-xs w-full"
          placeholder="Nazwa nowego tagu"
          value={tagName}
          disabled={isLoading}
          onChange={(e) => setTagName(e.target.value)}
          ref={ref}
        />
        <ActionButton disabled={isLoading} onClick={() => addNewTag({ tagName })}>
          Dodaj
        </ActionButton>
      </div>
    </div>
  );
};

export default AddTag;
